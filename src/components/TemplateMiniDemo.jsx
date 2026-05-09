import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const loops = {
  float: {
    animate: { y: [0, -8, 0], rotate: [0, -1.5, 1.5, 0] },
    transition: { duration: 3.8, repeat: Infinity, ease: 'easeInOut' },
  },
  open: {
    animate: { rotateX: [0, 0, -158, -158, 0], y: [0, 0, -5, -5, 0] },
    transition: { duration: 4.8, repeat: Infinity, ease: 'easeInOut', times: [0, 0.2, 0.42, 0.72, 1] },
  },
  letter: {
    animate: { y: [34, 34, -36, -36, 34], scale: [0.96, 0.96, 1.03, 1.03, 0.96] },
    transition: { duration: 4.8, repeat: Infinity, ease: 'easeInOut', times: [0, 0.2, 0.42, 0.72, 1] },
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

  if (templateId === 'iva-birthday') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#081426] via-[#132947] to-[#2a4d7a] flex items-center justify-center relative overflow-hidden">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={`star-${i}`}
            className="absolute text-[#77d7ff]/80"
            style={{ left: `${8 + i * 18}%`, top: `${14 + (i % 2) * 15}%`, fontSize: `${14 + (i % 3) * 4}px` }}
          >
            ✦
          </span>
        ))}
        <motion.div
          className="w-40 rounded-2xl border border-[#4f6d8b] bg-[#0f1e31]/85 px-4 py-5 text-center shadow-xl"
          animate={{ y: [6, -6, 6] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-[#1f3858] mb-3 text-[#77d7ff]">🔒</div>
          <p className="text-[10px] uppercase tracking-[0.15em] font-black text-[#77d7ff]">Private Birthday</p>
          <p className="text-xs text-white/85 mt-1">Gate + Gallery + Reasons</p>
        </motion.div>
      </div>
    );
  }

  return <EnvelopeDemo mood="kawaii" />;
};

export default TemplateMiniDemo;
