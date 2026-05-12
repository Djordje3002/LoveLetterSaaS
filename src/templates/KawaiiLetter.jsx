import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { palettes, fonts, extractYouTubeId } from './palettes';

const GINGHAM_STYLE = {
  backgroundColor: '#fff6f6',
  backgroundImage:
    'repeating-linear-gradient(0deg, #f9dce3, #f9dce3 52px, #fff8ef 52px, #fff8ef 104px), repeating-linear-gradient(90deg, #f9dce3, #f9dce3 52px, #fff8ef 52px, #fff8ef 104px)',
};

const DOTTED_STYLE = {
  backgroundColor: '#fff9ef',
  backgroundImage:
    'radial-gradient(circle at 12px 12px, rgba(245, 169, 192, 0.34) 3px, transparent 3px)',
  backgroundSize: '42px 42px',
};

const linedPaperStyle = {
  backgroundColor: '#fffdf9',
  backgroundImage:
    'linear-gradient(to bottom, transparent 0, transparent 58px, #d8d0c8 60px, transparent 62px)',
  backgroundSize: '100% 62px',
  boxShadow: '0 22px 46px rgba(112, 87, 59, 0.16)',
};

const buildTypedLetter = ({ scenes, senderName, showSenderName }) => {
  const rawBody = String(scenes.letterText || '').trim();
  const hasGreetingInBody = /^\s*my\s+dearest/i.test(rawBody);
  const greeting = hasGreetingInBody ? '' : (scenes.letterGreeting || 'My dearest,');
  const bridge = String(scenes.scene3Header || '').trim();
  const closing = String(scenes.closingMessage || '').trim();
  const signature = showSenderName && senderName ? `— ${senderName}` : '';

  return [greeting, rawBody, bridge, closing, signature]
    .map((part) => String(part || '').trim())
    .filter(Boolean)
    .join('\n\n');
};

