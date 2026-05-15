import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Sparkles, Palette, Share2, Quote } from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import Layout from '../components/Layout';
import TemplateCard from '../components/TemplateCard';
import { getShowcaseTemplateCards } from '../templates/registry';
import useIsMobile from '../hooks/useIsMobile';

const StatCounter = ({ value, label, disableAnimation = false }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const hasDigits = /[0-9]/.test(value);
  const numericValue = hasDigits ? parseInt(value.replace(/[^0-9]/g, ''), 10) : 0;
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    if (!hasDigits) return;
    if (disableAnimation) {
      setCount(numericValue);
      return;
    }
    if (isInView) {
      let start = 0;
      const end = numericValue;
      const duration = 1500;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isInView, numericValue, hasDigits, disableAnimation]);

  return (
    <motion.div
      ref={ref}
      initial={disableAnimation ? false : { opacity: 0, scale: 0.9 }}
      animate={!disableAnimation && isInView ? { opacity: 1, scale: 1 } : undefined}
      className="text-center p-8 rounded-[24px] border border-[#f1dce5] bg-white/90 shadow-sm"
    >
      <div className="text-3xl md:text-4xl font-bold text-primary-pink mb-2">
        {hasDigits ? `${count}${suffix}` : value}
      </div>
      <div className="text-secondary text-sm font-medium">{label}</div>
    </motion.div>
  );
};

