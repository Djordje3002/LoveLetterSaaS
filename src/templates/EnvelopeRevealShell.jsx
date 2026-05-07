import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const DEFAULT_BACKGROUND_STYLE = { backgroundColor: '#ffdbe6' };
const DEFAULT_ENVELOPE = {
  body: 'linear-gradient(180deg, #ffe9f0 0%, #ffd1de 52%, #ef9fb6 100%)',
  flap: 'linear-gradient(180deg, #ffe3ec 0%, #f6bbcd 100%)',
  front: 'linear-gradient(90deg, #f4c0cf 0%, #f8d2dd 50%, #f2b9ca 100%)',
  border: '#e8a6bb',
  seal: 'linear-gradient(135deg, #f34f80 0%, #dc305f 100%)',
  hint: '#f43f73',
};

const LETTER_TEXTURE = {
  backgroundColor: '#f2dfb8',
  backgroundImage: 'radial-gradient(circle at 14% 16%, rgba(140,104,60,0.20), transparent 38%), radial-gradient(circle at 88% 82%, rgba(127,87,45,0.17), transparent 34%), repeating-linear-gradient(180deg, rgba(111,77,38,0.04), rgba(111,77,38,0.04) 1px, transparent 1px, transparent 22px), radial-gradient(circle at 48% -30%, rgba(255,255,255,0.65), rgba(255,255,255,0) 70%)',
};

const EnvelopeRevealShell = ({
  hintText = 'Tap the wax seal to open ♥',
  openingHintText = 'Opening your letter...',
  letterPreviewText = 'A little preview from your letter...',
  backgroundStyle,
  floatingDecor = [],
  envelopeTheme,
  children,
}) => {
  const [state, setState] = useState('closed');
  const openTimerRef = useRef(null);
  const theme = envelopeTheme || DEFAULT_ENVELOPE;

  const isClosed = state === 'closed';
  const isOpening = state === 'opening';
  const isOpened = state === 'opened';

  useEffect(() => () => {
    if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
  }, []);

  const handleOpen = () => {
    if (!isClosed) return;
    setState('opening');
    openTimerRef.current = window.setTimeout(() => setState('opened'), 620);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="closed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            className="fixed inset-0 flex flex-col items-center justify-center p-6"
            style={backgroundStyle || DEFAULT_BACKGROUND_STYLE}
          >
            {floatingDecor.map((item) => (
              <motion.div
                key={item.id}
                className="absolute text-5xl sm:text-6xl"
                style={item.style}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, delay: item.delay || 0, ease: 'easeInOut' }}
              >
                {item.icon}
              </motion.div>
            ))}

            <motion.button
              type="button"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, type: 'spring' }}
              onClick={handleOpen}
              whileHover={isClosed ? { scale: 1.03, rotate: -1.2 } : undefined}
              whileTap={isClosed ? { scale: 0.98 } : undefined}
              className={`relative mb-12 w-[320px] h-[230px] sm:w-[380px] sm:h-[270px] ${isClosed ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <motion.div
                className="absolute inset-0 rounded-[18px]"
                animate={{ opacity: [0.25, 0.55, 0.25] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ boxShadow: `0 0 80px ${theme.hint}4f` }}
              />

              <motion.div
                initial={{ y: 24, scale: 0.94, opacity: 0.85 }}
                animate={isOpening ? { y: [24, -126, -110], scale: [0.94, 1.03, 1.02], rotate: [0, -4, -1.8], opacity: [0.85, 1, 1] } : { y: 24, scale: 0.94, opacity: 0.85, rotate: 0 }}
                transition={isOpening ? { duration: 0.78, ease: ['easeOut', 'easeOut', 'easeInOut'], times: [0, 0.72, 1] } : { type: 'spring', stiffness: 170, damping: 17 }}
                className="absolute left-1/2 bottom-[72px] -translate-x-1/2 w-[250px] sm:w-[290px] h-[160px] sm:h-[182px] rounded-[12px] border border-[#d2b985] overflow-hidden z-10 shadow-[0_18px_36px_rgba(99,67,30,0.22)]"
                style={LETTER_TEXTURE}
              >
                <div className="absolute inset-[8px] rounded-[8px] border border-[#d9be8e]/70 pointer-events-none" />
                <p className="h-full px-5 py-4 text-left text-[13px] leading-[1.55] text-[#5a3c20] font-playfair font-medium overflow-hidden">
                  {letterPreviewText}
                </p>
              </motion.div>

              <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[300px] sm:w-[350px] h-[196px] sm:h-[220px]">
                <div className="absolute inset-0 rounded-[18px] border shadow-[0_24px_44px_rgba(197,71,115,0.28)]" style={{ background: theme.body, borderColor: theme.border }} />
                <div className="absolute inset-x-0 bottom-0 h-[124px] sm:h-[136px] [clip-path:polygon(0_0,50%_85%,100%_0,100%_100%,0_100%)] rounded-b-[18px]" style={{ background: theme.front }} />
                <div className="absolute inset-x-[12px] bottom-[10px] h-[1px] bg-white/45" />

                <motion.div
                  animate={isOpening ? { rotateX: -184, y: -8 } : { rotateX: 0, y: 0 }}
                  transition={{ duration: 0.55, ease: [0.2, 0.75, 0.22, 1] }}
                  className="absolute left-0 right-0 top-0 h-[118px] sm:h-[132px] origin-top [transform-style:preserve-3d] [perspective:1200px]"
                >
                  <div className="w-full h-full border-x border-t [clip-path:polygon(0_0,100%_0,50%_100%)] rounded-t-[16px]" style={{ background: theme.flap, borderColor: theme.border }} />
                </motion.div>

                <AnimatePresence>
                  {isClosed && (
                    <motion.div
                      initial={{ scale: 0.68, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.35, opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 top-[72px] sm:top-[80px] -translate-x-1/2 z-20 w-12 h-12 text-white border-4 border-white shadow-xl rounded-full flex items-center justify-center text-lg"
                      style={{ background: theme.seal }}
                    >
                      ❤️
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="font-dancing text-4xl text-center"
              style={{ color: theme.hint }}
            >
              {isOpening ? openingHintText : hintText}
            </motion.p>
          </motion.div>
        ) : (
          <motion.div key="opened" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnvelopeRevealShell;
