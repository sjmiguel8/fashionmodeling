export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="container max-w-4xl px-6 py-16 mx-auto">
                <article className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
                    {/* Header section - keeping existing styling */}
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                            Privacy Policy for Fashion Modeling
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            <strong>Effective Date: March 27, 2025</strong>
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Introduction Section */}
                        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Welcome to Fashion Modeling ("we," "us," or "our"), a web application designed to help users discover clothing articles through web and Pinterest searches. We are committed to protecting your privacy and ensuring transparency about how we collect, use, and share your information. This Privacy Policy explains our practices regarding the information we collect when you use our website (the "Service"), hosted on Vercel.
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                                By using the Service, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree, please do not use the Service.
                            </p>
                        </section>

                        {/* Information We Collect Section */}
                        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                                1. Information We Collect
                            </h2>
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                                    1.1 Information You Provide
                                </h3>
                                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
                                    <li>
                                        <strong>Search Queries:</strong> When you enter search terms (e.g., "clothing articles") into our search bar, we temporarily process these queries to retrieve results from third-party APIs.
                                    </li>
                                </ul>

                                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                                    1.2 Automatically Collected Information
                                </h3>
                                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
                                    <li><strong>Usage Data:</strong> We may collect information about how you interact with the Service, such as pages visited, time spent, and the browser or device used.</li>
                                    <li><strong>Log Data:</strong> Our servers may log technical details like your IP address, browser type, operating system, and timestamps.</li>
                                    <li><strong>Cookies and Similar Technologies:</strong> We may use cookies or similar technologies to enhance your experience.</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                                    1.3 Third-Party Data
                                </h3>
                                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
                                    <li>
                                        <strong>API Interactions:</strong> When you use the Service, we send your search queries to third-party APIs (Google Custom Search API and Pinterest API) to retrieve results.
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* How We Use Your Information Section */}
                        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                                2. How We Use Your Information
                            </h2>
                            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                                <li><strong>To Provide the Service:</strong> Process your search queries and display relevant results.</li>
                                <li><strong>To Improve the Service:</strong> Analyze usage patterns to enhance functionality.</li>
                                <li><strong>To Ensure Security:</strong> Monitor and protect the Service from unauthorized access.</li>
                                <li><strong>To Comply with Legal Obligations:</strong> Fulfill any applicable legal requirements.</li>
                            </ul>
                        </section>

                        {/* Third-Party Service Providers Section */}
                        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                                3. How We Share Your Information
                            </h2>
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                                    3.1 Third-Party Service Providers
                                </h3>
                                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                                    <li>
                                        <strong>Google Custom Search API:</strong> Your search queries are sent to Google. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google's Privacy Policy</a>.
                                    </li>
                                    <li>
                                        <strong>Pinterest API:</strong> Your search queries are sent to Pinterest. See <a href="https://policy.pinterest.com/en/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Pinterest's Privacy Policy</a>.
                                    </li>
                                    <li>
                                        <strong>Vercel:</strong> Our hosting provider may process technical data. See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Vercel's Privacy Policy</a>.
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Remaining sections following the same pattern... */}
                        {/* Add sections 4-8 with the same styling structure */}

                        {/* Contact Section */}
                        <section className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                                9. Contact Us
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
                            </p>
                            <p className="text-blue-600 dark:text-blue-400 font-semibold">
                                sjmiguel322@gmail.com
                            </p>
                        </section>
                    </div>
                </article>
            </div>
        </div>
    );
}
