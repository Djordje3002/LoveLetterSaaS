import { useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const HEART_PATH = 'M256 423C141 326 44 239 44 137C44 66 96 19 162 19C204 19 238 40 256 74C274 40 308 19 350 19C416 19 468 66 468 137C468 239 371 326 256 423Z';

const getPointHash = (x, y) => {
  const raw = (x + 17) * 92821 + (y + 29) * 68917;
  return ((raw % 997) + 997) % 997;
};

const insideHeart = (x, y) => {
  const nx = (x - 0.5) * 2;
  const ny = (y - 0.5) * 2;
  const value = ((nx * nx) + (ny * ny) - 1) ** 3 - (nx * nx * ny * ny * ny);
  return value <= 0;
};

const buildHeartDots = () => {
  const dots = [];
  for (let gy = 1; gy <= 43; gy += 1) {
    for (let gx = 1; gx <= 43; gx += 1) {
      const x = gx / 44;
      const y = gy / 44;
      if (!insideHeart(x, y)) continue;
      if (getPointHash(gx, gy) < 250) continue;
      dots.push({
        cx: x * 512,
        cy: y * 456,
        r: 2.9 + ((getPointHash(gx + 11, gy + 7) % 4) * 0.55),
      });
    }
  }
  return dots;
};

const DOTTED_HEART_DOTS = buildHeartDots();

const DecorativeHeartQr = ({ size = 196, value = '', color = '#D91E5B', variant = 'classic' }) => {
  const qrValue = typeof value === 'string' && value.trim()
    ? value.trim()
    : 'https://lovelettersaas.vercel.app';

  const heartSize = Math.round(size * 2.28);
  const heartOffset = Math.round((heartSize - size) / 2);
  const isDottedHeart = variant === 'dotted-heart';
  const qrSize = isDottedHeart ? Math.round(size * 0.9) : size;
  const qrCardPad = isDottedHeart ? Math.max(10, Math.round(size * 0.06)) : 0;
  const gradientId = useMemo(
    () => `heart-qr-gradient-${Math.random().toString(36).slice(2, 9)}`,
    []
  );

  return (
    <div
      id="qr-code"
      className="relative inline-flex items-center justify-center"
      style={{
        width: heartSize,
        height: Math.round(heartSize * 0.96),
      }}
    >
      <svg
        aria-hidden
        viewBox="0 0 512 456"
        className="absolute inset-0 h-full w-full pointer-events-none"
        style={{ filter: 'drop-shadow(0 18px 30px rgba(190, 24, 93, 0.24))' }}
      >
        <defs>
          {isDottedHeart ? (
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff4fa" />
              <stop offset="100%" stopColor="#ffe6f1" />
            </linearGradient>
          ) : (
            <radialGradient id={gradientId} cx="32%" cy="28%" r="82%">
              <stop offset="0%" stopColor="#ff79ad" />
              <stop offset="56%" stopColor={color} />
              <stop offset="100%" stopColor="#9d123f" />
            </radialGradient>
          )}
          {isDottedHeart ? (
            <clipPath id={`${gradientId}-clip`}>
              <path d={HEART_PATH} />
            </clipPath>
          ) : null}
        </defs>
        <path
          d={HEART_PATH}
          fill={`url(#${gradientId})`}
        />
        {isDottedHeart ? (
          <g clipPath={`url(#${gradientId}-clip)`} fill={color}>
            {DOTTED_HEART_DOTS.map((dot) => (
              <circle key={`${dot.cx}-${dot.cy}`} cx={dot.cx} cy={dot.cy} r={dot.r} />
            ))}
          </g>
        ) : null}
      </svg>

      <div
        className="relative z-10"
        style={{
          marginTop: Math.round(size * 0.2),
          transform: `translateY(${Math.round(size * 0.02)}px)`,
          background: isDottedHeart ? '#ffffff' : 'transparent',
          borderRadius: isDottedHeart ? 20 : 0,
          padding: qrCardPad,
          boxShadow: isDottedHeart
            ? '0 18px 30px rgba(217, 30, 91, 0.18)'
            : '0 10px 18px rgba(157, 18, 63, 0.16)',
        }}
      >
        <QRCodeSVG
          value={qrValue}
          size={qrSize}
          fgColor={isDottedHeart ? color : '#FFFFFF'}
          bgColor={isDottedHeart ? '#FFFFFF' : color}
          level="H"
          marginSize={isDottedHeart ? 3 : 2}
          style={{
            display: 'block',
            borderRadius: isDottedHeart ? 8 : 0,
          }}
        />
      </div>
      <div aria-hidden style={{ width: heartOffset, height: 1, position: 'absolute', opacity: 0 }} />
    </div>
  );
};

export default DecorativeHeartQr;
