import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WINE = '#7B1C2E';
const BLUSH = '#F2D9DC';
const IVORY = '#FAF3E8';

const HeartLock = ({ open }) => (
  <svg width="90" height="104" viewBox="0 0 90 104" fill="none">
    <path d="M45 40C45 40 18 26 18 12C18 4 25 0 32 0C38 0 42 3 45 8C48 3 52 0 58 0C65 0 72 4 72 12C72 26 45 40 45 40Z" fill={WINE}/>
    <motion.path
      d="M30 40C30 28 38 22 45 22C52 22 60 28 60 40"
      stroke={WINE} strokeWidth="8" fill="none" strokeLinecap="round"
      animate={open ? { rotate: -22, y: -10, originX: '45px', originY: '40px' } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ transformOrigin: '45px 40px' }}
    />
    <rect x="20" y="38" width="50" height="42" rx="9" fill={WINE}/>
    <circle cx="45" cy="57" r="6" fill={IVORY}/>
    <rect x="43" y="57" width="4" height="10" rx="2" fill={IVORY}/>
    <line x1="58" y1="80" x2="58" y2="98" stroke={WINE} strokeWidth="2.5"/>
    <ellipse cx="58" cy="100" rx="5" ry="3" fill={WINE}/>
    <path d="M55 90 L58 86 L61 90Z" fill={WINE}/>
  </svg>
);

const CloudPuff = ({ style }) => (
  <div style={{
    position: 'absolute', borderRadius: '50%', opacity: 0.2,
    background: 'radial-gradient(circle, #9B2335 0%, #7B1C2E 100%)',
    filter: 'blur(2px)', ...style
  }}/>
);

const LockBg = () => (
  <>
    <CloudPuff style={{ width: 260, height: 130, top: '6%', left: '-8%', transform: 'rotate(-7deg)' }}/>
    <CloudPuff style={{ width: 200, height: 110, top: '21%', right: '4%', transform: 'rotate(6deg)' }}/>
    <CloudPuff style={{ width: 240, height: 130, top: '55%', left: '7%', transform: 'rotate(4deg)' }}/>
    <CloudPuff style={{ width: 280, height: 140, top: '70%', right: '-5%', transform: 'rotate(-8deg)' }}/>
    {['7% / 6%', '9% / right 8%', '32% / 4%', 'bottom 28% / right 6%', 'bottom 12% / 8%'].map((pos, i) => {
      const [top, left] = pos.split(' / ');
      const isRight = left && left.startsWith('right');
      const style = { position: 'absolute', color: WINE, fontSize: [36, 30, 22, 28, 18][i], opacity: [0.5, 0.45, 0.35, 0.4, 0.3][i] };
      if (isRight) { style.top = top; style.right = left.replace('right ', ''); }
      else { style.top = top; style.left = left; }
      return <div key={i} style={style}>{['☾', '♥', '✿', '✿', '❤'][i]}</div>;
    })}
    <div style={{ position: 'absolute', top: '44%', right: '5%', color: WINE, fontSize: 14, opacity: 0.28 }}>•</div>
    <div style={{ position: 'absolute', top: '62%', left: '12%', color: WINE, fontSize: 12, opacity: 0.24 }}>•</div>
    <div style={{ position: 'absolute', bottom: '20%', right: '14%', color: WINE, fontSize: 20, opacity: 0.3 }}>✦</div>
  </>
);

const FlowerWall = () => {
  const flowers = [
    ['#A01830', '#C03050'], ['#E8A0A8', '#F0C0C8'], ['#FFF5F5', '#FFEEF0'],
    ['#C84060', '#E06080'], ['#F0C0C8', '#F8D8DC'],
  ];
  const grid = Array.from({ length: 35 }, (_, i) => ({
    x: (i % 7) * 56 + 20 + Math.sin(i * 1.9) * 10,
    y: Math.floor(i / 7) * 90 + 60,
    colors: flowers[i % 5],
    rot: (i * 37) % 60,
    size: 12 + (i % 4) * 2,
  }));
  return (
    <svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
      {grid.map((f, i) => (
        <g key={i} transform={`translate(${f.x},${f.y})`}>
          {[0, 60, 120, 180, 240, 300].map(a => {
            const rad = (a + f.rot) * Math.PI / 180;
            return (
              <ellipse key={a}
                cx={Math.cos(rad) * (f.size + 4)} cy={Math.sin(rad) * (f.size + 4)}
                rx={f.size} ry={f.size / 2.2}
                fill={f.colors[0]} opacity="0.88"
                transform={`rotate(${a + f.rot} ${Math.cos(rad) * (f.size + 4)} ${Math.sin(rad) * (f.size + 4)})`}
              />
            );
          })}
          <circle cx="0" cy="0" r={f.size / 2.5} fill={f.colors[1]}/>
        </g>
      ))}
    </svg>
  );
};

