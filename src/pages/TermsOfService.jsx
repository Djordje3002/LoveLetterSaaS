import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
import Layout from '../components/Layout';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-2xl font-bold text-dark mb-4 mt-2">{title}</h2>
    <div className="space-y-4 text-[#374151] leading-relaxed">{children}</div>
  </div>
);

const TermsOfService = () => {
  const lastUpdated = 'May 9, 2026';

  return (
    <Layout>
      <div className="bg-primary-light border-b border-card py-16 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-16 h-16 bg-white rounded-2xl shadow-soft flex items-center justify-center mx-auto mb-6 border border-card">
            <FileText className="text-primary-pink" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-3">Terms of Service</h1>
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
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-10 text-blue-800 text-sm">
            <strong>Summary:</strong> LovePage lets users create, preview, and publish digital letter pages. You can explore templates without paying, and publishing requires checkout. By using LovePage, you agree to these Terms and our <Link to="/privacy" className="text-primary-pink hover:underline">Privacy Policy</Link>.
          </div>

          <Section title="1. Acceptance of Terms">
            <p>
              These Terms of Service ("Terms") govern your access to and use of LovePage (the "Service").
              By using the Service, you agree to be bound by these Terms.
            </p>
            <p>
              If you do not agree, do not use the Service.
            </p>
          </Section>

          <Section title="2. Eligibility and Accounts">
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be at least 13 years old to use LovePage.</li>
              <li>If you are under the age of majority in your jurisdiction, use the Service only with guardian permission.</li>
              <li>You are responsible for activity on your account and for keeping your credentials secure.</li>
              <li>You must provide accurate account information and keep it reasonably up to date.</li>
            </ul>
          </Section>

          <Section title="3. Service Description">
            <p>LovePage provides tools to create interactive digital pages, including templates, previews, and publishing features.</p>
            <p>Features may include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Template selection and customization (text, settings, media, and styling).</li>
              <li>Draft creation and preview links.</li>
              <li>Publishing via checkout for a one-time fee.</li>
              <li>Shareable links and QR support for published pages.</li>
            </ul>
            <p>
              We may update, improve, or discontinue features at any time.
            </p>
          </Section>

          <Section title="4. Payments, Pricing, and Refunds">
            <h3 className="font-bold text-dark mt-4 mb-2">a) Pricing</h3>
            <p>
              Publishing requires payment. Current pricing and promotions are shown in the app at checkout time.
              Prices may change in the future, but you are charged based on the displayed price at purchase time.
            </p>

            <h3 className="font-bold text-dark mt-6 mb-2">b) Stripe checkout</h3>
            <p>
              Payments are processed by Stripe. By paying, you also agree to applicable Stripe terms and policies.
              We do not store full payment card information.
            </p>

            <h3 className="font-bold text-dark mt-6 mb-2">c) Discount codes</h3>
            <p>
              Discount codes may be offered at our discretion, can expire or be changed, and may be limited to specific
              users, pages, or periods. Abuse or manipulation of discounts may result in cancellation.
            </p>

            <h3 className="font-bold text-dark mt-6 mb-2">d) Refund policy</h3>
            <p>
              Because digital access is typically delivered immediately after successful payment, purchases are generally
              final. However, we may issue refunds in reasonable cases such as duplicate billing or clear technical failure.
              Contact support with payment proof to request review.
            </p>
          </Section>

          <Section title="5. User Content and License">
            <h3 className="font-bold text-dark mt-4 mb-2">a) Ownership</h3>
            <p>You retain ownership of content you submit (text, names, images, and similar materials).</p>

            <h3 className="font-bold text-dark mt-6 mb-2">b) License to operate the service</h3>
            <p>
              You grant us a non-exclusive, worldwide, royalty-free license to host, process, reproduce, display, and
              transmit your content solely to provide and improve the Service.
            </p>

            <h3 className="font-bold text-dark mt-6 mb-2">c) Your responsibility</h3>
            <p>
              You are responsible for ensuring you have rights and permissions for all submitted content, including
              third-party photos, names, music links, and other assets.
            </p>
          </Section>

          <Section title="6. Prohibited Use">
            <p>You may not use LovePage to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate laws, regulations, or third-party rights.</li>
              <li>Upload or distribute abusive, threatening, defamatory, hateful, or fraudulent content.</li>
              <li>Post sexual content involving minors or exploitative/illegal material.</li>
              <li>Distribute malware, attempt unauthorized access, or disrupt the Service.</li>
              <li>Automate abusive scraping, spam, or high-volume attacks against the platform.</li>
              <li>Impersonate others or misrepresent identity or authorization.</li>
            </ul>
          </Section>

          <Section title="7. AI Features">
            <p>
              Optional AI writing suggestions are provided for convenience and may be inaccurate, repetitive, or unsuitable.
              You are responsible for reviewing and editing AI-generated output before publishing.
            </p>
          </Section>

          <Section title="8. Takedowns, Suspension, and Termination">
            <p>
              We may remove content or suspend/terminate accounts that violate these Terms, create legal risk, or harm
              platform integrity.
            </p>
            <p>
              We may also suspend access for security incidents, fraud concerns, or required legal compliance.
            </p>
          </Section>

          <Section title="9. Intellectual Property">
            <p>
              The Service, including software, design system, branding, template framework, and site content (excluding
              user content), is protected by intellectual property laws and remains our property or our licensors' property.
            </p>
          </Section>

          <Section title="10. Third-Party Services">
            <p>
              LovePage relies on third-party services such as Firebase, Stripe, Cloudinary, YouTube links, and OpenAI API.
              We are not responsible for third-party outages, policies, or actions beyond our control.
            </p>
          </Section>

          <Section title="11. Disclaimer of Warranties">
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
              EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
              TITLE, AND NON-INFRINGEMENT.
            </p>
          </Section>

          <Section title="12. Limitation of Liability">
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, LOVEPAGE WILL NOT BE LIABLE FOR INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR LOSS OF
              PROFITS, DATA, USE, OR GOODWILL.
            </p>
            <p>
              OUR AGGREGATE LIABILITY FOR CLAIMS RELATING TO THE SERVICE WILL NOT EXCEED THE AMOUNT
              YOU PAID TO LOVEPAGE IN THE 12 MONTHS BEFORE THE EVENT GIVING RISE TO LIABILITY.
            </p>
          </Section>

          <Section title="13. Indemnification">
            <p>
              You agree to defend, indemnify, and hold harmless LovePage and its operators from claims, liabilities,
              damages, losses, and expenses (including reasonable legal fees) arising from your content, your use of the
              Service, or your violation of these Terms or applicable law.
            </p>
          </Section>

          <Section title="14. Governing Law and Disputes">
            <p>
              These Terms are governed by applicable law in the jurisdiction of the service operator, without regard to
              conflict-of-law principles. Before filing formal claims, both parties agree to attempt good-faith informal
              resolution by contacting support.
            </p>
          </Section>

          <Section title="15. Changes to Terms">
            <p>
              We may update these Terms from time to time. Updated Terms are effective when posted. Continued use after
              updates means you accept the revised Terms.
            </p>
          </Section>

          <Section title="16. Contact">
            <div className="bg-primary-light rounded-xl p-6 border border-card mt-4">
              <p>
                <strong>Support:</strong>{' '}
                <a href="mailto:support@lovepage.app" className="text-primary-pink hover:underline">support@lovepage.app</a>
              </p>
              <p className="mt-1">
                <strong>Legal:</strong>{' '}
                <a href="mailto:legal@lovepage.app" className="text-primary-pink hover:underline">legal@lovepage.app</a>
              </p>
            </div>
          </Section>
        </motion.div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
