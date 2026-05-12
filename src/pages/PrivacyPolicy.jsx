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
  const lastUpdated = 'May 9, 2026';

  return (
    <Layout>
      <div className="bg-primary-light border-b border-card py-16 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-16 h-16 bg-white rounded-2xl shadow-soft flex items-center justify-center mx-auto mb-6 border border-card">
            <Shield className="text-primary-pink" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-3">Privacy Policy</h1>
          <p className="text-secondary">Last updated: {lastUpdated}</p>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-8">
        <Link to="/" className="inline-flex items-center gap-2 text-primary-pink font-bold hover:gap-3 transition-all text-sm mb-8">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-10 text-amber-800 text-sm">
            <strong>Summary:</strong> We collect only what we need to run LovePage. We do not sell personal data. Card payments are handled by Stripe, AI suggestions are generated through our server endpoint, and your page content is stored to deliver your draft or published page.
          </div>

          <Section title="1. Who We Are">
            <p>
              LovePage ("LovePage", "we", "us", "our") provides an online service for creating, customizing,
              publishing, and sharing interactive digital letter pages.
            </p>
            <p>
              Questions about this Privacy Policy can be sent to{' '}
              <a href="mailto:privacy@lovepage.app" className="text-primary-pink hover:underline">privacy@lovepage.app</a>.
            </p>
          </Section>

          <Section title="2. Scope">
            <p>
              This Privacy Policy applies to our website, builder, preview and publish flow, account features, dashboard,
              and related support communications.
            </p>
          </Section>

          <Section title="3. Information We Collect">
            <h3 className="font-bold text-dark mt-4 mb-2">a) Account and identity data</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email address, user ID, and sign-in details through Firebase Authentication (email/password or Google sign-in).</li>
            </ul>

            <h3 className="font-bold text-dark mt-6 mb-2">b) Content and customization data</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Template choice, message text, recipient/sender names, settings, styling choices, and draft metadata.</li>
              <li>Media URLs or uploaded images you add to your page experience.</li>
            </ul>

            <h3 className="font-bold text-dark mt-6 mb-2">c) Payment and transaction data</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Stripe checkout session ID, payment status, timestamps, and related transaction metadata.</li>
              <li>We do not receive or store full card numbers, CVC, or complete payment instrument details.</li>
            </ul>

            <h3 className="font-bold text-dark mt-6 mb-2">d) Technical and usage data</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP address, browser/device information, request logs, and app interaction events used for product analytics and debugging.</li>
              <li>Local browser storage items used to keep draft references and product state.</li>
            </ul>

            <h3 className="font-bold text-dark mt-6 mb-2">e) AI suggestion data</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>When you use "AI Suggest", request fields (such as template context and text inputs) are sent through our backend endpoint to generate suggestions.</li>
            </ul>
          </Section>

          <Section title="4. How We Use Information">
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide core app functionality (drafting, previewing, publishing, sharing, and account access).</li>
              <li>Process and verify payments and prevent fraud/abuse.</li>
              <li>Host and deliver pages and media content.</li>
              <li>Generate AI writing suggestions when requested by you.</li>
              <li>Maintain app security, monitor reliability, and improve performance and UX.</li>
              <li>Comply with legal obligations and enforce our Terms.</li>
            </ul>
          </Section>

          <Section title="5. Legal Bases (EEA/UK, where applicable)">
            <p>Depending on your location, we process personal data under one or more of these legal bases:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Contract:</strong> to deliver the service you request.</li>
              <li><strong>Legitimate interests:</strong> for security, fraud prevention, analytics, and service improvement.</li>
              <li><strong>Consent:</strong> where legally required for specific processing.</li>
              <li><strong>Legal obligation:</strong> where we must retain or disclose data by law.</li>
            </ul>
          </Section>

          <Section title="6. Sharing and Service Providers">
            <p>We share data only with vendors needed to run the service, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google Firebase / Google Cloud:</strong> authentication, database, hosting, and backend functions.</li>
              <li><strong>Stripe:</strong> secure checkout and payment processing.</li>
              <li><strong>Cloudinary:</strong> hosting and delivery for uploaded media, where used.</li>
              <li><strong>OpenAI API:</strong> generation of optional AI message suggestions via our backend route.</li>
            </ul>
            <p>
              We may also disclose data when required by law, to protect legal rights, or during a merger, acquisition,
              financing, or similar business transfer.
            </p>
            <p>
              We do not sell personal information or share it for third-party advertising.
            </p>
          </Section>

          <Section title="7. Data Retention">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Pending drafts:</strong> pending drafts may be auto-deleted after expiration (currently 24 hours) by scheduled cleanup.</li>
              <li><strong>Published pages:</strong> retained to keep published links active unless deletion is requested or required.</li>
              <li><strong>Account and payment metadata:</strong> retained as needed for operations, fraud prevention, and legal/accounting obligations.</li>
              <li><strong>Local browser data:</strong> remains on your device until you clear browser storage.</li>
            </ul>
          </Section>

          <Section title="8. International Transfers">
            <p>
              Our providers may process data in countries other than your own, including the United States.
              By using LovePage, you understand that your data may be transferred and processed internationally.
            </p>
          </Section>

          <Section title="9. Your Privacy Rights">
            <p>Depending on applicable law, you may have rights to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access, correct, or delete personal data.</li>
              <li>Restrict or object to certain processing.</li>
              <li>Request portability of data you provided.</li>
              <li>Withdraw consent where processing depends on consent.</li>
              <li>Appeal or complain to your local data protection authority.</li>
            </ul>
            <p>
              Send requests to{' '}
              <a href="mailto:privacy@lovepage.app" className="text-primary-pink hover:underline">privacy@lovepage.app</a>.
            </p>
          </Section>

          <Section title="10. Cookies and Local Storage">
            <p>
              LovePage uses essential browser storage and similar technologies to preserve app state (for example,
              draft references and settings). You can clear these in your browser settings.
            </p>
          </Section>

          <Section title="11. Security">
            <p>
              We use reasonable technical and organizational measures designed to protect personal data, including secure
              transport encryption and provider-level access controls. No system is perfectly secure, and we cannot
              guarantee absolute security.
            </p>
          </Section>

          <Section title="12. Children's Privacy">
            <p>
              LovePage is not intended for children under 13, and we do not knowingly collect personal data from children
              under 13. If you believe such data was submitted, contact us and we will investigate and remove it where required.
            </p>
          </Section>

          <Section title="13. Changes to This Policy">
            <p>
              We may update this Privacy Policy periodically. We will post the revised version with a new "Last updated"
              date. Material changes may be communicated through in-app or website notice.
            </p>
          </Section>

          <Section title="14. Contact Us">
            <div className="bg-primary-light rounded-xl p-6 border border-card mt-4">
              <p>
                <strong>Privacy:</strong>{' '}
                <a href="mailto:privacy@lovepage.app" className="text-primary-pink hover:underline">privacy@lovepage.app</a>
              </p>
              <p className="mt-1">
                <strong>Support:</strong>{' '}
                <a href="mailto:support@lovepage.app" className="text-primary-pink hover:underline">support@lovepage.app</a>
              </p>
            </div>
          </Section>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
