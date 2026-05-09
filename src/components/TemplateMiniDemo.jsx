import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const loops = {
  float: {
    animate: { y: [0, -9, 0], rotate: [0, -1.8, 1.2, 0] },
    transition: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
  },
  open: {
    animate: { rotateX: [0, 0, -172, -172, 0], y: [0, 0, -6, -6, 0] },
    transition: { duration: 5.2, repeat: Infinity, ease: 'easeInOut', times: [0, 0.2, 0.38, 0.74, 1] },
  },
  letter: {
    animate: { y: [34, 34, -54, -40, 34], scale: [0.96, 0.96, 1.06, 1.02, 0.96], rotate: [0, 0, -2, -1, 0] },
    transition: { duration: 5.2, repeat: Infinity, ease: 'easeInOut', times: [0, 0.2, 0.38, 0.74, 1] },
  },
};

const EnvelopeDemo = ({ mood = 'kawaii', interactive = false, onRevealChange }) => {
  const themes = {
    kawaii: {
      bg: 'bg-gingham',
      body: 'from-[#ffe9f0] via-[#ffd4e1] to-[#f4a6bc]',
      front: 'from-[#f7bdcd] via-[#ffe0e8] to-[#f0a8bd]',
      seal: 'from-[#f65287] to-[#d93467]',
      text: 'text-[#b93268]',
      label: 'tap to open',
      decor: ['top-3 left-4|🌸', 'top-4 right-5|⭐', 'bottom-4 left-6|🎈', 'bottom-4 right-5|🐱'],
    },
    dark: {
      bg: 'bg-[#160d0b]',
      body: 'from-[#3a241b] via-[#241610] to-[#110b08]',
      front: 'from-[#2b1a13] via-[#1a100c] to-[#332018]',
      seal: 'from-[#8b1d31] to-[#4d0b18]',
      text: 'text-[#d4af37]',
      label: 'break seal',
      decor: ['top-5 left-5|🕯️', 'top-6 right-6|✦', 'bottom-5 left-7|✶'],
    },
    midnight: {
      bg: 'bg-[#071229]',
      body: 'from-[#dbe8ff] via-[#b9cdf4] to-[#8ea9df]',
      front: 'from-[#a8bee9] via-[#dce8ff] to-[#92abe2]',
      seal: 'from-[#3e5fc2] to-[#263c8e]',
      text: 'text-[#c7d8ff]',
      label: 'under stars',
      decor: ['top-4 left-5|🌙', 'top-5 right-6|✦', 'bottom-5 right-7|✧'],
    },
    rose: {
      bg: 'bg-[#fff2f6]',
      body: 'from-[#ffd7e6] via-[#ffc5da] to-[#f6a8c3]',
      front: 'from-[#f6b4cc] via-[#ffdbe8] to-[#eca7be]',
      seal: 'from-[#e2477b] to-[#bb2f5f]',
      text: 'text-[#b53f67]',
      label: 'rose whisper',
      decor: ['top-3 left-5|🌹', 'top-4 right-6|✨', 'bottom-5 left-6|💗'],
    },
    golden: {
      bg: 'bg-[#fff8e8]',
      body: 'from-[#f4deb0] via-[#ebcd8f] to-[#cfab60]',
      front: 'from-[#e4c786] via-[#f8e9c4] to-[#d8b26d]',
      seal: 'from-[#cf9b2f] to-[#9f6f11]',
      text: 'text-[#8d6216]',
      label: 'golden promise',
      decor: ['top-3 left-5|✨', 'top-4 right-6|⭐', 'bottom-4 right-6|💛'],
    },
  };
  const theme = themes[mood] || themes.kawaii;
  const [state, setState] = useState('closed'); // closed | opening | opened
  const openTimerRef = useRef(null);

  const isClosed = state === 'closed';
  const isOpening = state === 'opening';
  const isOpened = state === 'opened';

  useEffect(() => () => {
    if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
  }, []);

  useEffect(() => {
    if (!interactive || !onRevealChange) return;
    onRevealChange(isOpened);
  }, [interactive, isOpened, onRevealChange]);

  const handleOpen = () => {
    if (!interactive || !isClosed) return;
    setState('opening');
    openTimerRef.current = window.setTimeout(() => setState('opened'), 560);
  };

  const labelText = interactive
    ? (isOpened ? 'opened' : 'tap to open')
    : theme.label;

  return (
    <div className={`w-full h-full ${theme.bg} relative overflow-hidden flex items-center justify-center`}>
      {mood === 'midnight' && [10, 22, 38, 54, 70, 86].map((left, i) => (
        <span key={left} className="absolute w-1 h-1 bg-white rounded-full animate-twinkle" style={{ left: `${left}%`, top: `${18 + (i * 13) % 62}%` }} />
      ))}
      {mood === 'dark' && [12, 26, 43, 61, 78].map((left, i) => (
        <span key={left} className="absolute bottom-0 w-1.5 h-1.5 rounded-full animate-ember bg-amber-400" style={{ left: `${left}%`, animationDelay: `${i * 0.35}s` }} />
      ))}
      {theme.decor.map((item) => {
        const [position, icon] = item.split('|');
        return <span key={item} className={`absolute ${position} text-xl drop-shadow-sm`}>{icon}</span>;
      })}

      <motion.button
        type="button"
        onClick={handleOpen}
        className={`relative w-36 h-28 ${interactive && isClosed ? 'cursor-pointer' : 'cursor-default'}`}
        whileTap={interactive && isClosed ? { scale: 0.98 } : undefined}
        animate={interactive
          ? (isClosed ? { y: [0, -5, 0], rotate: [0, -1, 1, 0] } : { y: 0, rotate: 0 })
          : loops.float.animate}
        transition={interactive
          ? (isClosed ? { duration: 2.7, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 })
          : loops.float.transition}
      >
        <motion.div
          className="absolute left-1/2 bottom-[44px] -translate-x-1/2 w-28 h-20 rounded-md border border-[#d7bc8f] bg-[#f2dfb8] shadow-md"
          animate={interactive
            ? (isOpened
              ? { y: -36, scale: 1.03, rotate: -1.8, opacity: 1 }
              : isOpening
                ? { y: [34, -44, -36], scale: [0.96, 1.04, 1.03], rotate: [0, -4, -1.8], opacity: [0, 0.45, 1] }
                : { y: 34, scale: 0.96, rotate: 0, opacity: 0 })
            : loops.letter.animate}
          transition={interactive
            ? (isOpening
              ? { duration: 0.76, ease: ['easeOut', 'easeOut', 'easeInOut'], times: [0, 0.74, 1] }
              : { type: 'spring', stiffness: 160, damping: 16 })
            : loops.letter.transition}
        >
          <div className="absolute inset-2 border border-[#dfc99f] rounded-sm" />
          <div className="absolute left-4 right-4 top-5 h-px bg-[#9d7650]/25" />
          <div className="absolute left-4 right-6 top-9 h-px bg-[#9d7650]/20" />
          <div className="absolute left-4 right-8 top-[52px] h-px bg-[#9d7650]/20" />
        </motion.div>
        {!interactive && (
          <div className="pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 z-30">
            {['♥', '✦', '♥', '✧', '♥'].map((glyph, i) => (
              <motion.span
                key={`${glyph}-${i}`}
                className="absolute text-[#d53f78] text-[11px] font-bold"
                animate={{
                  opacity: [0, 0, 0.95, 0, 0],
                  scale: [0.3, 0.3, 1, 1.2, 1.2],
                  x: [
                    0,
                    0,
                    Math.cos((i / 5) * Math.PI * 2) * (14 + (i % 2) * 4),
                    Math.cos((i / 5) * Math.PI * 2) * (18 + (i % 2) * 5),
                    Math.cos((i / 5) * Math.PI * 2) * (18 + (i % 2) * 5),
                  ],
                  y: [
                    0,
                    0,
                    Math.sin((i / 5) * Math.PI * 2) * (12 + (i % 2) * 4),
                    Math.sin((i / 5) * Math.PI * 2) * (16 + (i % 2) * 5),
                    Math.sin((i / 5) * Math.PI * 2) * (16 + (i % 2) * 5),
                  ],
                }}
                transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {glyph}
              </motion.span>
            ))}
          </div>
        )}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-36 h-24">
          <div className={`absolute inset-0 rounded-xl bg-gradient-to-b ${theme.body} border border-white/20 shadow-xl`} />
          <div className={`absolute inset-x-0 bottom-0 h-16 bg-gradient-to-r ${theme.front} [clip-path:polygon(0_0,50%_84%,100%_0,100%_100%,0_100%)] rounded-b-xl z-10`} />
          <motion.div
            className="absolute inset-x-0 top-0 h-14 origin-top [transform-style:preserve-3d] z-20"
            animate={interactive
              ? ((isOpening || isOpened) ? { rotateX: -166, y: -3 } : { rotateX: 0, y: 0 })
              : loops.open.animate}
            transition={interactive
              ? { duration: 0.58, ease: [0.2, 0.75, 0.22, 1] }
              : loops.open.transition}
          >
            <div className={`w-full h-full bg-gradient-to-b ${theme.front} [clip-path:polygon(0_0,100%_0,50%_100%)] rounded-t-xl border-t border-white/30`} />
          </motion.div>
          <motion.div
            className={`absolute left-1/2 top-9 -translate-x-1/2 z-30 w-9 h-9 rounded-full bg-gradient-to-br ${theme.seal} border-2 border-white flex items-center justify-center text-white text-xs shadow-lg`}
            animate={interactive
              ? (isClosed ? { scale: [1, 1.08, 1], opacity: 1 } : { scale: 0.3, opacity: 0, y: -4 })
              : { scale: [1, 1.08, 1], opacity: [1, 1, 0, 0, 1] }}
            transition={interactive
              ? (isClosed ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.18, ease: 'easeOut' })
              : { duration: 4.8, repeat: Infinity, ease: 'easeInOut', times: [0, 0.16, 0.36, 0.76, 1] }}
          >
            ♥
          </motion.div>
        </div>
      </motion.button>
      <span className={`absolute bottom-4 font-dancing text-2xl ${theme.text}`}>{labelText}</span>
    </div>
  );
};

