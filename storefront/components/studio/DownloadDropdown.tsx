import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Download, FileImage, FileEdit, FileCode, Crown, Sparkles } from "lucide-react";

interface DownloadDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
  screenSize?: 'mobile' | 'tablet' | 'desktop';
}

export function DownloadDropdown({ isOpen, onClose }: DownloadDropdownProps) {
  if (!isOpen) return null;

  const handleImagePdfDownload = () => {
    // Simulate image PDF download
    // In a real app, this would generate and download the image PDF
    const blob = new Blob(['Image PDF content'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design-image.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEditablePdfDownload = () => {
    // This would require pro subscription
    alert("Editable PDF download requires a Pro subscription. Please upgrade to continue.");
  };

  const handleJsonDownload = () => {
    // This would require pro subscription
    alert("Project File saving requires a Pro subscription. Please upgrade to continue.");
  };

  return (
    <div className="bg-white border-b border-border shadow-lg">
      <div className="px-6 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Download className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Download Options</h3>
              <p className="text-sm text-gray-500">Export your design in different formats</p>
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

        {/* Download Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Image PDF - Free */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:scale-105">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-md">
                <FileImage className="w-5 h-5 text-white" />
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
                FREE
              </Badge>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Image PDF</h4>
            <p className="text-sm text-gray-600 mb-4">
              Download your design as a static PDF image. Perfect for printing and sharing.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                <span>High resolution output</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                <span>Print-ready quality</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                <span>Universal compatibility</span>
              </div>
            </div>
            <Button 
              onClick={handleImagePdfDownload}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Image PDF
            </Button>
          </div>

          {/* Editable PDF - Pro */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:scale-105">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                <FileEdit className="w-5 h-5 text-white" />
              </div>
              <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0">
                <Crown className="w-3 h-3 mr-1" />
                PRO
              </Badge>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Editable PDF</h4>
            <p className="text-sm text-gray-600 mb-4">
              Export as an editable PDF with selectable text and vector graphics.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                <span>Editable text layers</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                <span>Vector graphics preserved</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                <span>Professional workflows</span>
              </div>
            </div>
            <Button 
              onClick={handleEditablePdfDownload}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-0 shadow-sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Upgrade for Editable PDF
            </Button>
          </div>

          {/* Project File - Pro */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:scale-105">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                <FileCode className="w-5 h-5 text-white" />
              </div>
              <Badge variant="secondary" className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0">
                <Crown className="w-3 h-3 mr-1" />
                PRO
              </Badge>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Project File</h4>
            <p className="text-sm text-gray-600 mb-4">
              Save your project file to reopen and edit your design in the learnmix platform.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                <span>Preserves all design elements</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                <span>Maintains editing capabilities</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                <span>Continue working later</span>
              </div>
            </div>
            <Button 
              onClick={handleJsonDownload}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 shadow-sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Upgrade for Project File
            </Button>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <div>
              <h5 className="font-medium text-gray-900 text-sm mb-1">Download Tips</h5>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Image PDFs are perfect for presentations and print materials</li>
                <li>• Editable PDFs maintain text and vector quality for professional use</li>
                <li>• Project files let you continue editing your design anytime</li>
                <li>• All downloads preserve your original design quality</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}