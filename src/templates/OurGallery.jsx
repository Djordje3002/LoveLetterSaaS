import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { palettes, fonts, extractYouTubeId } from './palettes';

const PLACEHOLDER_COLORS = [
  'from-rose-300 to-pink-400',
  'from-sky-300 to-blue-400',
  'from-amber-300 to-orange-400',
  'from-emerald-300 to-teal-400',
  'from-violet-300 to-purple-400',
];

const OurGallery = ({
  recipientName, senderName, scenes = {}, palette = 'pink',
  font = 'playful', showSenderName = true, showFooter = true,
  musicEnabled = false, musicUrl = '',
}) => {
  const pal = palettes[palette] || palettes.pink;
  const fnt = fonts[font] || fonts.playful;
  const videoId = extractYouTubeId(musicUrl);
  const photos = [1,2,3,4,5].map((i) => ({
    id: i,
    caption: scenes[`polaroidCaption${i}`] || `Memory ${i}`,
    color: PLACEHOLDER_COLORS[i - 1],
  }));
  const [current, setCurrent] = useState(0);
  const prev = useCallback(() => setCurrent(c => (c - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setCurrent(c => (c + 1) % photos.length), [photos.length]);

  React.useEffect(() => {
    const handle = (e) => { if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next(); };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [prev, next]);

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden" style={{ fontFamily: fnt.body }}>
      {musicEnabled && videoId && (
        <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0`}
          allow="autoplay" className="w-0 h-0 absolute opacity-0" title="bg music" />
      )}
      <div className="absolute top-8 left-0 right-0 text-center z-10 pointer-events-none">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="text-white text-2xl md:text-4xl font-bold drop-shadow-xl" style={{ fontFamily: fnt.heading }}>
          {scenes.galleryTitle || 'Our Story in Photos'}
        </motion.h1>
      </div>
      <div className="flex-grow relative flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }} className="absolute inset-0">
            <div className={`w-full h-full bg-gradient-to-br ${photos[current].color} flex items-center justify-center`}>
              <p className="text-white/30 text-8xl font-black">📷</p>
            </div>
            <div className="absolute inset-0 bg-black/30" />
          </motion.div>
        </AnimatePresence>
        <button onClick={prev} className="absolute left-4 z-20 w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-all">
          <ChevronLeft size={24} />
        </button>
        <button onClick={next} className="absolute right-4 z-20 w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-all">
          <ChevronRight size={24} />
        </button>
        <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-2 z-20">
          {photos.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50'}`} />
          ))}
        </div>
      </div>
      <div className="shrink-0 bg-black/70 backdrop-blur-md px-8 py-6 text-center border-t border-white/10">
        <AnimatePresence mode="wait">
          <motion.p key={current} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
            className="text-white font-dancing text-2xl">
            {photos[current].caption}
          </motion.p>
        </AnimatePresence>
        {showSenderName && senderName && <p className="text-white/50 text-sm mt-1">— {senderName}</p>}
        {showFooter && <p className="text-white/30 text-xs mt-2">made with LovePage ♥</p>}
      </div>
    </div>
  );
};

export default OurGallery;
