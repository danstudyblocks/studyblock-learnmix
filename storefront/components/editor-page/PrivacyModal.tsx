"use client";

import { X } from "lucide-react";

interface PrivacyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PrivacyModal = ({ isOpen, onClose }: PrivacyModalProps) => {
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
                        Privacy Policy
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
                        <p className="text-sm text-gray-600 mb-4">Last updated: Q1 2026</p>
                        
                        <p className="text-gray-700 leading-relaxed mb-6">
                            This Privacy Policy explains how Learnmix collects, uses, stores, and protects personal data. It is written in line with UK data protection law, including the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
                        </p>

                        {/* Quick Navigation */}
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Navigation</h3>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { label: "Who We Are", id: "who-we-are" },
                                    { label: "Data Collection", id: "data-collection" },
                                    { label: "Data Use", id: "data-use" },
                                    { label: "Lawful Bases", id: "lawful-bases" },
                                    { label: "Children's Data", id: "children" },
                                    { label: "AI Tools", id: "ai-tools" },
                                    { label: "Sharing Data", id: "sharing" },
                                    { label: "International Transfers", id: "transfers" },
                                    { label: "Data Retention", id: "retention" },
                                    { label: "Your Rights", id: "rights" },
                                    { label: "Security", id: "security" },
                                    { label: "Policy Changes", id: "changes" },
                                    { label: "Contact Us", id: "contact" },
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
                        <section id="who-we-are" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                1. Who We Are
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                Learnmix (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is an education technology platform that enables educators and organisations to create, edit, share, sell, and use educational resources.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                For the purposes of data protection law, Learnmix is the data controller of personal data collected through the platform.
                            </p>
                        </section>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 2 */}
                        <section id="data-collection" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                2. What Data We Collect
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We may collect and process the following types of personal data:
                            </p>

                            <h3 className="text-lg font-semibold mb-3">a. Account and contact information</h3>
                            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                                <li>Name</li>
                                <li>Email address</li>
                                <li>Password (stored in encrypted form)</li>
                                <li>Organisation or school name (if provided)</li>
                            </ul>

                            <h3 className="text-lg font-semibold mb-3">b. Usage and platform data</h3>
                            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                                <li>Resources viewed, created, edited, or downloaded</li>
                                <li>Marketplace activity and purchase history</li>
                                <li>Log-in activity and device information</li>
                            </ul>

                            <h3 className="text-lg font-semibold mb-3">c. Payment information</h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Payments are processed by third-party payment providers. Learnmix does not store full payment card details.
                            </p>

                            <h3 className="text-lg font-semibold mb-3">d. Communications</h3>
                            <ul className="list-disc pl-6 mb-3 space-y-2 text-gray-700">
                                <li>Messages sent to us by email or through the platform</li>
                                <li>Support requests and feedback</li>
                            </ul>
                        </section>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 3 */}
                        <section id="data-use" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                3. How We Use Personal Data
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">We use personal data to:</p>
                            <ul className="list-disc pl-6 mb-3 space-y-2 text-gray-700">
                                <li>Provide and operate the Learnmix platform</li>
                                <li>Create and manage user accounts</li>
                                <li>Enable downloads, editing, sales, and print-on-demand services</li>
                                <li>Process payments and commissions</li>
                                <li>Improve platform performance and features</li>
                                <li>Communicate with users about updates, support, or service issues</li>
                                <li>Meet legal and regulatory obligations</li>
                            </ul>
                        </section>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 4 */}
                        <section id="lawful-bases" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                4. Lawful Bases for Processing
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                Under UK GDPR, we rely on the following lawful bases:
                            </p>
                            <ul className="list-disc pl-6 mb-3 space-y-2 text-gray-700">
                                <li><strong>Contract</strong> – to provide the services users sign up for</li>
                                <li><strong>Legitimate interests</strong> – to improve and secure the platform</li>
                                <li><strong>Legal obligation</strong> – where we must comply with the law</li>
                                <li><strong>Consent</strong> – for optional marketing communications</li>
                            </ul>
                        </section>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 5 */}
                        <section id="children" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                5. Children&apos;s Data and Safeguarding
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                Learnmix is designed primarily for educators and schools.
                            </p>
                            <ul className="list-disc pl-6 mb-3 space-y-2 text-gray-700">
                                <li>We do not knowingly collect personal data from children under 13 without appropriate consent.</li>
                                <li>Users must not upload personal data relating to pupils unless they have a lawful basis to do so.</li>
                                <li>Content intended for classroom use must comply with safeguarding and data protection expectations.</li>
                            </ul>
                        </section>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 6 */}
                        <section id="ai-tools" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                6. AI Tools and Data Use
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                Learnmix may offer AI-assisted tools to support content creation and adaptation.
                            </p>
                            <ul className="list-disc pl-6 mb-3 space-y-2 text-gray-700">
                                <li>User inputs may be processed to generate outputs.</li>
                                <li>AI-generated content should be reviewed by users before classroom use.</li>
                                <li>We do not use user content to train external AI models without permission.</li>
                            </ul>
                        </section>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 7 */}
                        <section id="sharing" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                7. Sharing Personal Data
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">We may share personal data with:</p>
                            <ul className="list-disc pl-6 mb-3 space-y-2 text-gray-700">
                                <li>Trusted service providers (such as hosting, analytics, and payment services)</li>
                                <li>Professional advisers where necessary</li>
                                <li>Authorities where required by law</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed">
                                All third parties are required to handle data securely and in line with data protection law.
                            </p>
                        </section>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 8 */}
                        <section id="transfers" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                8. International Transfers
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                Where personal data is transferred outside the UK, we ensure appropriate safeguards are in place, such as standard contractual clauses.
                            </p>
                        </section>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 9 */}
                        <section id="retention" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                9. Data Retention
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                We retain personal data only for as long as necessary to:
                            </p>
                            <ul className="list-disc pl-6 mb-3 space-y-2 text-gray-700">
                                <li>Provide the platform</li>
                                <li>Meet legal and accounting requirements</li>
                                <li>Resolve disputes</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed">
                                Users may request account deletion at any time, subject to legal obligations.
                            </p>
                        </section>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 10 */}
                        <section id="rights" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                10. Your Rights
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                Under UK data protection law, you have the right to:
                            </p>
                            <ul className="list-disc pl-6 mb-3 space-y-2 text-gray-700">
                                <li>Access your personal data</li>
                                <li>Request correction of inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Object to or restrict processing</li>
                                <li>Request data portability</li>
                                <li>Withdraw consent where applicable</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed">
                                Requests can be made using the contact details below.
                            </p>
                        </section>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 11 */}
                        <section id="security" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                11. Security
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                We use appropriate technical and organisational measures to protect personal data against unauthorised access, loss, or misuse.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Users are responsible for keeping their account details confidential.
                            </p>
                        </section>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 12 */}
                        <section id="changes" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                12. Changes to This Policy
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                We may update this Privacy Policy from time to time. Significant changes will be communicated through the platform or by email.
                            </p>
                        </section>

                        <hr className="my-8 border-gray-300" />

                        {/* Section 13 */}
                        <section id="contact" className="mb-8 scroll-mt-4">
                            <h2 
                                className="text-xl font-semibold mb-4"
                                style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
                            >
                                13. Contact Us
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                If you have questions about this Privacy Policy or how we handle personal data, please contact:
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

export default PrivacyModal;
