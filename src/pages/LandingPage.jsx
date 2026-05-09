import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Sparkles, Palette, Share2, Quote } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import Layout from '../components/Layout';
import TemplateCard from '../components/TemplateCard';
import { getTemplateCards } from '../templates/registry';

const StatCounter = ({ value, label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const hasDigits = /[0-9]/.test(value);
  const numericValue = hasDigits ? parseInt(value.replace(/[^0-9]/g, ''), 10) : 0;
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    if (!hasDigits) return;
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
  }, [isInView, numericValue, hasDigits]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      className="card-white text-center p-8"
    >
      <div className="text-3xl md:text-4xl font-bold text-primary-pink mb-2">
        {hasDigits ? `${count}${suffix}` : value}
      </div>
      <div className="text-secondary text-sm font-medium">{label}</div>
    </motion.div>
  );
};

const LandingPage = () => {
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

  const templates = getTemplateCards();

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
      text: "I created this for my girlfriend’s birthday, and she got emotional in the best way. She said it felt like our whole story in one page.",
      name: "Ethan M.",
      occasion: "Valentine Confession",
      initials: "EM"
    },
    {
      text: "I made one for my girl just to say I love you, and her reaction was everything. She keeps reopening it and telling me how special it feels.",
      name: "Mia C.",
      occasion: "Birthday Surprise",
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-pill border border-primary-pink text-primary-pink text-sm font-medium bg-primary-light/50"
        >
          <span className="w-2 h-2 rounded-full bg-primary-pink animate-pulse"></span>
          Create beautiful love pages ✨
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold mb-6 leading-[0.95] text-dark"
        >
          Make Your <span className="text-primary-pink">Love</span> Truly <span className="text-primary-pink">Unforgettable</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-secondary text-lg md:text-xl max-w-2xl mb-10"
        >
          Create a personalized interactive page your partner will never forget.
          Share it with a link or QR code.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {['Super simple.', 'Mobile friendly', 'Link & QR code', 'Up to 100 reasons'].map((badge) => (
            <div key={badge} className="flex items-center gap-1.5 bg-white border border-card px-4 py-2 rounded-pill text-sm font-medium shadow-sm">
              <CheckCircle2 size={16} className="text-primary-pink" />
              {badge}
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to="/templates" className="btn-primary btn-shimmer flex items-center gap-2 px-10 text-lg">
            ✦ Create yours →
          </Link>
          <Link to="/templates" className="btn-outline px-10 text-lg">
            See templates
          </Link>
        </motion.div>
      </section>

      {/* Stats Row */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCounter key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It <span className="text-transparent bg-clip-text bg-pink-gradient italic">Works</span>
          </h2>
          <div className="w-24 h-1.5 bg-pink-gradient mx-auto rounded-full mb-6"></div>
          <p className="text-secondary text-lg">Create your personalized love page in just three simple steps</p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Dotted Line Background */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 border-t-2 border-dotted border-primary-pink opacity-20 -z-10"></div>
          
          {steps.map((step) => (
            <div key={step.id} className="card-white relative pt-12">
              <div className="absolute top-0 left-6 -translate-y-1/2 w-12 h-12 bg-primary-pink text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-primary-pink/30">
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
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-pink-gradient italic">Beautiful</span> Templates
          </h2>
          <div className="w-24 h-1.5 bg-pink-gradient mx-auto rounded-full mb-6"></div>
          <p className="text-secondary text-lg">Each template is a unique interactive experience — perfect for any occasion</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {templates.slice(0, 3).map((template, i) => (
            <TemplateCard key={template.id} template={template} index={i} />
          ))}
        </div>

        <div className="text-center">
          <Link to="/templates" className="btn-outline inline-block">
            See all templates →
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-primary-light/30 py-24 mb-32">
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

            <motion.div
              className="flex w-max gap-6"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            >
              {slidingTestimonials.map((t, i) => (
                <div key={`${t.initials}-${i}`} className="card-white relative w-[300px] shrink-0 bg-white md:w-[360px]">
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
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <motion.div 
          whileInView={{ scale: [0.95, 1], opacity: [0, 1] }}
          className="bg-pink-gradient rounded-[24px] p-12 md:p-20 text-center relative overflow-hidden"
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
              ✦ Create yours now →
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
