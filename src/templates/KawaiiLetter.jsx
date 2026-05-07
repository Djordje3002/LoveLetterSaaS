import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, ChevronRight } from 'lucide-react';
import EnvelopeRevealShell from './EnvelopeRevealShell';
import { palettes, fonts, extractYouTubeId } from './palettes';

const KAWAII_PAPER_STYLE = {
  backgroundColor: '#fff6fb',
  backgroundImage: 'radial-gradient(circle at 12% 14%, rgba(236,148,184,0.18), transparent 38%), radial-gradient(circle at 88% 82%, rgba(216,124,160,0.16), transparent 34%), repeating-linear-gradient(180deg, rgba(171,99,131,0.09), rgba(171,99,131,0.09) 1px, transparent 1px, transparent 30px), linear-gradient(120deg, rgba(255,255,255,0.75), transparent 42%)',
};

const KawaiiLetter = ({
  recipientName, senderName, scenes = {}, palette = 'pink',
  font = 'playful', showSenderName = true, showFooter = true,
  musicEnabled = false, musicUrl = '',
}) => {
  const [scene, setScene] = useState(2);
  const pal = palettes[palette] || palettes.pink;
  const fnt = fonts[font] || fonts.playful;
  const videoId = extractYouTubeId(musicUrl);
  const floatingEmojis = useMemo(() => ([
    { id: 'a', icon: '🌸', style: { top: '10%', left: '7%' }, delay: 0 },
    { id: 'b', icon: '🎀', style: { top: '14%', right: '8%' }, delay: 0.3 },
    { id: 'c', icon: '✨', style: { top: '52%', right: '6%' }, delay: 0.6 },
    { id: 'd', icon: '🎈', style: { bottom: '11%', left: '10%' }, delay: 0.9 },
    { id: 'e', icon: '💌', style: { bottom: '18%', right: '16%' }, delay: 1.2 },
  ]), []);

  const letterParagraphs = (scenes.letterText || '').split('\n').filter(Boolean);
  const polaroids = [1, 2, 3, 4, 5].map(i => ({
    caption: scenes[`polaroidCaption${i}`] || `Memory ${i}`,
    imageUrl: scenes[`photo${i}Url`] || '',
    color: ['bg-rose-200', 'bg-sky-200', 'bg-amber-200', 'bg-emerald-200', 'bg-violet-200'][i - 1],
  }));

  return (
    <EnvelopeRevealShell
      hintText={scenes.hint || 'Tap to open ♥'}
      openingHintText="Opening your letter..."
      letterPreviewText={scenes.scene2Header || scenes.letterText || scenes.scene1Text || 'A little preview from your letter...'}
      paperVariant="rose"
      backgroundStyle={{ backgroundColor: pal.bg }}
      floatingDecor={floatingEmojis}
      envelopeTheme={{
        body: 'linear-gradient(180deg, #ffeaf2 0%, #ffd6e4 52%, #f1a8bd 100%)',
        flap: 'linear-gradient(180deg, #ffedf4 0%, #f7bfd1 100%)',
        front: 'linear-gradient(90deg, #f8c8d7 0%, #fce0e8 50%, #f5bfd0 100%)',
        border: '#e8adc1',
        seal: 'linear-gradient(135deg, #f65287 0%, #d93467 100%)',
        hint: pal.primary,
      }}
    >
      <div className="min-h-screen relative overflow-x-hidden" style={{ fontFamily: fnt.body }}>
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-75"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
          style={{
            backgroundImage: `radial-gradient(circle at 20% 22%, ${pal.primary}22, transparent 38%), radial-gradient(circle at 76% 18%, ${pal.accent}20, transparent 40%), radial-gradient(circle at 50% 84%, ${pal.primary}1a, transparent 44%)`,
            backgroundSize: '160% 160%',
          }}
        />
        {musicEnabled && videoId && (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0`}
            allow="autoplay"
            className="w-0 h-0 absolute opacity-0"
            title="background music"
          />
        )}

        <AnimatePresence mode="wait">
          {scene === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-screen flex flex-col items-center py-20 px-6 relative overflow-hidden"
              style={{
                backgroundColor: '#fff8fb',
                backgroundImage: 'linear-gradient(90deg, rgba(248,200,212,0.36) 50%, transparent 50%), linear-gradient(rgba(248,200,212,0.36) 50%, transparent 50%)',
                backgroundSize: '78px 78px',
              }}
            >
              <span className="absolute top-16 left-10 text-4xl">🌼</span>
              <span className="absolute top-16 right-12 text-4xl">⭐</span>
              <span className="absolute bottom-24 left-10 text-4xl">🎈</span>
              <span className="absolute bottom-24 right-12 text-4xl">🐱</span>
              <span className="absolute left-8 top-1/2 -translate-y-1/2 text-3xl text-[#c35a86]">〰️</span>

              <div className="max-w-2xl w-full text-center">
                <h1 className="text-4xl md:text-5xl italic mb-8" style={{ fontFamily: fnt.heading, color: '#9c2f5e' }}>
                  {scenes.scene2Header || 'A letter for you...'}
                </h1>
                <div className="relative rounded-[24px] border border-[#e7bed0] shadow-[0_24px_44px_rgba(173,74,116,0.22)] overflow-hidden max-w-xl mx-auto" style={KAWAII_PAPER_STYLE}>
                  <div className="absolute top-0 left-7 w-16 h-6 bg-white/70 rotate-[-8deg] rounded-sm shadow-sm" />
                  <div className="absolute top-0 right-8 w-16 h-6 bg-white/70 rotate-[7deg] rounded-sm shadow-sm" />
                  <div className="px-8 py-12 text-left relative">
                    <div className="space-y-6 text-[1.06rem] md:text-xl leading-[1.9] font-serif text-[#5d2943]">
                      {letterParagraphs.length > 0 ? letterParagraphs.map((para, i) => (
                        <motion.p key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 + i * 0.3 }}>
                          {para}
                        </motion.p>
                      )) : (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="text-[#99647c] italic text-center">
                          Your letter text will appear here...
                        </motion.p>
                      )}
                    </div>

                    {showSenderName && senderName && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + letterParagraphs.length * 0.3 }} className="mt-14 flex flex-col items-end">
                        <p className="font-dancing text-3xl" style={{ color: '#cb4f82' }}>— {senderName}</p>
                      </motion.div>
                    )}

                    {scenes.closingMessage && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 + letterParagraphs.length * 0.3 }}
                        className="font-dancing text-2xl mt-6 text-right"
                        style={{ color: '#cb4f82' }}
                      >
                        {scenes.closingMessage}
                      </motion.p>
                    )}
                  </div>
                </div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  onClick={() => setScene(3)}
                  className="mt-14 px-8 py-4 rounded-full font-bold flex items-center gap-2 mx-auto text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #f54f86, #df2f64)' }}
                >
                  Continue <ChevronRight size={20} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {scene === 3 && (
            <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-white py-24 px-6 overflow-x-hidden relative">
              <motion.div
                className="pointer-events-none absolute inset-0 opacity-70"
                animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
                transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                style={{
                  backgroundImage: `radial-gradient(circle at 10% 18%, ${pal.primary}14, transparent 30%), radial-gradient(circle at 85% 75%, ${pal.accent}1c, transparent 32%)`,
                  backgroundSize: '180% 180%',
                }}
              />
              <div className="max-w-7xl mx-auto text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3" style={{ fontFamily: fnt.heading }}>
                  {scenes.scene3Header || 'Our Memories'} <Camera style={{ color: pal.primary }} />
                </h2>
                <p className="text-secondary">Swipe to see our favorite moments</p>
              </div>

              <div className="flex overflow-x-auto gap-8 px-4 pb-12 snap-x" style={{ scrollbarWidth: 'none' }}>
                {polaroids.map((photo, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, rotate: i % 2 === 0 ? -5 : 5, x: 50, y: 12 }}
                    animate={{ opacity: 1, x: 0, rotate: i % 2 === 0 ? -2 : 2 }}
                    transition={{ delay: i * 0.15 }}
                    whileHover={{ rotate: 0, scale: 1.03 }}
                    className="flex-shrink-0 w-[300px] snap-center cursor-pointer"
                  >
                    <div className="bg-white p-4 shadow-xl rounded-sm border border-card">
                      <div className={`aspect-square ${photo.color} rounded-sm relative overflow-hidden mb-6`}>
                        {photo.imageUrl && (
                          <img src={photo.imageUrl} alt={photo.caption} className="absolute inset-0 w-full h-full object-cover" />
                        )}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-8 bg-white/40 backdrop-blur-sm -rotate-2" />
                      </div>
                      <p className="font-dancing text-2xl text-dark/70 text-center">{photo.caption}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {showFooter && (
                <div className="mt-16 text-center">
                  <p className="text-secondary text-sm mb-2">made with LovePage ♥</p>
                  <a href="/" className="text-sm font-bold hover:underline" style={{ color: pal.primary }}>
                    Create your own page
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </EnvelopeRevealShell>
  );
};

export default KawaiiLetter;