const LeopardStar = ({ style }) => (
  <div style={{
    position: 'absolute',
    clipPath: 'polygon(50% 0,62% 36%,100% 38%,71% 60%,81% 100%,50% 76%,19% 100%,29% 60%,0 38%,38% 36%)',
    background: [
      'radial-gradient(circle at 22% 18%, rgba(0,0,0,0.9) 0 8%, transparent 9%)',
      'radial-gradient(circle at 70% 34%, rgba(0,0,0,0.85) 0 7%, transparent 8%)',
      'radial-gradient(circle at 36% 66%, rgba(0,0,0,0.88) 0 9%, transparent 10%)',
      'radial-gradient(circle at 82% 72%, rgba(0,0,0,0.8) 0 7%, transparent 8%)',
      'linear-gradient(135deg, #f2d7a8 0%, #cfab78 52%, #f2d7a8 100%)',
    ].join(','),
    outline: '3px solid white',
    ...style
  }}/>
);

const BouquetIllustration = ({ size = 150 }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 150 188" fill="none">
    <path d="M52 138 Q75 98 98 138" stroke="#D4A96A" strokeWidth="30" strokeLinecap="round" fill="none"/>
    <line x1="75" y1="138" x2="75" y2="188" stroke="#A87040" strokeWidth="3"/>
    <line x1="55" y1="152" x2="95" y2="152" stroke="#5BA8A0" strokeWidth="3.5" strokeLinecap="round"/>
    {[
      { cx: 54, cy: 84, col: '#C84820', center: '#8B1A30' },
      { cx: 76, cy: 56, col: '#F8F8F4', center: '#E8E0D0' },
      { cx: 100, cy: 78, col: '#E07038', center: '#983810' },
      { cx: 64, cy: 52, col: '#C84820', center: '#8B1A30' },
      { cx: 90, cy: 100, col: '#F8F8F4', center: '#E0D8C8' },
    ].map(({ cx, cy, col, center }, fi) =>
      [0, 72, 144, 216, 288].map(a => {
        const rad = a * Math.PI / 180;
        return (
          <ellipse key={`${fi}-${a}`}
            cx={cx + Math.cos(rad) * 13} cy={cy + Math.sin(rad) * 13}
            rx="11" ry="6" fill={col} opacity="0.9"
            transform={`rotate(${a} ${cx + Math.cos(rad) * 13} ${cy + Math.sin(rad) * 13})`}
          />
        );
      }).concat(<circle key={`c${fi}`} cx={cx} cy={cy} r="7" fill={center}/>)
    )}
  </svg>
);

const Polaroid = ({ src, caption, scratchLabel, revealed, onReveal, style }) => (
  <button type="button" onClick={onReveal} style={{
    position: 'absolute', background: '#F5ECD7',
    padding: '8px 8px 30px', borderRadius: 4,
    boxShadow: '0 4px 18px rgba(0,0,0,0.4)', border: 'none',
    cursor: 'pointer', textAlign: 'center', ...style
  }}>
    <div style={{ width: 112, height: 134, position: 'relative', overflow: 'hidden', background: '#5A2030' }}>
      {src
        ? <img src={src} alt={caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#6B3040,#3D0A14)' }}/>
      }
      {!revealed && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg,#4a2535,#201018)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ color: 'rgba(255,255,255,0.82)', fontStyle: 'italic', fontSize: 16, fontFamily: "'Cormorant Garamond',serif" }}>
            {scratchLabel || 'Scratch me'}
          </span>
        </div>
      )}
    </div>
    <p style={{ margin: '5px 0 0', fontSize: 11, color: '#3c2a31', fontStyle: 'italic', fontFamily: "'Cormorant Garamond',serif", maxWidth: 112, lineHeight: 1.35 }}>
      {caption}
    </p>
  </button>
);

