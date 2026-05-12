import { useEffect, useRef, useState } from 'react';
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

const PAPER_VARIANTS = {
  warm: {
    border: '#d2b985',
    innerBorder: '#d9be8e',
    text: '#5a3c20',
    fade: '#ead3a3',
    shadow: '0 20px 38px rgba(99,67,30,0.24)',
    style: {
      backgroundColor: '#f2dfb8',
      backgroundImage: 'radial-gradient(circle at 14% 16%, rgba(140,104,60,0.20), transparent 38%), radial-gradient(circle at 88% 82%, rgba(127,87,45,0.17), transparent 34%), repeating-linear-gradient(180deg, rgba(111,77,38,0.05), rgba(111,77,38,0.05) 1px, transparent 1px, transparent 22px), repeating-radial-gradient(circle at 0 0, rgba(80,52,22,0.028), rgba(80,52,22,0.028) 1px, transparent 1px, transparent 4px), radial-gradient(circle at 48% -30%, rgba(255,255,255,0.65), rgba(255,255,255,0) 70%)',
    },
  },
  rose: {
    border: '#d8b0b8',
    innerBorder: '#e3c1c8',
    text: '#5e3042',
    fade: '#f2cad5',
    shadow: '0 18px 32px rgba(117,57,82,0.22)',
    style: {
      backgroundColor: '#f9e8ee',
      backgroundImage: 'radial-gradient(circle at 12% 18%, rgba(206,128,158,0.20), transparent 40%), radial-gradient(circle at 86% 84%, rgba(181,106,135,0.18), transparent 34%), repeating-linear-gradient(180deg, rgba(157,95,121,0.055), rgba(157,95,121,0.055) 1px, transparent 1px, transparent 24px), repeating-radial-gradient(circle at 0 0, rgba(115,68,89,0.028), rgba(115,68,89,0.028) 1px, transparent 1px, transparent 5px), radial-gradient(circle at 56% -25%, rgba(255,255,255,0.72), rgba(255,255,255,0) 72%)',
    },
  },
  midnight: {
    border: '#9eb2d8',
    innerBorder: '#bcc8e0',
    text: '#253456',
    fade: '#d8e3f6',
    shadow: '0 22px 38px rgba(42,57,99,0.26)',
    style: {
      backgroundColor: '#e6edf9',
      backgroundImage: 'radial-gradient(circle at 14% 16%, rgba(122,148,201,0.24), transparent 40%), radial-gradient(circle at 86% 82%, rgba(86,120,179,0.20), transparent 34%), repeating-linear-gradient(180deg, rgba(82,109,161,0.06), rgba(82,109,161,0.06) 1px, transparent 1px, transparent 24px), repeating-radial-gradient(circle at 0 0, rgba(57,77,120,0.032), rgba(57,77,120,0.032) 1px, transparent 1px, transparent 5px), radial-gradient(circle at 52% -30%, rgba(255,255,255,0.82), rgba(255,255,255,0) 70%)',
    },
  },
  noir: {
    border: '#8f6f52',
    innerBorder: '#a7896e',
    text: '#422d1e',
    fade: '#d4b79a',
    shadow: '0 20px 42px rgba(43,23,14,0.34)',
    style: {
      backgroundColor: '#e2c29f',
      backgroundImage: 'radial-gradient(circle at 14% 14%, rgba(107,63,31,0.30), transparent 40%), radial-gradient(circle at 82% 88%, rgba(92,52,26,0.28), transparent 35%), radial-gradient(circle at 50% 104%, rgba(70,39,20,0.16), transparent 52%), repeating-linear-gradient(180deg, rgba(90,52,28,0.06), rgba(90,52,28,0.06) 1px, transparent 1px, transparent 22px), repeating-radial-gradient(circle at 0 0, rgba(75,42,22,0.035), rgba(75,42,22,0.035) 1px, transparent 1px, transparent 4px), radial-gradient(circle at 48% -36%, rgba(255,255,255,0.50), rgba(255,255,255,0) 70%)',
    },
  },
};

const EnvelopeRevealShell = ({
  hintText = 'Tap the wax seal to open ♥',
  openingHintText = 'Opening your letter...',
  letterPreviewText = 'A little preview from your letter...',
  backgroundStyle,
  floatingDecor = [],
  envelopeTheme,
  paperVariant = 'warm',
  letterPaperStyle,
  children,
}) => {
  const [state, setState] = useState('closed');
  const openTimerRef = useRef(null);
  const theme = envelopeTheme || DEFAULT_ENVELOPE;
  const paper = PAPER_VARIANTS[paperVariant] || PAPER_VARIANTS.warm;

  const isClosed = state === 'closed';
  const isOpening = state === 'opening';
  const isOpened = state === 'opened';

  useEffect(() => () => {
    if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
  }, []);

  const handleOpen = () => {
    if (!isClosed) return;
    setState('opening');
    openTimerRef.current = window.setTimeout(() => setState('opened'), 820);
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
              initial={{ y: -140, opacity: 0, scale: 0.92 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.18, duration: 0.82, ease: [0.34, 1.56, 0.64, 1] }}
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
                initial={{ y: 118, scale: 0.93, opacity: 0.94 }}
                animate={isOpening ? { y: [118, -164, -138], scale: [0.93, 1.04, 1.01], rotate: [0, -4.2, -1.4], opacity: [0.94, 1, 1] } : { y: 118, scale: 0.93, opacity: 0.94, rotate: 0 }}
                transition={isOpening ? { duration: 0.94, ease: ['easeOut', 'easeOut', 'easeInOut'], times: [0, 0.74, 1] } : { type: 'spring', stiffness: 170, damping: 17 }}
                className="absolute left-1/2 bottom-[72px] -translate-x-1/2 w-[250px] sm:w-[290px] h-[160px] sm:h-[182px] rounded-[12px] border overflow-hidden z-10"
                style={{ ...paper.style, ...letterPaperStyle, borderColor: paper.border, boxShadow: paper.shadow }}
              >
                <div className="absolute inset-0 opacity-50 pointer-events-none" style={{ background: 'linear-gradient(124deg, rgba(255,255,255,0.66), transparent 48%)' }} />
                <div className="absolute inset-[8px] rounded-[8px] border pointer-events-none" style={{ borderColor: paper.innerBorder }} />
                <div className="relative h-full px-5 py-4 text-left text-[13px] leading-[1.6] font-playfair font-medium overflow-y-auto pr-2" style={{ color: paper.text }}>
                  {letterPreviewText}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-7 pointer-events-none" style={{ background: `linear-gradient(to top, ${paper.fade}, transparent)` }} />
              </motion.div>

              <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[300px] sm:w-[350px] h-[196px] sm:h-[220px]">
                <div className="absolute inset-0 rounded-[18px] border shadow-[0_24px_44px_rgba(197,71,115,0.28)]" style={{ background: theme.body, borderColor: theme.border }} />
                <div className="absolute inset-x-0 bottom-0 h-[124px] sm:h-[136px] [clip-path:polygon(0_0,50%_85%,100%_0,100%_100%,0_100%)] rounded-b-[18px] z-[11]" style={{ background: theme.front }} />
                <div className="absolute inset-x-[12px] bottom-[10px] h-[1px] bg-white/45" />

                <motion.div
                  animate={isOpening ? { rotateX: -184, y: -8 } : { rotateX: 0, y: 0 }}
                  transition={{ duration: 0.68, ease: [0.2, 0.75, 0.22, 1] }}
                  className="absolute left-0 right-0 top-0 h-[118px] sm:h-[132px] origin-top [transform-style:preserve-3d] [perspective:1200px] z-[12]"
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
