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
  const lastUpdated = 'May 5, 2025';

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-primary-light border-b border-card py-16 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-16 h-16 bg-white rounded-2xl shadow-soft flex items-center justify-center mx-auto mb-6 border border-card">
            <FileText className="text-primary-pink" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-3">Terms of Service</h1>
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

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-10 text-blue-800 text-sm">
            <strong>Summary:</strong> LovePage lets you create beautiful, personalized love pages. Pay once, share forever. By using this service you agree to these terms. Please read them — they're written plainly.
          </div>

          <Section title="1. Acceptance of Terms">
            <p>By accessing or using LovePage (the "Service") at any URL on which it is hosted, you agree to be bound by these Terms of Service ("Terms") and our <Link to="/privacy" className="text-primary-pink hover:underline">Privacy Policy</Link>. If you do not agree, do not use the Service.</p>
            <p>We may revise these Terms at any time. Continued use of the Service after any change constitutes your acceptance of the new Terms. The "Last Updated" date at the top of this page reflects the most recent revision.</p>
          </Section>

          <Section title="2. Description of Service">
            <p>LovePage is a web-based tool that allows users to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create personalized digital love letter pages using pre-designed templates.</li>
              <li>Customize page content (text, names, photos, music links).</li>
              <li>Publish a finished page for a one-time payment of $12 USD.</li>
              <li>Share the published page via a unique URL and QR code.</li>
            </ul>
            <p>Pages are hosted for an indefinite period following payment. We do not guarantee any specific uptime or duration beyond commercially reasonable availability.</p>
          </Section>

          <Section title="3. Eligibility">
            <p>You must be at least 13 years of age to use LovePage. By using the Service, you represent and warrant that you meet this requirement. If you are between 13 and 18 years of age, you must have your parent or legal guardian's permission to use the Service and make purchases.</p>
          </Section>

          <Section title="4. User Content">
            <h3 className="font-bold text-dark mt-4 mb-2">a) Your Content, Your Responsibility</h3>
            <p>You are solely responsible for all text, images, names, messages, and any other content ("User Content") you submit to LovePage. By submitting User Content, you represent and warrant that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You own or have the necessary rights to use and share the content.</li>
              <li>Your content does not infringe any third party's copyright, trademark, privacy, or other rights.</li>
              <li>Your content does not violate any applicable law or regulation.</li>
            </ul>

            <h3 className="font-bold text-dark mt-6 mb-2">b) Prohibited Content</h3>
            <p>You may not use LovePage to create, store, or distribute content that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Is unlawful, harmful, threatening, harassing, defamatory, or hateful.</li>
              <li>Contains nudity, sexually explicit material, or exploits minors in any way.</li>
              <li>Promotes violence, terrorism, or self-harm.</li>
              <li>Violates the privacy or personal rights of any person.</li>
              <li>Constitutes unsolicited commercial messages (spam).</li>
              <li>Impersonates any person or entity, or misrepresents your affiliation with any person.</li>
              <li>Contains viruses, malware, or any other harmful code.</li>
            </ul>
            <p>We reserve the right to remove any content that violates these prohibitions at our sole discretion, without prior notice, and without liability to you.</p>

            <h3 className="font-bold text-dark mt-6 mb-2">c) License to Us</h3>
            <p>By submitting User Content, you grant LovePage a non-exclusive, worldwide, royalty-free license to store, display, and serve your content solely for the purpose of operating and providing the Service (i.e., displaying your love page to the recipient you choose to share it with). We do not use your content for marketing or any other purpose without your explicit consent.</p>
          </Section>

          <Section title="5. Payment & Refund Policy">
            <h3 className="font-bold text-dark mt-4 mb-2">a) Pricing</h3>
            <p>Publishing a love page costs a one-time fee of <strong>$12.00 USD</strong>. This fee grants you a lifetime-hosted, shareable page with a unique URL and QR code. All prices are displayed in USD and are inclusive of any applicable fees charged by our payment processor.</p>

            <h3 className="font-bold text-dark mt-6 mb-2">b) Payment Processing</h3>
            <p>Payments are processed securely by <strong>Stripe, Inc.</strong> You will be redirected to Stripe's hosted checkout page to complete your purchase. LovePage does not store your payment card information. By completing a purchase, you agree to Stripe's <a href="https://stripe.com/legal/consumer" target="_blank" rel="noopener noreferrer" className="text-primary-pink hover:underline">Terms of Service</a>.</p>

            <h3 className="font-bold text-dark mt-6 mb-2">c) Refund Policy</h3>
            <p>Because LovePage is a digital service that is immediately delivered upon payment (your page is activated the moment payment is confirmed), <strong>all sales are final and non-refundable</strong> as a general rule.</p>
            <p>However, we do offer refunds in the following cases:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You were charged but your page was not activated due to a technical error on our part.</li>
              <li>You were charged more than once for the same page.</li>
            </ul>
            <p>To request a refund in these cases, contact us at <a href="mailto:support@lovepage.app" className="text-primary-pink hover:underline">support@lovepage.app</a> within 7 days of purchase with your Stripe receipt. We will review and respond within 5 business days.</p>
          </Section>

          <Section title="6. Intellectual Property">
            <h3 className="font-bold text-dark mt-4 mb-2">a) Our Property</h3>
            <p>The LovePage Service, including its design, templates, code, branding, and all content created by us, is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, sell, or create derivative works of any part of our Service without our express written permission.</p>

            <h3 className="font-bold text-dark mt-6 mb-2">b) Your Property</h3>
            <p>You retain all ownership rights to the User Content you create. Our license to your content (described in Section 4c) does not transfer ownership to us.</p>
          </Section>

          <Section title="7. Acceptable Use">
            <p>In addition to the content restrictions in Section 4, you agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service for any unlawful purpose or in violation of these Terms.</li>
              <li>Attempt to reverse-engineer, decompile, or disassemble any portion of the Service.</li>
              <li>Use automated tools (bots, scrapers, crawlers) to access or collect data from the Service without our written permission.</li>
              <li>Interfere with or disrupt the integrity or performance of the Service or its underlying infrastructure.</li>
              <li>Attempt to gain unauthorized access to any part of the Service or its related systems.</li>
              <li>Use the Service to create pages that harass, intimidate, or harm any individual.</li>
            </ul>
          </Section>

          <Section title="8. Termination & Takedowns">
            <p>We reserve the right to suspend or terminate your access to the Service, or remove any page, at our sole discretion and without prior notice if we believe you have violated these Terms, any applicable law, or for any other reason we deem necessary to protect the Service or its users.</p>
            <p>If your page is removed for a Terms violation, you will not be entitled to a refund.</p>
            <p>You may request deletion of your page at any time by contacting <a href="mailto:support@lovepage.app" className="text-primary-pink hover:underline">support@lovepage.app</a>.</p>
          </Section>

          <Section title="9. Disclaimers">
            <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
            <p>We do not warrant that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The Service will be uninterrupted, error-free, or secure.</li>
              <li>Any errors or defects will be corrected.</li>
              <li>The Service or the servers that make it available are free of viruses or other harmful components.</li>
            </ul>
          </Section>

          <Section title="10. Limitation of Liability">
            <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, LOVEPAGE AND ITS OPERATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATED TO YOUR USE OF (OR INABILITY TO USE) THE SERVICE.</p>
            <p>IN ANY CASE, OUR TOTAL AGGREGATE LIABILITY TO YOU FOR ANY CLAIM ARISING FROM OR RELATED TO THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM (OR $12.00 IF YOU HAVE NOT MADE ANY PAYMENT).</p>
          </Section>

          <Section title="11. Indemnification">
            <p>You agree to indemnify, defend, and hold harmless LovePage and its affiliates, officers, agents, and employees from and against any and all claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising from or related to: (a) your use of the Service; (b) your User Content; or (c) your violation of these Terms or any applicable law.</p>
          </Section>

          <Section title="12. Third-Party Services & Links">
            <p>The Service may include links to third-party websites or services (e.g., YouTube for background music, Stripe for payments). These are not under our control. We are not responsible for the content, privacy practices, or terms of any third-party services. Your use of third-party services is at your own risk and subject to their own terms.</p>
          </Section>

          <Section title="13. Governing Law & Disputes">
            <p>These Terms are governed by and construed in accordance with applicable law. Any dispute arising from these Terms or your use of the Service shall first be attempted to be resolved informally by contacting us at <a href="mailto:support@lovepage.app" className="text-primary-pink hover:underline">support@lovepage.app</a>. If an informal resolution cannot be reached within 30 days, disputes shall be resolved through binding arbitration or in a court of competent jurisdiction.</p>
          </Section>

          <Section title="14. Changes to the Service">
            <p>We reserve the right to modify, suspend, or discontinue the Service (or any part of it) at any time, with or without notice. We will not be liable to you or any third party for any modification, suspension, or discontinuation of the Service. If we discontinue the Service entirely, we will attempt to provide at least 30 days' notice.</p>
          </Section>

          <Section title="15. Entire Agreement">
            <p>These Terms, together with our <Link to="/privacy" className="text-primary-pink hover:underline">Privacy Policy</Link>, constitute the entire agreement between you and LovePage regarding the Service and supersede all prior agreements and understandings.</p>
          </Section>

          <Section title="16. Contact">
            <p>If you have any questions about these Terms, please contact us:</p>
            <div className="bg-primary-light rounded-xl p-6 border border-card mt-4">
              <p><strong>Email:</strong> <a href="mailto:support@lovepage.app" className="text-primary-pink hover:underline">support@lovepage.app</a></p>
              <p className="mt-1"><strong>Legal:</strong> <a href="mailto:legal@lovepage.app" className="text-primary-pink hover:underline">legal@lovepage.app</a></p>
            </div>
          </Section>

        </motion.div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
