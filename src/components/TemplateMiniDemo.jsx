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

const EnvelopeDemo = ({ mood = 'kawaii' }) => {
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

      <motion.div className="relative w-36 h-28" {...loops.float}>
        <motion.div
          className="absolute left-1/2 bottom-[44px] -translate-x-1/2 w-28 h-20 rounded-md border border-[#d7bc8f] bg-[#f2dfb8] shadow-md"
          {...loops.letter}
        >
          <div className="absolute inset-2 border border-[#dfc99f] rounded-sm" />
          <div className="absolute left-4 right-4 top-5 h-px bg-[#9d7650]/25" />
          <div className="absolute left-4 right-6 top-9 h-px bg-[#9d7650]/20" />
          <div className="absolute left-4 right-8 top-[52px] h-px bg-[#9d7650]/20" />
        </motion.div>
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-36 h-24">
          <div className={`absolute inset-0 rounded-xl bg-gradient-to-b ${theme.body} border border-white/20 shadow-xl`} />
          <div className={`absolute inset-x-0 bottom-0 h-16 bg-gradient-to-r ${theme.front} [clip-path:polygon(0_0,50%_84%,100%_0,100%_100%,0_100%)] rounded-b-xl z-10`} />
          <motion.div className="absolute inset-x-0 top-0 h-14 origin-top [transform-style:preserve-3d] z-20" {...loops.open}>
            <div className={`w-full h-full bg-gradient-to-b ${theme.front} [clip-path:polygon(0_0,100%_0,50%_100%)] rounded-t-xl border-t border-white/30`} />
          </motion.div>
          <motion.div
            className={`absolute left-1/2 top-9 -translate-x-1/2 z-30 w-9 h-9 rounded-full bg-gradient-to-br ${theme.seal} border-2 border-white flex items-center justify-center text-white text-xs shadow-lg`}
            animate={{ scale: [1, 1.08, 1], opacity: [1, 1, 0, 0, 1] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', times: [0, 0.16, 0.36, 0.76, 1] }}
          >
            ♥
          </motion.div>
        </div>
      </motion.div>
      <span className={`absolute bottom-4 font-dancing text-2xl ${theme.text}`}>{theme.label}</span>
    </div>
  );
};

const TemplateMiniDemo = ({ templateId }) => {
  if (templateId === 'dark-romance') return <EnvelopeDemo mood="dark" />;
  if (templateId === 'midnight-love') return <EnvelopeDemo mood="midnight" />;
  if (templateId === 'kawaii-letter') return <EnvelopeDemo mood="kawaii" />;

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
      <div className="w-full h-full bg-gradient-to-br from-pink-100 to-violet-200 flex items-center justify-center relative overflow-hidden">
        <motion.div className="w-36 bg-white rounded-2xl shadow-xl border border-violet-100 p-4 text-center" animate={{ y: [8, -8, 8] }} transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}>
          <p className="text-[10px] uppercase tracking-wider text-violet-400 font-bold">Date Invite</p>
          <p className="text-sm font-black text-violet-800 mt-2">Saturday?</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <span className="rounded-full bg-primary-pink text-white text-[10px] py-1">Yes</span>
            <span className="rounded-full bg-violet-50 text-violet-700 text-[10px] py-1">Details</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return <EnvelopeDemo mood="kawaii" />;
};

export default TemplateMiniDemo;
