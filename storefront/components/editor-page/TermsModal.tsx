"use client";

import { X } from "lucide-react";

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TermsModal = ({ isOpen, onClose }: TermsModalProps) => {
    if (!isOpen) return null;

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div 
                className="bg-[rgb(252,250,248)] rounded-2xl w-full max-w-4xl my-8 shadow-xl relative"
                style={{ fontFamily: '"Public Sans", Helvetica, Arial, sans-serif' }}
            >
                {/* Header */}
                <div className="sticky top-0 bg-[rgb(252,250,248)] border-b border-black/10 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
                    <h1 
                        className="text-2xl tracking-tight"
                        style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                    >
                        Terms and Conditions
                    </h1>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-8 overflow-y-auto max-h-[calc(100vh-200px)]">
                    <div className="prose prose-sm max-w-none">
                        <p className="text-sm text-gray-600 mb-6">Last updated: Q1 2026</p>

                        {/* Quick Navigation */}
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Navigation</h3>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { label: "About Learnmix", id: "about" },
                                    { label: "Who Can Use", id: "who-can-use" },
                                    { label: "Licence & Use", id: "licence" },
                                    { label: "Accounts", id: "accounts" },
                                    { label: "Intellectual Property", id: "ip" },
                                    { label: "Marketplace", id: "marketplace" },
                                    { label: "Safety", id: "safety" },
                                    { label: "AI Tools", id: "ai" },
                                    { label: "Privacy", id: "privacy" },
                                    { label: "Termination", id: "termination" },
                                    { label: "Liability", id: "liability" },
                                    { label: "Changes", id: "changes" },
                                    { label: "Governing Law", id: "law" },
                                    { label: "Contact", id: "contact" },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => scrollToSection(item.id)}
                                        className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-colors"
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 1 */}
                        <section id="about" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                1. About Learnmix
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                Learnmix (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is an online platform that enables educators and organisations to create, edit, share, sell, and distribute educational resources, including digital and print-on-demand materials.
                            </p>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                These Terms and Conditions govern your use of the Learnmix platform, website, tools, and services (together, the &quot;Platform&quot;).
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                By accessing or using Learnmix, you agree to be bound by these Terms.
                            </p>
                        </section>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 2 */}
                        <section id="who-can-use" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                2. Who Can Use Learnmix
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">You may use Learnmix if:</p>
                            <ul className="list-disc pl-6 mb-3 space-y-2 text-gray-700">
                                <li>You are at least 18 years old, or</li>
                                <li>You are under 18 and have permission from a parent, guardian, or school.</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed">
                                If you are using Learnmix on behalf of a school, academy trust, organisation, or business, you confirm that you have authority to bind that organisation to these Terms.
                            </p>
                        </section>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 3 */}
                        <section id="licence" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                3. Licence and Permitted Use
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                Free and Pro users are granted a non-exclusive licence to use resources downloaded from Learnmix for their own classroom or school use. Resources may be used in both digital and printed formats as required for teaching and learning. Users must not sell, redistribute, or share Learnmix resources on other platforms or with third parties outside their school. Account details must not be shared with others, as this helps protect creators&apos; copyright and ensures compliance with data protection and safeguarding requirements.
                            </p>
                        </section>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 4 */}
                        <section id="accounts" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                4. Accounts and Responsibilities
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">You are responsible for:</p>
                            <ul className="list-disc pl-6 mb-3 space-y-2 text-gray-700">
                                <li>Keeping your account details secure</li>
                                <li>All activity that takes place under your account</li>
                                <li>Ensuring information you provide is accurate and up to date</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed">
                                We may suspend or terminate accounts that breach these Terms or misuse the Platform.
                            </p>
                        </section>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 5 */}
                        <section id="ip" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                5. Intellectual Property and Copyright
                            </h2>
                            
                            <h3 className="text-lg font-semibold mb-3 mt-6">5.1 Your Content</h3>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                You retain ownership of any original content, resources, designs, or materials you create and upload to Learnmix (&quot;Your Content&quot;).
                            </p>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                By uploading content to Learnmix, you grant us a non-exclusive, worldwide, royalty-free licence to:
                            </p>
                            <ul className="list-disc pl-6 mb-3 space-y-2 text-gray-700">
                                <li>Host, store, display, and distribute Your Content on the Platform</li>
                                <li>Enable editing, adaptation, and personalisation within Learnmix</li>
                                <li>Facilitate sales, downloads, and print-on-demand services</li>
                                <li>Promote Your Content and the Platform</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed">
                                This licence continues for as long as Your Content remains on Learnmix.
                            </p>

                            <h3 className="text-lg font-semibold mb-3 mt-6">5.2 Platform Editability and Use</h3>
                            <p className="text-gray-700 leading-relaxed mb-3">Resources created or uploaded to Learnmix:</p>
                            <ul className="list-disc pl-6 mb-3 space-y-2 text-gray-700">
                                <li>Can only be edited using Learnmix tools</li>
                                <li>May not be exported in editable formats for use in competing platforms</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed">
                                Downloaded resources (such as PDFs or printed materials) may be used in accordance with the licence selected by the creator.
                            </p>

                            <h3 className="text-lg font-semibold mb-3 mt-6">5.3 Third-Party Rights</h3>
                            <p className="text-gray-700 leading-relaxed mb-3">You must only upload content that:</p>
                            <ul className="list-disc pl-6 mb-3 space-y-2 text-gray-700">
                                <li>You own, or</li>
                                <li>You have permission or a valid licence to use</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                You must not upload content that infringes copyright, trademarks, or other intellectual property rights.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                We reserve the right to remove content that we reasonably believe infringes third-party rights.
                            </p>
                        </section>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 6 */}
                        <section id="marketplace" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                6. Marketplace and Monetisation
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                Creators may choose to sell resources through the Learnmix marketplace.
                            </p>
                            <ul className="list-disc pl-6 mb-3 space-y-2 text-gray-700">
                                <li>Prices are set by the creator</li>
                                <li>Learnmix retains a commission on sales, as communicated at the time of sale</li>
                                <li>Payments are subject to minimum payout thresholds and third-party payment provider terms</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mb-3">Creators are responsible for:</p>
                            <ul className="list-disc pl-6 mb-3 space-y-2 text-gray-700">
                                <li>Declaring income for tax purposes</li>
                                <li>Ensuring content is accurate, lawful, and suitable for educational use</li>
                            </ul>
                        </section>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 7 */}
                        <section id="safety" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                7. Acceptable Use and Safety
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">You must not use Learnmix to:</p>
                            <ul className="list-disc pl-6 mb-3 space-y-2 text-gray-700">
                                <li>Upload harmful, offensive, or discriminatory content</li>
                                <li>Share personal data of children or vulnerable individuals</li>
                                <li>Promote violence, extremism, or illegal activity</li>
                                <li>Circumvent platform safeguards or security</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                Content intended for classroom use must be appropriate for the stated age group and comply with UK safeguarding expectations.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                We may remove content or restrict accounts to protect users, schools, and learners.
                            </p>
                        </section>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 8 */}
                        <section id="ai" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                8. AI Tools and Generated Content
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                Learnmix may offer AI-assisted tools to support content creation and adaptation.
                            </p>
                            <ul className="list-disc pl-6 mb-3 space-y-2 text-gray-700">
                                <li>AI outputs are generated based on user input</li>
                                <li>Users are responsible for reviewing, editing, and validating AI-generated content</li>
                                <li>Learnmix does not guarantee accuracy or curriculum alignment of AI outputs</li>
                            </ul>
                        </section>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 9 */}
                        <section id="privacy" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                9. Data Protection and Privacy
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                We process personal data in accordance with UK data protection law, including the UK GDPR.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Details of how we collect and use personal data are set out in our Privacy Policy.
                            </p>
                        </section>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 10 */}
                        <section id="termination" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                10. Suspension and Termination
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">We may suspend or terminate access to Learnmix if:</p>
                            <ul className="list-disc pl-6 mb-3 space-y-2 text-gray-700">
                                <li>These Terms are breached</li>
                                <li>The Platform is misused</li>
                                <li>We are required to do so by law</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed">
                                You may stop using Learnmix at any time. Content removal may affect access to previously purchased or shared resources.
                            </p>
                        </section>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 11 */}
                        <section id="liability" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                11. Liability
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">Learnmix is provided on an &quot;as is&quot; basis.</p>
                            <p className="text-gray-700 leading-relaxed mb-3">To the fullest extent permitted by law:</p>
                            <ul className="list-disc pl-6 mb-3 space-y-2 text-gray-700">
                                <li>We exclude liability for loss of profits, revenue, or data</li>
                                <li>We do not accept responsibility for classroom outcomes or educational results</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed">
                                Nothing in these Terms limits liability for death or personal injury caused by negligence, fraud, or other liability that cannot be excluded under UK law.
                            </p>
                        </section>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 12 */}
                        <section id="changes" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                12. Changes to These Terms
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                We may update these Terms from time to time. Continued use of Learnmix after changes are published constitutes acceptance of the updated Terms.
                            </p>
                        </section>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 13 */}
                        <section id="law" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                13. Governing Law
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                These Terms are governed by the laws of England and Wales.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.
                            </p>
                        </section>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 14 */}
                        <section id="contact" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                14. Contact
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                If you have questions about these Terms, please contact:
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Email: <a href="mailto:hello@learnmix.com" className="text-black underline hover:text-gray-700">hello@learnmix.com</a>
                            </p>
                        </section>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-[rgb(252,250,248)] border-t border-black/10 px-6 py-4 rounded-b-2xl">
                    <button 
                        onClick={onClose}
                        className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-black/90 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;
