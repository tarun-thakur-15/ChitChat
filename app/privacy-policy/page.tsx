import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          🛡️ Privacy Policy
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          <span className="font-semibold">Last Updated:</span> October 5, 2025
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Welcome to ChatShat, a live chatting platform built to help people
          connect and communicate instantly. Your privacy is very important to
          us. This Privacy Policy explains how ChatShat collects, uses, and
          protects your information when you use our service.
        </p>

        <div className="space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              1. Information We Collect
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              When you use ChatShat, we may collect the following types of
              information:
              <li>
                <span className="font-semibold">Account Information: </span>
                When you sign up or log in, we may collect your name, email
                address, and profile photo &#40;if provided&#41;.
              </li>
              <li>
                <span className="font-semibold">Messages: </span> Your chat
                messages, images, and files are transmitted in real time through
                our servers to deliver them to the intended recipient.
              </li>
              <li>
                We
                <span className="font-semibold">do not</span> sell, share, or
                use your private messages for advertising purposes.
              </li>
              <li>
                <span className="font-semibold">Usage Data:</span> We may
                collect non-personal data such as your device type, browser, IP
                address, and timestamps for improving performance and security.
              </li>
              <li>
                <span className="font-semibold">Cookies:</span> We use basic
                cookies or local storage to maintain your login session and
                preferences.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              2. How We Use Your Information
            </h2>

            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              <li>Provide and maintain the ChatShat service</li>
              <li>Improve performance, reliability, and security</li>
              <li>Respond to your queries or technical issues</li>
              <li>Prevent spam, fraud, or misuse of the platform</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We never sell your personal data to third parties.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              3. Data Storage and Security
            </h2>
            <p className="pl-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Your messages are stored securely and accessible only to you and
              the intended recipients. <br />
              We use reasonable technical and organizational measures to protect
              your data from unauthorized access or loss. <br />
              However, please understand that no online service can guarantee
              100% security.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              4. Third-Party Services
            </h2>
            <p className="pl-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              ChatShat may use trusted third-party services &#40;such as hosting
              providers or analytics tools&#41; to run the platform efficiently.
              <br />
              These services only have access to the data necessary to perform
              their functions and are bound by confidentiality agreements.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              5. Children’s Privacy
            </h2>
            <p className="pl-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              You can request access, updates, or deletion of your personal data
              by contacting us at
              <a
                href="mailto:support@chatshat.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                support@chatshat.com
              </a>
              . You can also delete your account at any time.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              6. Changes to This Policy
            </h2>
            <p className="pl-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update this Privacy Policy occasionally to reflect
              improvements or legal requirements. <br />
              The updated version will always be available on this page, with
              the “Last Updated” date revised accordingly.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              7. Contact Us
            </h2>
            <p className="pl-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have questions or concerns about this Privacy Policy,
              please reach out to us at
              <Link
                href="mailto:tarunthakur283@gmail.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                tarunthakur283@gmail.com
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
