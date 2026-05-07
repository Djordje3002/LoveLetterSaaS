import React, { useMemo } from 'react';

function createRng(seed = 123456789) {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const finderPresets = [
  { x: 90, y: 68, size: 40 },
  { x: 150, y: 70, size: 34 },
  { x: 200, y: 66, size: 42 },
  { x: 125, y: 108, size: 36 },
  { x: 56, y: 186, size: 44 },
  { x: 244, y: 188, size: 40 },
  { x: 166, y: 232, size: 28 },
];

const DecorativeHeartQr = ({ size = 220, color = '#CC2D9A' }) => {
  const { blocks, finderPatterns } = useMemo(() => {
    const rng = createRng(424242);
    const generatedBlocks = [];
    const generatedFinders = finderPresets.map((p) => ({
      x: p.x + (rng() - 0.5) * 7,
      y: p.y + (rng() - 0.5) * 7,
      size: p.size + (rng() - 0.5) * 4,
    }));

    for (let y = 40; y <= 276; y += 6) {
      for (let x = 34; x <= 326; x += 6) {
        if (rng() < 0.56) {
          const kind = rng();
          let w = 6;
          let h = 6;
          if (kind < 0.24) {
            w = 12;
            h = 6;
          } else if (kind < 0.42) {
            w = 6;
            h = 12;
          } else if (kind < 0.56) {
            w = 10;
            h = 10;
          } else if (kind < 0.62) {
            w = 16;
            h = 6;
          }
          generatedBlocks.push({
            x: x + (rng() - 0.5) * 1.8,
            y: y + (rng() - 0.5) * 1.8,
            w,
            h,
          });
        }
      }
    }

    return { blocks: generatedBlocks, finderPatterns: generatedFinders };
  }, []);

  return (
    <svg
      width={size}
      height={Math.round(size * 0.88)}
      viewBox="0 0 360 316"
      role="img"
      aria-label="Decorative heart QR art"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="360" height="316" fill="#ffffff" />
      <defs>
        <clipPath id="heart-qr-clip">
          <path d="M180 286 C142 250, 48 190, 48 114 C48 66, 84 36, 124 36 C151 36, 170 50, 180 68 C190 50, 209 36, 236 36 C276 36, 312 66, 312 114 C312 190, 218 250, 180 286 Z" />
        </clipPath>
      </defs>

      <g clipPath="url(#heart-qr-clip)">
        {blocks.map((b, i) => (
          <rect key={`b-${i}`} x={b.x} y={b.y} width={b.w} height={b.h} fill={color} />
        ))}

        {finderPatterns.map((f, i) => {
          const outer = f.size;
          const ringOffset = outer * 0.2;
          const ringSize = outer * 0.6;
          const innerOffset = outer * 0.34;
          const innerSize = outer * 0.32;
          return (
            <g key={`f-${i}`} transform={`translate(${f.x}, ${f.y})`}>
              <rect x={0} y={0} width={outer} height={outer} fill={color} />
              <rect x={ringOffset} y={ringOffset} width={ringSize} height={ringSize} fill="#ffffff" />
              <rect x={innerOffset} y={innerOffset} width={innerSize} height={innerSize} fill={color} />
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default DecorativeHeartQr;
