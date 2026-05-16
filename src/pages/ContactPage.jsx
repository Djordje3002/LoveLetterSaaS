import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

const SUPPORT_EMAIL = 'support@lovepage.app';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const mailtoLink = useMemo(() => {
    const subject = encodeURIComponent('Custom LovePage request');
    const body = encodeURIComponent(
      [
        `Name: ${name || ''}`,
        `Email: ${email || ''}`,
        '',
        message || 'Hi, I want a fully custom page or website.',
      ].join('\n')
    );

    return `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  }, [email, message, name]);

  return (
    <Layout>
      <main className="min-h-screen bg-primary-light px-5 py-10 md:px-6 md:py-16">
        <div className="mx-auto max-w-2xl">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-primary-pink transition-all hover:gap-3"
          >
            <ArrowLeft size={16} /> Back to home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[28px] border border-card bg-white p-6 shadow-soft md:p-10"
          >
            <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-pink/10 text-primary-pink">
              <Mail size={28} />
            </div>

            <h1 className="mb-3 text-3xl font-bold text-dark md:text-5xl">Send me an email</h1>
            <p className="mb-8 text-base leading-relaxed text-secondary md:text-lg">
              Tell me what kind of custom page, website, or gift experience you want. I will reply as soon as I can.
            </p>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-secondary">Your name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-2xl border border-card bg-white px-4 py-4 text-dark outline-none transition-colors focus:border-primary-pink"
                  placeholder="Your name"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-secondary">Your email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-card bg-white px-4 py-4 text-dark outline-none transition-colors focus:border-primary-pink"
                  placeholder="you@example.com"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-secondary">Message</span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={6}
                  className="w-full resize-none rounded-2xl border border-card bg-white px-4 py-4 text-dark outline-none transition-colors focus:border-primary-pink"
                  placeholder="I want a custom page for..."
                />
              </label>
            </div>

            <a
              href={mailtoLink}
              className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-full bg-primary-pink px-6 py-4 text-base font-bold text-white shadow-lg transition-transform hover:scale-[1.01] md:w-auto"
            >
              <Send size={19} /> Open email
            </a>

            <p className="mt-5 text-sm text-secondary">
              Email opens in your default mail app: <span className="font-bold text-dark">{SUPPORT_EMAIL}</span>
            </p>
          </motion.div>
        </div>
      </main>
    </Layout>
  );
};

export default ContactPage;
