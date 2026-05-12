import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import EnvelopeRevealShell from './EnvelopeRevealShell';
import { palettes, fonts, extractYouTubeId } from './palettes';

const MIDNIGHT_PAPER_STYLE = {
  backgroundColor: '#eef4ff',
  backgroundImage: 'radial-gradient(circle at 12% 14%, rgba(133,158,211,0.22), transparent 40%), radial-gradient(circle at 88% 86%, rgba(75,107,170,0.16), transparent 35%), repeating-linear-gradient(180deg, rgba(69,93,145,0.07), rgba(69,93,145,0.07) 1px, transparent 1px, transparent 30px), radial-gradient(circle at 50% -24%, rgba(255,255,255,0.86), transparent 68%)',
};

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
      paperVariant="midnight"
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

        <div className="relative z-10 min-h-screen max-w-3xl mx-auto px-6 py-24 text-center flex flex-col justify-center">
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

          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 0.8 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.6, duration: 0.75, ease: 'easeOut' }}
            className="relative mx-auto w-full max-w-2xl rounded-[18px] border border-[#aab9dc] shadow-[0_30px_80px_rgba(3,7,30,0.46)] px-7 py-9 md:px-10 md:py-12 text-left overflow-hidden max-h-[78vh]"
            style={MIDNIGHT_PAPER_STYLE}
          >
            <div className="absolute top-0 left-10 w-20 h-7 bg-white/70 rotate-[-6deg] shadow-sm rounded-sm" />
            <div className="absolute inset-[10px] rounded-[12px] border border-[#bdc9e5]/80 pointer-events-none" />
            <div className="relative max-h-[60vh] overflow-y-auto pr-2 space-y-7">
              {letterParagraphs.length > 0 ? letterParagraphs.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95 + i * 0.26 }}
                  className="text-lg md:text-xl text-[#233456] leading-[1.9]"
                >
                  {para}
                </motion.p>
              )) : (
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }} className="text-lg text-[#60739d] leading-relaxed italic text-center">
                  Your letter will appear here under a thousand stars...
                </motion.p>
              )}

              {(scenes.closingMessage || (showSenderName && senderName)) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 + letterParagraphs.length * 0.26 }} className="pt-5 text-right">
                  {scenes.closingMessage && (
                    <p className="font-dancing text-3xl mb-2" style={{ color: '#3e5fc2' }}>{scenes.closingMessage}</p>
                  )}
                  {showSenderName && senderName && (
                    <p className="font-dancing text-2xl text-[#52658c]">— {senderName}</p>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
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
