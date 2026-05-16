import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
    'linear-gradient(to bottom, transparent 0, transparent 56px, rgba(198,177,158,0.55) 57px, transparent 59px)',
  backgroundSize: '100% 62px',
  boxShadow: '0 24px 58px rgba(112, 87, 59, 0.18)',
};

const MEMORY_CARD_POSITIONS = [
  { x: '7%', y: '8%', rotate: -7 },
  { x: '58%', y: '7%', rotate: 6 },
  { x: '11%', y: '37%', rotate: -3 },
  { x: '61%', y: '36%', rotate: 8 },
  { x: '34%', y: '61%', rotate: -5 },
];

const normalize = (value, fallback) => {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  return text || fallback;
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
  recipientName,
  senderName,
  scenes = {},
  palette = 'pink',
  font = 'playful',
  showSenderName = true,
  showFooter = true,
  musicEnabled = false,
  musicUrl = '',
}) => {
  const [phase, setPhase] = useState('envelope'); // envelope | floral | letter | memories | final
  const [flapOpen, setFlapOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [sealVisible, setSealVisible] = useState(true);
  const [burstKey, setBurstKey] = useState(0);
  const memoryAreaRef = useRef(null);

  const pal = palettes[palette] || palettes.pink;
  const fnt = fonts[font] || fonts.playful;
  const videoId = extractYouTubeId(musicUrl);

  const heading = normalize(scenes.scene2Header, 'My sweetest letter to you');
  const memoriesTitle = normalize(scenes.memoriesTitle || scenes.scene3Header, 'Our favorite memories');
  const memoriesButtonLabel = normalize(scenes.memoriesButtonLabel, 'See our memories');
  const finalButtonLabel = normalize(scenes.finalButtonLabel, 'Read the last note');
  const finalTitle = normalize(
    scenes.finalTitle,
    recipientName ? `For ${recipientName}, always` : 'For you, always'
  );
  const finalMessage = normalize(
    scenes.finalMessage,
    'Every little piece of this page is here for one reason: you are loved, deeply and completely.'
  );
  const typedLetter = useMemo(
    () => buildTypedLetter({ scenes, senderName, showSenderName }),
    [scenes, senderName, showSenderName]
  );
  const memoryCards = useMemo(() => {
    const uploadedCards = [1, 2, 3, 4, 5]
      .map((slot) => ({
        id: slot,
        imageUrl: String(scenes[`photo${slot}Url`] || '').trim(),
        caption: normalize(scenes[`polaroidCaption${slot}`], `Memory ${slot}`),
      }))
      .filter((card) => Boolean(card.imageUrl));

    return uploadedCards.map((card, idx) => ({
      ...card,
      ...MEMORY_CARD_POSITIONS[idx % MEMORY_CARD_POSITIONS.length],
    }));
  }, [scenes]);

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
	              { id: 'soft-heart', char: '♡', className: 'top-[9%] left-[8%] text-6xl text-[#c66a8f]' },
	              { id: 'spark', char: '✦', className: 'top-[9%] right-[8%] text-4xl text-[#c66a8f]' },
	              { id: 'bloom', char: '✿', className: 'bottom-[14%] left-[9%] text-5xl text-[#d98da9]' },
	              { id: 'small-heart', char: '♥', className: 'bottom-[12%] right-[10%] text-5xl text-[#b30553]' },
	              { id: 'ribbon', char: '—', className: 'left-[6%] top-1/2 -translate-y-1/2 text-6xl text-[#b5547f]' },
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

            <div className="w-[min(94vw,620px)] max-w-full flex flex-col items-center gap-4">
              <div className="relative w-[min(86vw,520px)] max-w-[92%] h-[min(55vw,320px)]">
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
              </div>

              <p className="w-full px-4 text-center text-[clamp(1.05rem,4.8vw,1.9rem)] leading-tight text-[#b00d5f] font-semibold font-dancing break-words">
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
	              className="pt-8 md:pt-12 px-2 text-center text-[2.1rem] sm:text-[2.7rem] md:text-[4rem] leading-[0.95] text-[#9f164d] font-dancing font-bold relative z-10 break-words"
	            >
	              {heading}
	            </motion.h1>

	            <span className="absolute top-[13%] left-[17%] text-6xl text-[#dc8eb3] rotate-[-8deg]">♥</span>
	            <span className="absolute bottom-[11%] right-[20%] text-5xl text-[#dc8eb3] rotate-[10deg]">♥</span>
	            <span className="absolute bottom-[7%] right-[8%] text-5xl">✿</span>
	            <span className="absolute bottom-[7%] left-[8%] text-5xl rotate-[10deg] opacity-80">♡</span>

	            <motion.div
	              initial={{ y: 220, opacity: 0 }}
	              animate={{ y: 0, opacity: 1 }}
	              transition={{ duration: 0.54, ease: [0.21, 0.85, 0.24, 1] }}
	              className="mx-auto mt-6 sm:mt-8 w-[min(92vw,860px)] min-h-[72vh] rounded-[18px] border border-[#ded2c5] overflow-hidden relative"
	              style={linedPaperStyle}
	            >
	              <div className="absolute -top-[8px] left-1/2 -translate-x-1/2 w-24 h-8 bg-white/90 rotate-[2deg] border border-[#e8e1d7] shadow-sm" />
	              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fbf7ee]/65 pointer-events-none" />
	              <div className="absolute left-[28px] top-0 bottom-0 w-[2px] bg-[#e5bcc6]" />

	              <div className="relative px-9 sm:px-14 py-14 sm:py-16">
	                <p
	                  className="font-dancing text-[#2b1a20] text-[1.45rem] sm:text-[1.85rem] leading-[1.6] whitespace-pre-line text-left"
	                  style={{ fontFamily: "'Dancing Script', 'Great Vibes', cursive", fontWeight: 700, letterSpacing: '0.01em' }}
	                >
	                  {typedText}
	                </p>
	              </div>
	            </motion.div>

	            <div className="text-center mt-7 relative z-10">
	              <button
	                type="button"
	                onClick={() => setPhase('memories')}
	                className="inline-flex items-center justify-center rounded-full bg-[#b30553] px-7 py-3 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_14px_24px_rgba(179,5,83,0.22)]"
	              >
	                {memoriesButtonLabel}
	              </button>
	            </div>

	            {showFooter ? (
	              <div className="text-center mt-6">
	                <p className="text-xs uppercase tracking-widest font-black" style={{ color: `${pal.primary}B3` }}>
	                  made with LovePage ♥
	                </p>
	              </div>
	            ) : null}
	          </motion.section>
	        )}

	        {phase === 'memories' && (
	          <motion.section
	            key="memories"
	            initial={{ opacity: 0, y: 16 }}
	            animate={{ opacity: 1, y: 0 }}
	            exit={{ opacity: 0, y: -16 }}
	            className="min-h-screen px-4 py-8 sm:py-10 relative overflow-hidden"
	            style={{
	              backgroundColor: '#fff8f2',
	              backgroundImage:
	                'linear-gradient(180deg, rgba(255,248,242,0.96), rgba(255,240,246,0.92)), radial-gradient(circle at 18% 18%, rgba(250,200,214,0.32), transparent 38%)',
	            }}
	          >
	            <div className="max-w-5xl mx-auto">
	              <p className="text-center text-xs uppercase tracking-[0.3em] font-black mb-3 text-[#a14a62]">memory notes</p>
	              <h2 className="text-center text-3xl md:text-5xl font-black mb-8 text-[#2b1a20] break-words px-2" style={{ fontFamily: fnt.heading }}>
	                {memoriesTitle}
	              </h2>

	              <div
	                ref={memoryAreaRef}
	                className="relative w-full min-h-[64vh] rounded-[28px] border border-[#efd7c9] bg-white/80 overflow-hidden shadow-[0_18px_42px_rgba(122,82,58,0.12)]"
	              >
	                <div className="absolute inset-x-0 top-0 h-16 bg-[#f9dce3]/45" />
	                <div className="absolute left-6 top-6 h-10 w-10 rounded-full border border-[#e8c4ce] bg-[#fff8f2]" />
	                <div className="absolute right-7 bottom-7 text-5xl text-[#e7a6bb]">♡</div>
                {memoryCards.length > 0 ? (
                  memoryCards.map((card) => (
                    <motion.div
                      key={card.id}
                      drag
                      dragConstraints={memoryAreaRef}
                      dragElastic={0.18}
                      whileTap={{ scale: 1.03, cursor: 'grabbing' }}
                      className="absolute w-[43%] sm:w-[30%] max-w-[210px] bg-white rounded-2xl border border-[#f1dfd1] shadow-[0_16px_28px_rgba(146,86,64,0.16)] p-2 cursor-grab"
                      style={{ left: card.x, top: card.y, rotate: `${card.rotate}deg` }}
                    >
                      <div className="h-28 sm:h-32 rounded-xl overflow-hidden bg-[#f7e3cf]">
                        <img src={card.imageUrl} alt={card.caption} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[11px] sm:text-xs text-center mt-2 font-semibold text-[#6d3e2f]">
                        {card.caption}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                    <p className="text-sm font-semibold text-[#8f6473]">
                      No photos uploaded yet. Add up to 5 memories in the editor.
                    </p>
                  </div>
                )}
              </div>

	              <div className="text-center mt-8">
	                <button
	                  type="button"
	                  onClick={() => setPhase('final')}
	                  className="inline-flex items-center justify-center rounded-full bg-[#b30553] px-8 py-3 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_14px_24px_rgba(179,5,83,0.22)]"
	                >
	                  {finalButtonLabel}
	                </button>
	              </div>
	            </div>
	          </motion.section>
	        )}

	        {phase === 'final' && (
	          <motion.section
	            key="final"
	            initial={{ opacity: 0, y: 16 }}
	            animate={{ opacity: 1, y: 0 }}
	            className="min-h-screen px-5 py-12 relative overflow-hidden flex flex-col items-center justify-center text-center"
	            style={DOTTED_STYLE}
	          >
	            <div className="absolute top-[12%] left-[12%] text-6xl text-[#e2a0b4] rotate-[-10deg]">♡</div>
	            <div className="absolute bottom-[12%] right-[12%] text-6xl text-[#e2a0b4] rotate-[8deg]">♥</div>
	            <div className="relative z-10 max-w-2xl rounded-[28px] border border-[#efbfd0] bg-white/95 px-8 py-12 shadow-[0_24px_48px_rgba(148,55,88,0.18)]">
	              <p className="text-xs uppercase tracking-[0.32em] font-black mb-4 text-[#a73a62]">last note</p>
	              <h3 className="text-3xl sm:text-4xl md:text-5xl leading-tight font-black mb-5 text-[#2b1a20] break-words" style={{ fontFamily: fnt.heading }}>
	                {finalTitle}
	              </h3>
	              <p className="text-[#6c4050] text-lg leading-8 whitespace-pre-line">{finalMessage}</p>
	              {showSenderName && senderName ? (
	                <p className="mt-8 font-dancing text-4xl text-[#b30553]">- {senderName}</p>
	              ) : null}
	            </div>

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
