import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Music2, Play } from 'lucide-react';
import { extractYouTubeId } from './palettes';

const FALLBACK_PHOTOS = [
  '/templates/iva-birthday/IMG_5107.PNG',
  '/templates/iva-birthday/IMG_5109.PNG',
  '/templates/iva-birthday/IMG_4977.PNG',
  '/templates/iva-birthday/IMG_5086.PNG',
  '/templates/iva-birthday/IMG_5089.PNG',
];

const CLOUD_PUFFS = [
  { top: '8%', left: '-6%', width: 300, height: 170, rot: -7 },
  { top: '18%', right: '6%', width: 230, height: 130, rot: 6 },
  { top: '52%', left: '8%', width: 280, height: 170, rot: 4 },
  { top: '66%', right: '-4%', width: 310, height: 170, rot: -8 },
];

const STAR_STICKERS = [
  { top: '37%', left: '10%', size: 156, rotate: -10 },
  { top: '56%', right: '8%', size: 142, rotate: 10 },
  { bottom: '18%', right: '16%', size: 128, rotate: -14 },
];

const SCRATCH_SLOTS = [1, 2, 3, 4, 5];
const BOUQUET_FLOWER_FALLBACK = ['🌹', '🌷', '🌸', '🌺', '🌼', '🌻'];
const BOUQUET_STEM_ROTATIONS = [-15, -9, -4, 0, 4, 9, 15];
const FLOWER_KEYWORD_TO_EMOJI = {
  rose: '🌹',
  tulip: '🌷',
  lily: '🌸',
  peony: '🌺',
  hibiscus: '🌺',
  daisy: '🌼',
  sunflower: '🌻',
  blossom: '🌸',
  orchid: '🌸',
};

const normalizePin = (value) => {
  const digits = String(value || '').replace(/\D+/g, '');
  if (!digits) return '2611';
  return digits.slice(0, 8);
};

