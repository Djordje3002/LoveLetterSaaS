import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Image as ImageIcon, Home, Lock, Shuffle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { palettes, fonts, extractYouTubeId } from './palettes';

const MEMORY_PLACEHOLDERS = [
  { label: 'First favorite', hint: 'Add your sweetest photo', from: '#253f63', to: '#122033' },
  { label: 'Little adventure', hint: 'Add a memory together', from: '#7b3150', to: '#20172a' },
  { label: 'Quiet moment', hint: 'Add a cozy snapshot', from: '#2f5d67', to: '#10242c' },
  { label: 'Big laugh', hint: 'Add a funny photo', from: '#70436f', to: '#1d1830' },
  { label: 'Forever piece', hint: 'Add one more memory', from: '#8a4a3d', to: '#241816' },
];

const LETTER_BACKGROUND_STYLE = {
  backgroundColor: '#fff9ef',
  backgroundImage:
    'radial-gradient(circle at 12px 12px, rgba(245, 169, 192, 0.28) 3px, transparent 3px), radial-gradient(circle at 20% 18%, rgba(119,215,255,0.16), transparent 34%), radial-gradient(circle at 82% 78%, rgba(255,154,176,0.18), transparent 36%)',
  backgroundSize: '42px 42px, 100% 100%, 100% 100%',
};

const LINED_PAPER_STYLE = {
  backgroundColor: '#fffdf9',
  backgroundImage:
    'linear-gradient(to bottom, transparent 0, transparent 56px, rgba(198,177,158,0.55) 57px, transparent 59px)',
  backgroundSize: '100% 62px',
  boxShadow: '0 26px 68px rgba(112, 87, 59, 0.18)',
};

const DEFAULT_REASON_DETAILS = [
  'your laugh',
  'the way you listen',
  'your sleepy good mornings',
  'how you make small plans feel exciting',
  'your kindness',
  'your random stories',
  'your hugs',
  'your brave heart',
  'your silly jokes',
  'your voice',
  'how you remember little things',
  'your honest eyes',
  'the calm you bring',
  'your tiny habits',
  'how you cheer for me',
  'your warm messages',
  'your smile',
  'the way you dream',
  'your patience',
  'the home I feel with you',
];

const DEFAULT_REASON_ENDINGS = [
  'turns normal days into something I want to keep',
  'makes me feel safe, chosen, and understood',
  'reminds me that love can be soft and real',
  'brings light into places I did not know needed it',
  'makes every ordinary moment feel like ours',
];

const DEFAULT_REASONS = Array.from({ length: 100 }, (_, i) => {
  const detail = DEFAULT_REASON_DETAILS[i % DEFAULT_REASON_DETAILS.length];
  const ending = DEFAULT_REASON_ENDINGS[Math.floor(i / DEFAULT_REASON_DETAILS.length) % DEFAULT_REASON_ENDINGS.length];
  return `I love ${detail} because it ${ending}.`;
});

const REASON_CARD_GRADIENTS = [
  ['#77d7ff', '#3d78ff'],
  ['#ff8bb2', '#d62464'],
  ['#ffe2a6', '#d88d2f'],
  ['#b79cff', '#6c54d9'],
  ['#90f0d1', '#288f83'],
  ['#ffb199', '#df5b5b'],
];

const HEART_COLOR_MAP = {
  blue: '#77d7ff',
  pink: '#ff6fa8',
  red: '#ff5f7d',
  purple: '#b79cff',
  gold: '#ffd166',
};

