import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Image as ImageIcon, Home, Lock, Shuffle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { palettes, fonts, extractYouTubeId } from './palettes';

const FALLBACK_PHOTOS = [
  '/templates/iva-birthday/IMG_5107.PNG',
  '/templates/iva-birthday/IMG_5109.PNG',
  '/templates/iva-birthday/IMG_4977.PNG',
  '/templates/iva-birthday/IMG_5086.PNG',
  '/templates/iva-birthday/IMG_5089.PNG',
];

const FUNNY_NO_LINES = [
  'The NO button is temporarily out of service 😏',
  'Nice try, but this is a YES-only zone 💘',
  'You can run, but you cannot hide from love ✨',
  'The answer is still YES 😌',
];

const DEFAULT_REASONS = Array.from({ length: 100 }, (_, i) => `Reason ${i + 1}: You make life brighter.`);

const formatTogether = (rawDate) => {
  const candidate = rawDate ? new Date(rawDate) : new Date('2025-12-06T00:00:00');
  const start = Number.isNaN(candidate.getTime()) ? new Date('2025-12-06T00:00:00') : candidate;
  const diff = Date.now() - start.getTime();
  const days = Math.max(0, Math.floor(diff / 86400000));
  const hours = Math.max(0, Math.floor((diff % 86400000) / 3600000));
  const mins = Math.max(0, Math.floor((diff % 3600000) / 60000));
  return `${days}d ${hours}h ${mins}m`;
};

