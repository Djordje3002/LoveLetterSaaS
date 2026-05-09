import { useEffect, useMemo, useRef, useState } from 'react';
import { extractYouTubeId } from './palettes';

const TYPING_PAUSE = 1200;

const DEFAULT_SCRIPT = [
  'them: hey',
  'them: are you awake right now',
  'me: yes, what happened',
  'them: nothing bad, promise',
  'them: i have been carrying this in my heart for a while',
  'me: omg now i am nervous',
  'them: do not be',
  'them: you are the person who makes heavy days feel lighter',
  'them: you make ordinary moments feel warm and safe',
  'them: when i am with you, i breathe easier',
  'me: ...',
  'them: you are my favorite hello and my calmest place',
  'them: and i wanted to tell you properly',
  'them: not rushed, not hidden, just honest',
  'them: love: i love you so much',
].join('\n');

const parseChatScript = (rawScript) => {
  const source = String(rawScript || '').trim() || DEFAULT_SCRIPT;
  const lines = source.split('\n').map((line) => line.trim()).filter(Boolean);

  const messages = [];
  let delay = 800;

  lines.forEach((line, idx) => {
    const loveMatch = line.match(/^love\s*:\s*(.+)$/i);
    const meMatch = line.match(/^me\s*:\s*(.+)$/i);
    const themMatch = line.match(/^them\s*:\s*(.+)$/i);

    let from = 'them';
    let text = line;
    let isLove = false;

    if (loveMatch) {
      from = 'them';
      text = loveMatch[1].trim();
      isLove = true;
    } else if (meMatch) {
      from = 'me';
      text = meMatch[1].trim();
    } else if (themMatch) {
      from = 'them';
      text = themMatch[1].trim();
    }

    if (!text) return;

    delay += from === 'them' ? 1500 : 1350;
    if (isLove) delay += 850;

    messages.push({
      id: idx + 1,
      from,
      text,
      isLove,
      delay,
    });
  });

  return messages.length > 0 ? messages : [{
    id: 1,
    from: 'them',
    text: 'I love you.',
    isLove: true,
    delay: 1200,
  }];
};

const TypingIndicator = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '10px 14px',
      background: '#2c2c2e',
      borderRadius: '18px 18px 18px 4px',
      width: 'fit-content',
      marginBottom: 2,
    }}
  >
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: '#8e8e93',
          display: 'block',
          animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }}
      />
    ))}
  </div>
);

const Bubble = ({ msg, show, isLast, senderAvatar }) => {
  const isMe = msg.from === 'me';
  if (!show) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isMe ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: 8,
        marginBottom: msg.isLove ? 0 : 3,
        animation: 'bubbleIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
      }}
    >
      {!isMe ? (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff6b9d, #c44dff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            flexShrink: 0,
            marginBottom: 2,
            opacity: isLast ? 1 : 0,
          }}
        >
          {senderAvatar}
        </div>
      ) : null}

      <div
        style={{
          maxWidth: '72%',
          padding: msg.isLove ? '14px 20px' : '9px 14px',
          borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          background: msg.isLove
            ? 'linear-gradient(135deg, #ff6b9d 0%, #ff4d8d 50%, #c44dff 100%)'
            : isMe
              ? '#0a84ff'
              : '#2c2c2e',
          color: '#fff',
          fontSize: msg.isLove ? 20 : 15,
          fontFamily: msg.isLove ? "'Georgia', serif" : "-apple-system, 'SF Pro Text', sans-serif",
          fontWeight: msg.isLove ? 500 : 400,
          letterSpacing: msg.isLove ? '0.02em' : 0,
          lineHeight: 1.4,
          boxShadow: msg.isLove ? '0 4px 24px rgba(255,77,141,0.45), 0 0 0 1px rgba(255,255,255,0.08)' : 'none',
          position: 'relative',
          wordBreak: 'break-word',
        }}
      >
        {msg.isLove ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              background: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.18) 0%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />
        ) : null}
        {msg.text}
      </div>
    </div>
  );
};

