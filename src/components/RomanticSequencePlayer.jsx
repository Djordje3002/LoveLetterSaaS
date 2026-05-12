import { useCallback, useEffect, useMemo, useState } from 'react';
import DecorativeHeartQr from './DecorativeHeartQr';

const LETTER_TEXT = `My Dearest,\n\n I never said this right, but you matter to me. It's in the quiet way you stay in my mind. In the way small things turn into thoughts of you. And how my day feels softer with you in it. Like I can just be, without trying too hard.`;

const RomanticSequencePlayer = () => {
  const [scene, setScene] = useState(1);
  const [flapOpen, setFlapOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [chatStep, setChatStep] = useState(0);

  const hearts = useMemo(
    () => [...Array(16)].map((_, i) => ({
      id: `h-${i}`,
      left: `${8 + ((i * 13) % 84)}%`,
      top: `${8 + ((i * 17) % 72)}%`,
      delay: `${(i % 6) * 0.24}s`,
      size: 18 + (i % 3) * 10,
    })),
    []
  );

  const handleSealTap = useCallback(() => {
    if (scene !== 2 || flapOpen) return;
    setFlapOpen(true);
    setScene(3);
  }, [scene, flapOpen]);

  useEffect(() => {
    const timers = [];
    if (scene === 1) {
      timers.push(setTimeout(() => setScene(2), 1500));
    }
    if (scene === 2) {
      timers.push(setTimeout(() => handleSealTap(), 3500));
    }
    if (scene === 3) {
      timers.push(setTimeout(() => setScene(4), 600));
    }
    if (scene === 4) {
      timers.push(setTimeout(() => setScene(5), 900));
    }
    if (scene === 5) {
      timers.push(setTimeout(() => setScene(6), 5500));
    }
    if (scene === 6) {
      setChatStep(0);
      timers.push(setTimeout(() => setChatStep(1), 350));
      timers.push(setTimeout(() => setChatStep(2), 1100));
      timers.push(setTimeout(() => setChatStep(3), 1900));
      timers.push(setTimeout(() => setChatStep(4), 3000));
      timers.push(
        setTimeout(() => {
          setFlapOpen(false);
          setTypedText('');
          setChatStep(0);
          setScene(1);
        }, 6000)
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [scene, handleSealTap]);

  useEffect(() => {
    if (scene !== 5) return;
    setTypedText('');
    let idx = 0;
    const iv = setInterval(() => {
      idx += 1;
      setTypedText(LETTER_TEXT.slice(0, idx));
      if (idx >= LETTER_TEXT.length) clearInterval(iv);
    }, 18);
    return () => clearInterval(iv);
  }, [scene]);

  return (
    <div className="min-h-screen bg-[#f5f1ef] flex items-center justify-center p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Inter:wght@400;600;700&display=swap');
        .romantic-frame { width: 390px; height: 844px; border-radius: 26px; overflow: hidden; position: relative; background: #fff; font-family: Inter, sans-serif; box-shadow: 0 20px 50px rgba(0,0,0,0.16); }
        .scene { position: absolute; inset: 0; opacity: 0; transition: opacity 420ms ease; }
        .scene.active { opacity: 1; }
        .subtitle { position: absolute; bottom: 26px; left: 50%; transform: translateX(-50%); font-family: 'Inter', sans-serif; font-size: 28px; color: #111; -webkit-text-stroke: 3px #fff; font-weight: 700; line-height: 1; z-index: 40; }
        .pulse-heart { animation: pulseHeart 1.4s ease-in-out infinite; }
        .intro-heart { animation: introPulse 4s ease-in-out infinite; }
        .envelope-drop { animation: envelopeDrop 780ms cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .sticker-float { animation: stickerIn 700ms ease both; }
        .floral-zoom { animation: floralZoom 1.2s ease-in-out both; filter: blur(8px); }
        .chat-pop { animation: chatPop 420ms cubic-bezier(0.22, 1.3, 0.36, 1) both; }
        .cursor { display: inline-block; margin-left: 2px; animation: blink 900ms steps(1,end) infinite; }
        @keyframes pulseHeart { 0%,100% { transform: translate(-50%, -50%) scale(1); } 50% { transform: translate(-50%, -50%) scale(1.06); } }
        @keyframes introPulse { 0%,100% { transform: scale(1); opacity: 0.1; } 50% { transform: scale(1.08); opacity: 0.2; } }
        @keyframes envelopeDrop { 0% { transform: translateY(-200px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes stickerIn { 0% { transform: scale(0.5) translateY(14px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
        @keyframes floralZoom { 0% { opacity: 0; transform: scale(1); } 35% { opacity: 1; transform: scale(1.03); } 100% { opacity: 0.95; transform: scale(1.05); } }
        @keyframes chatPop { 0% { opacity: 0; transform: translateY(14px) scale(0.2); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes blink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }
      `}</style>

      <div className="romantic-frame">
        <div className={`scene ${scene === 1 ? 'active' : ''}`} style={{ background: '#FDF0E8' }}>
          {hearts.map((h) => (
            <div
              key={h.id}
              className="intro-heart"
              style={{
                position: 'absolute',
                left: h.left,
                top: h.top,
                width: h.size,
                height: h.size,
                color: '#dba8bc',
                opacity: 0.15,
                fontSize: h.size,
                animationDelay: h.delay,
              }}
            >
              ♥
            </div>
          ))}
        </div>

        <div
          className={`scene ${scene === 2 || scene === 3 ? 'active' : ''}`}
          style={{
            backgroundColor: '#fef5f7',
            backgroundImage:
              'repeating-linear-gradient(0deg, #FADADD, #FADADD 40px, #F8C8D0 40px, #F8C8D0 80px), repeating-linear-gradient(90deg, #FADADD, #FADADD 40px, #F8C8D0 40px, #F8C8D0 80px)',
          }}
        >
          <div className="sticker-float" style={{ position: 'absolute', top: 52, left: 54, fontSize: 34, animationDelay: '160ms' }}>🌼</div>
          <div className="sticker-float" style={{ position: 'absolute', top: 66, right: 44, fontSize: 28, animationDelay: '280ms' }}>⭐</div>
          <div className="sticker-float" style={{ position: 'absolute', left: 26, top: 336, color: '#b84876', fontSize: 44, animationDelay: '360ms' }}>〰️</div>
          <div className="sticker-float" style={{ position: 'absolute', left: 52, bottom: 148, fontSize: 38, animationDelay: '420ms' }}>🎈</div>
          <div className="sticker-float" style={{ position: 'absolute', right: 38, bottom: 132, fontSize: 44, animationDelay: '460ms' }}>🐱</div>

          <div className="envelope-drop" style={{ position: 'absolute', left: '50%', top: 254, transform: 'translateX(-50%)', width: 286, height: 190 }}>
            <div style={{ position: 'absolute', inset: 0, background: '#F4A7B9', border: '1px solid #eca4b5', borderRadius: 3 }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '50%', height: '100%', background: '#d995a8', clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '50%', height: '100%', background: '#d995a8', clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '56%', background: '#e6a9b8', clipPath: 'polygon(0 100%, 50% 34%, 100% 100%)' }} />
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: 110,
                background: '#f5c4d2',
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
                transform: flapOpen ? 'rotateX(-180deg)' : 'rotateX(0deg)',
                transition: 'transform 600ms ease-in-out',
                zIndex: 8,
              }}
            />
            {!flapOpen && (
              <button
                type="button"
                onClick={handleSealTap}
                className="pulse-heart"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '51%',
                  width: 58,
                  height: 58,
                  borderRadius: '50%',
                  border: 'none',
                  background: '#9B2335',
                  color: '#fff',
                  fontSize: 19,
                  fontWeight: 700,
                  zIndex: 10,
                  boxShadow: '0 6px 10px rgba(0,0,0,0.18)',
                  cursor: 'pointer',
                }}
                aria-label="Open envelope seal"
              >
                ♥
              </button>
            )}
          </div>

          <div style={{ position: 'absolute', top: 470, width: '100%', textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: 28, color: '#9f355f', fontWeight: 700 }}>
            Tap seal to open ♥
          </div>

          {scene === 3 && (
            <div style={{ position: 'absolute', left: '50%', top: 350, transform: 'translateX(-50%)', width: 0, height: 0 }}>
              {[...Array(12)].map((_, i) => (
                <div
                  key={`burst-${i}`}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    fontSize: i % 2 ? 12 : 16,
                    color: i % 2 ? '#d6458d' : '#ffc0db',
                    animation: 'chatPop 480ms ease forwards',
                    transform: `translate(${Math.cos((i / 12) * Math.PI * 2) * (46 + i * 2)}px, ${Math.sin((i / 12) * Math.PI * 2) * (42 + i * 2)}px)`,
                  }}
                >
                  {i % 3 === 0 ? '✨' : '♥'}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`scene ${scene === 4 ? 'active' : ''} floral-zoom`}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 18% 24%, #ffc8da 0%, #ffe9f2 34%, transparent 58%), radial-gradient(circle at 82% 22%, #ffd5de 0%, #fff1f6 38%, transparent 60%), radial-gradient(circle at 50% 72%, #ffc0cb 0%, #ffe4e1 36%, #fff0f5 70%)',
            }}
          />
        </div>

        <div className={`scene ${scene === 5 ? 'active' : ''}`} style={{ background: '#FAF6F0' }}>
          <div style={{ position: 'absolute', top: 34, width: '100%', textAlign: 'center', fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#8B0000', fontSize: 28 }}>
            A letter for you...
          </div>

          <div
            style={{
              position: 'absolute',
              left: 18,
              right: 18,
              bottom: 72,
              top: 118,
              background: '#fffdf9',
              border: '1px solid #dfd8cf',
              transform: scene === 5 ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 500ms ease-out',
              boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: -14, left: 46, width: 84, height: 20, background: 'rgba(255,255,255,0.92)', transform: 'rotate(-12deg)', border: '1px solid #ece7de' }} />
            <div style={{ position: 'absolute', top: -10, right: 56, width: 74, height: 20, background: 'rgba(255,255,255,0.9)', transform: 'rotate(10deg)', border: '1px solid #ece7de' }} />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'linear-gradient(to bottom, transparent 0, transparent 41px, #e8e3da 42px, transparent 43px), linear-gradient(to right, transparent 0, transparent 26px, #df9c9c 27px, #df9c9c 29px, transparent 30px)',
                backgroundSize: '100% 44px, 100% 100%',
              }}
            />
            <div
              style={{
                position: 'relative',
                padding: '34px 24px 24px 48px',
                color: '#222',
                fontFamily: 'Inter, sans-serif',
                fontStyle: 'italic',
                fontSize: 20,
                lineHeight: 1.28,
                whiteSpace: 'pre-wrap',
              }}
            >
              {typedText}
              <span className="cursor">|</span>
            </div>
          </div>
        </div>

        <div className={`scene ${scene === 6 ? 'active' : ''}`} style={{ background: '#121212' }}>
          <div style={{ position: 'absolute', inset: '20px 14px 86px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginTop: 16, opacity: chatStep >= 1 ? 1 : 0 }} className={chatStep >= 1 ? 'chat-pop' : ''}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#3c3c3c' }} />
              <div style={{ background: '#252525', color: '#fff', padding: '12px 16px', borderRadius: 18, fontSize: 18 }}>hii babyyy</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginTop: 14, opacity: chatStep >= 2 ? 1 : 0 }} className={chatStep >= 2 ? 'chat-pop' : ''}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#3c3c3c' }} />
              <div style={{ background: '#252525', color: '#fff', padding: '12px 16px', borderRadius: 18, fontSize: 18 }}>i have something for u</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginTop: 14, opacity: chatStep >= 3 ? 1 : 0 }} className={chatStep >= 3 ? 'chat-pop' : ''}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#3c3c3c' }} />
              <div style={{ background: '#fff', borderRadius: 18, padding: 8 }}>
                <DecorativeHeartQr size={140} color="#CC2D9A" />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginTop: 14, opacity: chatStep >= 4 ? 1 : 0 }} className={chatStep >= 4 ? 'chat-pop' : ''}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#3c3c3c' }} />
              <div style={{ background: '#252525', color: '#fff', padding: '12px 16px', borderRadius: 18, fontSize: 18 }}>scan it 💝</div>
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              left: 10,
              right: 10,
              bottom: 14,
              background: '#1f1f1f',
              border: '1px solid #2b2b2b',
              borderRadius: 24,
              height: 52,
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              color: '#7f7f7f',
              fontSize: 17,
            }}
          >
            <span style={{ marginRight: 10 }}>📷</span>
            <span style={{ flex: 1 }}>Message...</span>
            <span>🎤</span>
          </div>
        </div>

        <div className="subtitle">i love you.</div>
      </div>
    </div>
  );
};

export default RomanticSequencePlayer;
