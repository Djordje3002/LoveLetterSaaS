import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import EnvelopeRevealShell from './EnvelopeRevealShell';
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

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedName(displayName.slice(0, i + 1));
      i += 1;
      if (i >= displayName.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, [displayName]);

  const letterParagraphs = (scenes.letterText || '').split('\n').filter(Boolean);

  return (
    <EnvelopeRevealShell
      hintText={scenes.hint || 'Open under the stars'}
      openingHintText="Opening your midnight letter..."
      letterPreviewText={scenes.letterText || scenes.scene2Header || 'A starry message written for you...'}
      backgroundStyle={{ background: 'radial-gradient(circle at 50% 10%, #1a2b5f 0%, #0a1230 40%, #03071e 100%)' }}
      floatingDecor={[
        { id: 'm1', icon: '🌙', style: { top: '12%', left: '9%' }, delay: 0 },
        { id: 'm2', icon: '✨', style: { top: '16%', right: '8%' }, delay: 0.3 },
        { id: 'm3', icon: '💫', style: { bottom: '15%', right: '14%' }, delay: 0.8 },
      ]}
      envelopeTheme={{
        body: 'linear-gradient(180deg, #d9e4ff 0%, #becdf3 52%, #9eb4e8 100%)',
        flap: 'linear-gradient(180deg, #ecf2ff 0%, #bed0f8 100%)',
        front: 'linear-gradient(90deg, #c6d5f5 0%, #d9e6ff 50%, #b2c6f3 100%)',
        border: '#8ea6d7',
        seal: 'linear-gradient(135deg, #3e5fc2 0%, #2f4aa2 100%)',
        hint: '#94b8ff',
      }}
    >
      <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: '#03071e', fontFamily: fnt.body }}>
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          animate={{ opacity: [0.45, 0.75, 0.45] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background: `radial-gradient(circle at 20% 18%, ${pal.accent}24, transparent 38%), radial-gradient(circle at 82% 24%, #8ec5ff1f, transparent 36%), radial-gradient(circle at 50% 90%, #ffffff12, transparent 44%)`,
          }}
        />
        {musicEnabled && videoId && (
          <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0`} allow="autoplay" className="w-0 h-0 absolute opacity-0" title="bg music" />
        )}

        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-twinkle"
              style={{
                top: `${(i * 13) % 100}%`,
                left: `${(i * 17) % 100}%`,
                width: `${1 + (i % 3)}px`,
                height: `${1 + (i % 3)}px`,
                backgroundColor: 'white',
                opacity: 0.25 + ((i % 6) * 0.11),
                animationDelay: `${(i % 7) * 0.45}s`,
                animationDuration: `${2.2 + (i % 4) * 0.8}s`,
              }}
            />
          ))}
        </div>

        <ShootingStar interval={8000} />

        <div className="relative z-10 max-w-2xl mx-auto px-8 py-32 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-sm font-bold uppercase tracking-[0.3em] mb-8" style={{ color: pal.accent }}>
            ✦ A message for
          </motion.p>

          <h1 className="text-5xl md:text-7xl font-bold mb-16 min-h-[1.2em]" style={{ fontFamily: fnt.heading, color: pal.accent, textShadow: `0 0 40px ${pal.accent}80` }}>
            {typedName}<span className="animate-pulse">|</span>
          </h1>
          <motion.div
            className="mx-auto mb-14 h-[2px] rounded-full"
            style={{ width: '140px', backgroundColor: pal.accent }}
            animate={{ width: ['80px', '180px', '80px'], opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="space-y-8 text-left">
            {letterParagraphs.length > 0 ? letterParagraphs.map((para, i) => (
              <motion.p key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 + i * 0.32 }} className="text-lg text-white/80 leading-relaxed">
                {para}
              </motion.p>
            )) : (
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="text-lg text-white/40 leading-relaxed italic text-center">
                Your letter will appear here under a thousand stars...
              </motion.p>
            )}
          </div>

          {(scenes.closingMessage || (showSenderName && senderName)) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 + letterParagraphs.length * 0.32 }} className="mt-20 text-right">
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
    </EnvelopeRevealShell>
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
    <div
      className="fixed pointer-events-none z-20 animate-shooting-star"
      style={{
        top: pos.top,
        left: pos.left,
        width: '100px',
        height: '2px',
        background: 'linear-gradient(90deg, white, transparent)',
        transform: 'rotate(-30deg)',
        boxShadow: '0 0 6px white',
      }}
    />
  );
};

export default MidnightLove;
