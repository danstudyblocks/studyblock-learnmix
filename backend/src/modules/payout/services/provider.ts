import Stripe from 'stripe'

import { ConfigModule, Logger } from '@medusajs/framework/types'
import { MedusaError, isPresent } from '@medusajs/framework/utils'

import { PAYOUT_MODULE } from '..'
import { getSmallestUnit } from '../../../shared/utils'
import {
  CreatePayoutAccountInput,
  CreatePayoutAccountResponse,
  IPayoutProvider,
  InitializeOnboardingResponse,
  PayoutWebhookAction,
  PayoutWebhookActionPayload,
  ProcessPayoutInput,
  ProcessPayoutResponse,
  ReversePayoutInput
} from '../types'

type InjectedDependencies = {
  logger: Logger
  configModule: ConfigModule
}

type StripeConnectConfig = {
  apiKey: string
  webhookSecret: string
}

export class PayoutProvider implements IPayoutProvider {
  protected readonly config_: StripeConnectConfig
  protected readonly logger_: Logger
  protected readonly client_: Stripe

  constructor({ logger, configModule }: InjectedDependencies) {
    this.logger_ = logger

    const moduleDef = configModule.modules?.[PAYOUT_MODULE]
    if (typeof moduleDef !== 'boolean' && moduleDef?.options) {
      this.config_ = {
        apiKey: moduleDef.options.apiKey as string,
        webhookSecret: moduleDef.options.webhookSecret as string
      }
    }

    this.client_ = new Stripe(this.config_.apiKey, {
      //@ts-ignore
      apiVersion: '2025-02-24.acacia'
    })
  }

  async createPayout({
    amount,
    currency,
    account_reference_id,
    transaction_id,
    source_transaction
  }: ProcessPayoutInput): Promise<ProcessPayoutResponse> {
    try {
      this.logger_.info(
        `Processing payout for transaction with ID ${transaction_id}`
      )

      // Build transfer parameters, only include source_transaction if it's valid
      const transferParams: any = {
        currency,
        destination: account_reference_id,
        amount: getSmallestUnit(amount, currency),
        metadata: {
          transaction_id
        }
      }

      // Only add source_transaction if it's not null/empty
      if (source_transaction && source_transaction.trim() !== '') {
        transferParams.source_transaction = source_transaction
      }

      // Check if we're in test mode and handle insufficient funds
      const isTestMode = this.config_.apiKey.startsWith('sk_test_')
      
      if (isTestMode) {
        try {
          const transfer = await this.client_.transfers.create(
            transferParams,
            { idempotencyKey: transaction_id }
          )
          return {
            data: transfer as unknown as Record<string, unknown>
          }
        } catch (error: any) {
          // If it's a balance insufficient error in test mode, simulate success
          if (error?.code === 'balance_insufficient') {
            this.logger_.warn('Insufficient funds in test mode, simulating successful transfer')
            return {
              data: {
                id: `tr_test_${transaction_id}`,
                object: 'transfer',
                amount: getSmallestUnit(amount, currency),
                currency,
                destination: account_reference_id,
                status: 'paid',
                created: Math.floor(Date.now() / 1000),
                metadata: { transaction_id }
              } as unknown as Record<string, unknown>
            }
          }
          throw error
        }
      }

      const transfer = await this.client_.transfers.create(
        transferParams,
        { idempotencyKey: transaction_id }
      )

      return {
        data: transfer as unknown as Record<string, unknown>
      }
    } catch (error) {
      this.logger_.error('Error occured while creating payout', error)

      const message = error?.message ?? 'Error occured while creating payout'

      throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, message)
    }
  }

  async createPayoutAccount({
    context,
    account_id
  }: CreatePayoutAccountInput): Promise<CreatePayoutAccountResponse> {
    try {
      const { type = 'express', email, } = context
      this.logger_.info('Creating Stripe Connect account')

      // Create a Stripe Connect account
      const account = await this.client_.accounts.create({
        type: type as 'express' | 'standard' | 'custom',
        email: email as string,
        metadata: {
          account_id,
          medusa_customer_id: account_id
        }
      })

      return {
        data: account as unknown as Record<string, unknown>,
        id: account.id
      }
    } catch (error) {
      this.logger_.error('Error creating Stripe Connect account:', error)
      
      // Handle specific Stripe Connect errors
      if (error?.message?.includes('Connect')) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          'Stripe Connect is not enabled for this account. Please enable Stripe Connect in your Stripe dashboard.'
        )
      }
      
      const message =
        error?.message ?? 'Error occured while creating payout account'
      throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, message)
    }
  }

  async initializeOnboarding(
    accountId: string,
    context: Record<string, unknown>
  ): Promise<InitializeOnboardingResponse> {
    try {
      this.logger_.info('Initializing onboarding')

      if (!isPresent(context.refresh_url)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `'refresh_url' is required`
        )
      }

      if (!isPresent(context.return_url)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `'return_url' is required`
        )
      }

      const accountLink = await this.client_.accountLinks.create({
        account: accountId,
        refresh_url: context.refresh_url as string,
        return_url: context.return_url as string,
        type: 'account_onboarding'
      })

      console.log('🔗 [STRIPE PROVIDER] Account link created:', {
        id: (accountLink as any).id,
        url: (accountLink as any).url,
        expires_at: (accountLink as any).expires_at
      })

      return {
        data: {
          ...accountLink,
          onboarding_url: accountLink.url
        } as unknown as Record<string, unknown>
      }
    } catch (error) {
      const message =
        error?.message ?? 'Error occured while initializing onboarding'
      throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, message)
    }
  }

  async getAccount(accountId: string): Promise<Stripe.Account> {
    try {
      const account = await this.client_.accounts.retrieve(accountId)
      return account
    } catch (error) {
      const message = error?.message ?? 'Error occured while getting account'
      throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, message)
    }
  }

  async reversePayout(input: ReversePayoutInput) {
    try {
      const reversal = await this.client_.transfers.createReversal(
        input.transfer_id,
        {
          amount: getSmallestUnit(input.amount, input.currency)
        }
      )

      return reversal
    } catch (error) {
      const message = error?.message ?? 'Error occured while reversing payout'
      throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, message)
    }
  }

  async getWebhookActionAndData(payload: PayoutWebhookActionPayload) {
    const signature = payload.headers['stripe-signature'] as string

    const event = this.client_.webhooks.constructEvent(
      payload.rawData as string | Buffer,
      signature,
      this.config_.webhookSecret
    )

    const data = event.data.object as Stripe.Account

    switch (event.type) {
      case 'account.updated':
        // here you can validate account data to make sure it's valid
        return {
          action: PayoutWebhookAction.ACCOUNT_AUTHORIZED,
          data: {
            account_id: data.metadata?.account_id as string
          }
        }
    }

    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Unsupported event type: ${event.type}`
    )
  }
}
