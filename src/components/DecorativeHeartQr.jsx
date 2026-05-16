import { QRCodeSVG } from 'qrcode.react';

const DecorativeHeartQr = ({
  size = 196,
  value = '',
  color = '#B11478',
  qrRatio = 0.62,
  qrOffsetRatio = 0.008,
  qrImageSrc = '',
}) => {
  const maxSize = Number.isFinite(size) ? Math.max(1, Math.round(size)) : 196;

  const qrValue = typeof value === 'string' && value.trim()
    ? value.trim()
    : 'https://lovelettersaas.vercel.app';
  const qrPercent = `${(Math.max(0.05, qrRatio) * 100).toFixed(3)}%`;
  const qrTop = `calc(50% + ${(qrOffsetRatio * 100).toFixed(3)}%)`;
  const qrSvgSize = Math.max(256, Math.round(maxSize * Math.max(0.2, qrRatio)));

  return (
    <div
      id="qr-code"
      className="relative mx-auto"
      style={{
        width: '100%',
        maxWidth: maxSize,
        aspectRatio: '1 / 1',
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
        className="absolute left-1/2 z-10"
        style={{
          top: qrTop,
          width: qrPercent,
          height: qrPercent,
          transform: 'translate(-50%, -50%) rotate(45deg)',
        }}
      >
        {qrImageSrc ? (
          <img
            src={qrImageSrc}
            alt="QR code"
            className="h-full w-full object-contain"
            style={{ display: 'block' }}
          />
        ) : (
          <QRCodeSVG
            value={qrValue}
            size={qrSvgSize}
            fgColor={color}
            bgColor="transparent"
            level="H"
            marginSize={0}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DecorativeHeartQr;
