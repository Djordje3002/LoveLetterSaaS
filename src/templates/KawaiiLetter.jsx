import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, ChevronRight } from 'lucide-react';
import EnvelopeRevealShell from './EnvelopeRevealShell';
import { palettes, fonts, extractYouTubeId } from './palettes';

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
      backgroundStyle={{ backgroundColor: pal.bg }}
      floatingDecor={floatingEmojis}
      envelopeTheme={{
        body: 'linear-gradient(180deg, #ffe9f0 0%, #ffd1de 52%, #ef9fb6 100%)',
        flap: 'linear-gradient(180deg, #ffe3ec 0%, #f6bbcd 100%)',
        front: 'linear-gradient(90deg, #f4c0cf 0%, #f8d2dd 50%, #f2b9ca 100%)',
        border: '#e8a6bb',
        seal: 'linear-gradient(135deg, #f34f80 0%, #dc305f 100%)',
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
              className="min-h-screen flex flex-col items-center py-24 px-6 relative"
              style={{ backgroundColor: '#FAF9F6' }}
            >
              <motion.div
                aria-hidden
                className="absolute inset-0 opacity-50"
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                style={{
                  backgroundImage: `linear-gradient(120deg, transparent 0%, ${pal.primary}0f 40%, transparent 80%)`,
                  backgroundSize: '220% 220%',
                }}
              />
              <div className="max-w-2xl w-full text-center">
                <h1 className="text-4xl md:text-5xl italic mb-8" style={{ fontFamily: fnt.heading, color: pal.text }}>
                  {scenes.scene2Header || 'A letter for you...'}
                </h1>
                <div className="w-24 h-px mx-auto mb-12" style={{ backgroundColor: `${pal.primary}50` }} />

                <div className="space-y-6 text-lg md:text-xl leading-relaxed font-serif text-left">
                  {letterParagraphs.length > 0 ? letterParagraphs.map((para, i) => (
                    <motion.p key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.4 }}>
                      {para}
                    </motion.p>
                  )) : (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-gray-400 italic text-center">
                      Your letter text will appear here...
                    </motion.p>
                  )}
                </div>

                {showSenderName && senderName && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + letterParagraphs.length * 0.4 }} className="mt-16 flex flex-col items-end">
                    <p className="font-dancing text-3xl" style={{ color: pal.primary }}>— {senderName}</p>
                  </motion.div>
                )}

                {scenes.closingMessage && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + letterParagraphs.length * 0.4 + 0.3 }}
                    className="font-dancing text-2xl mt-8"
                    style={{ color: pal.primary }}
                  >
                    {scenes.closingMessage}
                  </motion.p>
                )}

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  onClick={() => setScene(3)}
                  className="mt-20 px-8 py-4 rounded-full font-bold flex items-center gap-2 mx-auto text-white transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: pal.primary }}
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
