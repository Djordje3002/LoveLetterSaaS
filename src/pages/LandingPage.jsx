import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Sparkles, Palette, Share2, Star, Quote } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import Layout from '../components/Layout';
import TemplateCard from '../components/TemplateCard';

const StatCounter = ({ value, label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
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
  }, [isInView, numericValue]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      className="card-white text-center p-8"
    >
      <div className="text-3xl md:text-4xl font-bold text-primary-pink mb-2">
        {count}{suffix}
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
    { value: '500+', label: 'Happy Customers' },
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

  const templates = [
    { id: 'kawaii-letter', name: 'Kawaii Letter', tags: ['Love', 'Letter'] },
    { id: '100-reasons', name: '100 Reasons', tags: ['Reasons', 'Love'] },
    { id: 'our-gallery', name: 'Our Gallery', tags: ['Gallery', 'Memories'] },
    { id: 'dark-romance', name: 'Dark Romance', tags: ['Elegant', 'Letter'] },
    { id: 'our-story', name: 'Our Story', tags: ['Story', 'Timeline'] },
    { id: 'midnight-love', name: 'Midnight Love', tags: ['Night', 'Elegant'] },
  ];

  const testimonials = [
    {
      text: "I made this for my girlfriend's birthday and she literally cried happy tears. The page was so beautiful and easy to make!",
      name: "Josh B.",
      occasion: "Anniversary Gift",
      initials: "JB"
    },
    {
      text: "Sent this to my wife on Valentine's Day. She said it was the most thoughtful gift she's ever received.",
      name: "Dylan S.",
      occasion: "Valentine's Gift",
      initials: "DS"
    },
    {
      text: "Used it for my parents' anniversary and the whole family was amazed. Will definitely use it again!",
      name: "Keith W.",
      occasion: "Anniversary Gift",
      initials: "KW"
    }
  ];

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
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          Give Love a <br />
          <span className="text-transparent bg-clip-text bg-pink-gradient">Beautiful Home</span>
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
          {['No design skills', 'Mobile friendly', 'Link & QR code', 'Up to 100 reasons'].map((badge) => (
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="card-white relative bg-white">
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
          <Link to="/templates" className="bg-white text-primary-pink px-10 py-4 rounded-pill font-bold text-lg shadow-xl hover:scale-105 transition-transform inline-block btn-shimmer">
            ✦ Create yours now →
          </Link>
        </motion.div>
      </section>
    </Layout>
  );
};

export default LandingPage;