const ChatReveal = ({
  recipientName,
  scenes = {},
  musicEnabled = false,
  musicUrl = '',
  showFooter = true,
}) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [hearts, setHearts] = useState([]);
  const scrollRef = useRef(null);
  const timers = useRef([]);
  const videoId = extractYouTubeId(musicUrl);

  const senderName = scenes.chatSenderName || 'baby';
  const senderAvatar = scenes.chatSenderAvatar || '🩷';
  const introTitle = scenes.chatIntroTitle || 'you have a message';
  const introSubtitle = scenes.chatIntroSubtitle || 'tap anywhere to open';
  const messages = useMemo(() => parseChatScript(scenes.chatScript), [scenes.chatScript]);

  const clearAllTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const spawnHearts = () => {
    const newHearts = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: 20 + Math.random() * 60,
      delay: Math.random() * 0.6,
      size: 14 + Math.random() * 18,
      drift: (Math.random() - 0.5) * 60,
    }));
    setHearts(newHearts);
    const t = window.setTimeout(() => setHearts([]), 3000);
    timers.current.push(t);
  };

  const startSequence = () => {
    clearAllTimers();
    setVisibleCount(0);
    setShowTyping(false);
    setDone(false);
    setHearts([]);
    setIsPlaying(true);

    messages.forEach((msg, idx) => {
      if (msg.from === 'them') {
        const typingStart = window.setTimeout(
          () => setShowTyping(true),
          Math.max(0, msg.delay - TYPING_PAUSE)
        );
        timers.current.push(typingStart);
      }

      const t = window.setTimeout(() => {
        setShowTyping(false);
        setVisibleCount(idx + 1);
        if (msg.isLove) {
          spawnHearts();
          const doneTimer = window.setTimeout(() => setDone(true), 600);
          timers.current.push(doneTimer);
        }
      }, msg.delay);
      timers.current.push(t);
    });
  };

  useEffect(() => () => clearAllTimers(), []);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [visibleCount, showTyping]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, sans-serif',
        padding: '20px 0',
        position: 'relative',
      }}
    >
      <style>{`
        @keyframes bubbleIn {
          from { opacity: 0; transform: scale(0.7) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes heartFloat {
          0%   { opacity: 1; transform: translateY(0) translateX(0) scale(1); }
          100% { opacity: 0; transform: translateY(-160px) translateX(var(--drift)) scale(0.5); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,77,141,0); }
          50%       { box-shadow: 0 0 0 12px rgba(255,77,141,0.15); }
        }
        @keyframes statusIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

      {musicEnabled && videoId ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0`}
          allow="autoplay"
          className="w-0 h-0 absolute opacity-0 pointer-events-none"
          title="chat-reveal-music"
        />
      ) : null}

      <div
        style={{
          width: 'min(94vw, 375px)',
          height: 'min(calc(100vh - 40px), 780px)',
          background: '#000',
          borderRadius: 44,
          border: '8px solid #1a1a1a',
          boxShadow: '0 0 0 1px #333, 0 40px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {hearts.map((h) => (
          <div
            key={h.id}
            style={{
              position: 'absolute',
              bottom: 180,
              left: `${h.x}%`,
              fontSize: h.size,
              pointerEvents: 'none',
              zIndex: 50,
              animation: `heartFloat 2.4s ease-out ${h.delay}s forwards`,
              '--drift': `${h.drift}px`,
            }}
          >
            🩷
          </div>
        ))}

        <div
          style={{
            padding: '14px 24px 6px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 12,
            fontWeight: 600,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          <span>9:41</span>
          <div style={{ width: 120, height: 22, background: '#000', borderRadius: 11, border: '1px solid #333' }} />
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <span style={{ fontSize: 10 }}>●●●</span>
            <span style={{ fontSize: 10 }}>▶</span>
            <span style={{ fontSize: 10 }}>■</span>
          </div>
        </div>

        <div
          style={{
            padding: '6px 16px 12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            borderBottom: '0.5px solid #1c1c1e',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff6b9d, #c44dff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              boxShadow: done ? '0 0 0 3px rgba(255,107,157,0.4)' : 'none',
              transition: 'box-shadow 0.4s',
              animation: done ? 'pulseGlow 2s ease-in-out infinite' : 'none',
            }}
          >
            {senderAvatar}
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#fff' }}>{senderName}</p>
            <p style={{ margin: 0, fontSize: 11, color: '#8e8e93' }}>iMessage</p>
          </div>
        </div>

        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <p
            style={{
              textAlign: 'center',
              fontSize: 11,
              color: '#636366',
              margin: '0 0 12px',
              fontWeight: 500,
            }}
          >
            Today {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>

          {messages.map((msg, idx) => (
            <Bubble
              key={msg.id}
              msg={msg}
              show={idx < visibleCount}
              senderAvatar={senderAvatar}
              isLast={
                idx < visibleCount
                && messages.slice(idx + 1, visibleCount).filter((m) => m.from === 'them').length === 0
                && msg.from === 'them'
              }
            />
          ))}

          {showTyping ? (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, animation: 'bubbleIn 0.25s ease forwards' }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ff6b9d, #c44dff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                {senderAvatar}
              </div>
              <TypingIndicator />
            </div>
          ) : null}

          {done ? (
            <p
              style={{
                textAlign: 'center',
                fontSize: 11,
                color: '#ff6b9d',
                marginTop: 8,
                animation: 'statusIn 0.5s ease forwards',
                fontStyle: 'italic',
              }}
            >
              Delivered with love for {recipientName || 'you'} 🩷
            </p>
          ) : null}
        </div>

        <div
          style={{
            padding: '10px 12px 28px',
            background: '#000',
            borderTop: '0.5px solid #1c1c1e',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              flex: 1,
              background: '#1c1c1e',
              borderRadius: 20,
              padding: '9px 14px',
              fontSize: 15,
              color: '#636366',
              border: '0.5px solid #2c2c2e',
            }}
          >
            iMessage
          </div>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: isPlaying && !done ? '#1c1c1e' : 'linear-gradient(135deg, #ff6b9d, #c44dff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              fontSize: 14,
              color: 'white',
            }}
            onClick={!isPlaying || done ? startSequence : undefined}
            title={done ? 'Replay' : 'Send'}
          >
            {done ? '↺' : '↑'}
          </div>
        </div>
      </div>

      {!isPlaying ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            backdropFilter: 'blur(8px)',
            zIndex: 100,
          }}
          onClick={startSequence}
        >
          <div style={{ fontSize: 52 }}>{senderAvatar}</div>
          <p
            style={{
              color: '#fff',
              fontSize: 22,
              fontWeight: 600,
              margin: 0,
              fontFamily: 'Georgia, serif',
              textAlign: 'center',
            }}
          >
            {introTitle}
          </p>
          <p style={{ color: '#8e8e93', fontSize: 14, margin: 0 }}>{introSubtitle}</p>
          <div
            style={{
              marginTop: 8,
              padding: '12px 32px',
              borderRadius: 30,
              background: 'linear-gradient(135deg, #ff6b9d, #c44dff)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(255,77,141,0.4)',
            }}
          >
            open 🩷
          </div>
        </div>
      ) : null}

      {showFooter ? (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/35 text-xs tracking-widest uppercase font-bold">
          made with LovePage ♥
        </div>
      ) : null}
    </div>
  );
};

export default ChatReveal;