const hexToRgba = (hex, alpha) => {
  const normalized = String(hex || '').trim().replace('#', '');
  if (!/^[0-9a-fA-F]{3,6}$/.test(normalized)) return `rgba(255, 111, 168, ${alpha})`;
  const fullHex = normalized.length === 3
    ? normalized.split('').map((char) => `${char}${char}`).join('')
    : normalized.padEnd(6, normalized[normalized.length - 1]).slice(0, 6);
  const r = Number.parseInt(fullHex.slice(0, 2), 16);
  const g = Number.parseInt(fullHex.slice(2, 4), 16);
  const b = Number.parseInt(fullHex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getReasonCardRotation = (index) => {
  const pattern = [-5, -3, -1, 1, 3, 5, -4, 2];
  return pattern[index % pattern.length];
};

const FUNNY_NO_LINES = [
  'The NO button is temporarily out of service 😏',
  'Nice try, but this is a YES-only zone 💘',
  'You can run, but you cannot hide from love ✨',
  'The answer is still YES 😌',
];

const FullHouseLove = ({
  recipientName,
  senderName,
  scenes = {},
  reasons = [],
  palette = 'navy',
  font = 'playful',
  showSenderName = true,
  showFooter = true,
  musicEnabled = false,
  musicUrl = '',
}) => {
  const [screen, setScreen] = useState('gate');
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [gateMessage, setGateMessage] = useState('');
  const [questionMessage, setQuestionMessage] = useState('');
  const [noButtonOffset, setNoButtonOffset] = useState({ x: 0, y: 0 });
  const [tab, setTab] = useState('home');
  const [reasonCards, setReasonCards] = useState([]);
  const [revealedReasons, setRevealedReasons] = useState(0);

  const pal = palettes[palette] || palettes.navy;
  const fnt = fonts[font] || fonts.playful;
  const videoId = extractYouTubeId(musicUrl);
  const heartColorToken = String(scenes.heartColor || 'blue').trim().toLowerCase();
  const heartColor = HEART_COLOR_MAP[heartColorToken] || '#77d7ff';
  const heartGlow = hexToRgba(heartColor, 0.36);
  const heartSoft = hexToRgba(heartColor, 0.18);

  const expectedName = (scenes.accessName || recipientName || 'love').trim().toLowerCase();
  const expectedPassword = (scenes.accessPassword || 'love').trim().toLowerCase();

  const galleryItems = useMemo(
    () => [1, 2, 3, 4, 5].map((slot, i) => ({
      src: scenes[`photo${slot}Url`] || '',
      caption: scenes[`polaroidCaption${slot}`] || `Memory ${slot}`,
      placeholder: MEMORY_PLACEHOLDERS[i],
    })),
    [scenes]
  );

  const reasonItems = useMemo(() => {
    if (Array.isArray(reasons) && reasons.filter(Boolean).length > 0) {
      return reasons.filter(Boolean);
    }
    return DEFAULT_REASONS;
  }, [reasons]);

  useEffect(() => {
    setReasonCards(reasonItems.map((text, index) => ({ id: index, text, flipped: false })));
    setRevealedReasons(0);
  }, [reasonItems]);

  useEffect(() => {
    if (reasonCards.length === 0 || revealedReasons !== reasonCards.length) return;
    const timer = window.setTimeout(() => {
      confetti({
        particleCount: 140,
        spread: 84,
        origin: { y: 0.58 },
        colors: [pal.primary, pal.accent, '#ffffff'],
      });
    }, 260);
    return () => window.clearTimeout(timer);
  }, [pal.accent, pal.primary, reasonCards.length, revealedReasons]);

  const letterText = scenes.letterText || 'My love, this little space is made just for you.';
  const letterGreeting = scenes.letterGreeting || 'My dearest,';
  const letterBody = [
    letterGreeting,
    letterText,
    scenes.closingMessage,
    showSenderName && senderName ? `— ${senderName}` : '',
  ]
    .map((part) => String(part || '').trim())
    .filter(Boolean)
    .join('\n\n');

  const checkGate = () => {
    const validName = nameInput.trim().toLowerCase() === expectedName;
    const validPassword = passwordInput.trim().toLowerCase() === expectedPassword;
    if (!validName || !validPassword) {
      setGateMessage('Try again 💫 Use the exact name and password.');
      return;
    }
    setGateMessage('');
    setScreen('question');
  };

  const handleNoClick = () => {
    setNoButtonOffset({
      x: Math.round((Math.random() - 0.5) * 120),
      y: Math.round((Math.random() - 0.5) * 70),
    });
    setQuestionMessage(FUNNY_NO_LINES[Math.floor(Math.random() * FUNNY_NO_LINES.length)]);
  };

  const handleYesClick = () => {
    setQuestionMessage('Knew it 💍 Opening our little world...');
    setTimeout(() => setScreen('main'), 900);
  };

  const flipReasonCard = (id) => {
    const cardToFlip = reasonCards.find((card) => card.id === id);
    if (!cardToFlip || cardToFlip.flipped) return;
    setReasonCards((prev) => prev.map((card) => (card.id === id ? { ...card, flipped: true } : card)));
    setRevealedReasons((count) => Math.min(count + 1, reasonCards.length));
  };

  const shuffleReasons = () => {
    setReasonCards((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden" style={{ fontFamily: fnt.body, background: `radial-gradient(circle at top, ${heartSoft}, transparent 46%), #07070b` }}>
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-55"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage: `radial-gradient(circle at 18% 18%, ${hexToRgba(heartColor, 0.2)}, transparent 36%), radial-gradient(circle at 80% 70%, ${pal.primary}1f, transparent 38%)`,
          backgroundSize: '170% 170%',
        }}
      />

      {[...Array(10)].map((_, i) => (
        <span
          key={`heart-${i}`}
          className="absolute pointer-events-none"
          style={{
            left: `${6 + (i * 10) % 88}%`,
            top: `${12 + (i * 9) % 80}%`,
            opacity: 0.2,
            color: heartColor,
            transform: `scale(${0.7 + (i % 3) * 0.15})`,
          }}
        >
          ♥
        </span>
      ))}

      {musicEnabled && videoId && (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0`}
          allow="autoplay"
          className="w-0 h-0 absolute opacity-0"
          title="full-house background music"
        />
      )}

      <AnimatePresence mode="wait">
        {screen === 'gate' && (
          <motion.section
            key="gate"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="w-full max-w-xl rounded-[28px] border border-[#28445f] bg-[#0f1622]/94 shadow-[0_30px_80px_rgba(0,0,0,0.45)] p-8 text-center backdrop-blur">
              <div className="inline-flex w-14 h-14 rounded-full bg-[#1b3148] items-center justify-center mb-4">
                <Lock className="text-[#77d7ff]" size={24} />
              </div>
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: fnt.heading }}>{scenes.welcomeTitle || 'Welcome, my love 💙'}</h1>
              <p className="text-white/70 mb-6">{scenes.welcomeSubtitle || 'This is our little private world.'}</p>
              <div className="space-y-3 text-left">
                <label className="text-xs uppercase tracking-widest text-white/70 font-bold">Name</label>
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder={expectedName || 'Iva'}
                  className="w-full bg-[#0a111a] border border-[#2d4a66] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#77d7ff]"
                />
                <label className="text-xs uppercase tracking-widest text-white/70 font-bold">Password</label>
                <input
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password"
                  type="password"
                  className="w-full bg-[#0a111a] border border-[#2d4a66] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#77d7ff]"
                />
              </div>
              <button onClick={checkGate} className="mt-6 w-full rounded-full px-6 py-3 font-bold text-[#05101a] bg-[#77d7ff] hover:brightness-105 transition-all">
                Enter Full House of Love ✨
              </button>
              <p className="mt-3 text-sm text-[#ff9ab0] min-h-[20px]">{gateMessage}</p>
            </div>
          </motion.section>
        )}

        {screen === 'question' && (
          <motion.section
            key="question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="w-full max-w-2xl rounded-[28px] border border-[#3f2742] bg-[#1a1220]/94 p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
              <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: fnt.heading }}>
                {scenes.questionTitle || 'Will you keep choosing me forever?'}
              </h2>
              <div className="relative h-28">
                <button onClick={handleYesClick} className="absolute left-1/2 -translate-x-[110%] top-5 rounded-full px-8 py-3 bg-[#ff4d6d] text-white font-bold hover:scale-105 transition-transform">
                  YES 💍
                </button>
                <motion.button
                  onClick={handleNoClick}
                  animate={{ x: noButtonOffset.x, y: noButtonOffset.y }}
                  transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                  className="absolute left-1/2 translate-x-[10%] top-5 rounded-full px-8 py-3 border border-[#76517a] bg-transparent text-[#ffb4c7] font-bold"
                >
                  NO 🙈
                </motion.button>
              </div>
              <p className="text-sm text-[#ff9ab0] min-h-[22px] mt-2">{questionMessage}</p>
            </div>
          </motion.section>
        )}

        {screen === 'main' && (
          <motion.section
            key="main"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 min-h-screen px-5 pb-8 pt-10 md:px-10 md:pt-12"
          >
            <div className={tab === 'home' ? 'max-w-none mx-auto' : 'max-w-6xl mx-auto'}>
              <header className="relative z-20 mb-7 flex justify-center px-1 pt-1 md:pt-2">
                <div className="w-full max-w-[620px] rounded-[22px] border border-white/20 bg-[linear-gradient(120deg,rgba(7,17,31,0.92),rgba(9,23,40,0.78))] p-2 shadow-[0_18px_38px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                  <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'home', label: 'Home', icon: Home },
                    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
                    { id: 'reasons', label: 'Reasons', icon: Heart },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => setTab(item.id)}
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ y: -1 }}
                        className={`rounded-2xl px-4 py-2.5 text-sm font-bold inline-flex items-center justify-center gap-2 transition-all ${
                          tab === item.id ? 'text-[#08101a] shadow-[0_8px_20px_rgba(0,0,0,0.24)]' : 'text-white/80 hover:bg-white/10'
                        }`}
                        style={tab === item.id ? { background: `linear-gradient(135deg, ${heartColor}, ${pal.accent})` } : undefined}
                      >
                        <Icon size={15} />
                        {item.label}
                      </motion.button>
                    );
                  })}
                  </div>
                </div>
              </header>

	              {tab === 'home' && (
	                <div
	                  className="relative -mx-5 -mt-16 min-h-screen overflow-x-hidden px-3 pb-10 pt-24 text-[#2b1a20] md:-mx-10"
	                  style={LETTER_BACKGROUND_STYLE}
	                >
	                  <motion.h2
	                    initial={{ opacity: 0, y: 16 }}
	                    animate={{ opacity: 1, y: 0 }}
	                    className="relative z-10 mx-auto max-w-[760px] px-5 pt-5 text-center font-dancing text-[2.05rem] font-bold leading-[0.95] text-[#9f164d] sm:text-[2.7rem] md:text-[3.7rem]"
	                  >
	                    {scenes.homeTitle || 'Full House of Love 💙'}
	                  </motion.h2>
                  <span className="pointer-events-none absolute left-[9%] top-[20%] text-5xl rotate-[-9deg]" style={{ color: hexToRgba(heartColor, 0.62) }}>♥</span>
                  <span className="pointer-events-none absolute right-[11%] top-[18%] text-4xl rotate-[8deg]" style={{ color: hexToRgba(heartColor, 0.46) }}>✦</span>
                  <span className="pointer-events-none absolute bottom-[12%] left-[8%] text-4xl" style={{ color: hexToRgba(heartColor, 0.5) }}>♡</span>
                  <span className="pointer-events-none absolute bottom-[9%] right-[10%] text-5xl rotate-[10deg]" style={{ color: hexToRgba(heartColor, 0.42) }}>✿</span>

	                  <motion.div
	                    initial={{ y: 120, opacity: 0 }}
	                    animate={{ y: 0, opacity: 1 }}
	                    transition={{ duration: 0.54, ease: [0.21, 0.85, 0.24, 1] }}
	                    className="relative z-10 mx-auto mt-7 min-h-[72vh] w-[min(92vw,860px)] overflow-hidden rounded-[18px] border border-[#ded2c5]"
	                    style={LINED_PAPER_STYLE}
	                  >
	                    <div className="absolute -top-[8px] left-1/2 h-8 w-24 -translate-x-1/2 rotate-[2deg] border border-[#e8e1d7] bg-white/90 shadow-sm" />
	                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fbf7ee]/65 pointer-events-none" />
	                    <div className="absolute bottom-0 left-[28px] top-0 w-[2px] bg-[#e5bcc6]" />

	                    <div className="relative px-9 py-14 sm:px-14 sm:py-16">
	                      <p
	                        className="whitespace-pre-line text-left font-dancing text-[1.45rem] font-bold leading-[1.6] text-[#2b1a20] sm:text-[1.85rem]"
	                        style={{ fontFamily: "'Dancing Script', 'Great Vibes', cursive", letterSpacing: '0.01em' }}
	                      >
	                        {letterBody}
	                      </p>
	                    </div>
	                  </motion.div>
	                </div>
	              )}

              {tab === 'gallery' && (
                <div className="rounded-[28px] border border-[#28445f] bg-[#0f1827]/94 p-6">
                  <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: fnt.heading }}>{scenes.galleryTitle || 'Our Moments 📸'}</h3>
                  <p className="text-white/70 mb-5">{scenes.gallerySubtitle || 'A collection of our favorite memories.'}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {galleryItems.map((photo, i) => (
                      <motion.figure
                        key={`gal-${i}`}
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: i * 0.05, type: 'spring', stiffness: 150, damping: 18 }}
                        whileHover={{ y: -4, rotate: i % 2 === 0 ? -0.5 : 0.5 }}
                        className="rounded-2xl overflow-hidden border border-[#3a5169] bg-black/25 shadow-[0_18px_36px_rgba(0,0,0,0.22)]"
                      >
                        {photo.src ? (
                          <img src={photo.src} alt={photo.caption} className="w-full h-52 object-cover" />
                        ) : (
                          <div
                            className="relative flex h-52 flex-col items-center justify-center overflow-hidden p-5 text-center"
                            style={{
                              background: `radial-gradient(circle at 25% 18%, rgba(255,255,255,0.20), transparent 34%), linear-gradient(135deg, ${photo.placeholder.from}, ${photo.placeholder.to})`,
                            }}
                          >
                            <div className="absolute inset-3 rounded-[18px] border border-white/15" />
                            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-lg">
                              <ImageIcon size={24} />
                            </div>
                            <p className="relative mt-4 text-sm font-black uppercase tracking-[0.16em] text-white/85">{photo.placeholder.label}</p>
                            <p className="relative mt-1 text-xs font-medium text-white/58">{photo.placeholder.hint}</p>
                          </div>
                        )}
                        <figcaption className="px-3 py-2 text-sm text-white/85">{photo.caption}</figcaption>
                      </motion.figure>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'reasons' && (
                <div className="rounded-[28px] border border-[#28445f] bg-[#0f1827]/94 p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
                    <h3 className="text-3xl font-bold" style={{ fontFamily: fnt.heading }}>
                      {scenes.reasonsTitle || 'Reasons I Love You 💙'}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-white/70 font-medium">{revealedReasons} / {reasonCards.length} revealed</span>
                      <button
                        onClick={shuffleReasons}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white transition-all hover:scale-105"
                        style={{ background: `linear-gradient(135deg, ${pal.primary}, ${heartColor})` }}
                      >
                        <Shuffle size={14} />
                        Shuffle
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {reasonCards.map((card, i) => {
                      const gradient = REASON_CARD_GRADIENTS[i % REASON_CARD_GRADIENTS.length];
                      const baseRotation = getReasonCardRotation(i);
                      return (
                        <motion.button
                          key={card.id}
                          type="button"
                          layout
                          initial={{ opacity: 0, y: 14, scale: 0.92 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: i * 0.015, type: 'spring', stiffness: 170, damping: 18 }}
                          whileHover={{ y: -7, scale: 1.03, rotate: baseRotation + (i % 2 === 0 ? -1 : 1) }}
                          whileTap={{ scale: 0.98 }}
                          className="aspect-square cursor-pointer appearance-none border-0 bg-transparent p-0 text-left"
                          style={{ perspective: '1000px' }}
                          onClick={() => flipReasonCard(card.id)}
                          aria-label={`Reveal reason ${i + 1}`}
                        >
                          <motion.div
                            className="relative w-full h-full transition-all duration-500"
                            animate={
                              card.flipped
                                ? { rotateY: 180, rotateZ: baseRotation, scale: [1, 1.08, 1], y: [0, -7, 0] }
                                : { rotateY: 0, rotateZ: baseRotation, scale: 1, y: 0 }
                            }
                            transition={{
                              rotateY: { duration: 0.7, ease: [0.2, 0.75, 0.24, 1] },
                              rotateZ: { duration: 0.6, ease: 'easeOut' },
                              scale: { duration: 0.46, times: [0, 0.58, 1] },
                              y: { duration: 0.46, times: [0, 0.5, 1] },
                            }}
                            style={{ transformStyle: 'preserve-3d' }}
                          >
                            <div
                              className="absolute inset-0 overflow-hidden rounded-[24px] border border-white/25 p-3 shadow-[0_20px_36px_rgba(0,0,0,0.26)]"
                              style={{
                                background: `radial-gradient(circle at 20% 14%, rgba(255,255,255,0.42), transparent 30%), linear-gradient(145deg, ${gradient[0]}, ${gradient[1]})`,
                                backfaceVisibility: 'hidden',
                              }}
                            >
                              <div className="absolute inset-[5px] rounded-[18px] border border-white/35" />
                              <div
                                className="absolute inset-0 rounded-[24px] opacity-0 transition-opacity duration-400"
                                style={{ background: `radial-gradient(circle at 50% 28%, ${heartGlow}, transparent 64%)`, opacity: card.flipped ? 0.85 : 0 }}
                              />
                              <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-white/16" />
                              <div className="absolute -bottom-8 left-2 h-20 w-20 rounded-full bg-black/10" />
                              <div className="relative flex h-full flex-col justify-between">
                                <div className="flex items-center justify-between">
                                  <span className="rounded-full bg-white/18 px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/85">
                                    Reason {String(i + 1).padStart(2, '0')}
                                  </span>
                                  <span className="text-lg" style={{ color: hexToRgba(heartColor, 0.95) }}>♡</span>
                                </div>
                                <div className="flex flex-1 items-center justify-center">
                                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/50 bg-white/20 text-3xl text-white shadow-inner">
                                    ♥
                                  </div>
                                </div>
                                <span className="text-center text-[10px] font-bold uppercase tracking-[0.16em] text-white/82">
                                  Tap to open
                                </span>
                              </div>
                            </div>
                            <div
                              className="absolute inset-0 flex flex-col items-start justify-between rounded-[24px] border p-4 text-left shadow-[0_20px_36px_rgba(0,0,0,0.2)]"
                              style={{
                                background: 'linear-gradient(160deg, #fffdf9, #fff4f8)',
                                backfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)',
                                borderColor: pal.accent,
                              }}
                            >
                              <div className="flex items-center justify-between w-full">
                                <Sparkles size={18} style={{ color: pal.primary }} />
                                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Love Note</p>
                              </div>
                              <p className="mt-3 text-sm font-black leading-snug" style={{ color: pal.text }}>
                                {card.text}
                              </p>
                              <p className="text-[11px] font-semibold text-slate-500">Reason #{i + 1}</p>
                            </div>
                          </motion.div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {revealedReasons === reasonCards.length && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center pt-8">
                      {scenes.closingMessage && (
                        <p className="font-dancing text-3xl mb-2" style={{ color: pal.accent }}>
                          {scenes.closingMessage}
                        </p>
                      )}
                      {showSenderName && senderName && (
                        <p className="font-dancing text-2xl text-white/85">— {senderName}</p>
                      )}
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {showFooter && (
              <div className="text-center mt-10 pb-4">
                <p className="text-white/45 text-sm">made with LovePage ♥</p>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FullHouseLove;
