import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
import Layout from '../components/Layout';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-2xl font-bold text-dark mb-4 mt-2">{title}</h2>
    <div className="space-y-4 text-[#374151] leading-relaxed">{children}</div>
  </div>
);

const PrivacyPolicy = () => {
  const lastUpdated = 'May 5, 2025';

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-primary-light border-b border-card py-16 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-16 h-16 bg-white rounded-2xl shadow-soft flex items-center justify-center mx-auto mb-6 border border-card">
            <Shield className="text-primary-pink" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-3">Privacy Policy</h1>
          <p className="text-secondary">Last updated: {lastUpdated}</p>
        </motion.div>
      </div>

      {/* Back link */}
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <Link to="/" className="inline-flex items-center gap-2 text-primary-pink font-bold hover:gap-3 transition-all text-sm mb-8">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-10 text-amber-800 text-sm">
            <strong>Summary:</strong> LovePage collects only the minimum data needed to provide the service. We do not sell your data. Payment processing is handled entirely by Stripe — we never store your card details.
          </div>

          <Section title="1. Who We Are">
            <p>LovePage ("we", "us", "our") is an online service that allows users to create and share personalized digital love letter pages. Our website is accessible at <strong>lovepage.app</strong> (or the domain on which you accessed this site).</p>
            <p>If you have questions about this Privacy Policy, contact us at: <a href="mailto:privacy@lovepage.app" className="text-primary-pink hover:underline">privacy@lovepage.app</a>.</p>
          </Section>

          <Section title="2. Information We Collect">
            <p>We collect information in the following categories:</p>

            <h3 className="font-bold text-dark mt-6 mb-2">a) Information You Provide Directly</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Page content:</strong> The text, recipient/sender names, and customization choices you enter into the page builder (stored in Firestore to power your love page).</li>
              <li><strong>Payment information:</strong> When you purchase a page, you are redirected to Stripe's hosted checkout page. We receive only a Stripe session ID and payment confirmation — we never see, store, or process your credit card number, CVV, or billing address directly.</li>
            </ul>

            <h3 className="font-bold text-dark mt-6 mb-2">b) Information Collected Automatically</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Usage data:</strong> Browser type, device type, pages visited, referring URLs, and timestamps, collected via standard server logs and analytics tools.</li>
              <li><strong>Cookies &amp; local storage:</strong> We use browser local storage to remember your current draft ID between sessions. We do not use advertising cookies or third-party tracking cookies.</li>
              <li><strong>IP address:</strong> Logged temporarily as part of standard server infrastructure (Firebase Hosting / Google Cloud) for security and abuse prevention.</li>
            </ul>

            <h3 className="font-bold text-dark mt-6 mb-2">c) Information We Do NOT Collect</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>We do not require account registration — you do not need to provide an email address to use LovePage.</li>
              <li>We do not collect names, phone numbers, or any personal identifiers beyond what you voluntarily type into your love page.</li>
              <li>We do not collect payment card data of any kind.</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, operate, and maintain the LovePage service (storing and serving your love page).</li>
              <li>Process and verify your one-time payment via Stripe.</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities.</li>
              <li>Analyze usage patterns to improve the product (aggregate, anonymized data only).</li>
              <li>Comply with legal obligations.</li>
            </ul>
            <p>We do <strong>not</strong> use your data for advertising, we do <strong>not</strong> sell your data to any third party, and we do <strong>not</strong> use your personal data for any purpose beyond operating this service.</p>
          </Section>

          <Section title="4. Data Storage & Retention">
            <p>Your page content is stored in Google Firebase Firestore, hosted on Google Cloud infrastructure in the United States. By using LovePage, you consent to your data being stored and processed in the US.</p>
            <p><strong>Drafts (unpaid pages)</strong> are automatically deleted 24 hours after creation if payment is not completed.</p>
            <p><strong>Active pages (paid)</strong> are stored indefinitely so your love page remains accessible at its unique link. If you want your page deleted, contact us at <a href="mailto:support@lovepage.app" className="text-primary-pink hover:underline">support@lovepage.app</a> and we will remove it within 7 business days.</p>
          </Section>

          <Section title="5. Sharing Your Information">
            <p>We share data with the following third-party services only as necessary to operate LovePage:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Stripe, Inc.</strong> — Payment processing. When you pay, you interact directly with Stripe's platform. Stripe's privacy policy is available at <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-pink hover:underline">stripe.com/privacy</a>.</li>
              <li><strong>Google Firebase / Google Cloud Platform</strong> — Database (Firestore), hosting, and serverless functions. Google's privacy policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-pink hover:underline">policies.google.com/privacy</a>.</li>
            </ul>
            <p>We do not share, sell, rent, or trade your personal information with any other third parties for their commercial purposes.</p>
          </Section>

          <Section title="6. Cookies & Tracking">
            <p>LovePage uses:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Browser localStorage</strong> — To remember your in-progress draft between visits. This data stays on your device and is not transmitted to external advertising services.</li>
              <li><strong>No advertising cookies.</strong> We do not use Google AdSense, Facebook Pixel, or any other advertising tracking technology.</li>
            </ul>
            <p>You can clear your browser's local storage at any time via your browser settings, which will remove any draft references stored locally.</p>
          </Section>

          <Section title="7. Your Rights">
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Right to Access:</strong> Request a copy of the data we hold about you.</li>
              <li><strong>Right to Deletion:</strong> Request that we delete your page content and any associated data.</li>
              <li><strong>Right to Rectification:</strong> Request that we correct inaccurate data.</li>
              <li><strong>Right to Restriction:</strong> Request that we limit processing of your data.</li>
              <li><strong>Right to Portability:</strong> Request your data in a portable format.</li>
            </ul>
            <p>To exercise any of these rights, email us at <a href="mailto:privacy@lovepage.app" className="text-primary-pink hover:underline">privacy@lovepage.app</a>. We will respond within 30 days.</p>
            <p>If you are located in the European Economic Area (EEA), you also have the right to lodge a complaint with your local data protection authority.</p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>LovePage is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child under 13 has provided us with personal information, please contact us immediately and we will delete that information.</p>
          </Section>

          <Section title="9. Security">
            <p>We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>HTTPS encryption for all data in transit.</li>
              <li>Firebase Security Rules restricting database access.</li>
              <li>Payment data handled exclusively by PCI-DSS compliant Stripe infrastructure.</li>
            </ul>
            <p>However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.</p>
          </Section>

          <Section title="10. International Data Transfers">
            <p>Our infrastructure is primarily based in the United States. If you are accessing LovePage from outside the US, your data may be transferred to, stored, and processed in the US. By using LovePage, you consent to this transfer.</p>
          </Section>

          <Section title="11. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. We will indicate the date of the most recent revision at the top of this page. For significant changes, we may add a notice on the homepage. Your continued use of LovePage after any changes constitutes your acceptance of the updated policy.</p>
          </Section>

          <Section title="12. Contact Us">
            <p>For any questions, data requests, or concerns about this Privacy Policy:</p>
            <div className="bg-primary-light rounded-xl p-6 border border-card mt-4">
              <p><strong>Email:</strong> <a href="mailto:privacy@lovepage.app" className="text-primary-pink hover:underline">privacy@lovepage.app</a></p>
              <p className="mt-1"><strong>Support:</strong> <a href="mailto:support@lovepage.app" className="text-primary-pink hover:underline">support@lovepage.app</a></p>
            </div>
          </Section>

        </motion.div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
