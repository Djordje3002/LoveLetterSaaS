import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { palettes, fonts, extractYouTubeId } from './palettes';

const DarkRomance = ({
  recipientName, senderName, scenes = {}, palette = 'pink',
  font = 'elegant', showSenderName = true, showFooter = true,
  musicEnabled = false, musicUrl = '',
}) => {
  const pal = palettes[palette] || palettes.pink;
  const fnt = fonts[font] || fonts.elegant;
  const videoId = extractYouTubeId(musicUrl);
  const letterParagraphs = (scenes.letterText || '').split('\n').filter(Boolean);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white overflow-x-hidden" style={{ fontFamily: fnt.body }}>
      {musicEnabled && videoId && (
        <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0`}
          allow="autoplay" className="w-0 h-0 absolute opacity-0" title="bg music" />
      )}

      {/* Ember particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute bottom-0 animate-ember rounded-full opacity-70"
            style={{
              left: `${(i * 8.3) % 100}%`,
              width: `${4 + (i % 3) * 2}px`,
              height: `${4 + (i % 3) * 2}px`,
              backgroundColor: i % 2 === 0 ? '#F59E0B' : pal.primary,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${4 + (i % 3)}s`,
            }} />
        ))}
      </div>

      {/* Hero */}
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-8 py-24 relative">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <p className="text-sm font-bold uppercase tracking-[0.3em] mb-6" style={{ color: pal.primary }}>
            ♥ For {recipientName || 'You'}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight"
            style={{ fontFamily: fnt.heading, textShadow: `0 0 40px ${pal.primary}60` }}>
            Dark Romance
          </h1>
          <div className="w-32 h-px mx-auto" style={{ backgroundColor: pal.primary + '60' }} />
        </motion.div>
      </div>

      {/* Letter lines */}
      <div className="max-w-2xl mx-auto px-8 pb-32 space-y-8">
        {letterParagraphs.length > 0 ? letterParagraphs.map((para, i) => (
          <RevealLine key={i} text={para} delay={i * 0.1} accentColor={pal.primary} font={fnt.body} />
        )) : (
          <RevealLine text="Your letter text will appear here..." delay={0} accentColor={pal.primary} font={fnt.body} />
        )}

        {(scenes.closingMessage || (showSenderName && senderName)) && (
          <RevealLine
            text={(scenes.closingMessage || '') + (showSenderName && senderName ? `  — ${senderName}` : '')}
            delay={letterParagraphs.length * 0.1}
            accentColor={pal.primary}
            font="Dancing Script, cursive"
            isClosing
          />
        )}
      </div>

      {showFooter && (
        <div className="text-center pb-12">
          <p className="text-white/30 text-sm">made with LovePage ♥</p>
        </div>
      )}
    </div>
  );
};

const RevealLine = ({ text, delay, accentColor, font, isClosing }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.p ref={ref} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay }}
      className={`leading-relaxed ${isClosing ? 'text-2xl text-right' : 'text-lg md:text-xl text-white/80'}`}
      style={{ fontFamily: isClosing ? 'Dancing Script, cursive' : font, color: isClosing ? accentColor : undefined }}>
      {text}
    </motion.p>
  );
};

export default DarkRomance;
