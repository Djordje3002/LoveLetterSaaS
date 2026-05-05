import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Camera } from 'lucide-react';
import { palettes, fonts, extractYouTubeId } from './palettes';

const KawaiiLetter = ({
  recipientName, senderName, scenes = {}, palette = 'pink',
  font = 'playful', showSenderName = true, showFooter = true,
  musicEnabled = false, musicUrl = '',
}) => {
  const [scene, setScene] = useState(1);
  const pal = palettes[palette] || palettes.pink;
  const fnt = fonts[font] || fonts.playful;
  const videoId = extractYouTubeId(musicUrl);

  const letterParagraphs = (scenes.letterText || '').split('\n').filter(Boolean);
  const polaroids = [1, 2, 3, 4, 5].map(i => ({
    caption: scenes[`polaroidCaption${i}`] || `Memory ${i}`,
    imageUrl: scenes[`photo${i}Url`] || '',
    color: ['bg-rose-200', 'bg-sky-200', 'bg-amber-200', 'bg-emerald-200', 'bg-violet-200'][i - 1],
  }));

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ fontFamily: fnt.body }}>
      {/* Music iframe */}
      {musicEnabled && videoId && (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0`}
          allow="autoplay" className="w-0 h-0 absolute opacity-0" title="background music"
        />
      )}

      <AnimatePresence mode="wait">
        {/* Scene 1: Envelope */}
        {scene === 1 && (
          <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex flex-col items-center justify-center p-6"
            style={{ backgroundColor: pal.bg }}>
            <div className="absolute top-10 left-6 text-6xl animate-bob">🌸</div>
            <div className="absolute top-10 right-10 text-6xl animate-bob" style={{ animationDelay: '0.3s' }}>🌙</div>
            <div className="absolute top-1/2 right-6 text-5xl animate-bob" style={{ animationDelay: '0.6s' }}>🎀</div>
            <div className="absolute bottom-10 left-10 text-6xl animate-bob" style={{ animationDelay: '0.9s' }}>🎈</div>

            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              onClick={() => setScene(2)} className="relative mb-12 cursor-pointer">
              <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.96 }}
                className="w-64 h-44 bg-white rounded-2xl shadow-2xl flex items-center justify-center relative group">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg text-2xl group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: pal.primary }}>❤️</div>
                <div className="absolute top-0 left-0 w-full h-full border-t-[80px] border-x-[128px] border-x-transparent"
                  style={{ borderTopColor: pal.bg }} />
              </motion.div>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="font-dancing text-4xl text-center" style={{ color: pal.primary }}>
              {scenes.hint || 'Tap to open ♥'}
            </motion.p>
          </motion.div>
        )}

        {/* Scene 2: Letter */}
        {scene === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex flex-col items-center py-24 px-6" style={{ backgroundColor: '#FAF9F6' }}>
            <div className="max-w-2xl w-full text-center">
              <h1 className="text-4xl md:text-5xl italic mb-8" style={{ fontFamily: fnt.heading, color: pal.text }}>
                {scenes.scene2Header || 'A letter for you...'}
              </h1>
              <div className="w-24 h-px mx-auto mb-12" style={{ backgroundColor: pal.primary + '50' }} />

              <div className="space-y-6 text-lg md:text-xl leading-relaxed font-serif text-left">
                {letterParagraphs.length > 0 ? letterParagraphs.map((para, i) => (
                  <motion.p key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.4 }}>
                    {para}
                  </motion.p>
                )) : (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="text-gray-400 italic text-center">Your letter text will appear here...</motion.p>
                )}
              </div>

              {showSenderName && senderName && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + letterParagraphs.length * 0.4 }}
                  className="mt-16 flex flex-col items-end">
                  <p className="font-dancing text-3xl" style={{ color: pal.primary }}>— {senderName}</p>
                </motion.div>
              )}

              {scenes.closingMessage && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + letterParagraphs.length * 0.4 + 0.3 }}
                  className="font-dancing text-2xl mt-8" style={{ color: pal.primary }}>
                  {scenes.closingMessage}
                </motion.p>
              )}

              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 2 }} onClick={() => setScene(3)}
                className="mt-20 px-8 py-4 rounded-full font-bold flex items-center gap-2 mx-auto text-white transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: pal.primary }}>
                Continue <ChevronRight size={20} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Scene 3: Memories */}
        {scene === 3 && (
          <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="min-h-screen bg-white py-24 px-6 overflow-x-hidden">
            <div className="max-w-7xl mx-auto text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3"
                style={{ fontFamily: fnt.heading }}>
                {scenes.scene3Header || 'Our Memories'} <Camera style={{ color: pal.primary }} />
              </h2>
              <p className="text-secondary">Swipe to see our favorite moments</p>
            </div>

            <div className="flex overflow-x-auto gap-8 px-4 pb-12 snap-x" style={{ scrollbarWidth: 'none' }}>
              {polaroids.map((photo, i) => (
                <motion.div key={i} initial={{ opacity: 0, rotate: i % 2 === 0 ? -5 : 5, x: 50 }}
                  animate={{ opacity: 1, x: 0, rotate: i % 2 === 0 ? -2 : 2 }}
                  transition={{ delay: i * 0.15 }} whileHover={{ rotate: 0, scale: 1.03 }}
                  className="flex-shrink-0 w-[300px] snap-center cursor-pointer">
                  <div className="bg-white p-4 shadow-xl rounded-sm border border-card">
                    <div className={`aspect-square ${photo.color} rounded-sm relative overflow-hidden mb-6`}>
                      {photo.imageUrl && (
                        <img
                          src={photo.imageUrl}
                          alt={photo.caption}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
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
  );
};

export default KawaiiLetter;
