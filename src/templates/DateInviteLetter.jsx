import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import { palettes, fonts, extractYouTubeId } from './palettes';

const DEFAULT_CONFESSIONS = [
  {
    title: 'First confession',
    text: 'Your smile resets my whole day.',
  },
  {
    title: 'Second confession',
    text: 'You make ordinary moments feel cinematic.',
  },
  {
    title: 'Third confession',
    text: 'I still get excited every time your name appears.',
  },
  {
    title: 'Fourth confession',
    text: 'My calmest place is right next to you.',
  },
  {
    title: 'Fifth confession',
    text: 'You are my favorite person to celebrate life with.',
  },
  {
    title: 'Last confession',
    text: 'I like you. A lot. Maybe forever.',
  },
];

const MEMORY_CARD_POSITIONS = [
  { x: '8%', y: '8%', rotate: -8 },
  { x: '58%', y: '6%', rotate: 7 },
  { x: '14%', y: '38%', rotate: -4 },
  { x: '60%', y: '36%', rotate: 9 },
  { x: '33%', y: '60%', rotate: -6 },
];

const STICKERS = [
  { id: 'star', char: '⭐', className: 'top-[9%] right-[9%]' },
  { id: 'flower', char: '🌼', className: 'top-[10%] left-[9%]' },
  { id: 'wave', char: '〰️', className: 'top-[44%] left-[6%]' },
  { id: 'balloons', char: '🎈', className: 'bottom-[11%] left-[8%]' },
  { id: 'cat', char: '🐱', className: 'bottom-[11%] right-[8%]' },
];

const normalize = (value, fallback) => {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  return text || fallback;
};

const toConfession = (scenes, index) => ({
  title: normalize(scenes[`confession${index}Title`], DEFAULT_CONFESSIONS[index - 1].title),
  text: normalize(scenes[`confession${index}Text`], DEFAULT_CONFESSIONS[index - 1].text),
});