const KawaiiLetter = ({
  senderName,
  scenes = {},
  palette = 'pink',
  font = 'playful',
  showSenderName = true,
  showFooter = true,
  musicEnabled = false,
  musicUrl = '',
}) => {
  const [phase, setPhase] = useState('envelope'); // envelope | floral | letter
  const [flapOpen, setFlapOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [sealVisible, setSealVisible] = useState(true);
  const [burstKey, setBurstKey] = useState(0);

  const pal = palettes[palette] || palettes.pink;
  const fnt = fonts[font] || fonts.playful;
  const videoId = extractYouTubeId(musicUrl);

  const heading = scenes.scene2Header || 'A letter for you...';
  const typedLetter = useMemo(
    () => buildTypedLetter({ scenes, senderName, showSenderName }),
    [scenes, senderName, showSenderName]
  );

  useEffect(() => {
    if (phase !== 'floral') return undefined;
    const timer = window.setTimeout(() => setPhase('letter'), 820);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'letter') return undefined;
    setTypedText('');

    // Let the paper complete its entrance before revealing text.
    const startTimer = window.setTimeout(() => {
      setTypedText(typedLetter);
    }, 650);

    return () => window.clearTimeout(startTimer);
  }, [phase, typedLetter]);

  const handleOpen = useCallback(() => {
    if (flapOpen) return;
    setFlapOpen(true);
    setBurstKey((current) => current + 1);
    window.setTimeout(() => setSealVisible(false), 140);
    window.setTimeout(() => setPhase('floral'), 680);
  }, [flapOpen]);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ fontFamily: fnt.body }}>
      {musicEnabled && videoId ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0`}
          allow="autoplay"
          className="w-0 h-0 absolute opacity-0 pointer-events-none"
          title="kawaii-template-music"
        />
      ) : null}

      <AnimatePresence mode="wait">
        {phase === 'envelope' && (
          <motion.section
            key="envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen relative flex items-center justify-center px-4"
            style={GINGHAM_STYLE}
          >
            {[
              { id: 'flower', char: '🌼', className: 'top-[9%] left-[8%] text-5xl' },
              { id: 'star', char: '⭐', className: 'top-[8%] right-[7%] text-4xl' },
              { id: 'balloon', char: '🎈', className: 'bottom-[14%] left-[8%] text-5xl' },
              { id: 'cat', char: '🐱', className: 'bottom-[12%] right-[8%] text-5xl' },
              { id: 'wave', char: '〰️', className: 'left-[5%] top-1/2 -translate-y-1/2 text-4xl text-[#b5547f]' },
            ].map((item, index) => (
              <motion.span
                key={item.id}
                className={`absolute ${item.className}`}
                animate={{ y: [0, -6, 0], rotate: [0, -4, 4, 0] }}
                transition={{ duration: 4 + index * 0.35, repeat: Infinity, ease: 'easeInOut' }}
              >
                {item.char}
              </motion.span>
            ))}

            <div className="relative w-[min(86vw,520px)] max-w-[88%] h-[min(55vw,320px)]">
              <motion.div
                initial={{ y: -200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                className="relative w-full h-full"
              >
                <div className="absolute inset-0 rounded-[8px] bg-[#f3a8bd] border border-[#ec9bb2] shadow-[0_22px_38px_rgba(190,92,126,0.32)]" />
                <motion.div
                  animate={flapOpen ? { rotateX: -180 } : { rotateX: 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="absolute left-0 right-0 top-0 h-[58%] origin-top [transform-style:preserve-3d]"
                >
                  <div className="w-full h-full bg-[#ffd3df] [clip-path:polygon(0_0,100%_0,50%_100%)] rounded-t-[8px]" />
                </motion.div>
                <div className="absolute inset-y-0 left-0 w-1/2 bg-[#dc91aa] [clip-path:polygon(0_0,100%_50%,0_100%)]" />
                <div className="absolute inset-y-0 right-0 w-1/2 bg-[#dc91aa] [clip-path:polygon(100%_0,0_50%,100%_100%)]" />
                <div className="absolute left-0 right-0 bottom-0 h-[58%] bg-[#eba9bf] [clip-path:polygon(0_100%,50%_30%,100%_100%)]" />

                {sealVisible ? (
                  <motion.button
                    type="button"
                    onClick={handleOpen}
                    whileTap={{ scale: 0.95 }}
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 1.25, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 z-20 w-[74px] h-[74px] rounded-full bg-gradient-to-br from-[#cf226a] to-[#a61150] text-[#ffe0eb] text-3xl shadow-[0_12px_20px_rgba(97,18,52,0.42)]"
                  >
                    ♥
                  </motion.button>
                ) : null}
              </motion.div>

              {[...Array(12)].map((_, i) => (
                <motion.span
                  key={`${burstKey}-${i}`}
                  className="absolute left-1/2 top-1/2 text-[#ff4f8f] text-lg"
                  initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
                  animate={
                    flapOpen
                      ? {
                          opacity: [0, 1, 0],
                          scale: [0.2, 1, 0.6],
                          x: Math.cos((i / 12) * Math.PI * 2) * (68 + (i % 3) * 16),
                          y: Math.sin((i / 12) * Math.PI * 2) * (54 + (i % 4) * 12),
                        }
                      : { opacity: 0 }
                  }
                  transition={{ duration: 0.72, ease: 'easeOut' }}
                >
                  ✦
                </motion.span>
              ))}

              <p className="absolute -bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-[2rem] text-[#b00d5f] font-semibold font-dancing">
                {scenes.hint || 'Tap seal to open ♥'}
              </p>
            </div>
          </motion.section>
        )}

        {phase === 'floral' && (
          <motion.section
            key="floral"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen relative overflow-hidden"
            style={GINGHAM_STYLE}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
              animate={{ opacity: 0.95, scale: 1.07, filter: 'blur(0px)' }}
              transition={{ duration: 0.78, ease: 'easeOut' }}
              style={{
                background:
                  'radial-gradient(circle at 50% 48%, rgba(255,248,226,0.92) 0%, rgba(249,223,231,0.75) 36%, rgba(242,190,211,0.68) 56%, rgba(255,236,243,0.58) 78%)',
              }}
            />
            <motion.div
              className="absolute inset-0 opacity-85"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ duration: 0.4 }}
              style={{
                backgroundImage:
                  'radial-gradient(closest-side at 20% 35%, rgba(255,230,236,0.9), transparent), radial-gradient(closest-side at 82% 28%, rgba(255,246,220,0.85), transparent), radial-gradient(closest-side at 52% 66%, rgba(255,212,230,0.88), transparent)',
              }}
            />
          </motion.section>
        )}

        {phase === 'letter' && (
          <motion.section
            key="letter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen relative overflow-x-hidden px-3 py-6 sm:py-10"
            style={DOTTED_STYLE}
          >
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-8 md:pt-12 text-center text-[2.35rem] sm:text-[2.7rem] md:text-[4rem] leading-none text-[#b30553] font-dancing font-bold relative z-10"
            >
              {heading}
            </motion.h1>

            <span className="absolute top-[13%] left-[17%] text-6xl text-[#dc8eb3] rotate-[-8deg]">♥</span>
            <span className="absolute bottom-[11%] right-[20%] text-5xl text-[#dc8eb3] rotate-[10deg]">♥</span>
            <span className="absolute bottom-[7%] right-[8%] text-5xl">🌼</span>
            <span className="absolute bottom-[7%] left-[8%] text-5xl rotate-[10deg] opacity-80">🗒️</span>

            <motion.div
              initial={{ y: 220, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.54, ease: [0.21, 0.85, 0.24, 1] }}
              className="mx-auto mt-6 sm:mt-8 w-[min(92vw,860px)] min-h-[78vh] rounded-[14px] border border-[#ddd3c7] overflow-hidden relative"
              style={linedPaperStyle}
            >
              <div className="absolute -top-[8px] left-1/2 -translate-x-1/2 w-24 h-8 bg-white/90 rotate-[2deg] border border-[#e8e1d7] shadow-sm" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fbf7ee]/75 pointer-events-none" />
              <div className="absolute left-[28px] top-0 bottom-0 w-[2px] bg-[#e5bcc6]" />

              <div className="relative px-9 sm:px-14 py-14 sm:py-16">
                <p
                  className="font-dancing text-[#2b1a20] text-[1.55rem] sm:text-[2rem] leading-[1.52] whitespace-pre-line text-left"
                  style={{ fontFamily: "'Dancing Script', 'Great Vibes', cursive", fontWeight: 700, letterSpacing: '0.01em' }}
                >
                  {typedText}
                </p>
              </div>
            </motion.div>

            {showFooter ? (
              <div className="text-center mt-6">
                <p className="text-xs uppercase tracking-widest font-black" style={{ color: `${pal.primary}B3` }}>
                  made with LovePage ♥
                </p>
              </div>
            ) : null}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KawaiiLetter;
