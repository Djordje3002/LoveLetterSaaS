import { QRCodeSVG } from 'qrcode.react';

const DecorativeHeartQr = ({
  size = 196,
  value = '',
  color = '#B11478',
  qrRatio = 0.62,
  qrOffsetRatio = 0.008,
}) => {
  const qrValue = typeof value === 'string' && value.trim()
    ? value.trim()
    : 'https://lovelettersaas.vercel.app';

  const qrSize = Math.round(size * qrRatio);
  const qrOffsetY = Math.round(size * qrOffsetRatio);

  return (
    <div
      id="qr-code"
      className="relative inline-flex items-center justify-center"
      style={{
        width: size,
        height: size,
      }}
    >
      <img
        src="/custom-heart-qr.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-contain"
        style={{
          filter: 'drop-shadow(0 16px 24px rgba(190, 24, 93, 0.18))',
        }}
      />

      <div
        className="relative z-10 flex items-center justify-center"
        style={{
          width: qrSize,
          height: qrSize,
          transform: `translateY(${qrOffsetY}px) rotate(45deg)`,
        }}
      >
        <QRCodeSVG
          value={qrValue}
          size={qrSize}
          fgColor={color}
          bgColor="transparent"
          level="H"
          marginSize={0}
          style={{
            display: 'block',
            transform: 'scale(0.98)',
            transformOrigin: 'center',
          }}
        />
      </div>
    </div>
  );
};

export default DecorativeHeartQr;
