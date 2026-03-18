import { loadEnv, Modules, defineConfig } from "@medusajs/utils";
import {
  ADMIN_CORS,
  AUTH_CORS,
  BACKEND_URL,
  COOKIE_SECRET,
  DATABASE_URL,
  JWT_SECRET,
  REDIS_URL,
  RESEND_API_KEY,
  RESEND_FROM_EMAIL,
  S3_ACCESS,
  S3_ACCESS_KEY_ID,
  S3_BUCKET,
  S3_CACHE_CONTROL,
  S3_REGION,
  S3_SECRET_ACCESS_KEY,
  S3_URL,
  SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL,
  SHOULD_DISABLE_ADMIN,
  STORE_CORS,
  STRIPE_API_KEY,
  STRIPE_WEBHOOK_SECRET,
  WORKER_MODE,
  MEILISEARCH_HOST,
  MEILISEARCH_ADMIN_KEY,
} from "@/lib/constants";
import { DIGITAL_PRODUCT_MODULE } from "@/modules/digital-product";
import { PAYOUT_MODULE } from "@/modules/payout";
import { SUBSCRIPTION_MODULE } from "@/modules/subscription";
import { SVG_ASSET_MODULE } from "@/modules/svg-asset";

loadEnv(process.env.NODE_ENV, process.cwd());

const isDevelopment = process.env.NODE_ENV === "development";

const fileModule = isDevelopment
  ? {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-local",
            id: "local",
            options: {
              // Add specific provider options here for the local setup
            },
          },
        ],
      },
    }
  : {
      key: Modules.FILE,
      resolve: "@medusajs/file",
      id: "s3",
      options: {
        providers: [
          {
            resolve: `@medusajs/file-s3`,
            options: {
              s3_url: S3_URL,
              bucket: S3_BUCKET,
              region: S3_REGION,
              access_key_id: S3_ACCESS_KEY_ID,
              secret_access_key: S3_SECRET_ACCESS_KEY,
              cache_control: S3_CACHE_CONTROL,
              access: S3_ACCESS,
              file_url: S3_URL,
            },
          },
        ],
      },
    };

const medusaConfig = {
  projectConfig: {
    databaseUrl: DATABASE_URL,
    databaseLogging: false,
    redisUrl: REDIS_URL,
    workerMode: WORKER_MODE,
    databaseDriverOptions: {
      debug: false,
      logger: (message) => {
        // Suppress MikroORM logs in development
        if (process.env.NODE_ENV === 'production') {
          console.error(message);
        }
      },
    },
    http: {
      storeCors: STORE_CORS,
      adminCors: ADMIN_CORS,
      authCors: AUTH_CORS,
      jwtSecret: JWT_SECRET,
      cookieSecret: COOKIE_SECRET,
    },
  },
  admin: {
    backendUrl: BACKEND_URL,
    disable: SHOULD_DISABLE_ADMIN,
  },
  modules: [
    { resolve: "@/modules/order-return-request" },
    { resolve: "@/modules/split-order-payment" },
    {
      key: PAYOUT_MODULE,
      resolve: "@/modules/payout",
      options: {
        apiKey: process.env.STRIPE_API_KEY,
        webhookSecret: process.env.STRIPE_CONNECTED_ACCOUNTS_WEBHOOK_SECRET,
      },
    },
    {
      key: DIGITAL_PRODUCT_MODULE,
      resolve: "./modules/digital-product",
    },
    {
      key: SVG_ASSET_MODULE,
      resolve: "./modules/svg-asset",
    },
    fileModule,
    {
      key: SUBSCRIPTION_MODULE,
      resolve: "./modules/subscription",
    },
    ...(STRIPE_API_KEY && STRIPE_WEBHOOK_SECRET
      ? [
          {
            key: Modules.PAYMENT,
            resolve: "@medusajs/medusa/payment",
            options: {
              providers: [
                {
                  resolve: "@medusajs/medusa/payment-stripe",
                  id: "stripe",
                  options: {
                    apiKey: STRIPE_API_KEY,
                    webhookSecret: STRIPE_WEBHOOK_SECRET,
                    capture: true,
                    automaticPaymentMethods: true,
                  },
                },
              ],
            },
          },
        ]
      : []),
    ...(REDIS_URL
      ? [
          {
            key: Modules.EVENT_BUS,
            resolve: "@medusajs/event-bus-redis",
            options: {
              redisUrl: REDIS_URL,
            },
          },
          {
            key: Modules.WORKFLOW_ENGINE,
            resolve: "@medusajs/workflow-engine-redis",
            options: {
              redis: {
                url: REDIS_URL,
              },
            },
          },
        ]
      : []),
    ...((SENDGRID_API_KEY && SENDGRID_FROM_EMAIL) ||
    (RESEND_API_KEY && RESEND_FROM_EMAIL)
      ? [
          {
            key: Modules.NOTIFICATION,
            resolve: "@medusajs/notification",
            options: {
              providers: [
                ...(SENDGRID_API_KEY && SENDGRID_FROM_EMAIL
                  ? [
                      {
                        resolve: "@medusajs/notification-sendgrid",
                        id: "sendgrid",
                        options: {
                          channels: ["email"],
                          api_key: SENDGRID_API_KEY,
                          from: SENDGRID_FROM_EMAIL,
                        },
                      },
                    ]
                  : []),
                ...(RESEND_API_KEY && RESEND_FROM_EMAIL
                  ? [
                      {
                        resolve: "@/modules/email-notifications",
                        id: "resend",
                        options: {
                          channels: ["email"],
                          api_key: RESEND_API_KEY,
                          from: RESEND_FROM_EMAIL,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
        ]
      : []),
  ],
  plugins: [
    ...(MEILISEARCH_HOST && MEILISEARCH_ADMIN_KEY
      ? [
          {
            resolve: "@rokmohar/medusa-plugin-meilisearch",
            options: {
              config: {
                host: MEILISEARCH_HOST,
                apiKey: MEILISEARCH_ADMIN_KEY,
              },
              settings: {
                products: {
                  type: "products",
                  enabled: true,
                  fields: [
                    "id",
                    "title",
                    "description",
                    "handle",
                    "variant_sku",
                    "thumbnail",
                  ],
                  indexSettings: {
                    searchableAttributes: [
                      "title",
                      "description",
                      "variant_sku",
                    ],
                    displayedAttributes: [
                      "id",
                      "handle",
                      "title",
                      "description",
                      "variant_sku",
                      "thumbnail",
                    ],
                    filterableAttributes: ["id", "handle"],
                  },
                  primaryKey: "id",
                },
              },
            },
          },
        ]
      : []),
  ],
};

export default defineConfig(medusaConfig);
