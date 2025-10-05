import Link from "next/link";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          🛡️ Privacy Policy
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          <span className="font-semibold">Last Updated:</span> October 5, 2025
        </p>

        <div className="space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="pl-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              By registering, logging in, or using ChatShat in any way, you
              agree to comply with these Terms & Conditions and all applicable
              laws. <br />
              If you do not agree, please discontinue use of the platform.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              2. Use of the Platform
            </h2>
            <p className="pl-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              You agree to use ChatShat responsibly and only for lawful
              purposes. You must not:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              <li>
                Use the app to send spam, harassment, threats, or offensive
                material.
              </li>
              <li>Impersonate another person or misrepresent your identity.</li>
              <li>
                Attempt to hack, damage, or disrupt the platform or its users.
              </li>
              <li>
                Use bots, scripts, or automation tools to abuse the service.
              </li>
            </ul>
            <p className="pl-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Violation of these rules may result in suspension or permanent
              banning of your account.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              3. User Accounts
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              <li>
                You are responsible for maintaining the confidentiality of your
                account and password.
              </li>
              <li>
                You are also responsible for all activities under your account.
              </li>
              <li>
                If you suspect any unauthorized use, please contact us
                immediately at support@chatshat.com .
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              4. Messages and Content
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              <li>
                You own the content &#40;messages, images, files&#41; you send
                through ChatShat.
              </li>
              <li>
                By using the platform, you grant us limited permission to
                process and deliver your messages to intended recipients.
              </li>
              <li>
                We do not read, sell, or share your messages for advertising or
                profiling purposes.
              </li>
              <li>
                You are solely responsible for the content you share — please
                avoid sending illegal, copyrighted, or harmful materials.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              5. Service Availability
            </h2>
            <p className="pl-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              ChatShat is a hobby project that may experience downtime, updates,
              or feature changes without notice. We strive to maintain uptime,
              but we do not guarantee that the service will always be available
              or error-free.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              6. Intellectual Property
            </h2>
            <p className="pl-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              All branding, design, and software code related to ChatShat are
              owned by the creator&#40;s&#41; of ChatShat. You may not copy,
              reproduce, or redistribute any part of the app without permission.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              7. Limitation of Liability
            </h2>
            <p className="pl-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              ChatShat and its creators shall not be held responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              <li>
                Any data loss, message delivery failure, or technical errors
              </li>
              <li>
                Any indirect, incidental, or consequential damages resulting
                from use of the platform
              </li>
            </ul>
            <p className="pl-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Use ChatShat at your own discretion and risk.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              8. Termination
            </h2>
            <p className="pl-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              We reserve the right to suspend or delete any account that
              violates these Terms or harms the community in any way. <br />
              You may delete your account anytime by contacting us at
              <Link
                href="mailto:tarunthakur283@gmail.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                tarunthakur283@gmail.com
              </Link>
              .
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              9. Changes to These Terms
            </h2>
            <p className="pl-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              We may modify or update these Terms periodically. <br />
              The updated version will always be posted here, and continued use
              of ChatShat after changes means you accept the new Terms.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              9. Contact Us
            </h2>
            <p className="pl-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have any questions or concerns about these Terms &
              Conditions, please reach out to us at:
              <Link
                href="mailto:tarunthakur283@gmail.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                📧 tarunthakur283@gmail.com
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
