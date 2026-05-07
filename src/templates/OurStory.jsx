import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { differenceInDays, parseISO } from 'date-fns';
import { palettes, fonts, extractYouTubeId } from './palettes';

const OurStory = ({
  recipientName, senderName, scenes = {}, palette = 'pink',
  font = 'classic', showSenderName = true, showFooter = true,
  musicEnabled = false, musicUrl = '',
}) => {
  const pal = palettes[palette] || palettes.pink;
  const fnt = fonts[font] || fonts.classic;
  const videoId = extractYouTubeId(musicUrl);
  const [bookOpen, setBookOpen] = useState(false);
  const chapterCards = useMemo(() => ([
    { title: scenes.chapter1Title || 'How We Met', text: scenes.chapter1Text || '' },
    { title: scenes.chapter2Title || 'Our First Date', text: scenes.chapter2Text || '' },
    { title: scenes.chapter3Title || 'The Moment I Knew', text: scenes.chapter3Text || '' },
  ].filter(c => c.text)), [scenes.chapter1Text, scenes.chapter1Title, scenes.chapter2Text, scenes.chapter2Title, scenes.chapter3Text, scenes.chapter3Title]);

  useEffect(() => {
    const t = setTimeout(() => setBookOpen(true), 800);
    return () => clearTimeout(t);
  }, []);

  const daysTogether = (() => {
    try {
      const d = scenes.startDate;
      if (!d) return null;
      const parsed = new Date(d);
      if (isNaN(parsed)) return null;
      return differenceInDays(new Date(), parsed);
    } catch { return null; }
  })();

  return (
    <div className="min-h-screen overflow-x-hidden relative" style={{ backgroundColor: pal.bg, fontFamily: fnt.body }}>
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage: `radial-gradient(circle at 18% 16%, ${pal.primary}18, transparent 40%), radial-gradient(circle at 82% 20%, ${pal.accent}20, transparent 42%), radial-gradient(circle at 52% 86%, ${pal.primary}14, transparent 44%)`,
          backgroundSize: '180% 180%',
        }}
      />
      {musicEnabled && videoId && (
        <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0`}
          allow="autoplay" className="w-0 h-0 absolute opacity-0" title="bg music" />
      )}

      {/* Book cover animation */}
      <div className="flex justify-center items-center min-h-screen pt-16 pb-32 px-6">
        <motion.div initial={{ rotateY: 0, scale: 0.9, opacity: 0 }}
          animate={bookOpen ? { rotateY: 0, scale: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, type: 'spring' }}
          className="w-full max-w-2xl">

          {/* Header / Cover */}
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="text-center mb-16">
            <div className="w-20 h-1 mx-auto mb-8 rounded-full" style={{ backgroundColor: pal.primary }} />
            <p className="text-sm font-bold uppercase tracking-[0.3em] mb-3" style={{ color: pal.primary }}>
              Our Story
            </p>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
              style={{ fontFamily: fnt.heading, color: pal.text }}>
              {recipientName ? `Me & ${recipientName}` : 'Our Love Story'}
            </h1>
            <motion.div
              className="mx-auto mb-4 h-1 rounded-full"
              style={{ backgroundColor: pal.accent, width: '140px' }}
              animate={{ width: ['90px', '170px', '90px'], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            {daysTogether !== null && (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-lg shadow-lg"
                style={{ backgroundColor: pal.primary }}>
                ♥ {daysTogether.toLocaleString()} days together
              </div>
            )}
            {scenes.startDate && (
              <p className="text-secondary mt-3 text-sm">Since {scenes.startDate}</p>
            )}
          </motion.div>

          {/* Chapters */}
          <div className="space-y-16">
            {chapterCards.map((ch, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.3 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ backgroundColor: pal.primary }} />
                <motion.div
                  className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-30"
                  style={{ backgroundColor: pal.primary }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                />
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: pal.primary }}>
                  Chapter {i + 1}
                </p>
                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: fnt.heading, color: pal.text }}>
                  {ch.title}
                </h2>
                <p className="text-secondary leading-relaxed">{ch.text}</p>
              </motion.div>
            ))}

            {scenes.closingMessage && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + chapterCards.length * 0.3 }} className="text-center py-8">
                <p className="font-dancing text-3xl" style={{ color: pal.primary }}>{scenes.closingMessage}</p>
                {showSenderName && senderName && (
                  <p className="font-dancing text-2xl text-secondary mt-2">— {senderName}</p>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {showFooter && (
        <div className="text-center pb-8">
          <p className="text-secondary text-sm">made with LovePage ♥</p>
        </div>
      )}
    </div>
  );
};

export default OurStory;
