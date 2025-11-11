import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">

            {/* Agreement to Terms */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms of Service ("Terms") constitute a legally binding agreement between you and Top10.com
                ("Company," "we," "us," or "our") concerning your access to and use of the Top10.com website
                and any related services (collectively, the "Service").
              </p>
              <p className="text-gray-700 leading-relaxed">
                By accessing or using the Service, you agree to be bound by these Terms. If you do not agree with
                these Terms, you must not access or use the Service.
              </p>
            </div>

            {/* Intellectual Property Rights */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Intellectual Property Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Unless otherwise indicated, the Service is our proprietary property and all source code, databases,
                functionality, software, website designs, audio, video, text, photographs, and graphics on the Service
                (collectively, the "Content") are owned or controlled by us or licensed to us.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The Content is protected by copyright and trademark laws. You are granted a limited license only for
                purposes of viewing the material contained on this Service.
              </p>
            </div>

            {/* User Representations */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Representations</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                By using the Service, you represent and warrant that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>You have the legal capacity and agree to comply with these Terms</li>
                <li>You are not a minor in the jurisdiction in which you reside</li>
                <li>You will not access the Service through automated or non-human means</li>
                <li>You will not use the Service for any illegal or unauthorized purpose</li>
                <li>Your use of the Service will not violate any applicable law or regulation</li>
              </ul>
            </div>

            {/* Prohibited Activities */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Prohibited Activities</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may not access or use the Service for any purpose other than that for which we make the Service
                available. Prohibited activities include, but are not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Systematically retrieve data or content to create a database or directory</li>
                <li>Make unauthorized use of the Service, including collecting usernames and/or email addresses</li>
                <li>Use the Service to advertise or offer to sell goods and services without our permission</li>
                <li>Circumvent, disable, or interfere with security-related features of the Service</li>
                <li>Engage in unauthorized framing of or linking to the Service</li>
                <li>Trick, defraud, or mislead us and other users</li>
                <li>Interfere with or disrupt the Service or servers or networks</li>
                <li>Use any robot, spider, or other automatic device to access the Service</li>
                <li>Upload or transmit viruses, malware, or any other malicious code</li>
                <li>Harass, intimidate, or threaten any of our employees or agents</li>
              </ul>
            </div>

            {/* User Generated Content */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. User Generated Content</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Service may allow you to post, submit, or transmit content ("User Content"). By providing User
                Content, you grant us a worldwide, non-exclusive, royalty-free, perpetual, irrevocable license to use,
                reproduce, modify, adapt, publish, and display such User Content.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You represent and warrant that: (1) you own or control all rights to the User Content; (2) the User
                Content is accurate and not misleading; and (3) use of the User Content does not violate these Terms
                or any applicable laws.
              </p>
            </div>

            {/* Third-Party Websites and Content */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Third-Party Websites and Content</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Service may contain links to third-party websites or services that are not owned or controlled by
                Top10.com. We have no control over, and assume no responsibility for, the content, privacy policies,
                or practices of any third-party websites or services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You acknowledge and agree that we shall not be responsible or liable for any damage or loss caused by
                or in connection with use of any third-party content, goods, or services available through such websites.
              </p>
            </div>

            {/* Affiliate Disclosure */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Affiliate Disclosure</h2>
              <p className="text-gray-700 leading-relaxed">
                Top10.com participates in affiliate marketing programs. This means we may earn commissions on products
                and services purchased through our affiliate links. These commissions help support our website and allow
                us to continue providing free content to our users. Our reviews and recommendations are based on our
                honest opinions and research, and affiliate relationships do not influence our editorial decisions.
              </p>
            </div>

            {/* Disclaimer of Warranties */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                THE SERVICE IS PROVIDED ON AN "AS-IS" AND "AS-AVAILABLE" BASIS. YOU AGREE THAT YOUR USE OF THE SERVICE
                WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS
                OR IMPLIED, IN CONNECTION WITH THE SERVICE.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We make no warranties or representations about the accuracy or completeness of the Service's content or
                the content of any websites linked to the Service and we will assume no liability for any errors or
                omissions.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU FOR ANY DIRECT, INDIRECT,
                CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE,
                LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICE, EVEN IF WE HAVE BEEN ADVISED OF
                THE POSSIBILITY OF SUCH DAMAGES.
              </p>
            </div>

            {/* Indemnification */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to defend, indemnify, and hold us harmless from and against any loss, damage, liability, claim,
                or demand, including reasonable attorneys' fees and expenses, made by any third party due to or arising
                out of: (1) your use of the Service; (2) breach of these Terms; (3) any breach of your representations
                and warranties; (4) your violation of the rights of a third party.
              </p>
            </div>

            {/* Modifications and Interruptions */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Modifications and Interruptions</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to change, modify, or remove the contents of the Service at any time for any reason
                at our sole discretion without notice. We also reserve the right to modify or discontinue all or part of
                the Service without notice. We will not be liable to you or any third party for any modification, price
                change, suspension, or discontinuance of the Service.
              </p>
            </div>

            {/* Governing Law */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be governed by and defined following the laws of the United States. Top10.com and
                yourself irrevocably consent that the courts shall have exclusive jurisdiction to resolve any dispute
                which may arise in connection with these Terms.
              </p>
            </div>

            {/* Termination */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                We may terminate or suspend your access immediately, without prior notice or liability, for any reason
                whatsoever, including without limitation if you breach these Terms. Upon termination, your right to use
                the Service will immediately cease.
              </p>
            </div>

            {/* Changes to Terms */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Changes to These Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify you of any changes by posting
                the new Terms on this page and updating the "Last updated" date. You are advised to review these Terms
                periodically. Your continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </div>

            {/* Contact Us */}
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-none space-y-2 text-gray-700 mb-6">
                <li><strong>Email:</strong> legal@top10.com</li>
                <li><strong>Website:</strong> www.top10.com</li>
              </ul>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
