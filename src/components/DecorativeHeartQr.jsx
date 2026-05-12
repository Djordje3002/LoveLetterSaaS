import { QRCodeSVG } from 'qrcode.react';

const DecorativeHeartQr = ({ size = 196, value = '', color = '#D91E5B' }) => {
  const qrValue = typeof value === 'string' && value.trim()
    ? value.trim()
    : 'https://lovelettersaas.vercel.app';

  const heartSize = Math.round(size * 2.28);
  const heartOffset = Math.round((heartSize - size) / 2);

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
          <radialGradient id="heartQrGradient" cx="32%" cy="28%" r="82%">
            <stop offset="0%" stopColor="#ff79ad" />
            <stop offset="56%" stopColor={color} />
            <stop offset="100%" stopColor="#9d123f" />
          </radialGradient>
        </defs>
        <path
          d="M256 423C141 326 44 239 44 137C44 66 96 19 162 19C204 19 238 40 256 74C274 40 308 19 350 19C416 19 468 66 468 137C468 239 371 326 256 423Z"
          fill="url(#heartQrGradient)"
        />
      </svg>

      <div
        className="relative z-10"
        style={{
          marginTop: Math.round(size * 0.18),
          transform: `translateY(${Math.round(size * 0.03)}px)`,
        }}
      >
        <QRCodeSVG
          value={qrValue}
          size={size}
          fgColor="#FFFFFF"
          bgColor={color}
          level="H"
          marginSize={2}
          style={{
            display: 'block',
            boxShadow: '0 10px 18px rgba(157, 18, 63, 0.16)',
          }}
        />
      </div>
      <div aria-hidden style={{ width: heartOffset, height: 1, position: 'absolute', opacity: 0 }} />
    </div>
  );
};

export default DecorativeHeartQr;
