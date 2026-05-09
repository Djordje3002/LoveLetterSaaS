import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle } from 'lucide-react';
import { palettes, fonts, extractYouTubeId } from './palettes';
import confetti from 'canvas-confetti';

const DEFAULT_REASONS = Array.from({ length: 100 }, (_, i) => `Reason ${i + 1}: You make life brighter.`);

const ReasonsILoveYou = ({
  recipientName, senderName, reasons = [], scenes = {}, palette = 'pink',
  font = 'playful', showSenderName = true, showFooter = true,
  musicEnabled = false, musicUrl = '',
}) => {
  const pal = palettes[palette] || palettes.pink;
  const fnt = fonts[font] || fonts.playful;
  const videoId = extractYouTubeId(musicUrl);

  const allReasons = reasons.length > 0 ? reasons : DEFAULT_REASONS;

  const [cards, setCards] = useState(allReasons.map((r, i) => ({ id: i, text: r, flipped: false })));
  const [revealed, setRevealed] = useState(0);

  const flip = (id) => {
    setCards(prev => prev.map(c => {
      if (c.id === id && !c.flipped) {
        const newRevealed = revealed + 1;
        setRevealed(newRevealed);
        if (newRevealed === cards.length) {
          setTimeout(() => confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: [pal.primary, pal.accent, '#ffffff'],
          }), 300);
        }
        return { ...c, flipped: true };
      }
      return c;
    }));
  };

  const shuffle = () => {
    setCards(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: pal.bg, fontFamily: fnt.body }}>
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage: `radial-gradient(circle at 18% 16%, ${pal.primary}20, transparent 36%), radial-gradient(circle at 82% 20%, ${pal.accent}20, transparent 38%), radial-gradient(circle at 52% 86%, #ffffff3a, transparent 42%)`,
          backgroundSize: '170% 170%',
        }}
      />
      {musicEnabled && videoId && (
        <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0`}
          allow="autoplay" className="w-0 h-0 absolute opacity-0" title="bg music" />
      )}

      {/* Header */}
      <div className="text-center py-16 px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: pal.primary }}>
            ♥ For {recipientName || 'You'}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: fnt.heading, color: pal.text }}>
            {allReasons.length} Reasons I Love You
          </h1>
          {scenes.introText && (
            <p className="text-secondary text-lg max-w-xl mx-auto mb-6">{scenes.introText}</p>
          )}
          <div className="flex items-center justify-center gap-4">
            <span className="text-sm text-secondary font-medium">{revealed} / {cards.length} revealed</span>
            <button onClick={shuffle}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white transition-all hover:scale-105"
              style={{ backgroundColor: pal.primary }}>
              <Shuffle size={14} /> Shuffle
            </button>
          </div>
        </motion.div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-5xl mx-auto px-4 pb-24 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <AnimatePresence>
            {cards.map((card, i) => (
              <motion.div key={card.id} layout
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4, scale: 1.03 }}
                className="aspect-square cursor-pointer" style={{ perspective: '1000px' }}
                onClick={() => flip(card.id)}>
                <div className={`relative w-full h-full transition-all duration-500`}
                  style={{ transformStyle: 'preserve-3d', transform: card.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                  {/* Front */}
                  <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center shadow-md border"
                    style={{ backgroundColor: pal.primary, backfaceVisibility: 'hidden', borderColor: pal.accent }}>
                    <span className="text-white text-3xl mb-2">♥</span>
                    <span className="text-white/80 text-xs font-bold">#{i + 1}</span>
                  </div>
                  {/* Back */}
                  <div className="absolute inset-0 rounded-2xl flex items-center justify-center p-3 shadow-md text-center"
                    style={{ backgroundColor: '#fff', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', border: `2px solid ${pal.accent}` }}>
                    <p className="text-sm font-bold leading-snug" style={{ color: pal.text }}>{card.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {revealed === cards.length && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center pb-16 px-6 relative z-10">
          {scenes.closingMessage && (
            <p className="font-dancing text-3xl mb-4" style={{ color: pal.primary }}>
              {scenes.closingMessage}
            </p>
          )}
          {showSenderName && senderName && (
            <p className="font-dancing text-2xl text-secondary">— {senderName}</p>
          )}
        </motion.div>
      )}

      {showFooter && (
        <div className="text-center pb-8">
          <p className="text-secondary text-sm">made with LovePage ♥</p>
        </div>
      )}
    </div>
  );
};

export default ReasonsILoveYou;
