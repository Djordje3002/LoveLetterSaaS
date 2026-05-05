import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { palettes, fonts, extractYouTubeId } from './palettes';

const MidnightLove = ({
  recipientName, senderName, scenes = {}, palette = 'navy',
  font = 'elegant', showSenderName = true, showFooter = true,
  musicEnabled = false, musicUrl = '',
}) => {
  const pal = palettes[palette] || palettes.navy;
  const fnt = fonts[font] || fonts.elegant;
  const videoId = extractYouTubeId(musicUrl);
  const [typedName, setTypedName] = useState('');
  const displayName = recipientName || 'My Love';

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedName(displayName.slice(0, i + 1));
      i++;
      if (i >= displayName.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, [displayName]);

  const letterParagraphs = (scenes.letterText || '').split('\n').filter(Boolean);

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: '#03071e', fontFamily: fnt.body }}>
      {musicEnabled && videoId && (
        <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0`}
          allow="autoplay" className="w-0 h-0 absolute opacity-0" title="bg music" />
      )}

      {/* Star field */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(80)].map((_, i) => (
          <div key={i} className="absolute rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              backgroundColor: 'white',
              opacity: Math.random() * 0.8 + 0.2,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }} />
        ))}
      </div>

      {/* Shooting star */}
      <ShootingStar interval={8000} />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-8 py-32 text-center">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-sm font-bold uppercase tracking-[0.3em] mb-8" style={{ color: pal.accent }}>
          ✦ A message for
        </motion.p>

        <h1 className="text-5xl md:text-7xl font-bold mb-16 min-h-[1.2em]"
          style={{ fontFamily: fnt.heading, color: pal.accent, textShadow: `0 0 40px ${pal.accent}80` }}>
          {typedName}<span className="animate-pulse">|</span>
        </h1>

        <div className="space-y-8 text-left">
          {letterParagraphs.length > 0 ? letterParagraphs.map((para, i) => (
            <motion.p key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + i * 0.4 }} className="text-lg text-white/80 leading-relaxed">
              {para}
            </motion.p>
          )) : (
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}
              className="text-lg text-white/40 leading-relaxed italic text-center">
              Your letter will appear here under a thousand stars...
            </motion.p>
          )}
        </div>

        {(scenes.closingMessage || (showSenderName && senderName)) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.5 + letterParagraphs.length * 0.4 }}
            className="mt-20 text-right">
            {scenes.closingMessage && (
              <p className="font-dancing text-3xl mb-2" style={{ color: pal.accent }}>{scenes.closingMessage}</p>
            )}
            {showSenderName && senderName && (
              <p className="font-dancing text-2xl text-white/60">— {senderName}</p>
            )}
          </motion.div>
        )}
      </div>

      {showFooter && (
        <div className="relative z-10 text-center pb-12">
          <p className="text-white/20 text-sm">made with LovePage ♥</p>
        </div>
      )}
    </div>
  );
};

const ShootingStar = ({ interval = 8000 }) => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: '20%', left: '10%' });

  useEffect(() => {
    const shoot = () => {
      setPos({ top: `${10 + Math.random() * 40}%`, left: `${Math.random() * 60}%` });
      setVisible(true);
      setTimeout(() => setVisible(false), 1000);
    };
    shoot();
    const t = setInterval(shoot, interval);
    return () => clearInterval(t);
  }, [interval]);

  if (!visible) return null;
  return (
    <div className="fixed pointer-events-none z-20 animate-shooting-star"
      style={{ top: pos.top, left: pos.left, width: '100px', height: '2px',
        background: 'linear-gradient(90deg, white, transparent)',
        transform: 'rotate(-30deg)', boxShadow: '0 0 6px white' }} />
  );
};

export default MidnightLove;
