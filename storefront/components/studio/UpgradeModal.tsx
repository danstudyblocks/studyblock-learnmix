import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Check, Crown, Sparkles, Zap, Shield, Users, Download, Palette, Upload, FileText, Settings } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  billing: 'monthly' | 'yearly';
  originalPrice?: number;
  popular?: boolean;
  features: string[];
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'monthly',
    name: 'Pro Monthly',
    price: 12,
    billing: 'monthly',
    features: [
      'Unlimited templates',
      'Advanced AI tools', 
      'Priority support',
      'Custom fonts',
      'Brand kit',
      'Team collaboration',
      'High-resolution exports',
      'Commercial license'
    ]
  },
  {
    id: 'yearly',
    name: 'Pro Yearly',
    price: 9,
    billing: 'yearly',
    originalPrice: 12,
    popular: true,
    features: [
      'Everything in Monthly',
      '25% savings',
      'Advanced templates',
      'White-label exports',
      'Priority AI processing',
      'Unlimited cloud storage',
      'Advanced team features',
      'Custom integrations'
    ]
  }
];

const proFeatures = [
  {
    icon: Sparkles,
    title: 'Advanced AI Tools',
    description: 'Access cutting-edge AI for image generation, text enhancement, and smart design suggestions'
  },
  {
    icon: Crown,
    title: 'Premium Templates',
    description: 'Unlock 1000+ professional templates designed by expert designers'
  },
  {
    icon: Zap,
    title: 'Priority Processing',
    description: 'Lightning-fast rendering and exports with dedicated server resources'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Real-time collaboration with unlimited team members and shared workspaces'
  },
  {
    icon: Download,
    title: 'High-Res Exports',
    description: 'Export in 4K resolution with transparent backgrounds and vector formats'
  },
  {
    icon: Palette,
    title: 'Custom Brand Kit',
    description: 'Save brand colors, fonts, and logos for consistent design across all projects'
  },
  {
    icon: Upload,
    title: 'Unlimited Storage',
    description: 'Store unlimited assets, templates, and projects in the cloud'
  },
  {
    icon: Shield,
    title: 'Commercial License',
    description: 'Use all designs for commercial purposes with full licensing rights'
  }
];

export function UpgradeModal({ isOpen, onClose, isMobile = false }: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('yearly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'plan' | 'payment'>('plan');

  if (!isOpen) return null;

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleContinue = () => {
    setPaymentStep('payment');
  };

  const handleBack = () => {
    setPaymentStep('plan');
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    // Handle successful payment
  };

  const selectedPlanData = pricingPlans.find(plan => plan.id === selectedPlan);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden ${isMobile ? 'mx-2' : 'mx-4'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Upgrade to learnmix Pro</h2>
              <p className="text-sm text-gray-500">Unlock powerful features for professional design</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-10 w-10 p-0 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Features & Benefits */}
          <div className="lg:w-1/2 p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-r border-gray-100">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What you&apos;ll get with Pro</h3>
              <p className="text-sm text-gray-600">Everything you need to create professional designs</p>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto no-scrollbar scrollbar-thin">
              {proFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{feature.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social Proof */}
            <div className="mt-6 p-4 bg-white/70 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-yellow-400 rounded-full mr-1"></div>
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-900">4.9/5</span>
              </div>
              <p className="text-xs text-gray-600">&quot;learnmix Pro has transformed how we create educational content. The AI tools save us hours every week!&quot;</p>
              <p className="text-xs text-gray-500 mt-1">— Sarah Chen, Design Lead at EduTech</p>
            </div>
          </div>

          {/* Right Side - Pricing & Payment */}
          <div className="lg:w-1/2 p-6">
            {paymentStep === 'plan' ? (
              <>
                {/* Plan Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose your plan</h3>
                  
                  <div className="space-y-3">
                    {pricingPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedPlan === plan.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handlePlanSelect(plan.id)}
                      >
                        {plan.popular && (
                          <div className="absolute -top-2 left-4">
                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                              Most Popular
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-bold text-gray-900">${plan.price}</span>
                              <span className="text-sm text-gray-500">/{plan.billing === 'monthly' ? 'month' : 'year'}</span>
                              {plan.originalPrice && (
                                <span className="text-sm text-gray-400 line-through ml-2">${plan.originalPrice}</span>
                              )}
                            </div>
                            {plan.billing === 'yearly' && (
                              <p className="text-xs text-green-600 font-medium mt-1">Save 25% annually</p>
                            )}
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedPlan === plan.id ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                          }`}>
                            {selectedPlan === plan.id && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Continue Button */}
                <Button
                  onClick={handleContinue}
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-xl"
                >
                  Continue to Payment
                </Button>

                {/* Money Back Guarantee */}
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>30-day money-back guarantee</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Cancel anytime, no questions asked</p>
                </div>
              </>
            ) : (
              <>
                {/* Payment Form */}
                <div className="mb-6">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="mb-4 text-sm text-gray-600 hover:text-gray-800"
                  >
                    ← Back to plans
                  </Button>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment details</h3>
                  
                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{selectedPlanData?.name}</p>
                        <p className="text-sm text-gray-600">
                          Billed {selectedPlanData?.billing === 'monthly' ? 'monthly' : 'annually'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">${selectedPlanData?.price}</p>
                        <p className="text-sm text-gray-600">
                          /{selectedPlanData?.billing === 'monthly' ? 'month' : 'year'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full h-11"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card number</label>
                      <Input
                        type="text"
                        placeholder="1234 1234 1234 1234"
                        className="w-full h-11"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
                        <Input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full h-11"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                        <Input
                          type="text"
                          placeholder="123"
                          className="w-full h-11"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder name</label>
                      <Input
                        type="text"
                        placeholder="Full name on card"
                        className="w-full h-11"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Button */}
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-xl"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    `Subscribe for $${selectedPlanData?.price}/${selectedPlanData?.billing === 'monthly' ? 'month' : 'year'}`
                  )}
                </Button>

                {/* Security Notice */}
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Shield className="w-3 h-3" />
                  <span>Secured by 256-bit SSL encryption</span>
                </div>
              </>
            )}

            {/* Terms */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                By subscribing, you agree to our{' '}
                <a href="#" className="text-purple-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}