const TemplateMiniDemo = ({ templateId, interactive = false, onRevealChange }) => {
  if (templateId === 'dark-romance') return <EnvelopeDemo mood="dark" interactive={interactive} onRevealChange={onRevealChange} />;
  if (templateId === 'midnight-love') return <EnvelopeDemo mood="midnight" interactive={interactive} onRevealChange={onRevealChange} />;
  if (templateId === 'kawaii-letter') return <EnvelopeDemo mood="kawaii" interactive={interactive} onRevealChange={onRevealChange} />;
  if (templateId === 'rose-whisper') return <EnvelopeDemo mood="rose" interactive={interactive} onRevealChange={onRevealChange} />;
  if (templateId === 'golden-promise') return <EnvelopeDemo mood="golden" interactive={interactive} onRevealChange={onRevealChange} />;
  if (templateId === 'iva-birthday') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#0b1627] via-[#13263f] to-[#27466f] relative overflow-hidden flex items-center justify-center">
        {[10, 24, 38, 54, 68, 84].map((left, i) => (
          <span
            key={left}
            className="absolute text-[10px] text-[#84d8ff]"
            style={{ left: `${left}%`, top: `${14 + (i * 11) % 62}%`, opacity: 0.72 }}
          >
            ✦
          </span>
        ))}
        <div className="w-[84%] h-[78%] rounded-2xl border border-[#3a5678] bg-[#0f1b2d]/92 p-3 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] uppercase tracking-[0.2em] font-black text-[#7fd8ff]">full house</span>
            <span className="text-[9px] text-[#b6ddff]">Together</span>
          </div>
          <div className="flex gap-1.5 mb-2">
            {['Home', 'Gallery', 'Reasons'].map((tab, i) => (
              <span
                key={tab}
                className={`text-[8px] px-2 py-0.5 rounded-full font-bold ${i === 0 ? 'bg-[#77d7ff] text-[#062033]' : 'bg-[#1e334d] text-[#c2dfff]'}`}
              >
                {tab}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1.5 h-[66%]">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="rounded-md border border-[#3a5169] bg-gradient-to-br from-[#1a2a40] to-[#0c1727]"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2.4 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (templateId === 'sky-love') {
    return (
      <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#1f3b84] via-[#10245a] to-[#060f2c]">
        {[12, 24, 36, 48, 62, 75, 88].map((left, i) => (
          <span
            key={left}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              top: `${14 + (i % 4) * 14}%`,
              left: `${left}%`,
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              opacity: 0.35 + (i % 4) * 0.16,
            }}
          />
        ))}
        <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#fff9dd] shadow-[0_0_22px_rgba(255,255,210,0.65)]" />
        <div className="relative w-40 h-28">
          <div className="absolute inset-0 rounded-[9px] bg-gradient-to-b from-[#d7e2ff] via-[#b9c8f4] to-[#8fa8e4] border border-[#8ea4d4]" />
          <div className="absolute inset-y-0 left-0 w-1/2 bg-[#aebfe8] [clip-path:polygon(0_0,100%_50%,0_100%)]" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[#aebfe8] [clip-path:polygon(100%_0,0_50%,100%_100%)]" />
          <div className="absolute left-0 right-0 bottom-0 h-[56%] bg-[#c0cff2] [clip-path:polygon(0_100%,50%_30%,100%_100%)]" />
          <motion.div
            className="absolute left-0 right-0 top-0 h-[56%] origin-top"
            animate={{ rotateX: [0, 0, -170, -170, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', times: [0, 0.2, 0.42, 0.72, 1] }}
          >
            <div className="w-full h-full bg-[#edf2ff] [clip-path:polygon(0_0,100%_0,50%_100%)] rounded-t-[9px]" />
          </motion.div>
          <motion.div
            className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-gradient-to-br from-[#6f87d6] to-[#3f56a6] text-white flex items-center justify-center text-[11px] font-black border border-white/80"
            animate={{ scale: [1, 1.08, 1], opacity: [1, 1, 0, 0, 1] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', times: [0, 0.16, 0.36, 0.76, 1] }}
          >
            ☾
          </motion.div>
        </div>
      </div>
    );
  }
  if (templateId === 'chat-reveal') {
    return (
      <div className="w-full h-full bg-black relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,107,157,0.14),transparent_44%),radial-gradient(circle_at_80%_80%,rgba(196,77,255,0.14),transparent_44%)]" />
        <div className="w-[82%] h-[78%] rounded-2xl border border-[#2f2f33] bg-[#0e0e10] p-3 flex flex-col justify-between shadow-xl">
          <div className="space-y-1.5">
            <motion.div
              className="ml-auto w-[62%] rounded-2xl rounded-br-md bg-[#0a84ff] px-2.5 py-1.5 text-[9px] text-white"
              animate={{ opacity: [0.35, 1, 1] }}
              transition={{ duration: 3.8, repeat: Infinity, times: [0, 0.24, 1] }}
            >
              not really why
            </motion.div>
            <motion.div
              className="w-[74%] rounded-2xl rounded-bl-md bg-[#2c2c2e] px-2.5 py-1.5 text-[9px] text-white"
              animate={{ opacity: [0.25, 0.25, 1, 1] }}
              transition={{ duration: 3.8, repeat: Infinity, times: [0, 0.35, 0.46, 1] }}
            >
              i have something to tell you
            </motion.div>
            <motion.div
              className="w-[80%] rounded-2xl rounded-bl-md bg-gradient-to-r from-[#ff6b9d] via-[#ff4d8d] to-[#c44dff] px-2.5 py-1.5 text-[9px] text-white font-semibold"
              animate={{ scale: [0.86, 1.02, 1], opacity: [0, 1, 1] }}
              transition={{ duration: 3.8, repeat: Infinity, times: [0, 0.62, 1] }}
            >
              i love you so much 🩷
            </motion.div>
          </div>
          <div className="flex items-center justify-center">
            <motion.span
              className="text-[#ff6b9d] text-xs font-black uppercase tracking-widest"
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              chat reveal
            </motion.span>
          </div>
        </div>
      </div>
    );
  }

  if (templateId === '100-reasons') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#fff4f7] to-[#efe9ff] flex items-center justify-center p-5 overflow-hidden">
        <div className="grid grid-cols-3 gap-2 w-full max-w-[190px]">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="aspect-[3/4] bg-white border border-pink-100 shadow-sm rounded-md flex items-center justify-center text-primary-pink font-black"
              animate={{ rotateY: [0, 0, 180, 180, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' }}
            >
              {i + 1}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (templateId === 'our-gallery') {
    return (
      <div className="w-full h-full bg-[#fff8f0] flex items-center justify-center relative overflow-hidden">
        {['bg-rose-200', 'bg-amber-200', 'bg-sky-200'].map((color, i) => (
          <motion.div
            key={color}
            className="absolute w-24 h-28 bg-white p-2 shadow-lg border border-white rounded-sm"
            animate={{ x: [-22 + i * 22, -52 + i * 52, -22 + i * 22], rotate: [-7 + i * 5, -13 + i * 13, -7 + i * 5] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className={`h-20 ${color} rounded-sm`} />
            <div className="h-2 mt-2 bg-slate-100 rounded-full" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (templateId === 'birthday-candles') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#ffe1b9] via-[#fff0d8] to-[#ffd4b3] relative overflow-hidden flex items-center justify-center">
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={`party-${i}`}
            className="absolute text-lg"
            style={{ left: `${10 + i * 22}%`, top: `${8 + (i % 2) * 12}%` }}
            animate={{ y: [0, -6, 0], rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2.8 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {i % 2 === 0 ? '🎈' : '✨'}
          </motion.span>
        ))}
        <div className="relative w-40 h-28">
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[92%] h-10 rounded-xl bg-gradient-to-r from-[#d7864d] via-[#f0a365] to-[#cb7440] border border-[#b96e40]" />
          <div className="absolute left-1/2 bottom-8 -translate-x-1/2 w-[78%] h-9 rounded-lg bg-gradient-to-r from-[#ffd494] via-[#ffe6b8] to-[#ffc984] border border-[#ddb477]" />
          <div className="absolute left-1/2 bottom-[42px] -translate-x-1/2 flex gap-2">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={`mini-candle-${idx}`} className="relative flex flex-col items-center">
                <motion.span
                  className="absolute -top-3 text-[10px]"
                  animate={{ y: [0, -2, 0], opacity: [0.85, 1, 0.85] }}
                  transition={{ duration: 0.8 + (idx % 2) * 0.15, repeat: Infinity, ease: 'easeInOut' }}
                >
                  🔥
                </motion.span>
                <div className="w-2 h-6 rounded-sm bg-[#ff5a6f] border border-[#d53d52]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (templateId === 'date-invite') {
    return (
      <div
        className="w-full h-full relative overflow-hidden flex items-center justify-center"
        style={{
          backgroundColor: '#fff8f8',
          backgroundImage:
            'repeating-linear-gradient(0deg, #f8d5dd, #f8d5dd 18px, #fff8ef 18px, #fff8ef 36px), repeating-linear-gradient(90deg, #f8d5dd, #f8d5dd 18px, #fff8ef 18px, #fff8ef 36px)',
        }}
      >
        <motion.span
          className="absolute top-2 right-3 text-sm"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          ⭐
        </motion.span>
        <motion.span
          className="absolute bottom-3 left-3 text-sm"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2.9, repeat: Infinity, ease: 'easeInOut' }}
        >
          🎈
        </motion.span>
        <div className="relative w-40 h-28">
          <div className="absolute inset-0 bg-[#f4a7b9] rounded-[8px] border border-[#eb9bb0]" />
          <div className="absolute inset-y-0 left-0 w-1/2 bg-[#d58fa4] [clip-path:polygon(0_0,100%_50%,0_100%)]" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[#d58fa4] [clip-path:polygon(100%_0,0_50%,100%_100%)]" />
          <div className="absolute left-0 right-0 bottom-0 h-[56%] bg-[#e8a8bc] [clip-path:polygon(0_100%,50%_30%,100%_100%)]" />
          <motion.div
            className="absolute left-0 right-0 top-0 h-[56%] origin-top"
            animate={{ rotateX: [0, 0, -175, -175, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', times: [0, 0.18, 0.38, 0.72, 1] }}
          >
            <div className="w-full h-full bg-[#f9cfdb] [clip-path:polygon(0_0,100%_0,50%_100%)] rounded-t-[8px]" />
          </motion.div>
          <motion.div
            className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#9B2335] text-white flex items-center justify-center text-[11px] font-black"
            animate={{ scale: [1, 1.08, 1], opacity: [1, 1, 0, 0, 1] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', times: [0, 0.14, 0.32, 0.76, 1] }}
          >
            ♥
          </motion.div>
        </div>
        <motion.div
          className="absolute bottom-3 right-3 bg-white/95 rounded-full px-2 py-1 text-[9px] font-black text-[#9B2335]"
          animate={{ x: [0, -12, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          No
        </motion.div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#f43f73] text-white text-[9px] font-black px-3 py-1">
          YES
        </div>
      </div>
    );
  }

  if (templateId === 'our-story') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#f6e8d2] via-[#fff7ea] to-[#f3dfc2] flex items-center justify-center relative overflow-hidden">
        <motion.div
          className="w-40 h-24 rounded-xl border border-[#d6b995] bg-[#fff6e8] shadow-[0_12px_22px_rgba(109,72,35,0.18)] relative"
          animate={{ rotateY: [0, -14, 0], x: [0, 4, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-y-0 left-1/2 w-[2px] bg-[#dfc19e]" />
          <span className="absolute left-4 top-3 text-[10px] font-bold uppercase tracking-wider text-[#98653d]">Our Story</span>
          <span className="absolute left-4 bottom-3 text-[10px] text-[#b9855d]">Gallery + Letter</span>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b9855d]">→</span>
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9855d]">←</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#fff4f7] to-[#eef0ff] flex items-center justify-center text-primary-pink text-xs font-bold uppercase tracking-wide">
      Template preview
    </div>
  );
};

export default TemplateMiniDemo;