const IvaBirthday = ({
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
  const [letterState, setLetterState] = useState('closed'); // closed | opening | opened
  const [reasonCards, setReasonCards] = useState([]);
  const [revealedReasons, setRevealedReasons] = useState(0);
  const letterOpenTimerRef = useRef(null);
  const sealBurst = ['♥', '✦', '♥', '✧', '♥', '✦'];

  const pal = palettes[palette] || palettes.navy;
  const fnt = fonts[font] || fonts.playful;
  const videoId = extractYouTubeId(musicUrl);
  const loveTimer = formatTogether(scenes.startDate);

  const expectedName = (scenes.accessName || recipientName || 'iva').trim().toLowerCase();
  const expectedPassword = (scenes.accessPassword || 'love').trim().toLowerCase();

  const galleryItems = useMemo(
    () => [1, 2, 3, 4, 5].map((slot, i) => ({
      src: scenes[`photo${slot}Url`] || FALLBACK_PHOTOS[i],
      caption: scenes[`polaroidCaption${slot}`] || `Memory ${slot}`,
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

  useEffect(() => () => {
    if (letterOpenTimerRef.current) window.clearTimeout(letterOpenTimerRef.current);
  }, []);

  const letterText = scenes.letterText || 'My love, this little space is made just for you.';
  const letterParagraphs = letterText.split('\n').filter(Boolean);

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

  const openLetter = () => {
    if (letterState !== 'closed') return;
    setLetterState('opening');
    letterOpenTimerRef.current = window.setTimeout(() => {
      setLetterState('opened');
    }, 720);
  };

  const flipReasonCard = (id) => {
    setReasonCards((prev) => prev.map((card) => {
      if (card.id !== id || card.flipped) return card;
      setRevealedReasons((count) => count + 1);
      return { ...card, flipped: true };
    }));
  };

  const shuffleReasons = () => {
    setReasonCards((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ fontFamily: fnt.body, background: 'radial-gradient(circle at top, rgba(119,215,255,0.20), transparent 46%), #07070b' }}>
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-55"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage: `radial-gradient(circle at 18% 18%, ${pal.accent}22, transparent 36%), radial-gradient(circle at 80% 70%, ${pal.primary}1f, transparent 38%)`,
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
            color: '#77d7ff',
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
            className="relative z-10 min-h-screen px-5 py-6 md:px-10"
          >
            <div className="max-w-6xl mx-auto">
              <header className="rounded-2xl border border-[#20374e] bg-[#0f1724]/90 px-4 py-3 mb-6 flex flex-wrap gap-3 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'home', label: 'Home', icon: Home },
                    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
                    { id: 'reasons', label: 'Reasons', icon: Heart },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setTab(item.id)}
                        className={`rounded-full px-4 py-2 text-sm font-bold inline-flex items-center gap-2 transition-all ${
                          tab === item.id ? 'bg-[#77d7ff] text-[#08101a]' : 'bg-[#111f31] text-white/78 hover:bg-[#1a2e45]'
                        }`}
                      >
                        <Icon size={14} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
                <div className="text-xs uppercase tracking-widest text-[#77d7ff] font-bold">Together {loveTimer}</div>
              </header>

              {tab === 'home' && (
                <div className="rounded-[28px] border border-[#28445f] bg-[#111b2b]/94 p-7 md:p-8 min-h-[74vh]">
                  <p className="uppercase tracking-[0.24em] text-xs text-[#77d7ff] font-black mb-3">Love Letter</p>
                  <h2 className="text-4xl font-bold mb-3" style={{ fontFamily: fnt.heading }}>{scenes.homeTitle || 'Full House of Love 💙'}</h2>
                  <p className="text-white/75 mb-6">{scenes.homeSubtitle || 'Every click is a little reminder of how much I love you.'}</p>

                  <div className="rounded-2xl border border-[#48607a] bg-[#fdf5e7] text-[#2f2318] p-5 shadow-inner">
                    <button
                      type="button"
                      onClick={openLetter}
                      disabled={letterState !== 'closed'}
                      className={`w-full text-left flex items-center justify-between font-bold mb-3 transition-colors ${
                        letterState === 'closed' ? 'text-[#8b3b4e] hover:text-[#9f1f44]' : 'text-[#6e5a43]'
                      }`}
                    >
                      <span>
                        {letterState === 'closed' ? 'Open love letter' : letterState === 'opening' ? 'Opening letter...' : 'Letter opened'}
                      </span>
                      <Sparkles size={16} />
                    </button>

                    <div className="relative h-[58vh] min-h-[420px] overflow-hidden rounded-xl border border-[#d3c4a8] bg-[#f8ebd3]">
                      {(letterState === 'opening' || letterState === 'opened') && (
                        <div className="pointer-events-none absolute left-1/2 top-[52%] z-30 -translate-x-1/2 -translate-y-1/2">
                          {sealBurst.map((glyph, i) => (
                            <motion.span
                              key={`${glyph}-${i}`}
                              className="absolute text-[#a52d56] text-base font-bold"
                              initial={{ opacity: 0.95, scale: 0.65, x: 0, y: 0 }}
                              animate={{
                                opacity: [0.95, 0],
                                scale: [0.65, 1.2],
                                x: Math.cos((i / sealBurst.length) * Math.PI * 2) * (38 + (i % 2) * 8),
                                y: Math.sin((i / sealBurst.length) * Math.PI * 2) * (34 + (i % 2) * 10),
                              }}
                              transition={{ duration: 0.52, delay: 0.05 + i * 0.03, ease: 'easeOut' }}
                            >
                              {glyph}
                            </motion.span>
                          ))}
                        </div>
                      )}
                      <motion.div
                        className="absolute left-1/2 bottom-[106px] -translate-x-1/2 w-[82%] max-w-[430px] h-[240px] rounded-lg border border-[#d6be95] overflow-hidden bg-[#f7ebd3]"
                        animate={letterState === 'opened'
                          ? { y: -8, opacity: 1, scale: 1, rotate: -0.8 }
                          : letterState === 'opening'
                            ? { y: [164, -28, -8], opacity: [0, 1, 1], scale: [0.95, 1.04, 1], rotate: [0, -2.4, -0.8] }
                            : { y: 160, opacity: 0, scale: 0.96, rotate: 0 }}
                        transition={letterState === 'opening'
                          ? { duration: 0.92, ease: 'easeOut', times: [0, 0.74, 1] }
                          : { type: 'spring', stiffness: 170, damping: 16 }}
                        style={{
                          backgroundImage:
                            'repeating-linear-gradient(180deg, rgba(110,80,45,0.08), rgba(110,80,45,0.08) 1px, transparent 1px, transparent 28px), radial-gradient(circle at 15% 18%, rgba(179,146,106,0.24), transparent 42%), radial-gradient(circle at 88% 82%, rgba(130,89,44,0.18), transparent 40%)',
                        }}
                      >
                        <div className="absolute inset-[8px] rounded-[6px] border border-[#d8c4a2]/80 pointer-events-none" />
                        <div className="relative h-full px-5 py-5 overflow-y-auto pr-2">
                          <AnimatePresence initial={false}>
                            {letterState === 'opened' && (
                              <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="space-y-3"
                              >
                                {letterParagraphs.map((paragraph, i) => (
                                  <p key={`p-${i}`} className="leading-7 text-[0.98rem]">{paragraph}</p>
                                ))}
                                {(scenes.closingMessage || (showSenderName && senderName)) && (
                                  <div className="text-right pt-2">
                                    {scenes.closingMessage ? <p className="font-dancing text-2xl text-[#a8485f]">{scenes.closingMessage}</p> : null}
                                    {showSenderName && senderName ? <p className="font-dancing text-xl text-[#6d3a4a] mt-1">— {senderName}</p> : null}
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>

                      <div className="absolute left-1/2 bottom-6 -translate-x-1/2 w-[84%] max-w-[440px] h-[220px]">
                        <div className="absolute inset-0 rounded-[16px] border border-[#ca8ca1] bg-gradient-to-b from-[#ffdce7] to-[#e8a6bb] shadow-[0_18px_34px_rgba(125,56,89,0.28)]" />
                        <div className="absolute inset-y-0 left-0 w-1/2 bg-[#d58fa4] [clip-path:polygon(0_0,100%_50%,0_100%)]" />
                        <div className="absolute inset-y-0 right-0 w-1/2 bg-[#d58fa4] [clip-path:polygon(100%_0,0_50%,100%_100%)]" />
                        <div className="absolute left-0 right-0 bottom-0 h-[58%] bg-[#ebb0c3] [clip-path:polygon(0_100%,50%_30%,100%_100%)] rounded-b-[16px]" />
                        <motion.div
                          className="absolute left-0 right-0 top-0 h-[56%] origin-top"
                          animate={letterState === 'opened' || letterState === 'opening' ? { rotateX: -176, y: -5 } : { rotateX: 0, y: 0 }}
                          transition={{ duration: 0.62, ease: [0.2, 0.75, 0.22, 1] }}
                          style={{ transformPerspective: 1100 }}
                        >
                          <div className="w-full h-full bg-[#ffd9e5] [clip-path:polygon(0_0,100%_0,50%_100%)] rounded-t-[16px]" />
                        </motion.div>
                        <motion.div
                          className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-gradient-to-br from-[#d62464] to-[#a90f4a] text-white flex items-center justify-center text-sm font-black border border-white/80"
                          animate={letterState === 'closed' ? { scale: [1, 1.08, 1], opacity: 1 } : { scale: 0.35, opacity: 0, y: -4 }}
                          transition={letterState === 'closed'
                            ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
                            : { duration: 0.2, ease: 'easeOut' }}
                        >
                          ♥
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'gallery' && (
                <div className="rounded-[28px] border border-[#28445f] bg-[#0f1827]/94 p-6">
                  <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: fnt.heading }}>{scenes.galleryTitle || 'Our Moments 📸'}</h3>
                  <p className="text-white/70 mb-5">{scenes.gallerySubtitle || 'A collection of our favorite memories.'}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {galleryItems.map((photo, i) => (
                      <motion.figure key={`gal-${i}`} whileHover={{ y: -4 }} className="rounded-2xl overflow-hidden border border-[#3a5169] bg-black/25">
                        <img src={photo.src} alt={photo.caption} className="w-full h-52 object-cover" />
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
                        style={{ backgroundColor: pal.primary }}
                      >
                        <Shuffle size={14} />
                        Shuffle
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {reasonCards.map((card, i) => (
                      <motion.div
                        key={card.id}
                        layout
                        initial={{ opacity: 0, scale: 0.86 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.02 }}
                        whileHover={{ y: -3, scale: 1.03 }}
                        className="aspect-square cursor-pointer"
                        style={{ perspective: '1000px' }}
                        onClick={() => flipReasonCard(card.id)}
                      >
                        <div
                          className="relative w-full h-full transition-all duration-500"
                          style={{ transformStyle: 'preserve-3d', transform: card.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                        >
                          <div
                            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center shadow-md border"
                            style={{ backgroundColor: pal.primary, backfaceVisibility: 'hidden', borderColor: pal.accent }}
                          >
                            <span className="text-white text-3xl mb-2">♥</span>
                            <span className="text-white/85 text-xs font-bold">#{i + 1}</span>
                          </div>
                          <div
                            className="absolute inset-0 rounded-2xl flex items-center justify-center p-3 shadow-md text-center"
                            style={{ backgroundColor: '#ffffff', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', border: `2px solid ${pal.accent}` }}
                          >
                            <p className="text-sm font-bold leading-snug" style={{ color: pal.text }}>{card.text}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
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

export default IvaBirthday;
