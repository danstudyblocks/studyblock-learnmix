"use client"
import { useState } from "react";
import { HttpTypes } from "@medusajs/types";

type ReportIssueFormProps = {
  product: HttpTypes.StoreProduct;
};

const ReportIssueForm: React.FC<ReportIssueFormProps> = ({ product }) => {
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [reportError, setReportError] = useState("");

  // Handle report form submission
  const handleReportSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingReport(true);
    setReportError("");

    const formData = new FormData(e.currentTarget);
    const reportData = {
      name: formData.get("user_name") as string,
      email: formData.get("user_email") as string,
      message: formData.get("message") as string,
      productId: product.id,
      productTitle: product.title,
    };

    try {
      console.log("reportData", reportData);
      // Simulate API call - replace with actual API endpoint
      
      // Show success popup
      setShowSuccessPopup(true);
      
      // Reset form
      e.currentTarget.reset();
      
      // Hide success popup after 5 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 5000);
      
    } catch (error) {
      console.log("Error submitting report:", error);
      setReportError("Failed to submit report. Please try again.");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <>
      <div className="stp-15 sbp-15">
        <p className="text-n600 text-2xl font-[700] text-start mt-2">
          <span className="text-sbhtext">Report</span> an issue
        </p>
        <form onSubmit={handleReportSubmit} className="grid grid-cols-12 gap-4 font-medium sm:gap-6 lg:mt-4">
          <div className="col-span-12 rounded-xl border border-n30 p-3 lg:col-span-6">
            <input
              type="text"
              className="outline-none placeholder:text-n100"
              placeholder="Name"
              name="user_name"
              required
              disabled={isSubmittingReport}
            />
          </div>
          <div className="col-span-12 rounded-xl border border-n30 p-3 lg:col-span-6">
            <input
              type="email"
              className="outline-none placeholder:text-n100"
              placeholder="Email"
              required
              name="user_email"
              disabled={isSubmittingReport}
            />
          </div>
          <div className="col-span-12 rounded-xl border border-n30 p-3">
            <textarea
              className="min-h-[100px] w-full outline-none placeholder:text-n100"
              placeholder="Message"
              name="message"
              required
              disabled={isSubmittingReport}
            ></textarea>
          </div>
          {reportError && (
            <div className="col-span-12">
              <p className="text-red-500 text-sm">{reportError}</p>
            </div>
          )}
          <div className="col-span-4">
            <button
              type="submit"
              disabled={isSubmittingReport}
              className="relative flex items-center justify-center overflow-hidden rounded-xl bg-b300 px-4 py-3 font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-xl after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] sm:px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {isSubmittingReport ? "Submitting..." : "Submit"}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              We will check the listing to see if it violates our guidelines and take the necessary action to ensure a safe shopping experience for everyone. Thank you for helping us maintain a trusted community.
            </p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="mt-6 bg-b300 text-white px-6 py-2 rounded-lg font-semibold hover:bg-b400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportIssueForm;
