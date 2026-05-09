import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Image as ImageIcon, BookOpen, Home, Lock, Plus, Sparkles } from 'lucide-react';
import { palettes, fonts, extractYouTubeId } from './palettes';

const FALLBACK_PHOTOS = [
  '/templates/iva-birthday/IMG_5107.PNG',
  '/templates/iva-birthday/IMG_5109.PNG',
  '/templates/iva-birthday/IMG_4977.PNG',
  '/templates/iva-birthday/IMG_5086.PNG',
  '/templates/iva-birthday/IMG_5089.PNG',
];

const FUNNY_NO_LINES = [
  'NE dugme trenutno ne radi 😏',
  'Nice try, but this is a YES-only zone 💘',
  'You can run, but you cannot hide from love ✨',
  'The answer is still YES 😌',
];

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
  const [diaryInput, setDiaryInput] = useState('');
  const [notes, setNotes] = useState([]);
  const [cardOpen, setCardOpen] = useState(false);

  const pal = palettes[palette] || palettes.navy;
  const fnt = fonts[font] || fonts.playful;
  const videoId = extractYouTubeId(musicUrl);
  const loveTimer = formatTogether(scenes.startDate);

  const expectedName = (scenes.accessName || recipientName || 'Iva').trim().toLowerCase();
  const expectedPassword = (scenes.accessPassword || 'volim te').trim().toLowerCase();

  const galleryItems = useMemo(
    () => [1, 2, 3, 4, 5].map((slot, i) => ({
      src: scenes[`photo${slot}Url`] || FALLBACK_PHOTOS[i],
      caption: scenes[`polaroidCaption${slot}`] || `Memory ${slot}`,
    })),
    [scenes]
  );

  const reasonItems = useMemo(() => {
    if (Array.isArray(reasons) && reasons.filter(Boolean).length > 0) {
      return reasons.filter(Boolean).slice(0, 18);
    }
    return [
      `You make every day brighter, ${recipientName || 'love'}.`,
      'You turn small moments into favorite memories.',
      'Your smile feels like home.',
      'You make life softer and warmer.',
      'You are my safest place and my happiest thought.',
      'With you, everything feels more alive.',
    ];
  }, [reasons, recipientName]);

  const letterText = scenes.letterText || 'Happy birthday, my love. This little space is made just for you.';
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
    setQuestionMessage('Knew it 💍 Opening your birthday world...');
    setTimeout(() => setScreen('main'), 900);
  };

  const addDiaryNote = () => {
    const trimmed = diaryInput.trim();
    if (!trimmed) return;
    setNotes((prev) => [{ text: trimmed, id: `${Date.now()}-${Math.random()}` }, ...prev].slice(0, 8));
    setDiaryInput('');
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
          title="birthday background music"
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
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: fnt.heading }}>{scenes.welcomeTitle || 'Dobro dosla, ljubavi 🩵'}</h1>
              <p className="text-white/70 mb-6">{scenes.welcomeSubtitle || 'Ovo je nas mali, privatni svet.'}</p>
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
                Enter Birthday Space ✨
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
                  DA 💍
                </button>
                <motion.button
                  onClick={handleNoClick}
                  animate={{ x: noButtonOffset.x, y: noButtonOffset.y }}
                  transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                  className="absolute left-1/2 translate-x-[10%] top-5 rounded-full px-8 py-3 border border-[#76517a] bg-transparent text-[#ffb4c7] font-bold"
                >
                  NE 🙈
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
                    { id: 'diary', label: 'Diary', icon: BookOpen },
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
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
                  <div className="rounded-[28px] border border-[#28445f] bg-[#111b2b]/94 p-7">
                    <p className="uppercase tracking-[0.24em] text-xs text-[#77d7ff] font-black mb-3">Birthday Letter</p>
                    <h2 className="text-4xl font-bold mb-3" style={{ fontFamily: fnt.heading }}>{scenes.homeTitle || 'Srecan rodjendan, ljubavi 🩵'}</h2>
                    <p className="text-white/75 mb-6">{scenes.homeSubtitle || 'Svaki klik je mali podsetnik koliko te volim.'}</p>

                    <div className="rounded-2xl border border-[#48607a] bg-[#fdf5e7] text-[#2f2318] p-5 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setCardOpen((prev) => !prev)}
                        className="w-full text-left flex items-center justify-between font-bold text-[#8b3b4e] mb-3"
                      >
                        <span>{cardOpen ? 'Close letter' : 'Open birthday letter'}</span>
                        <Sparkles size={16} />
                      </button>
                      <AnimatePresence initial={false}>
                        {cardOpen && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="space-y-4">
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
                  </div>

                  <div className="rounded-[28px] border border-[#28445f] bg-[#0d1624]/94 p-6 flex flex-col">
                    <h3 className="text-xl font-bold mb-4" style={{ fontFamily: fnt.heading }}>{scenes.sideCardTitle || 'Quick Memories'}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {galleryItems.slice(0, 4).map((photo, i) => (
                        <div key={`mini-${i}`} className="rounded-xl overflow-hidden border border-[#3a5169] bg-black/30">
                          <img src={photo.src} alt={photo.caption} className="w-full h-24 object-cover" />
                          <p className="text-[11px] px-2 py-1.5 text-white/75 line-clamp-1">{photo.caption}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === 'gallery' && (
                <div className="rounded-[28px] border border-[#28445f] bg-[#0f1827]/94 p-6">
                  <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: fnt.heading }}>{scenes.galleryTitle || 'Naši trenuci 📸'}</h3>
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
                  <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: fnt.heading }}>{scenes.reasonsTitle || 'Razlozi zasto te volim 🩵'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {reasonItems.map((reason, i) => (
                      <div key={`reason-${i}`} className="rounded-xl border border-[#33516e] bg-[#122237] px-4 py-3">
                        <p className="text-sm text-white/90"><span className="text-[#77d7ff] font-bold mr-2">{i + 1}.</span>{reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'diary' && (
                <div className="rounded-[28px] border border-[#28445f] bg-[#0f1827]/94 p-6">
                  <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: fnt.heading }}>{scenes.diaryTitle || 'Mini dnevnik ✍️'}</h3>
                  <p className="text-white/70 mb-4">{scenes.diarySubtitle || 'Write a tiny note and keep it here.'}</p>
                  <div className="flex gap-2 mb-4">
                    <input
                      value={diaryInput}
                      onChange={(e) => setDiaryInput(e.target.value)}
                      placeholder="Write a note..."
                      className="flex-1 bg-[#0a111a] border border-[#2d4a66] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#77d7ff]"
                    />
                    <button onClick={addDiaryNote} className="rounded-xl px-4 py-3 bg-[#77d7ff] text-[#05101a] font-bold inline-flex items-center gap-1">
                      <Plus size={16} /> Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {notes.length === 0 ? (
                      <p className="text-sm text-white/60">No notes yet.</p>
                    ) : (
                      notes.map((note) => (
                        <div key={note.id} className="rounded-xl border border-[#32516f] bg-[#122237] px-4 py-3 text-sm">
                          {note.text}
                        </div>
                      ))
                    )}
                  </div>
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