const DateInviteLetter = ({
  recipientName,
  senderName,
  scenes = {},
  palette = 'pink',
  font = 'elegant',
  showSenderName = true,
  showFooter = true,
  musicEnabled = false,
  musicUrl = '',
}) => {
  const pal = palettes[palette] || palettes.pink;
  const fnt = fonts[font] || fonts.elegant;
  const videoId = extractYouTubeId(musicUrl);
  const memoryAreaRef = useRef(null);

  const [phase, setPhase] = useState('intro');
  const [flapOpen, setFlapOpen] = useState(false);
  const [sealVisible, setSealVisible] = useState(true);
  const [burstKey, setBurstKey] = useState(0);
  const [revealedMap, setRevealedMap] = useState({});
  const [noButtonPos, setNoButtonPos] = useState({ x: 72, y: 72 });
  const [noAttempts, setNoAttempts] = useState(0);
  const [tauntIndex, setTauntIndex] = useState(0);

  const introLine = normalize(scenes.introLine, "There's something I have been wanting to ask...");
  const confessionTitle = normalize(scenes.confessionTitle, 'But first, let me tell you...');
  const memoriesTitle = normalize(scenes.memoriesTitle, 'Remember these?');
  const questionTitle = normalize(scenes.questionTitle, 'Will you be my Valentine?');
  const questionSubtitle = normalize(
    scenes.questionSubtitle,
    'A playful yes means everything to me.'
  );
  const yesLabel = normalize(scenes.yesLabel, 'Yes, absolutely');
  const noLabel = normalize(scenes.noLabel, 'No');
  const celebrationTitle = normalize(scenes.celebrationTitle, "I knew you would say yes!");
  const celebrationText = normalize(
    scenes.celebrationText,
    'Now we celebrate this moment and make it unforgettable.'
  );
  const openHint = normalize(scenes.hint, 'Tap seal to open');
  const continueLabel = normalize(scenes.continueLabel, 'Continue');
  const questionCta = normalize(scenes.questionCta, 'Ask the question');

  const taunts = [
    normalize(scenes.noTaunt1, 'Are you sure?'),
    normalize(scenes.noTaunt2, 'Nice try 😏'),
    normalize(scenes.noTaunt3, "I can wait all day 💘"),
  ];

  const confessions = useMemo(
    () => Array.from({ length: 6 }, (_, idx) => toConfession(scenes, idx + 1)),
    [scenes]
  );

  const memoryCards = useMemo(
    () =>
      [1, 2, 3, 4, 5].map((slot, idx) => ({
        id: slot,
        imageUrl: scenes[`photo${slot}Url`] || '',
        caption: normalize(scenes[`polaroidCaption${slot}`], `Memory ${slot}`),
        ...MEMORY_CARD_POSITIONS[idx],
      })),
    [scenes]
  );

  useEffect(() => {
    if (phase !== 'intro') return undefined;
    const timer = window.setTimeout(() => setPhase('envelope'), 1500);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const triggerFloralTransition = useCallback(() => {
    window.setTimeout(() => setSealVisible(false), 130);
    window.setTimeout(() => setPhase('floral'), 680);
  }, []);

  const openEnvelope = useCallback(() => {
    if (phase !== 'envelope' || flapOpen) return;
    setFlapOpen(true);
    setBurstKey((current) => current + 1);
    triggerFloralTransition();
  }, [flapOpen, phase, triggerFloralTransition]);

  useEffect(() => {
    if (phase !== 'envelope' || flapOpen) return undefined;
    const autoOpen = window.setTimeout(openEnvelope, 5000);
    return () => window.clearTimeout(autoOpen);
  }, [phase, flapOpen, openEnvelope]);

  useEffect(() => {
    if (phase !== 'floral') return undefined;
    const timer = window.setTimeout(() => setPhase('confessions'), 900);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const revealConfession = (index) => {
    setRevealedMap((current) => ({ ...current, [index]: true }));
  };

  const moveNoButton = useCallback(() => {
    if (!memoryAreaRef.current) return;
    const nextX = 16 + Math.random() * 68;
    const nextY = 34 + Math.random() * 52;
    setNoButtonPos({ x: nextX, y: nextY });
    setNoAttempts((current) => current + 1);
    setTauntIndex((current) => (current + 1) % taunts.length);
  }, [taunts.length]);

  const launchConfetti = useCallback(() => {
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { x: 0.5, y: 0.64 },
      colors: ['#F43F73', '#CC2D9A', '#FFD6E7', '#FFD166'],
    });
    window.setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 75,
        origin: { x: 0.45, y: 0.62 },
        colors: ['#F43F73', '#CC2D9A', '#FFE9F2'],
      });
    }, 220);
  }, []);

  const acceptLove = () => {
    setPhase('celebration');
    launchConfetti();
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ fontFamily: fnt.body, backgroundColor: pal.bg }}>
      {musicEnabled && videoId ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0`}
          allow="autoplay"
          className="w-0 h-0 absolute opacity-0 pointer-events-none"
          title="valentine-template-music"
        />
      ) : null}

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.section
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen px-6 py-16 flex items-center justify-center text-center relative"
            style={{ backgroundColor: '#FDF0E8' }}
          >
            {[...Array(12)].map((_, i) => (
              <motion.span
                key={`heart-bg-${i}`}
                className="absolute text-4xl text-[#f5b9c8]/35"
                style={{
                  left: `${8 + ((i * 17) % 82)}%`,
                  top: `${8 + ((i * 13) % 82)}%`,
                }}
                animate={{ opacity: [0.18, 0.36, 0.18], scale: [0.9, 1.07, 0.9] }}
                transition={{ duration: 3.2 + (i % 4), repeat: Infinity, delay: i * 0.1 }}
              >
                ♥
              </motion.span>
            ))}
            <div className="relative z-10 max-w-xl mx-auto">
              <p className="text-xs uppercase tracking-[0.35em] font-black mb-5" style={{ color: '#bb3b67' }}>
                Valentine Reveal
              </p>
              <h1 className="text-4xl md:text-6xl leading-tight font-black" style={{ color: '#2e1c22', fontFamily: fnt.heading }}>
                {introLine}
              </h1>
            </div>
          </motion.section>
        )}

        {phase === 'envelope' && (
          <motion.section
            key="envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-8"
            style={{
              backgroundColor: '#fff8f8',
              backgroundImage:
                'repeating-linear-gradient(0deg, #f8d5dd, #f8d5dd 52px, #fff8ef 52px, #fff8ef 104px), repeating-linear-gradient(90deg, #f8d5dd, #f8d5dd 52px, #fff8ef 52px, #fff8ef 104px)',
            }}
          >
            {STICKERS.map((item, idx) => (
              <motion.span
                key={item.id}
                className={`absolute ${item.className} text-5xl`}
                animate={{ y: [0, -6, 0], rotate: [0, -4, 4, 0] }}
                transition={{ duration: 4 + idx * 0.45, repeat: Infinity, ease: 'easeInOut' }}
              >
                {item.char}
              </motion.span>
            ))}

            <div className="relative w-[min(86vw,520px)] h-[min(55vw,320px)]">
              <motion.div
                initial={{ y: -200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                className="relative w-full h-full"
              >
                <div className="absolute inset-0 rounded-[8px] shadow-[0_22px_38px_rgba(174,83,117,0.35)] bg-[#f4a7b9] border border-[#eb9bb0]" />
                <motion.div
                  animate={flapOpen ? { rotateX: -180 } : { rotateX: 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="absolute left-0 right-0 top-0 h-[58%] origin-top [transform-style:preserve-3d]"
                >
                  <div className="w-full h-full bg-[#f9cfdb] [clip-path:polygon(0_0,100%_0,50%_100%)] rounded-t-[8px]" />
                </motion.div>
                <div className="absolute inset-y-0 left-0 w-1/2 bg-[#d58fa4] [clip-path:polygon(0_0,100%_50%,0_100%)]" />
                <div className="absolute inset-y-0 right-0 w-1/2 bg-[#d58fa4] [clip-path:polygon(100%_0,0_50%,100%_100%)]" />
                <div className="absolute left-0 right-0 bottom-0 h-[58%] bg-[#e8a8bc] [clip-path:polygon(0_100%,50%_30%,100%_100%)]" />

                {sealVisible ? (
                  <motion.button
                    type="button"
                    onClick={openEnvelope}
                    className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 z-20 w-[74px] h-[74px] rounded-full bg-[#9B2335] text-white text-3xl shadow-[0_12px_20px_rgba(90,20,30,0.45)]"
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 1.25, repeat: Infinity, ease: 'easeInOut' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ♥
                  </motion.button>
                ) : null}
              </motion.div>

              {[...Array(12)].map((_, i) => (
                <motion.span
                  key={`${burstKey}-${i}`}
                  className="absolute left-1/2 top-1/2 text-[#ff4f8f]"
                  initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
                  animate={
                    flapOpen
                      ? {
                          opacity: [0, 1, 0],
                          scale: [0.2, 1, 0.6],
                          x: Math.cos((i / 12) * Math.PI * 2) * (70 + (i % 3) * 18),
                          y: Math.sin((i / 12) * Math.PI * 2) * (58 + (i % 4) * 14),
                        }
                      : { opacity: 0 }
                  }
                  transition={{ duration: 0.72, ease: 'easeOut' }}
                >
                  ✦
                </motion.span>
              ))}
            </div>

            <p className="absolute bottom-[15%] text-[2rem] text-[#941c47] font-dancing font-bold">
              {openHint} ♥
            </p>
          </motion.section>
        )}

        {phase === 'floral' && (
          <motion.section
            key="floral"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1.05, filter: 'blur(8px)' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{
                background:
                  'radial-gradient(circle, #FFC0CB 0%, #FFE4E1 45%, #FFF0F5 100%)',
              }}
            />
          </motion.section>
        )}

        {phase === 'confessions' && (
          <motion.section
            key="confessions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="min-h-screen px-4 py-8 sm:py-12 relative overflow-hidden"
            style={{
              backgroundColor: '#fff6f9',
              backgroundImage:
                'radial-gradient(circle at 20% 18%, rgba(245,105,152,0.12), transparent 40%), radial-gradient(circle at 80% 18%, rgba(255,188,206,0.18), transparent 42%), radial-gradient(circle at 50% 90%, rgba(255,255,255,0.7), transparent 52%)',
            }}
          >
            <div className="max-w-4xl mx-auto">
              <p className="text-center text-xs uppercase tracking-[0.3em] font-black mb-3 text-[#b22d5e]">Scene 1</p>
              <h2 className="text-center text-3xl md:text-5xl font-black mb-8 text-[#34161f]" style={{ fontFamily: fnt.heading }}>
                {confessionTitle}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {confessions.map((confession, index) => {
                  const isRevealed = Boolean(revealedMap[index]);
                  return (
                    <motion.button
                      key={`${confession.title}-${index}`}
                      type="button"
                      onClick={() => revealConfession(index)}
                      whileTap={{ scale: 0.98 }}
                      className={`rounded-2xl p-5 text-left shadow-md border transition-all ${
                        isRevealed
                          ? 'bg-white border-[#efbfd0]'
                          : 'bg-[#ffd9e6] border-[#f4adc7] hover:-translate-y-0.5'
                      }`}
                    >
                      <p className="text-xs uppercase tracking-[0.2em] font-black mb-2 text-[#ac2758]">
                        {isRevealed ? confession.title : `Tap ${index + 1}`}
                      </p>
                      <p className={`text-sm leading-6 ${isRevealed ? 'text-[#43222e]' : 'text-[#912756]'}`}>
                        {isRevealed ? confession.text : 'Tap this card to reveal a confession.'}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
              <div className="text-center mt-9">
                <button
                  type="button"
                  onClick={() => setPhase('memories')}
                  className="inline-flex items-center justify-center px-8 py-3 rounded-full text-white font-black uppercase tracking-[0.12em] hover:scale-[1.02] transition-transform"
                  style={{ backgroundColor: pal.primary }}
                >
                  {continueLabel}
                </button>
              </div>
            </div>
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
                'radial-gradient(circle at 18% 20%, rgba(250,200,214,0.28), transparent 40%), radial-gradient(circle at 80% 16%, rgba(255,220,178,0.28), transparent 40%), radial-gradient(circle at 52% 85%, rgba(255,255,255,0.9), transparent 56%)',
            }}
          >
            <div className="max-w-5xl mx-auto">
              <p className="text-center text-xs uppercase tracking-[0.3em] font-black mb-3 text-[#b6663a]">Scene 2</p>
              <h2 className="text-center text-3xl md:text-5xl font-black mb-8 text-[#3a241c]" style={{ fontFamily: fnt.heading }}>
                {memoriesTitle}
              </h2>
              <div
                ref={memoryAreaRef}
                className="relative w-full min-h-[64vh] rounded-[28px] border border-[#f2d6c3] bg-white/75 backdrop-blur-sm overflow-hidden"
              >
                {memoryCards.map((card) => (
                  <motion.div
                    key={card.id}
                    drag
                    dragConstraints={memoryAreaRef}
                    dragElastic={0.18}
                    whileTap={{ scale: 1.03, cursor: 'grabbing' }}
                    className="absolute w-[42%] sm:w-[30%] max-w-[210px] bg-white rounded-2xl border border-[#f1dfd1] shadow-[0_16px_28px_rgba(146,86,64,0.16)] p-2 cursor-grab"
                    style={{ left: card.x, top: card.y, rotate: `${card.rotate}deg` }}
                  >
                    <div className="h-28 sm:h-32 rounded-xl overflow-hidden bg-[#f7e3cf]">
                      {card.imageUrl ? (
                        <img src={card.imageUrl} alt={card.caption} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">💖</div>
                      )}
                    </div>
                    <p className="text-[11px] sm:text-xs text-center mt-2 font-semibold text-[#6d3e2f]">
                      {card.caption}
                    </p>
                  </motion.div>
                ))}
              </div>
              <div className="text-center mt-8">
                <button
                  type="button"
                  onClick={() => setPhase('question')}
                  className="inline-flex items-center justify-center px-8 py-3 rounded-full text-white font-black uppercase tracking-[0.12em] hover:scale-[1.02] transition-transform"
                  style={{ backgroundColor: pal.primary }}
                >
                  {questionCta}
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {phase === 'question' && (
          <motion.section
            key="question"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="min-h-screen px-5 py-10 relative overflow-hidden"
            style={{
              backgroundColor: '#fff2f7',
              backgroundImage:
                'radial-gradient(circle at 50% 0%, rgba(244,63,115,0.14), transparent 44%), radial-gradient(circle at 88% 84%, rgba(255,178,204,0.22), transparent 40%)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-5 left-5 rounded-2xl border border-[#f1b6c9] bg-white/95 px-4 py-2.5 shadow-sm"
            >
              <p className="text-sm font-bold text-[#8e2f51]">{taunts[tauntIndex]}</p>
            </motion.div>

            <div className="max-w-3xl mx-auto text-center mt-16">
              <p className="text-xs uppercase tracking-[0.3em] font-black mb-3 text-[#b22d5e]">Final Scene</p>
              <h2 className="text-4xl md:text-6xl font-black mb-4 text-[#2f1821]" style={{ fontFamily: fnt.heading }}>
                {questionTitle}
              </h2>
              <p className="text-[#7d4a5b] text-lg mb-10">{questionSubtitle}</p>
            </div>

            <div className="relative max-w-3xl mx-auto h-[54vh] rounded-[30px] border border-[#f6c8d8] bg-white/80" ref={memoryAreaRef}>
              <motion.button
                type="button"
                onClick={acceptLove}
                whileTap={{ scale: 0.96 }}
                className="absolute left-1/2 top-[40%] -translate-x-1/2 px-10 py-4 rounded-full text-white font-black text-lg shadow-[0_14px_22px_rgba(219,62,118,0.35)]"
                style={{ backgroundColor: pal.primary }}
              >
                {yesLabel}
              </motion.button>

              <motion.button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  moveNoButton();
                }}
                onMouseEnter={moveNoButton}
                onTouchStart={(event) => {
                  event.preventDefault();
                  moveNoButton();
                }}
                animate={{ left: `${noButtonPos.x}%`, top: `${noButtonPos.y}%` }}
                transition={{ type: 'spring', stiffness: 250, damping: 18 }}
                className="absolute -translate-x-1/2 -translate-y-1/2 px-6 py-3 rounded-full border-2 font-black bg-white shadow-sm"
                style={{ borderColor: pal.primary, color: pal.primary }}
              >
                {noLabel}
              </motion.button>
            </div>
          </motion.section>
        )}

        {phase === 'celebration' && (
          <motion.section
            key="celebration"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen px-6 py-16 relative overflow-hidden flex flex-col items-center justify-center text-center"
            style={{
              background:
                'radial-gradient(circle at 50% 0%, #ffe7f0 0%, #ffd7e9 45%, #ffc5dd 100%)',
            }}
          >
            {[...Array(22)].map((_, i) => (
              <motion.span
                key={`final-heart-${i}`}
                className="absolute text-2xl"
                style={{ left: `${(i * 9) % 100}%`, top: `${(i * 17) % 100}%` }}
                animate={{ y: [0, -28, 0], opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 3 + (i % 4) * 0.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                💖
              </motion.span>
            ))}

            <div className="relative z-10 max-w-2xl rounded-[28px] border border-[#f2acc5] bg-white/90 backdrop-blur-sm px-8 py-12 shadow-[0_24px_44px_rgba(173,61,108,0.24)]">
              <p className="text-xs uppercase tracking-[0.32em] font-black mb-4 text-[#b02e60]">
                You said yes
              </p>
              <h3 className="text-4xl md:text-5xl font-black mb-4 text-[#371923]" style={{ fontFamily: fnt.heading }}>
                {celebrationTitle}
              </h3>
              <p className="text-[#734155] text-lg leading-8 mb-6">{celebrationText}</p>
              {showSenderName && senderName ? (
                <p className="font-dancing text-4xl" style={{ color: pal.primary }}>- {senderName}</p>
              ) : null}
              {recipientName ? (
                <p className="text-xs uppercase tracking-[0.26em] font-black mt-4 text-[#b96283]">
                  Made for {recipientName}
                </p>
              ) : null}
            </div>

            {noAttempts > 0 ? (
              <p className="relative z-10 mt-6 text-sm font-bold text-[#8f4161]">
                Escape attempts dodged: {noAttempts}
              </p>
            ) : null}
          </motion.section>
        )}
      </AnimatePresence>

      {showFooter ? (
        <div className="pointer-events-none fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
          <p className="text-[10px] uppercase tracking-[0.25em] font-black" style={{ color: `${pal.primary}99` }}>made with LovePage</p>
        </div>
      ) : null}
    </div>
  );
};

export default DateInviteLetter;