const LandingPage = () => {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = isMobile || prefersReducedMotion;
  const belowFoldPerfStyle = shouldReduceMotion
    ? { contentVisibility: 'auto', containIntrinsicSize: '1px 900px' }
    : undefined;

  const stats = [
    { value: '10+', label: 'Gift Templates' },
    { value: '100%', label: 'Customizable' },
    { value: '∞', label: 'Unlimited Sharing' },
    { value: '200+', label: 'Happy Customers' },
  ];

  const steps = [
    {
      id: 1,
      title: 'Choose a Template',
      desc: 'Browse our collection of beautifully designed templates for every occasion.',
      icon: <Palette className="text-primary-pink" size={24} />,
    },
    {
      id: 2,
      title: 'Personalize It',
      desc: 'Add your personal touch — change text, upload photos, and make it uniquely yours.',
      icon: <Sparkles className="text-primary-pink" size={24} />,
    },
    {
      id: 3,
      title: 'Share the Love',
      desc: 'Get a unique link and customizable QR code. Share it instantly and watch them smile.',
      icon: <Share2 className="text-primary-pink" size={24} />,
    },
  ];

  const templates = getShowcaseTemplateCards().slice(0, 3);

  const testimonials = [
    {
      text: "I made this for my girl as a surprise, and she couldn’t stop talking about it. She even sent the link to her best friend right away.",
      name: "Josh B.",
      occasion: "Anniversary Gift",
      initials: "JB"
    },
    {
      text: "I made it so fast and simple, and she loved it so much. She kept smiling while reading and told me it was her favorite surprise.",
      name: "Dylan S.",
      occasion: "Valentine's Gift",
      initials: "DS"
    },
    {
      text: "I put this together late at night for my girlfriend, and when she opened it she started smiling instantly. She said it was the sweetest thing I’ve ever made for her.",
      name: "Keith W.",
      occasion: "Anniversary Gift",
      initials: "KW"
    },
    {
      text: "I made this so fast and simple for my girl, and she loved it so much. She said it felt like our whole story in one page.",
      name: "Ethan M.",
      occasion: "Valentine Confession",
      initials: "EM"
    },
    {
      text: "I made one for my girl just to say I love you, and her reaction was everything. She keeps reopening it and telling me how special it feels.",
      name: "Mia C.",
      occasion: "Love Surprise",
      initials: "MC"
    },
    {
      text: "I thought it would take hours, but I finished it quickly and it still felt super personal. She said it looked like something made just for us.",
      name: "Noah R.",
      occasion: "Relationship Milestone",
      initials: "NR"
    },
    {
      text: "I made this at midnight, hit publish, and sent it right away. She replied in seconds saying she loved every part of it.",
      name: "Ava K.",
      occasion: "Late-night Love Note",
      initials: "AK"
    },
    {
      text: "I wanted something simple but meaningful, and this nailed it. She keeps opening the page again and showing it to her friends.",
      name: "Liam H.",
      occasion: "Valentine's Gift",
      initials: "LH"
    }
  ];
  const slidingTestimonials = [...testimonials, ...testimonials];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="hidden md:block absolute left-[-120px] top-24 h-72 w-72 rounded-full bg-[#ff6fa3]/20 blur-3xl" />
          <div className="hidden md:block absolute right-[-140px] top-44 h-80 w-80 rounded-full bg-[#ffd67b]/18 blur-3xl" />
          <div className="hidden md:block absolute bottom-14 left-1/2 h-52 w-[80%] -translate-x-1/2 rounded-full bg-[#f43f73]/10 blur-3xl" />
          <div className="md:hidden absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_15%_12%,rgba(255,111,163,0.22),transparent_42%),radial-gradient(circle_at_82%_18%,rgba(255,214,123,0.2),transparent_44%),radial-gradient(circle_at_50%_86%,rgba(244,63,115,0.12),transparent_52%)]" />
        </div>
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f3bfd1] bg-white/70 px-4 py-1.5 text-sm font-semibold text-primary-pink shadow-sm backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-primary-pink animate-pulse"></span>
          Design your own love experience
        </motion.div>

        <motion.h1
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? undefined : { delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-[0.95] text-dark font-display break-words"
        >
          Turn Your Feelings
          <br />
          <span className="text-primary-pink">Into a Private Love Experience.</span>
        </motion.h1>

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? undefined : { delay: 0.2 }}
          className="text-secondary text-lg md:text-xl max-w-2xl mb-10"
        >
          Build a personalized reveal page with your words, memories, and vibe.
          Publish once, share forever with a link and QR code.
        </motion.p>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? undefined : { delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {['Super easy', 'Unique URL + QR', 'Romantic templates', 'Fast setup'].map((badge) => (
            <div key={badge} className="flex items-center gap-1.5 rounded-full border border-[#f0d5df] bg-white/95 px-4 py-2 text-sm font-medium shadow-sm">
              <CheckCircle2 size={16} className="text-primary-pink" />
              {badge}
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? undefined : { delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to="/templates" className="btn-primary btn-shimmer flex items-center gap-2 px-10 text-lg">
            <span className={`inline-block ${shouldReduceMotion ? '' : 'animate-spin [animation-duration:2.2s]'}`} aria-hidden="true">✦</span> Create yours →
          </Link>
          <Link to="/templates" className="btn-outline bg-white/90 px-10 text-lg shadow-sm">
            See templates
          </Link>
        </motion.div>
      </section>

      {/* Stats Row */}
      <section className="max-w-7xl mx-auto px-6 mb-24" style={belowFoldPerfStyle}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCounter key={stat.label} value={stat.value} label={stat.label} disableAnimation={shouldReduceMotion} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 mb-32" style={belowFoldPerfStyle}>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It <span className="text-transparent bg-clip-text bg-pink-gradient italic">Works</span>
          </h2>
          <div className="w-24 h-1.5 bg-pink-gradient mx-auto rounded-full mb-6"></div>
          <p className="text-secondary text-lg">Create your personalized love page in just three simple steps</p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 rounded-[36px] border border-[#f2dde6] bg-white/75 p-6 md:p-8 shadow-[0_20px_50px_rgba(244,63,115,0.08)]">
          {/* Dotted Line Background */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 border-t-2 border-dotted border-primary-pink opacity-20 -z-10"></div>
          
          {steps.map((step) => (
            <div key={step.id} className="relative rounded-[24px] border border-[#f4d9e4] bg-[#fff9fc] p-6 pt-12 shadow-sm">
              <div className="absolute top-0 left-6 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-[#f43f73] to-[#f973a5] text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-primary-pink/30">
                {step.id}
              </div>
              <div className="absolute top-6 right-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-secondary text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Templates Preview */}
      <section className="max-w-7xl mx-auto px-6 mb-32" style={belowFoldPerfStyle}>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-pink-gradient italic">Beautiful</span> Templates
          </h2>
          <div className="w-24 h-1.5 bg-pink-gradient mx-auto rounded-full mb-6"></div>
          <p className="text-secondary text-lg">Each template is a unique interactive experience — perfect for any occasion</p>
        </div>

        <div className="rounded-[36px] border border-[#f2dde6] bg-white/70 p-6 md:p-8 shadow-[0_20px_50px_rgba(244,63,115,0.08)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {templates.map((template, i) => (
            <TemplateCard key={template.id} template={template} index={i} />
          ))}
          </div>

          <div className="text-center">
            <Link to="/templates" className="btn-outline inline-block bg-white">
              See all templates →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-b from-primary-light/20 to-white py-24 mb-32 border-y border-[#f3e1e8]" style={belowFoldPerfStyle}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Loved by <span className="text-transparent bg-clip-text bg-pink-gradient italic">Many</span>
            </h2>
            <p className="text-secondary text-lg">See what people are saying about their experience</p>
          </div>

          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-primary-light/30 to-transparent"></div>
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-primary-light/30 to-transparent"></div>

            {shouldReduceMotion ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {testimonials.slice(0, 4).map((t, i) => (
                  <div key={`${t.initials}-${i}`} className="relative rounded-[24px] border border-[#f0dbe4] bg-white p-6 shadow-sm">
                    <Quote size={40} className="text-primary-pink opacity-10 absolute top-4 left-4" />
                    <p className="text-dark italic mb-8 relative z-10 leading-relaxed">"{t.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-pink text-white flex items-center justify-center font-bold text-sm">
                        {t.initials}
                      </div>
                      <div>
                        <p className="font-bold text-dark text-sm">{t.name}</p>
                        <p className="text-secondary text-xs">{t.occasion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                className="flex w-max gap-6"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
              >
                {slidingTestimonials.map((t, i) => (
                  <div key={`${t.initials}-${i}`} className="relative w-[300px] shrink-0 rounded-[24px] border border-[#f0dbe4] bg-white p-6 shadow-sm md:w-[360px]">
                    <Quote size={40} className="text-primary-pink opacity-10 absolute top-4 left-4" />
                    <p className="text-dark italic mb-8 relative z-10 leading-relaxed">"{t.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-pink text-white flex items-center justify-center font-bold text-sm">
                        {t.initials}
                      </div>
                      <div>
                        <p className="font-bold text-dark text-sm">{t.name}</p>
                        <p className="text-secondary text-xs">{t.occasion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 mb-32" style={belowFoldPerfStyle}>
        <motion.div 
          whileInView={shouldReduceMotion ? undefined : { scale: [0.95, 1], opacity: [0, 1] }}
          className="rounded-[36px] border border-[#f6b7cb] bg-gradient-to-br from-[#ff5f8f] via-[#f43f73] to-[#d63366] p-12 md:p-20 text-center relative overflow-hidden shadow-[0_30px_80px_rgba(244,63,115,0.35)]"
        >
          {/* Decorative shapes */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 text-6xl">❤️</div>
            <div className="absolute bottom-10 right-10 text-6xl">✨</div>
            <div className="absolute top-1/2 left-1/4 text-4xl">🌸</div>
          </div>

          <div className="text-5xl mb-6">💝</div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Create Something Unforgettable?
          </h2>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Join hundreds of people who have made their loved ones smile.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/templates" className="bg-white text-primary-pink px-10 py-4 rounded-pill font-bold text-lg shadow-xl hover:scale-105 transition-transform inline-block btn-shimmer">
              <span className={`inline-block ${shouldReduceMotion ? '' : 'animate-spin [animation-duration:2.2s]'}`} aria-hidden="true">✦</span> Create yours now →
            </Link>
            <Link to="/dashboard" className="border-2 border-white/70 text-white px-10 py-4 rounded-pill font-bold text-lg bg-white/10 backdrop-blur hover:bg-white/20 transition-colors inline-block">
              My Dashboard
            </Link>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default LandingPage;
