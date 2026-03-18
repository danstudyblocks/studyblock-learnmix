import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Store, CheckCircle, DollarSign } from "lucide-react";

interface MarketplaceDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
  screenSize?: 'mobile' | 'tablet' | 'desktop';
}

interface FormData {
  title: string;
  description: string;
  subjectArea: string;
  keywords: string;
  priceType: 'free' | 'paid';
  price: string;
  allowEdit: boolean;
  allowPdfDownload: boolean;
  originalContent: boolean;
}

interface FormErrors {
  title?: string;
  description?: string;
  subjectArea?: string;
  keywords?: string;
  price?: string;
  originalContent?: string; // Change this from boolean to string for error messages
}

export function MarketplaceDropdown({ isOpen, onClose }: MarketplaceDropdownProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    subjectArea: '',
    keywords: '',
    priceType: 'free',
    price: '',
    allowEdit: false,
    allowPdfDownload: false,
    originalContent: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.subjectArea) {
      newErrors.subjectArea = 'Please select a subject area';
    }

    if (!formData.keywords.trim()) {
      newErrors.keywords = 'Keywords are required';
    }

    if (formData.priceType === 'paid' && (!formData.price || parseFloat(formData.price) <= 0)) {
      newErrors.price = 'Valid price is required for paid content';
    }

    if (!formData.originalContent) {
      newErrors.originalContent = 'You must confirm this is your original content';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          subjectArea: '',
          keywords: '',
          priceType: 'free',
          price: '',
          allowEdit: false,
          allowPdfDownload: false,
          originalContent: false
        });
        setIsSubmitted(false);
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting to marketplace:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (field in errors) {
      setErrors(prev => ({ ...prev, [field as keyof FormErrors]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white border-b border-border shadow-lg">
        <div className="px-6 py-8">
          <div className="max-w-2xl text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Submission Received!</h3>
            <p className="text-gray-600 mb-4">
              Thank you for submitting your design to the learnmix marketplace. Our team is now reviewing your submission and will add it to your account soon.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>What happens next?</strong><br />
                • Our team will review your submission within 24-48 hours<br />
                • You&apos;ll receive an email notification once it&apos;s approved<br />
                • Your resource will appear in your seller dashboard<br />
                • Start earning from your creative work!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-border shadow-lg">
      <div className="px-6 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Store className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Add to Marketplace</h3>
              <p className="text-sm text-gray-500">Share your design with the learnmix community</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Form - Left aligned with adjusted proportions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <Input
                placeholder="Give your design a catchy title..."
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <Textarea
                placeholder="Describe your design, its purpose, and how others can use it..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`min-h-32 ${errors.description ? 'border-red-500' : ''}`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>

            {/* Subject Area - Changed to text input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Area *
              </label>
              <Input
                placeholder="e.g. Mathematics, Science, English, Art..."
                value={formData.subjectArea}
                onChange={(e) => handleInputChange('subjectArea', e.target.value)}
                className={errors.subjectArea ? 'border-red-500' : ''}
              />
              {errors.subjectArea && (
                <p className="text-red-500 text-xs mt-1">{errors.subjectArea}</p>
              )}
            </div>

            {/* Keywords - Updated examples */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords *
              </label>
              <Input
                placeholder="poster, worksheet, stickers, postcards..."
                value={formData.keywords}
                onChange={(e) => handleInputChange('keywords', e.target.value)}
                className={errors.keywords ? 'border-red-500' : ''}
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate keywords with commas to help others find your design
              </p>
              {errors.keywords && (
                <p className="text-red-500 text-xs mt-1">{errors.keywords}</p>
              )}
            </div>
          </div>

          {/* Right Column - 1/3 width on large screens */}
          <div className="space-y-4">
            {/* Pricing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pricing
              </label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="free"
                    name="priceType"
                    checked={formData.priceType === 'free'}
                    onChange={() => handleInputChange('priceType', 'free')}
                    className="w-4 h-4 text-purple-600"
                  />
                  <label htmlFor="free" className="text-sm text-gray-700">
                    Free - Share with the community
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="paid"
                    name="priceType"
                    checked={formData.priceType === 'paid'}
                    onChange={() => handleInputChange('priceType', 'paid')}
                    className="w-4 h-4 text-purple-600"
                  />
                  <label htmlFor="paid" className="text-sm text-gray-700">
                    Paid - Set a price for your work
                  </label>
                </div>
                
                {formData.priceType === 'paid' && (
                  <div className="ml-6">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        className={`pl-10 ${errors.price ? 'border-red-500' : ''}`}
                        min="0.01"
                        step="0.01"
                      />
                    </div>
                    {errors.price && (
                      <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Permissions & Rights */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h4 className="font-medium text-gray-900">Permissions & Rights</h4>
              
              {/* Allow Edit Checkbox */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="allowEdit"
                  checked={formData.allowEdit}
                  onCheckedChange={(checked) => handleInputChange('allowEdit', !!checked)}
                />
                <div>
                  <label htmlFor="allowEdit" className="text-sm text-gray-700 font-medium">
                    Allow users to edit through the learnmix platform
                  </label>
                  <p className="text-xs text-gray-500">
                    Users can modify and customize your design within learnmix
                  </p>
                </div>
              </div>

              {/* Allow PDF Download Checkbox */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="allowPdfDownload"
                  checked={formData.allowPdfDownload}
                  onCheckedChange={(checked) => handleInputChange('allowPdfDownload', !!checked)}
                />
                <div>
                  <label htmlFor="allowPdfDownload" className="text-sm text-gray-700 font-medium">
                    Allow PDF download through marketplace
                  </label>
                  <p className="text-xs text-gray-500">
                    Users can download a PDF version of your design directly from the marketplace
                  </p>
                </div>
              </div>

              {/* Original Content Checkbox */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="originalContent"
                  checked={formData.originalContent}
                  onCheckedChange={(checked) => handleInputChange('originalContent', !!checked)}
                  className={errors.originalContent ? 'border-red-500' : ''}
                />
                <div>
                  <label htmlFor="originalContent" className="text-sm text-gray-700 font-medium">
                    This is my original content *
                  </label>
                  <p className="text-xs text-gray-500">
                    I confirm that I own the rights to this design and all included elements
                  </p>
                  {errors.originalContent && (
                    <p className="text-red-500 text-xs mt-1">{errors.originalContent}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-0 shadow-sm h-12"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Store className="w-4 h-4 mr-2" />
                  Submit to Marketplace
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <div>
              <h5 className="font-medium text-blue-900 text-sm mb-1">Marketplace Guidelines</h5>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Ensure your design is original and doesn&apos;t infringe on copyrights</li>
                <li>• High-quality designs perform better in the marketplace</li>
                <li>• Clear descriptions and relevant keywords help users find your work</li>
                <li>• Our team reviews all submissions to maintain quality standards</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}