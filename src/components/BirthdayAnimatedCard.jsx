import { useEffect, useMemo, useRef, useState } from 'react';

const clampCount = (value) => {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed)) return 5;
  return Math.min(Math.max(parsed, 1), 9);
};

const resolveTypedMessage = ({ message, name }) => {
  if (!name) return message;
  if (message.includes('{name}')) return message.replaceAll('{name}', name);
  if (message === 'Happy Birthday, my love 🎂✨') return `Happy Birthday, ${name} 🎂✨`;
  return message;
};

const BirthdayAnimatedCard = ({
  message = 'Happy Birthday, my love 🎂✨',
  name = '',
  candleCount = 5,
}) => {
  const totalCandles = clampCount(candleCount);
  const typedMessage = resolveTypedMessage({ message, name });

  const [elapsed, setElapsed] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [typingDone, setTypingDone] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [blown, setBlown] = useState(false);
  const [showFinalLine, setShowFinalLine] = useState(false);

  const typingStartedRef = useRef(false);

  const stars = useMemo(
    () => Array.from({ length: 34 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 4,
    })),
    []
  );

  const sparkles = useMemo(() => {
    const count = 26;
    const colors = ['#ff8fab', '#f6d365', '#8ce99a', '#cab8ff', '#ffffff', '#ffd6a5'];
    const shapes = ['circle', 'star', 'rect'];

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      shape: shapes[i % shapes.length],
      size: 6 + Math.random() * 7,
      tx: (Math.random() - 0.5) * 280,
      ty: -90 - Math.random() * 170,
      tyEnd: 120 + Math.random() * 80,
      rot: -220 + Math.random() * 440,
      delay: Math.random() * 0.18,
      duration: 1.1 + Math.random() * 0.55,
    }));
  }, []);

  const hearts = useMemo(() => {
    const symbols = ['🩷', '💛', '🩵', '🤍'];
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      symbol: symbols[i % symbols.length],
      left: Math.random() * 100,
      duration: 2.8 + Math.random() * 2.2,
      delay: Math.random() * 0.8,
      drift: -30 + Math.random() * 60,
      rotate: -20 + Math.random() * 40,
      size: 15 + Math.random() * 12,
    }));
  }, []);

  useEffect(() => {
    const start = Date.now();
    const timer = window.setInterval(() => {
      setElapsed(Date.now() - start);
    }, 40);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typingStartedRef.current) return;
    if (elapsed < 6000) return;

    typingStartedRef.current = true;

    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setTypedText(typedMessage.slice(0, index));

      if (index >= typedMessage.length) {
        window.clearInterval(interval);
        setTypingDone(true);
        window.setTimeout(() => setShowCursor(false), 700);
      }
    }, 58);

    return () => window.clearInterval(interval);
  }, [elapsed, typedMessage]);

  const firstLightAt = 2500;
  const lightGap = 400;
  const lightsElapsed = Math.floor((elapsed - firstLightAt) / lightGap) + 1;
  const litCount = blown ? 0 : Math.max(0, Math.min(totalCandles, lightsElapsed));

  const showOpeningFlame = elapsed < 1000 && !blown;
  const showCake = elapsed >= 1000;
  const showSparkleBurst = elapsed >= 5000 && elapsed < 6200 && !blown;
  const showPrompt = typingDone && !blown;

  const handleBlow = () => {
    if (!typingDone || blown) return;
    setBlown(true);
    setShowCursor(false);
    window.setTimeout(() => {
      setShowFinalLine(true);
    }, 760);
  };

  const candleXPositions = Array.from({ length: totalCandles }, (_, i) => {
    if (totalCandles === 1) return 0;
    const spacing = 30;
    const offset = ((totalCandles - 1) * spacing) / 2;
    return i * spacing - offset;
  });

  const sparkleKeyframes = sparkles.map((p) => `
    @keyframes confetti-${p.id} {
      0% { transform: translate(0px, 0px) rotate(0deg); opacity: 0; }
      14% { opacity: 1; }
      65% { transform: translate(${p.tx}px, ${p.ty}px) rotate(${p.rot}deg); opacity: 1; }
      100% { transform: translate(${p.tx * 0.85}px, ${p.tyEnd}px) rotate(${p.rot * 1.4}deg); opacity: 0; }
    }
  `).join('\n');

  const heartKeyframes = hearts.map((h) => `
    @keyframes heart-${h.id} {
      0% { transform: translate(0px, -40px) rotate(0deg); opacity: 0; }
      12% { opacity: 1; }
      100% { transform: translate(${h.drift}px, 980px) rotate(${h.rotate}deg); opacity: 0; }
    }
  `).join('\n');

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#080512',
      padding: 12,
      boxSizing: 'border-box',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&family=Dancing+Script:wght@600;700&family=Cormorant+Garamond:ital,wght@1,600;1,700&display=swap');

        @keyframes flameFlicker {
          0% { transform: scaleY(0.92) rotate(-3deg); opacity: 0.88; }
          50% { transform: scaleY(1.1) rotate(2deg); opacity: 1; }
          100% { transform: scaleY(0.95) rotate(-2deg); opacity: 0.9; }
        }

        @keyframes popRing {
          0% { transform: scale(0.2); opacity: 0.8; }
          100% { transform: scale(1.65); opacity: 0; }
        }

        @keyframes smokeRise {
          0% { transform: translateY(0px) scale(1); opacity: 0.62; }
          100% { transform: translateY(-30px) scale(0.8); opacity: 0; }
        }

        @keyframes flameOut {
          0% { transform: scaleY(1) scaleX(1); opacity: 1; }
          55% { transform: scaleY(1.45) scaleX(0.82) translateY(-6px); opacity: 0.75; }
          100% { transform: scaleY(0.1) scaleX(0.4) translateY(-20px); opacity: 0; }
        }

        @keyframes starPulse {
          0%, 100% { opacity: 0.16; }
          50% { opacity: 0.36; }
        }

        @keyframes promptPulse {
          0%, 100% { transform: scale(1); opacity: 0.82; }
          50% { transform: scale(1.06); opacity: 1; }
        }

        ${sparkleKeyframes}
        ${heartKeyframes}
      `}</style>

      <div
        onClick={handleBlow}
        style={{
          width: 'min(390px, 100vw)',
          height: 'min(844px, 100vh)',
          maxHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          background: '#1A0A2E',
          borderRadius: 24,
          boxShadow: '0 20px 80px rgba(0,0,0,0.45)',
          fontFamily: "'DM Sans', sans-serif",
          touchAction: 'manipulation',
          cursor: showPrompt ? 'pointer' : 'default',
        }}
      >
        <div style={{ position: 'absolute', inset: 0 }}>
          {stars.map((star) => (
            <span
              key={star.id}
              style={{
                position: 'absolute',
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: star.size,
                height: star.size,
                borderRadius: '50%',
                background: '#ffffff',
                opacity: 0.3,
                animation: `starPulse ${star.duration}s ease-in-out ${star.delay}s infinite`,
              }}
            />
          ))}
        </div>

        {showOpeningFlame ? (
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 26,
            height: 40,
            filter: 'drop-shadow(0 0 18px rgba(255,180,90,0.56))',
          }}>
            <svg width="26" height="40" viewBox="0 0 26 40" style={{ animation: 'flameFlicker 1.05s ease-in-out infinite' }}>
              <path d="M13 3 C18 10, 23 16, 20 24 C18 31, 8 34, 5 24 C3 17, 7 11, 13 3 Z" fill="#FDBA74" />
              <path d="M13 10 C16 14, 18 18, 16 23 C14.5 26, 10.5 27, 9 23 C7.8 19, 9.4 15, 13 10 Z" fill="#FFF3C4" />
            </svg>
          </div>
        ) : null}

        {showCake ? (
          <div style={{
            position: 'absolute',
            left: '50%',
            bottom: 126,
            transform: `translateX(-50%) translateY(${elapsed < 2500 ? 300 - Math.min(((elapsed - 1000) / 1500) * 300, 300) : 0}px)`,
            transition: 'transform 1.5s cubic-bezier(0.34,1.56,0.64,1)',
            width: 300,
            height: 310,
            pointerEvents: 'none',
          }}>
            <svg width="300" height="310" viewBox="0 0 300 310">
              <g>
                <rect x="45" y="220" width="210" height="60" rx="18" fill="#F4A261" />
                <path d="M45 232 C58 246, 68 224, 80 238 C90 250, 102 228, 114 240 C124 250, 136 228, 148 240 C160 252, 172 226, 184 240 C195 252, 208 228, 220 240 C230 250, 241 231, 255 240 L255 220 L45 220 Z" fill="#fffaf0" />

                <rect x="70" y="160" width="160" height="58" rx="16" fill="#E76F51" />
                <path d="M70 172 C81 185, 92 166, 102 178 C111 190, 124 170, 136 181 C146 192, 158 169, 170 182 C181 193, 194 170, 205 182 C215 193, 222 176, 230 181 L230 160 L70 160 Z" fill="#fffaf0" />

                <rect x="95" y="108" width="110" height="50" rx="14" fill="#264653" />
                <path d="M95 120 C103 132, 112 115, 120 126 C128 137, 136 118, 146 128 C154 138, 164 118, 173 128 C181 138, 191 118, 198 128 C202 133, 205 129, 205 126 L205 108 L95 108 Z" fill="#fffaf0" />

                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
                  const colors = ['#ff8fab', '#f6d365', '#8ce99a', '#cab8ff', '#ffd6a5'];
                  const x = 64 + i * 17;
                  const y = 196 + (i % 2) * 10;
                  return <rect key={`spr-${i}`} x={x} y={y} width="8" height="3" rx="2" fill={colors[i % colors.length]} transform={`rotate(${(i % 2 === 0 ? 18 : -12)} ${x} ${y})`} />;
                })}

                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const colors = ['#ff8fab', '#f6d365', '#8ce99a', '#cab8ff', '#ffd6a5'];
                  const x = 96 + i * 18;
                  const y = 141 + (i % 2) * 8;
                  return <rect key={`mid-spr-${i}`} x={x} y={y} width="7" height="3" rx="2" fill={colors[(i + 1) % colors.length]} transform={`rotate(${(i % 2 === 0 ? -18 : 14)} ${x} ${y})`} />;
                })}

                {[0, 1, 2, 3].map((i) => {
                  const colors = ['#ff8fab', '#f6d365', '#8ce99a', '#cab8ff', '#ffd6a5'];
                  const x = 110 + i * 20;
                  const y = 94 + (i % 2) * 7;
                  return <rect key={`top-spr-${i}`} x={x} y={y} width="6" height="3" rx="2" fill={colors[(i + 2) % colors.length]} transform={`rotate(${(i % 2 === 0 ? 14 : -12)} ${x} ${y})`} />;
                })}
              </g>
            </svg>

            <div style={{ position: 'absolute', left: '50%', top: 90, transform: 'translateX(-50%)' }}>
              {candleXPositions.map((x, i) => {
                const lit = i < litCount;
                const ignitionTime = firstLightAt + i * lightGap;
                const igniting = !blown && elapsed >= ignitionTime && elapsed <= ignitionTime + 430;
                const candleColors = ['#ff8fab', '#f6d365', '#8ce99a', '#cab8ff', '#ffd6a5'];
                const candleColor = candleColors[i % candleColors.length];

                return (
                  <div key={`candle-${i}`} style={{ position: 'absolute', left: x, top: 0, width: 12, height: 62, transform: 'translateX(-50%)' }}>
                    <div style={{
                      width: 8,
                      height: 38,
                      borderRadius: 5,
                      margin: '20px auto 0',
                      background: candleColor,
                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.34)',
                    }} />

                    {lit ? (
                      <>
                        <div style={{
                          position: 'absolute',
                          left: '50%',
                          top: -4,
                          transform: 'translateX(-50%)',
                          width: 58,
                          height: 58,
                          borderRadius: '50%',
                          background: 'radial-gradient(circle, rgba(255,201,120,0.42) 0%, rgba(255,201,120,0.2) 38%, rgba(255,201,120,0) 72%)',
                          filter: 'blur(1.5px)',
                        }} />
                        <svg
                          width="16"
                          height="24"
                          viewBox="0 0 16 24"
                          style={{
                            position: 'absolute',
                            left: '50%',
                            top: -10,
                            transform: 'translateX(-50%)',
                            animation: blown ? 'flameOut 0.6s ease forwards' : `flameFlicker ${0.95 + i * 0.06}s ease-in-out infinite`,
                            transformOrigin: '50% 80%',
                          }}
                        >
                          <path d="M8 1 C11 6, 14 9, 12.5 14 C11.3 18.4, 4.7 19.5, 3.5 14 C2.7 10, 4.9 6, 8 1 Z" fill="#FDBA74" />
                          <path d="M8 6 C9.7 8.3, 10.8 10.2, 10 13 C9.3 15, 6.7 15.3, 6 13 C5.3 10.5, 6.2 8.4, 8 6 Z" fill="#FFF4CC" />
                        </svg>
                      </>
                    ) : null}

                    {igniting ? (
                      <span style={{
                        position: 'absolute',
                        left: '50%',
                        top: -10,
                        transform: 'translateX(-50%)',
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        border: '2px solid rgba(255, 223, 160, 0.9)',
                        animation: 'popRing 0.42s ease-out forwards',
                      }} />
                    ) : null}

                    {blown ? (
                      <svg width="14" height="34" viewBox="0 0 14 34" style={{
                        position: 'absolute',
                        left: '50%',
                        top: -14,
                        transform: 'translateX(-50%)',
                        animation: 'smokeRise 1s ease-out forwards',
                      }}>
                        <path d="M7 30 C8 24, 4 22, 7 16 C10 10, 5 8, 8 2" stroke="rgba(228,219,240,0.72)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                      </svg>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {showSparkleBurst ? (
              <div style={{ position: 'absolute', left: '50%', top: 92 }}>
                {sparkles.map((p) => {
                  const node = p.shape === 'circle'
                    ? <span style={{ width: p.size, height: p.size, borderRadius: '50%', background: p.color, display: 'block' }} />
                    : p.shape === 'rect'
                      ? <span style={{ width: p.size + 3, height: Math.max(3, p.size / 2.4), borderRadius: 2, background: p.color, display: 'block' }} />
                      : <span style={{ color: p.color, fontSize: p.size + 4, lineHeight: 1, display: 'block' }}>✦</span>;

                  return (
                    <span
                      key={`spark-${p.id}`}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        opacity: 0,
                        animation: `confetti-${p.id} ${p.duration}s ease-out ${p.delay}s forwards`,
                      }}
                    >
                      {node}
                    </span>
                  );
                })}
                <div style={{
                  position: 'absolute',
                  left: -120,
                  top: -120,
                  width: 240,
                  height: 240,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,189,105,0.35) 0%, rgba(255,189,105,0.15) 40%, rgba(255,189,105,0) 72%)',
                  filter: 'blur(3px)',
                }} />
              </div>
            ) : null}
          </div>
        ) : null}

        {!showFinalLine ? (
          <div style={{
            position: 'absolute',
            left: 20,
            right: 20,
            top: 118,
            textAlign: 'center',
            minHeight: 130,
          }}>
            {elapsed >= 6000 ? (
              <>
                <h1 style={{
                  margin: 0,
                  color: '#FDF0E8',
                  fontFamily: "'Dancing Script', cursive",
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: 0.2,
                  textShadow: '0 0 18px rgba(253,240,232,0.16)',
                }}>
                  {typedText}
                  {showCursor ? <span style={{ opacity: 0.88 }}>|</span> : null}
                </h1>

                {typingDone ? (
                  <p style={{
                    margin: '12px 0 0',
                    color: '#E9A5B6',
                    fontFamily: "'DM Sans', sans-serif",
                    fontStyle: 'italic',
                    fontSize: 14,
                    opacity: 0.92,
                    transition: 'opacity 0.5s ease',
                  }}>
                    make a wish before you blow them out
                  </p>
                ) : null}
              </>
            ) : null}
          </div>
        ) : null}

        {showPrompt ? (
          <p style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 54,
            margin: 0,
            textAlign: 'center',
            fontFamily: "'Dancing Script', cursive",
            color: '#FFD4E2',
            fontSize: 27,
            animation: 'promptPulse 1.5s ease-in-out infinite',
            textShadow: '0 0 14px rgba(255,189,214,0.22)',
          }}>
            tap to blow 🌬️
          </p>
        ) : null}

        {blown ? (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {hearts.map((h) => (
              <span
                key={`heart-rain-${h.id}`}
                style={{
                  position: 'absolute',
                  left: `${h.left}%`,
                  top: -50,
                  fontSize: h.size,
                  animation: `heart-${h.id} ${h.duration}s linear ${h.delay}s forwards`,
                }}
              >
                {h.symbol}
              </span>
            ))}
          </div>
        ) : null}

        {showFinalLine ? (
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '42%',
            transform: 'translateY(-50%)',
            textAlign: 'center',
            padding: '0 24px',
          }}>
            <h2 style={{
              margin: 0,
              color: '#FDF0E8',
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontWeight: 700,
              fontSize: 46,
              lineHeight: 1.1,
              textShadow: '0 0 24px rgba(255,225,198,0.35)',
            }}>
              i love you more than cake.
            </h2>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BirthdayAnimatedCard;
