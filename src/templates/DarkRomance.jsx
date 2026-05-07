import React from 'react';
import { motion } from 'framer-motion';
import EnvelopeRevealShell from './EnvelopeRevealShell';
import { palettes, fonts, extractYouTubeId } from './palettes';

const DARK_PARCHMENT_STYLE = {
  backgroundColor: '#d9b58e',
  backgroundImage: 'radial-gradient(circle at 15% 15%, rgba(71,35,18,0.30), transparent 42%), radial-gradient(circle at 85% 90%, rgba(55,26,13,0.26), transparent 36%), radial-gradient(circle at 50% 108%, rgba(49,23,12,0.20), transparent 52%), repeating-linear-gradient(180deg, rgba(77,43,24,0.065), rgba(77,43,24,0.065) 1px, transparent 1px, transparent 30px), linear-gradient(125deg, rgba(255,245,219,0.36), transparent 44%)',
};

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
    <EnvelopeRevealShell
      hintText={scenes.hint || 'Break the wax seal'}
      openingHintText="Unfolding the confession..."
      letterPreviewText={scenes.letterText || scenes.scene2Header || 'A candlelit confession written for you...'}
      paperVariant="noir"
      backgroundStyle={{ background: 'linear-gradient(180deg, #0b0b0b 0%, #1c1007 100%)' }}
      floatingDecor={[
        { id: 'd1', icon: '🕯️', style: { top: '12%', left: '10%' }, delay: 0.1 },
        { id: 'd2', icon: '🖤', style: { top: '16%', right: '10%' }, delay: 0.35 },
        { id: 'd3', icon: '✨', style: { bottom: '15%', left: '12%' }, delay: 0.75 },
      ]}
      envelopeTheme={{
        body: 'linear-gradient(180deg, #2b1b16 0%, #1f1410 52%, #130d0a 100%)',
        flap: 'linear-gradient(180deg, #3a2720 0%, #1d120f 100%)',
        front: 'linear-gradient(90deg, #2c1c16 0%, #1f1410 50%, #261712 100%)',
        border: '#5f4032',
        seal: 'linear-gradient(135deg, #7c1f2a 0%, #5b0f1f 100%)',
        hint: '#d4af37',
      }}
    >
      <div className="min-h-screen bg-[#0D0D0D] text-white overflow-x-hidden relative" style={{ fontFamily: fnt.body }}>
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          style={{
            backgroundImage: `radial-gradient(circle at 20% 15%, ${pal.primary}26, transparent 35%), radial-gradient(circle at 80% 85%, #f59e0b22, transparent 35%), linear-gradient(180deg, #090909 0%, #0d0d0d 35%, #111111 100%)`,
            backgroundSize: '170% 170%',
          }}
        />
        {musicEnabled && videoId && (
          <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0`} allow="autoplay" className="w-0 h-0 absolute opacity-0" title="bg music" />
        )}

        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute bottom-0 animate-ember rounded-full opacity-70"
              style={{
                left: `${(i * 8.3) % 100}%`,
                width: `${4 + (i % 3) * 2}px`,
                height: `${4 + (i % 3) * 2}px`,
                backgroundColor: i % 2 === 0 ? '#F59E0B' : pal.primary,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${4 + (i % 3)}s`,
              }}
            />
          ))}
        </div>

        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <p className="text-sm font-bold uppercase tracking-[0.3em] mb-6" style={{ color: pal.primary }}>
              ♥ For {recipientName || 'You'}
            </p>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight" style={{ fontFamily: fnt.heading, textShadow: `0 0 40px ${pal.primary}60` }}>
              Dark Romance
            </h1>
            <motion.p className="text-white/70 text-sm mb-5 tracking-[0.16em] uppercase" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
              A candlelit confession
            </motion.p>
            <div className="w-32 h-px mx-auto" style={{ backgroundColor: `${pal.primary}60` }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 36, rotate: -0.8 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.45, duration: 0.8, ease: 'easeOut' }}
            className="relative z-10 mt-14 w-full max-w-2xl text-left rounded-[6px] border border-[#8f6f52] shadow-[0_35px_80px_rgba(0,0,0,0.42)] px-7 py-9 md:px-10 md:py-12"
            style={DARK_PARCHMENT_STYLE}
          >
            <div className="absolute inset-[10px] border border-[#6d4a30]/35 pointer-events-none" />
            <div className="absolute -top-3 left-10 w-24 h-7 bg-[#f2ddb7]/70 rotate-[-4deg] shadow-sm" />
            <div className="absolute -bottom-4 right-12 w-28 h-8 bg-[#5e2c1e]/20 rotate-[3deg] blur-[1px]" />
            <div className="relative space-y-7 text-[#3f2818]">
              {letterParagraphs.length > 0 ? letterParagraphs.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75 + i * 0.22 }}
                  className="text-lg md:text-xl leading-[1.9]"
                  style={{ fontFamily: fnt.body }}
                >
                  {para}
                </motion.p>
              )) : (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }} className="text-lg italic text-[#6f4a30] text-center">
                  Your letter text will appear here...
                </motion.p>
              )}

              {(scenes.closingMessage || (showSenderName && senderName)) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + letterParagraphs.length * 0.22 }}
                  className="pt-5 text-right"
                >
                  {scenes.closingMessage && (
                    <p className="font-dancing text-3xl text-[#731e2b]">{scenes.closingMessage}</p>
                  )}
                  {showSenderName && senderName && (
                    <p className="font-dancing text-2xl text-[#573522] mt-2">— {senderName}</p>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {showFooter && (
          <div className="text-center pb-12">
            <p className="text-white/30 text-sm">made with LovePage ♥</p>
          </div>
        )}
      </div>
    </EnvelopeRevealShell>
  );
};

export default DarkRomance;