const NavArrow = ({ dir, onClick }) => (
  <button type="button" onClick={onClick} style={{
    position: 'fixed', right: 14,
    top: dir === 'up' ? 'calc(50% - 56px)' : 'calc(50% + 12px)',
    width: 44, height: 44, borderRadius: '50%',
    background: 'rgba(255,255,255,0.76)', backdropFilter: 'blur(4px)',
    border: '1.5px solid rgba(123,28,46,0.22)', color: WINE,
    fontSize: 18, cursor: 'pointer', zIndex: 50,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.13)'
  }}>
    {dir === 'up' ? '∧' : '∨'}
  </button>
);

const pageV = {
  enter: { opacity: 0, y: 44 },
  center: { opacity: 1, y: 0, transition: { duration: 0.58, ease: [0.77, 0, 0.175, 1] } },
  exit: { opacity: 0, y: -36, transition: { duration: 0.38 } },
};

const BouquetGarden = ({
  recipientName = 'You',
  senderName = 'Me',
  scenes = {},
  showSenderName = true,
  musicEnabled = false,
  musicUrl = '',
}) => {
  const [page, setPage] = useState(0);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [scratchRevealed, setScratchRevealed] = useState({});
  const [typedLetter, setTypedLetter] = useState('');

  const correctPin = String(scenes.accessPassword || '1234').replace(/\D/g, '').slice(0, 4) || '1234';
  const fromLabel = (scenes.lockFromLabel || (showSenderName && senderName) || 'From me').trim();
  const toLabel = (scenes.lockToLabel || recipientName || 'To you').trim();
  const letterText = (scenes.letterText || 'Sometimes I catch myself smiling at my phone just because of you. You make ordinary days feel softer and happier, and having you in my life is one of my favorite things.').trim();
  const scratchLabel = scenes.scratchLabel || 'Scratch me';

  const photos = [1, 2, 3, 4, 5].map(i => ({
    src: String(scenes[`photo${i}Url`] || '').trim(),
    caption: String(scenes[`polaroidCaption${i}`] || `Memory ${i}`).trim(),
  }));

  const goto = useCallback((p) => {
    const next = ((p % 5) + 5) % 5;
    setPage(next);
  }, []);

  // Page 1 (flower wall) auto-advances
  useEffect(() => {
    if (page === 1) {
      const t = setTimeout(() => goto(2), 2200);
      return () => clearTimeout(t);
    }
  }, [page, goto]);

  // Typewriter for love letter
  useEffect(() => {
    if (page === 3) {
      setTypedLetter('');
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setTypedLetter(letterText.slice(0, i));
        if (i >= letterText.length) clearInterval(iv);
      }, 38);
      return () => clearInterval(iv);
    }
  }, [page, letterText]);

  // Page 4 loops back to 0
  useEffect(() => {
    if (page === 4) {
      const t = setTimeout(() => goto(0), 1800);
      return () => clearTimeout(t);
    }
  }, [page, goto]);

  const pushDigit = (d) => {
    if (unlocking) return;
    const next = pin + d;
    if (next.length > correctPin.length) return;
    setPin(next);
    setPinError(false);
    if (next.length === correctPin.length) {
      if (next === correctPin) {
        setUnlocking(true);
        setTimeout(() => { setPage(1); setPin(''); setUnlocking(false); }, 900);
      } else {
        setPinError(true);
        setTimeout(() => { setPin(''); setPinError(false); }, 600);
      }
    }
  };

  const polaroidPositions = [
    { top: '7%', left: '8%', transform: 'rotate(-13deg)' },
    { top: '5%', right: '10%', transform: 'rotate(9deg)' },
    { top: '38%', left: '4%', transform: 'rotate(-7deg)' },
    { top: '36%', right: '7%', transform: 'rotate(14deg)' },
    { top: '64%', left: '28%', transform: 'rotate(-4deg)' },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100dvh', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
      {musicEnabled && musicUrl && (
        <iframe src={`https://www.youtube.com/embed/${musicUrl}?autoplay=1&loop=1&controls=0`}
          allow="autoplay" style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }} title="music"/>
      )}
      <AnimatePresence mode="wait">

        {/* ===== PAGE 0: PIN LOCK ===== */}
        {page === 0 && (
          <motion.div key="lock" variants={pageV} initial="enter" animate="center" exit="exit"
            style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: IVORY, position: 'relative', padding: '0 20px' }}>
            <LockBg/>
            <motion.div
              animate={pinError ? { x: [0, -12, 12, -10, 10, -6, 6, 0] } : {}}
              transition={{ duration: 0.46 }}
              style={{ position: 'relative', zIndex: 10, textAlign: 'center', width: '100%', maxWidth: 360 }}>
              <motion.div
                animate={unlocking ? { scale: [1, 1.1, 0.95, 1.05, 1], rotate: [0, 4, -4, 2, 0] } : {}}
                transition={{ duration: 0.7 }}
                style={{ marginBottom: 20 }}>
                <HeartLock open={unlocking}/>
              </motion.div>
              <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 30, color: WINE, lineHeight: 1.3, margin: 0 }}>From : {fromLabel}</p>
              <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 30, color: WINE, lineHeight: 1.3, margin: '3px 0 0' }}>For : {toLabel}</p>
              <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 18, color: WINE, opacity: 0.72, margin: '8px 0 0' }}>a little secret...</p>
              {/* PIN dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 14, margin: '26px 0 22px' }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} style={{
                    width: 13, height: 13, borderRadius: '50%',
                    border: `2.5px solid ${WINE}`,
                    background: pin.length > i ? WINE : 'transparent',
                    transition: 'background 0.15s'
                  }}/>
                ))}
              </div>
              {/* Keypad */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, maxWidth: 248, margin: '0 auto' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
                  <motion.button key={d} type="button" onClick={() => pushDigit(String(d))}
                    whileTap={{ scale: 0.93 }}
                    style={{ height: 52, borderRadius: 12, background: BLUSH, border: 'none', fontSize: 20, color: WINE, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 6px rgba(123,28,46,0.15)' }}>
                    {d}
                  </motion.button>
                ))}
                <div/>
                <motion.button type="button" onClick={() => pushDigit('0')} whileTap={{ scale: 0.93 }}
                  style={{ height: 52, borderRadius: 12, background: BLUSH, border: 'none', fontSize: 20, color: WINE, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 6px rgba(123,28,46,0.15)' }}>
                  0
                </motion.button>
                <motion.button type="button" onClick={() => setPin(p => p.slice(0, -1))} whileTap={{ scale: 0.93 }}
                  style={{ height: 52, borderRadius: 12, background: BLUSH, border: 'none', fontSize: 20, color: WINE, cursor: 'pointer', boxShadow: '0 2px 6px rgba(123,28,46,0.15)' }}>
                  ⌫
                </motion.button>
              </div>
              <div style={{ minHeight: 24, marginTop: 14 }}>
                {pinError && <p style={{ color: '#9c2f59', fontSize: 13, fontWeight: 600, margin: 0 }}>Wrong code. Try again.</p>}
              </div>
              {/* Pagination dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 4 }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', border: `1.5px solid ${WINE}`, background: i === 0 ? WINE : 'transparent' }}/>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ===== PAGE 1: FLOWER WALL ===== */}
        {page === 1 && (
          <motion.div key="flowers" variants={pageV} initial="enter" animate="center" exit="exit"
            style={{ minHeight: '100dvh', position: 'relative', overflow: 'hidden', background: '#2A0810' }}>
            <FlowerWall/>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(80, 10, 20, 0.18)' }}/>
          </motion.div>
        )}

        {/* ===== PAGE 2: SCRAPBOOK ===== */}
        {page === 2 && (
          <motion.div key="scrapbook" variants={pageV} initial="enter" animate="center" exit="exit"
            style={{ minHeight: '100dvh', position: 'relative', overflow: 'hidden', background: '#3D0A14', backgroundImage: 'radial-gradient(circle at 50% 38%, #5A1020 0%, #3D0A14 68%)' }}>
            <NavArrow dir="up" onClick={() => goto(page - 1)}/>
            <NavArrow dir="down" onClick={() => goto(page + 1)}/>
            {photos.slice(0, 5).map((p, i) => (
              <Polaroid key={i} src={p.src} caption={p.caption}
                scratchLabel={scratchLabel}
                revealed={!!scratchRevealed[i]}
                onReveal={() => setScratchRevealed(s => ({ ...s, [i]: true }))}
                style={polaroidPositions[i]}
              />
            ))}
            <LeopardStar style={{ width: 115, height: 115, top: '51%', left: '12%', transform: 'rotate(-13deg)' }}/>
            <LeopardStar style={{ width: 88, height: 88, top: '20%', right: '40%', transform: 'rotate(9deg)' }}/>
            <div style={{ position: 'absolute', bottom: 18, right: 18 }}>
              <BouquetIllustration size={128}/>
            </div>
            {/* Torn paper + wax seal */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0,
              width: 196, height: 178, background: '#1A0A0E',
              clipPath: 'polygon(0 22%,8% 12%,15% 24%,22% 10%,30% 22%,100% 22%,100% 100%,0 100%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 16
            }}>
              <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #9B2335, #5A0D18)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                <span style={{ fontFamily: "'Great Vibes', cursive", color: '#FAF3E8', fontSize: 28 }}>L</span>
              </div>
              <p style={{ fontFamily: "'Great Vibes', cursive", color: '#fff', fontSize: 15, margin: 0, lineHeight: 1.5 }}>From : {fromLabel}</p>
              <p style={{ fontFamily: "'Great Vibes', cursive", color: '#fff', fontSize: 15, margin: 0 }}>For : {toLabel}</p>
            </div>
          </motion.div>
        )}

        {/* ===== PAGE 3: LOVE LETTER ===== */}
        {page === 3 && (
          <motion.div key="letter" variants={pageV} initial="enter" animate="center" exit="exit"
            style={{ minHeight: '100dvh', display: 'flex', position: 'relative', overflow: 'hidden' }}>
            <NavArrow dir="up" onClick={() => goto(page - 1)}/>
            <NavArrow dir="down" onClick={() => goto(page + 1)}/>
            {/* Left panel */}
            <div style={{
              flex: '0 0 56%', background: '#1A0A0E',
              padding: '44px 28px 44px 24px',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              clipPath: 'polygon(0 0,100% 0,100% 90%,85% 97%,70% 91%,55% 97%,40% 90%,25% 97%,10% 91%,0 96%)'
            }}>
              <p style={{ fontFamily: "'Great Vibes', cursive", color: 'rgba(255,255,255,0.88)', fontSize: 22, lineHeight: 2, margin: 0 }}>
                {typedLetter}
                <span style={{ display: 'inline-block', width: 2, height: '1.1em', background: 'rgba(255,255,255,0.7)', marginLeft: 2, verticalAlign: 'middle', animation: 'blink 1s step-end infinite' }}/>
              </p>
              <style>{`@keyframes blink { 50% { opacity: 0 } }`}</style>
            </div>
            {/* Right panel */}
            <div style={{ flex: '0 0 44%', background: '#2A0A18', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <LeopardStar style={{ width: 118, height: 118, top: '28%', left: '8%', transform: 'rotate(8deg)' }}/>
              <BouquetIllustration size={168}/>
            </div>
          </motion.div>
        )}

        {/* ===== PAGE 4: LOOP / OUTRO ===== */}
        {page === 4 && (
          <motion.div key="outro" variants={pageV} initial="enter" animate="center" exit="exit"
            style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: IVORY, position: 'relative' }}>
            <NavArrow dir="up" onClick={() => goto(0)}/>
            <LockBg/>
            <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
              <HeartLock open={false}/>
              <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 28, color: WINE, marginTop: 18 }}>Until next time...</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', border: `1.5px solid ${WINE}`, background: WINE }}/>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default BouquetGarden;