const ScratchPolaroid = ({
  imageUrl,
  revealed,
  onReveal,
  caption,
  scratchLabel,
  absolute = true,
  className = '',
  style,
}) => {
  return (
    <motion.button
      type="button"
      onClick={onReveal}
      className={`${absolute ? 'absolute w-[156px] max-w-[39vw]' : 'w-full'} rounded-[8px] bg-[#f6efe3] p-2 text-left shadow-[0_14px_26px_rgba(0,0,0,0.33)] ${className}`}
      whileTap={{ scale: 0.985 }}
      style={style}
    >
      <div className="relative overflow-hidden rounded-[6px] aspect-[4/5] bg-[#c5bcc0]">
        {imageUrl ? (
          <img src={imageUrl} alt={caption || 'memory photo'} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#d8cfd4] via-[#c3bac0] to-[#ac9fa7]" />
        )}

        <motion.div
          initial={false}
          animate={revealed
            ? { opacity: 0, clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }
            : { opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
          className="absolute inset-0 bg-gradient-to-br from-[#d7d0d6] via-[#bdb2bb] to-[#e4dfe4]"
        >
          <div className="absolute inset-0 flex items-center justify-center px-2 text-center">
            <span className="text-white/92 italic text-[30px] leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {scratchLabel}
            </span>
          </div>
        </motion.div>
      </div>

      <p className="mt-2 text-[13px] text-[#3c2a31] italic leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {caption}
      </p>
    </motion.button>
  );
};

const LeopardStar = ({ style }) => (
  <div
    className="absolute border-4 border-[#fff6eb] shadow-[0_10px_22px_rgba(0,0,0,0.28)]"
    style={{
      clipPath: 'polygon(50% 0, 62% 36%, 100% 38%, 71% 60%, 81% 100%, 50% 76%, 19% 100%, 29% 60%, 0 38%, 38% 36%)',
      background:
        'radial-gradient(circle at 24% 20%, rgba(0,0,0,0.92) 0 8%, transparent 9%), radial-gradient(circle at 72% 36%, rgba(0,0,0,0.86) 0 7%, transparent 8%), radial-gradient(circle at 38% 68%, rgba(0,0,0,0.88) 0 9%, transparent 10%), radial-gradient(circle at 84% 74%, rgba(0,0,0,0.8) 0 7%, transparent 8%), linear-gradient(135deg, #f2d7a8 0%, #cfab78 52%, #f2d7a8 100%)',
      ...style,
    }}
  />
);

const normalizeBouquetFlower = (rawValue, index) => {
  const clean = String(rawValue || '').trim();
  if (!clean) return BOUQUET_FLOWER_FALLBACK[index % BOUQUET_FLOWER_FALLBACK.length];
  if (/[\u{1F300}-\u{1FAFF}]/u.test(clean)) return clean;

  const normalized = clean.toLowerCase();
  const emojiFromKeyword = Object.entries(FLOWER_KEYWORD_TO_EMOJI).find(([keyword]) => normalized.includes(keyword))?.[1];
  if (emojiFromKeyword) return emojiFromKeyword;
  return BOUQUET_FLOWER_FALLBACK[index % BOUQUET_FLOWER_FALLBACK.length];
};

const BouquetCard = ({ title, note, flowers, className = '' }) => (
  <div className={`rounded-[18px] border border-[#f6d8e4] bg-[#f7efe3] p-3 shadow-[0_14px_30px_rgba(0,0,0,0.28)] ${className}`}>
    <p className="text-[11px] uppercase tracking-[0.18em] text-[#6e4e5c] font-bold">Personalized bouquet</p>
    <p className="mt-1 text-[34px] leading-[0.88] text-[#872343] italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      {title}
    </p>
    <div className="mt-2 rounded-[12px] border border-[#e8d8cc] bg-[#fffaf2] px-2.5 py-2.5">
      <div className="flex items-end justify-center gap-1.5 min-h-[86px]">
        {flowers.map((flower, index) => (
          <div key={`${flower}-${index}`} className="flex flex-col items-center" style={{ transform: `rotate(${BOUQUET_STEM_ROTATIONS[index % BOUQUET_STEM_ROTATIONS.length]}deg)` }}>
            <span className="text-[29px] leading-none">{flower}</span>
            <span className="mt-0.5 h-[36px] w-[2px] rounded-full bg-[#63906a]/75" />
          </div>
        ))}
      </div>
    </div>
    <p className="mt-2 text-[14px] italic text-[#4a3843] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      {note}
    </p>
  </div>
);

const BouquetGarden = ({
  recipientName,
  senderName,
  scenes = {},
  showSenderName = true,
  showFooter = true,
  musicEnabled = false,
  musicUrl = '',
}) => {
  const [phase, setPhase] = useState('gate'); // gate | envelope | board
  const [typedPin, setTypedPin] = useState('');
  const [gateError, setGateError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [scratchRevealed, setScratchRevealed] = useState({});
  const [showMemoryCard, setShowMemoryCard] = useState(false);

  const lockPin = normalizePin(scenes.accessPassword || scenes.lockCode || '2611');
  const hiddenMusicId = extractYouTubeId(musicUrl);
  const clipVideoId = useMemo(() => {
    const raw = String(scenes.youtubeUrl || '').trim();
    if (!raw) return '';
    return extractYouTubeId(raw);
  }, [scenes.youtubeUrl]);

  const displayFrom = String(
    scenes.lockFromLabel
    || (showSenderName && senderName ? senderName : '')
    || 'From me'
  ).trim();

  const displayTo = String(
    scenes.lockToLabel
    || recipientName
    || 'To you'
  ).trim();

  const favoriteLabel = String(scenes.favoriteLabel || 'Favorite person').trim();
  const bouquetTitle = String(scenes.bouquetTitle || 'For you, in bloom').trim();
  const bouquetNote = String(scenes.bouquetNote || 'Picked one by one, just for you.').trim();
  const bouquetFlowersRaw = String(scenes.bouquetFlowers || 'rose, tulip, peony, daisy, sunflower').trim();
  const scratchLabel = String(scenes.scratchLabel || 'Scratch me').trim();
  const boardTitle = String(scenes.scene2Header || 'Our secret garden').trim();
  const boardNote = String(
    scenes.letterText
    || 'Sometimes I catch myself smiling at my phone just because of you. You make ordinary days feel softer and brighter, and having you in my life is one of my favorite things.'
  ).trim();

  const boardNoteLines = boardNote.split('\n').filter(Boolean);
  const bouquetFlowers = useMemo(() => {
    const items = bouquetFlowersRaw
      .split(/[,\n|]+/)
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 7);
    const base = items.length > 0 ? items : ['rose', 'tulip', 'peony', 'daisy', 'sunflower'];
    return base.map((item, index) => normalizeBouquetFlower(item, index));
  }, [bouquetFlowersRaw]);

  const photos = SCRATCH_SLOTS.map((slot, index) => ({
    slot,
    src: String(scenes[`photo${slot}Url`] || FALLBACK_PHOTOS[index] || '').trim(),
    caption: String(scenes[`polaroidCaption${slot}`] || `Memory ${slot}`).trim(),
  }));

  const songTitle = String(scenes.spotifyTrackTitle || 'Just the Two of Us').trim();
  const songArtist = String(scenes.spotifyArtist || 'Grover Washington Jr., Bill Withers').trim();

  const mapTitle = String(scenes.mapTitle || 'Memory map').trim();
  const mapPlace = String(scenes.mapPlace || 'Saigon 26').trim();
  const postcardSubtitle = String(scenes.memorySubtitle || 'Somewhere special').trim();
  const voiceLabel = String(scenes.voiceLabel || 'Voice note').trim();

  const footerTitle = String(scenes.closingMessage || 'Grow your own garden').trim();
  const footerSubtitle = String(scenes.closingSubmessage || 'Made with flowers').trim();

  const pushPinDigit = (digit) => {
    if (phase !== 'gate' || isUnlocking) return;
    if (typedPin.length >= lockPin.length) return;

    const next = `${typedPin}${digit}`;
    setTypedPin(next);
    setGateError('');

    if (next.length === lockPin.length) {
      if (next === lockPin) {
        setIsUnlocking(true);
        window.setTimeout(() => {
          setPhase('envelope');
          setTypedPin('');
          setIsUnlocking(false);
        }, 1200);
      } else {
        setGateError('Wrong code. Try again.');
        window.setTimeout(() => {
          setTypedPin('');
        }, 520);
      }
    }
  };

  const removePinDigit = () => {
    if (isUnlocking) return;
    setTypedPin((prev) => prev.slice(0, -1));
  };

  const openEnvelope = () => {
    if (envelopeOpen) return;
    setEnvelopeOpen(true);
    window.setTimeout(() => setPhase('board'), 900);
  };

  const onRevealScratch = (slot) => {
    setScratchRevealed((prev) => ({ ...prev, [slot]: true }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f6f0e2] text-[#2e2426]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {musicEnabled && hiddenMusicId ? (
        <iframe
          src={`https://www.youtube.com/embed/${hiddenMusicId}?autoplay=1&loop=1&playlist=${hiddenMusicId}&controls=0`}
          allow="autoplay"
          className="absolute h-0 w-0 opacity-0 pointer-events-none"
          title="bouquet-garden-music"
        />
      ) : null}

      <AnimatePresence mode="wait">
        {phase === 'gate' && (
          <motion.section
            key="gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="min-h-screen relative flex items-center justify-center px-5"
            style={{
              background: 'radial-gradient(circle at 16% 24%, rgba(198,45,88,0.2), transparent 34%), radial-gradient(circle at 84% 16%, rgba(155,24,62,0.22), transparent 30%), linear-gradient(180deg, #f9f3e8 0%, #f8efe2 100%)',
            }}
          >
            {CLOUD_PUFFS.map((cloud, i) => (
              <div
                key={`cloud-${i}`}
                className="absolute rounded-[48%] opacity-[0.78]"
                style={{
                  width: cloud.width,
                  height: cloud.height,
                  transform: `rotate(${cloud.rot}deg)`,
                  background: 'radial-gradient(circle at 40% 45%, rgba(199,46,86,0.56), rgba(149,25,61,0.7))',
                  filter: 'blur(0.2px)',
                  ...cloud,
                }}
              />
            ))}

            <div className="absolute top-7 left-7 text-[42px] text-[#8a1a42]">☾</div>
            <div className="absolute top-8 right-9 text-[40px] text-[#8a1a42]">♥</div>

            <motion.div
              animate={gateError ? { x: [0, -10, 10, -8, 8, 0] } : { x: 0 }}
              transition={{ duration: 0.42 }}
              className="relative z-10 w-full max-w-[370px] text-center"
            >
              <div className="mx-auto mb-6 h-[88px] w-[88px] rounded-full bg-[#9c1f4d] text-[#fdece5] shadow-[0_18px_36px_rgba(112,10,45,0.35)] flex items-center justify-center">
                <Heart size={36} className="fill-current" />
              </div>

              <p className="text-[28px] italic leading-none text-[#522631]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                From: {displayFrom}
              </p>
              <p className="mt-1 text-[28px] italic leading-none text-[#522631]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                To: {displayTo}
              </p>

              <div className="mt-6 flex items-center justify-center gap-2.5">
                {Array.from({ length: lockPin.length }).map((_, index) => (
                  <span
                    key={`pin-dot-${index}`}
                    className={`h-3.5 w-3.5 rounded-full border ${typedPin.length > index ? 'bg-[#9e1e4f] border-[#9e1e4f]' : 'border-[#ad9a92] bg-transparent'}`}
                  />
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                  <button
                    key={`digit-${digit}`}
                    type="button"
                    onClick={() => pushPinDigit(digit)}
                    className="h-12 rounded-xl border border-[#d5c6bb] bg-[#f7ede3] text-[#5f3b46] text-lg font-semibold shadow-sm hover:bg-[#f4e3d8]"
                  >
                    {digit}
                  </button>
                ))}
                <div />
                <button
                  type="button"
                  onClick={() => pushPinDigit(0)}
                  className="h-12 rounded-xl border border-[#d5c6bb] bg-[#f7ede3] text-[#5f3b46] text-lg font-semibold shadow-sm hover:bg-[#f4e3d8]"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={removePinDigit}
                  className="h-12 rounded-xl border border-[#d5c6bb] bg-[#f7ede3] text-[#5f3b46] text-lg font-semibold shadow-sm hover:bg-[#f4e3d8]"
                >
                  ←
                </button>
              </div>

              <p className="min-h-[22px] mt-3 text-sm text-[#9c2f59] font-medium">{gateError}</p>
            </motion.div>

            {isUnlocking && (
              <div className="absolute inset-0 pointer-events-none z-20">
                {Array.from({ length: 36 }).map((_, i) => (
                  <motion.span
                    key={`bloom-${i}`}
                    className="absolute text-[24px]"
                    initial={{
                      opacity: 1,
                      x: '50vw',
                      y: '50vh',
                      scale: 0.4,
                    }}
                    animate={{
                      opacity: 0,
                      x: `${50 + Math.cos((i / 36) * Math.PI * 2) * (14 + (i % 4) * 7)}vw`,
                      y: `${50 + Math.sin((i / 36) * Math.PI * 2) * (17 + (i % 3) * 8)}vh`,
                      scale: 1.26,
                    }}
                    transition={{ duration: 0.95, ease: 'easeOut', delay: (i % 6) * 0.02 }}
                  >
                    {i % 4 === 0 ? '🌸' : i % 3 === 0 ? '🌺' : '🌹'}
                  </motion.span>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {phase === 'envelope' && (
          <motion.section
            key="envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-5"
            style={{ background: '#f3ecd9' }}
          >
            <motion.button
              type="button"
              onClick={openEnvelope}
              whileTap={{ scale: 0.98 }}
              className="relative h-[220px] w-[280px]"
            >
              <div className="absolute inset-0 rounded-[12px] bg-gradient-to-b from-[#c54665] via-[#af2f52] to-[#8f1f43] shadow-[0_24px_44px_rgba(94,12,39,0.36)]" />
              <div className="absolute inset-y-0 left-0 w-1/2 bg-[#952647] [clip-path:polygon(0_0,100%_50%,0_100%)]" />
              <div className="absolute inset-y-0 right-0 w-1/2 bg-[#952647] [clip-path:polygon(100%_0,0_50%,100%_100%)]" />
              <div className="absolute left-0 right-0 bottom-0 h-[58%] bg-[#cb4f6f] [clip-path:polygon(0_100%,50%_30%,100%_100%)] rounded-b-[12px]" />
              <motion.div
                className="absolute inset-x-0 top-0 h-[56%] origin-top [transform-style:preserve-3d]"
                animate={envelopeOpen ? { rotateX: -170, y: -4 } : { rotateX: 0, y: 0 }}
                transition={{ duration: 0.68, ease: [0.22, 0.82, 0.24, 1] }}
              >
                <div className="h-full w-full rounded-t-[12px] bg-gradient-to-b from-[#ef8ca4] via-[#f4b8c8] to-[#e76f8c] [clip-path:polygon(0_0,100%_0,50%_100%)] border-t border-white/50" />
              </motion.div>

              <motion.div
                className="absolute left-1/2 top-[56%] z-10 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f7d8d4] bg-gradient-to-br from-[#d24b78] to-[#931f4c] text-[#ffe9e3] flex items-center justify-center"
                animate={envelopeOpen ? { scale: 0.2, opacity: 0, y: -8 } : { scale: [1, 1.08, 1], opacity: 1 }}
                transition={envelopeOpen ? { duration: 0.16 } : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                ♥
              </motion.div>

              <p className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-[32px] italic text-[#8f2c4a]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {scenes.envelopeHint || 'Tap to open'}
              </p>
            </motion.button>
          </motion.section>
        )}

        {phase === 'board' && (
          <motion.section
            key="board"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-screen relative overflow-y-auto"
            style={{
              backgroundColor: '#7f0d27',
              backgroundImage:
                'radial-gradient(circle at 12% 18%, rgba(165,27,61,0.6), transparent 35%), radial-gradient(circle at 75% 22%, rgba(196,61,89,0.45), transparent 42%), radial-gradient(circle at 52% 72%, rgba(120,14,40,0.66), transparent 40%), linear-gradient(145deg, rgba(255,255,255,0.06), transparent 36%), linear-gradient(35deg, rgba(0,0,0,0.16), transparent 42%)',
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,rgba(0,0,0,0.22)_100%)]" />

            <div className="relative mx-auto w-full max-w-[1080px] min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
              <div className="relative z-10 space-y-4 pb-16 lg:hidden">
                <div className="rounded-full border border-[#f6dce4] bg-black/28 px-4 py-2 shadow-[0_10px_20px_rgba(0,0,0,0.32)]">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#ffdbe7] font-bold">{boardTitle}</p>
                </div>

                <div className="rounded-[16px] bg-[#f4e6d5] px-4 py-3 shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                  <p
                    className="text-[36px] leading-[0.82] text-[#8b1f43] italic"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {favoriteLabel}
                  </p>
                </div>

                <BouquetCard
                  title={bouquetTitle}
                  note={bouquetNote}
                  flowers={bouquetFlowers}
                />

                {clipVideoId ? (
                  <div className="rounded-[18px] border border-white/40 bg-black/70 p-1 shadow-[0_18px_34px_rgba(0,0,0,0.38)]">
                    <div className="overflow-hidden rounded-[14px]">
                      <iframe
                        src={`https://www.youtube.com/embed/${clipVideoId}?autoplay=0&controls=1`}
                        title="favorite clip"
                        className="aspect-video w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[16px] border border-white/35 bg-[#22151a]/82 p-4 text-white shadow-[0_14px_28px_rgba(0,0,0,0.36)]">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70 font-bold">Favorite clip</p>
                    <p className="mt-2 text-sm text-white/90">Add a YouTube link in editor to show your special video here.</p>
                  </div>
                )}

                <div className="rounded-[18px] border border-[#f2b7c6] bg-[#1f1f24]/88 p-3 shadow-[0_14px_30px_rgba(0,0,0,0.35)]">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-md bg-[#3f2a36]" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold text-white">{songTitle}</p>
                      <p className="truncate text-xs text-white/66">{songArtist}</p>
                    </div>
                    <button type="button" className="h-9 w-9 rounded-full border border-white/45 text-white flex items-center justify-center">
                      <Play size={16} className="translate-x-[1px]" />
                    </button>
                  </div>
                  <div className="mt-3 h-1 rounded-full bg-white/16">
                    <div className="h-full w-[37%] rounded-full bg-white/70" />
                  </div>
                </div>

                <div className="rounded-[14px] border border-[#f6e1de] bg-[#1f1b23]/92 px-4 py-4 shadow-[0_18px_35px_rgba(0,0,0,0.35)]">
                  <div className="mb-3 flex items-center gap-2 text-[#f8dde5]">
                    <div className="h-7 w-7 rounded-full bg-[#8e1f46] flex items-center justify-center text-sm">♥</div>
                    <p className="text-[11px] uppercase tracking-[0.17em] font-bold">From: {displayFrom} · For: {displayTo}</p>
                  </div>
                  <div className="space-y-2">
                    {boardNoteLines.map((line, idx) => (
                      <p key={`mobile-note-line-${idx}`} className="text-[#fff5f6] text-[25px] leading-[0.98] italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {photos.map((photo, index) => (
                    <ScratchPolaroid
                      key={`mobile-photo-${photo.slot}`}
                      imageUrl={photo.src}
                      revealed={Boolean(scratchRevealed[photo.slot])}
                      onReveal={() => onRevealScratch(photo.slot)}
                      caption={photo.caption}
                      scratchLabel={scratchLabel}
                      absolute={false}
                      className={index === photos.length - 1 ? 'col-span-2 mx-auto max-w-[220px]' : ''}
                    />
                  ))}
                </div>

                <div className="rounded-[18px] border border-white/45 bg-[#f3efe4] p-3 shadow-[0_14px_30px_rgba(0,0,0,0.35)]">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#5f6c61] font-bold">Map pin</p>
                  <p className="text-[34px] leading-[0.9] mt-1 text-[#1f2c1d]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{mapTitle}</p>
                  <button
                    type="button"
                    onClick={() => setShowMemoryCard(true)}
                    className="mt-2 block w-full overflow-hidden rounded-xl border border-[#b9c4b4]"
                  >
                    <div
                      className="h-[130px] w-full"
                      style={{
                        backgroundImage:
                          'radial-gradient(circle at 30% 26%, rgba(130,154,122,0.45), transparent 28%), linear-gradient(115deg, #70856f 0%, #95a48e 48%, #7a8f77 100%), repeating-linear-gradient(15deg, rgba(255,255,255,0.32), rgba(255,255,255,0.32) 2px, transparent 2px, transparent 26px), repeating-linear-gradient(110deg, rgba(255,255,255,0.14), rgba(255,255,255,0.14) 1px, transparent 1px, transparent 19px)',
                      }}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[#f4d8c5] px-1">
                  <p className="text-[46px] leading-none -rotate-6 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>i/o</p>
                  <div className="flex items-center gap-2 text-[38px]">
                    <span>😺</span>
                    <span>🐈</span>
                    <span>💐</span>
                  </div>
                </div>

                {showFooter ? (
                  <div className="pt-2 text-center">
                    <p className="inline-block rounded-full bg-black/28 px-4 py-1.5 text-[#f7ede2] text-[30px] leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {footerTitle}
                    </p>
                    <p className="mt-1 text-[#f7ede2] text-sm font-medium">{footerSubtitle}</p>
                  </div>
                ) : null}
              </div>

              <div className="relative hidden lg:block min-h-[1450px]">
                {clipVideoId ? (
                  <div className="absolute left-[6%] top-[9%] w-[320px] max-w-[64vw] rounded-[18px] border border-white/40 bg-black/70 p-1 shadow-[0_18px_34px_rgba(0,0,0,0.38)]">
                    <div className="overflow-hidden rounded-[14px]">
                      <iframe
                        src={`https://www.youtube.com/embed/${clipVideoId}?autoplay=0&controls=1`}
                        title="favorite clip"
                        className="aspect-video w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ) : (
                  <div className="absolute left-[6%] top-[10%] w-[290px] max-w-[62vw] rounded-[16px] border border-white/35 bg-[#22151a]/82 p-4 text-white shadow-[0_14px_28px_rgba(0,0,0,0.36)]">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70 font-bold">Favorite clip</p>
                    <p className="mt-2 text-sm text-white/90">Add a YouTube link in editor to show your special video here.</p>
                  </div>
                )}

                <div className="absolute left-[5%] top-[3.8%] rounded-full border border-[#f6dce4] bg-black/28 px-4 py-2 shadow-[0_10px_20px_rgba(0,0,0,0.32)] max-w-[72vw]">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#ffdbe7] font-bold">{boardTitle}</p>
                </div>

                <div className="absolute right-[8%] top-[9%] rounded-[18px] bg-[#f4e6d5] px-4 py-3 shadow-[0_10px_20px_rgba(0,0,0,0.3)] max-w-[240px]">
                  <p
                    className="text-[46px] leading-[0.78] text-[#8b1f43] italic"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {favoriteLabel}
                  </p>
                </div>

                <BouquetCard
                  title={bouquetTitle}
                  note={bouquetNote}
                  flowers={bouquetFlowers}
                  className="absolute left-[36%] top-[24%] w-[280px] max-w-[30vw]"
                />

                <div className="absolute right-[6%] top-[28%] w-[350px] max-w-[72vw] rounded-[20px] border border-[#f2b7c6] bg-[#1f1f24]/88 p-3 shadow-[0_14px_30px_rgba(0,0,0,0.35)]">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-[#3f2a36]" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-semibold text-white">{songTitle}</p>
                      <p className="truncate text-[13px] text-white/66">{songArtist}</p>
                    </div>
                    <button type="button" className="h-10 w-10 rounded-full border border-white/45 text-white flex items-center justify-center">
                      <Play size={17} className="translate-x-[1px]" />
                    </button>
                  </div>
                  <div className="mt-3 h-1 rounded-full bg-white/16">
                    <div className="h-full w-[37%] rounded-full bg-white/70" />
                  </div>
                </div>

                {STAR_STICKERS.map((star, index) => (
                  <LeopardStar key={`leopard-star-${index}`} style={{
                    width: star.size,
                    height: star.size,
                    transform: `rotate(${star.rotate}deg)`,
                    ...star,
                  }} />
                ))}

                <div className="absolute left-[7%] top-[42%] rounded-[14px] border border-[#f6e1de] bg-[#1f1b23]/92 px-6 py-5 max-w-[430px] shadow-[0_18px_35px_rgba(0,0,0,0.35)]">
                  <div className="mb-3 flex items-center gap-3 text-[#f8dde5]">
                    <div className="h-8 w-8 rounded-full bg-[#8e1f46] flex items-center justify-center">♥</div>
                    <p className="text-[13px] uppercase tracking-[0.2em] font-bold">From: {displayFrom} · For: {displayTo}</p>
                  </div>
                  <div className="space-y-2">
                    {boardNoteLines.map((line, idx) => (
                      <p key={`note-line-${idx}`} className="text-[#fff5f6] text-[31px] leading-[1.02] italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="absolute right-[6%] bottom-[19%] rounded-[18px] border border-white/45 bg-[#f3efe4] p-3 w-[262px] max-w-[70vw] shadow-[0_14px_30px_rgba(0,0,0,0.35)]">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#5f6c61] font-bold">Map pin</p>
                  <p className="text-[36px] leading-[0.9] mt-1 text-[#1f2c1d]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{mapTitle}</p>
                  <button
                    type="button"
                    onClick={() => setShowMemoryCard(true)}
                    className="mt-2 block w-full overflow-hidden rounded-xl border border-[#b9c4b4]"
                  >
                    <div
                      className="h-[130px] w-full"
                      style={{
                        backgroundImage:
                          'radial-gradient(circle at 30% 26%, rgba(130,154,122,0.45), transparent 28%), linear-gradient(115deg, #70856f 0%, #95a48e 48%, #7a8f77 100%), repeating-linear-gradient(15deg, rgba(255,255,255,0.32), rgba(255,255,255,0.32) 2px, transparent 2px, transparent 26px), repeating-linear-gradient(110deg, rgba(255,255,255,0.14), rgba(255,255,255,0.14) 1px, transparent 1px, transparent 19px)',
                      }}
                    />
                  </button>
                </div>

                <div className="absolute left-[9%] bottom-[16%] text-[90px] leading-none text-[#f4d8c5] opacity-95 rotate-[-8deg]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  i/o
                </div>

                <div className="absolute left-[10%] bottom-[7%] text-[70px]">😺</div>
                <div className="absolute left-[18%] bottom-[6.2%] text-[66px]">🐈</div>

                <div className="absolute right-[17%] bottom-[8%] text-[90px]">💐</div>

                <ScratchPolaroid
                  imageUrl={photos[0].src}
                  revealed={Boolean(scratchRevealed[1])}
                  onReveal={() => onRevealScratch(1)}
                  caption={photos[0].caption}
                  scratchLabel={scratchLabel}
                  style={{ top: '42%', right: '33%', transform: 'rotate(-6deg)' }}
                />
                <ScratchPolaroid
                  imageUrl={photos[1].src}
                  revealed={Boolean(scratchRevealed[2])}
                  onReveal={() => onRevealScratch(2)}
                  caption={photos[1].caption}
                  scratchLabel={scratchLabel}
                  style={{ top: '58%', right: '8%', transform: 'rotate(8deg)' }}
                />
                <ScratchPolaroid
                  imageUrl={photos[2].src}
                  revealed={Boolean(scratchRevealed[3])}
                  onReveal={() => onRevealScratch(3)}
                  caption={photos[2].caption}
                  scratchLabel={scratchLabel}
                  style={{ top: '63%', left: '8%', transform: 'rotate(-8deg)' }}
                />
                <ScratchPolaroid
                  imageUrl={photos[3].src}
                  revealed={Boolean(scratchRevealed[4])}
                  onReveal={() => onRevealScratch(4)}
                  caption={photos[3].caption}
                  scratchLabel={scratchLabel}
                  style={{ top: '73%', left: '38%', transform: 'rotate(6deg)' }}
                />
                <ScratchPolaroid
                  imageUrl={photos[4].src}
                  revealed={Boolean(scratchRevealed[5])}
                  onReveal={() => onRevealScratch(5)}
                  caption={photos[4].caption}
                  scratchLabel={scratchLabel}
                  style={{ top: '80%', right: '32%', transform: 'rotate(-4deg)' }}
                />

                {showFooter ? (
                  <div className="absolute right-[4%] bottom-[2.4%] text-right">
                    <p className="inline-block rounded-full bg-black/28 px-4 py-1.5 text-[#f7ede2] text-[36px] leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {footerTitle}
                    </p>
                    <p className="mt-1 text-[#f7ede2] text-base font-medium">{footerSubtitle}</p>
                  </div>
                ) : null}
              </div>
            </div>

            <AnimatePresence>
              {showMemoryCard && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] flex items-center justify-center px-4"
                  onClick={() => setShowMemoryCard(false)}
                >
                  <motion.div
                    initial={{ y: 20, scale: 0.96, opacity: 0 }}
                    animate={{ y: 0, scale: 1, opacity: 1 }}
                    exit={{ y: 12, scale: 0.98, opacity: 0 }}
                    className="w-full max-w-[360px] rounded-[24px] bg-[#f5efe2] border border-[#f7dfce] p-4 text-left shadow-[0_30px_60px_rgba(0,0,0,0.38)]"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="overflow-hidden rounded-[14px] border border-[#dac9b8] bg-[#d9d0c4] aspect-[4/3]">
                      {photos[4]?.src ? (
                        <img src={photos[4].src} alt={mapPlace} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-[#b8afa3] via-[#cabfb1] to-[#a9a091]" />
                      )}
                    </div>
                    <p className="mt-3 text-[11px] tracking-[0.2em] uppercase text-[#705c52]">Memory pin</p>
                    <p className="text-[44px] leading-none text-[#1f1713]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{mapPlace}</p>
                    <p className="mt-1 text-[#6b5b53] italic text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{postcardSubtitle}</p>
                    <div className="mt-4 rounded-full border border-[#dfd3c8] bg-white px-3 py-2 flex items-center gap-3">
                      <button type="button" className="h-8 w-8 rounded-full bg-[#2f6f47] text-white flex items-center justify-center">
                        <Play size={14} className="translate-x-[1px]" />
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#222]">{voiceLabel}</p>
                        <p className="text-xs text-[#7a746e]">tap to listen</p>
                      </div>
                      <Music2 size={16} className="text-[#4f4a45]" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMemoryCard(false)}
                      className="mt-4 w-full rounded-full border border-[#c9b8a8] bg-[#f8f2ea] py-2.5 text-sm font-semibold text-[#4a3530]"
                    >
                      Close
                    </button>
                  </motion.div>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BouquetGarden;
