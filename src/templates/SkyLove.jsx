import { motion } from 'framer-motion';
import EnvelopeRevealShell from './EnvelopeRevealShell';
import { palettes, fonts, extractYouTubeId } from './palettes';

const SKY_PAPER_STYLE = {
  backgroundColor: '#f5ecd7',
  backgroundImage:
    'radial-gradient(circle at 14% 14%, rgba(164,135,94,0.26), transparent 42%), radial-gradient(circle at 84% 86%, rgba(132,104,69,0.22), transparent 35%), repeating-linear-gradient(180deg, rgba(109,82,50,0.08), rgba(109,82,50,0.08) 1px, transparent 1px, transparent 30px), radial-gradient(circle at 48% -26%, rgba(255,255,255,0.78), transparent 68%)',
};

const SKY_STARS = Array.from({ length: 52 }, (_, index) => ({
  id: index,
  top: `${4 + ((index * 13) % 84)}%`,
  left: `${3 + ((index * 17) % 94)}%`,
  size: `${1 + (index % 3)}px`,
  delay: `${(index % 7) * 0.35}s`,
  duration: `${2.4 + (index % 5) * 0.65}s`,
  opacity: 0.32 + (index % 6) * 0.09,
}));

const SkyLove = ({
  recipientName,
  senderName,
  scenes = {},
  palette = 'navy',
  font = 'elegant',
  showSenderName = true,
  showFooter = true,
  musicEnabled = false,
  musicUrl = '',
}) => {
  const pal = palettes[palette] || palettes.navy;
  const fnt = fonts[font] || fonts.elegant;
  const videoId = extractYouTubeId(musicUrl);
  const letterParagraphs = (scenes.letterText || '').split('\n').filter(Boolean);

  return (
    <EnvelopeRevealShell
      hintText={scenes.hint || 'Tap the moon seal to open ✨'}
      openingHintText="Opening your sky letter..."
      letterPreviewText={scenes.letterText || scenes.scene2Header || 'A message written under the moonlight...'}
      paperVariant="midnight"
      backgroundStyle={{
        background:
          'radial-gradient(circle at 50% 12%, #314f95 0%, #182f66 35%, #0a1940 68%, #060f2c 100%)',
      }}
      floatingDecor={[
        { id: 'sky-1', icon: '🌙', style: { top: '12%', left: '10%' }, delay: 0.12 },
        { id: 'sky-2', icon: '✨', style: { top: '17%', right: '8%' }, delay: 0.34 },
        { id: 'sky-3', icon: '⭐', style: { bottom: '16%', left: '12%' }, delay: 0.62 },
      ]}
      envelopeTheme={{
        body: 'linear-gradient(180deg, #d7e2ff 0%, #b9c8f4 52%, #8fa8e4 100%)',
        flap: 'linear-gradient(180deg, #edf2ff 0%, #bfd0f9 100%)',
        front: 'linear-gradient(90deg, #c0cff2 0%, #dce8ff 50%, #abc0eb 100%)',
        border: '#8ca3d4',
        seal: 'linear-gradient(135deg, #6f87d6 0%, #3f56a6 100%)',
        hint: '#b7cbff',
      }}
    >
      <div className="min-h-screen relative overflow-hidden" style={{ fontFamily: fnt.body }}>
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.6, 0.92, 0.6] }}
          transition={{ duration: 9.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background:
              'radial-gradient(circle at 20% 18%, rgba(123,149,227,0.38), transparent 38%), radial-gradient(circle at 86% 22%, rgba(170,203,255,0.30), transparent 36%), radial-gradient(circle at 46% 86%, rgba(109,132,201,0.34), transparent 42%), linear-gradient(180deg, #050d28 0%, #0a173f 52%, #060f2e 100%)',
          }}
        />

        {musicEnabled && videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0`}
            allow="autoplay"
            className="w-0 h-0 absolute opacity-0"
            title="sky-love-background-music"
          />
        ) : null}

        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {SKY_STARS.map((star) => (
            <span
              key={star.id}
              className="absolute rounded-full animate-twinkle"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
                backgroundColor: '#ffffff',
                animationDelay: star.delay,
                animationDuration: star.duration,
              }}
            />
          ))}
        </div>

        <div className="absolute top-[10%] right-[10%] w-24 h-24 rounded-full bg-[#f8f5e9] shadow-[0_0_60px_rgba(255,255,220,0.48)] border border-[#f7edcf]/80" />
        <div className="absolute top-[11.5%] right-[14%] w-4 h-4 rounded-full bg-[#d6cdb4]/70" />
        <div className="absolute top-[14.2%] right-[11.4%] w-2.5 h-2.5 rounded-full bg-[#cdc3a8]/75" />

        <div className="relative z-10 min-h-screen px-5 py-16 sm:px-8 sm:py-20 flex items-center justify-center">
          <div className="w-full max-w-3xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75 }}
              className="text-xs sm:text-sm font-bold uppercase tracking-[0.32em] mb-4"
              style={{ color: `${pal.accent || '#b8cbff'}dd` }}
            >
              Sky Love
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4"
              style={{ fontFamily: fnt.heading, color: '#e4ecff' }}
            >
              {scenes.scene2Header || `For ${recipientName || 'my love'}, beneath the stars`}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.34, duration: 0.7 }}
              className="text-[#bfd0ff] text-sm sm:text-base mb-12"
            >
              {scenes.scene3Header || 'Tonight the moon holds every word I could not keep inside.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 28, rotate: 0.8 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: 0.5, duration: 0.82, ease: 'easeOut' }}
              className="relative mx-auto w-full rounded-[14px] border border-[#b59d77] shadow-[0_30px_80px_rgba(9,18,52,0.48)] px-7 py-9 sm:px-10 sm:py-12 text-left overflow-hidden max-h-[78vh]"
              style={SKY_PAPER_STYLE}
            >
              <div className="absolute -top-3 left-12 w-24 h-7 bg-white/70 rotate-[-6deg] shadow-sm rounded-sm" />
              <div className="absolute inset-[10px] rounded-[10px] border border-[#cfba93]/70 pointer-events-none" />
              <div className="relative max-h-[60vh] overflow-y-auto pr-2 space-y-6 text-[#2b3e63]">
                {letterParagraphs.length > 0 ? (
                  letterParagraphs.map((paragraph, index) => (
                    <motion.p
                      key={`${paragraph.slice(0, 8)}-${index}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.74 + index * 0.2 }}
                      className="text-lg sm:text-xl leading-[1.85]"
                    >
                      {paragraph}
                    </motion.p>
                  ))
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.74 }}
                    className="text-lg italic text-[#5f7199] text-center"
                  >
                    Your message will appear here under the moonlight...
                  </motion.p>
                )}

                {(scenes.closingMessage || (showSenderName && senderName)) ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + letterParagraphs.length * 0.2 }}
                    className="pt-4 text-right"
                  >
                    {scenes.closingMessage ? (
                      <p className="font-dancing text-3xl text-[#4868a8]">{scenes.closingMessage}</p>
                    ) : null}
                    {showSenderName && senderName ? (
                      <p className="font-dancing text-2xl text-[#5a6f9f] mt-2">— {senderName}</p>
                    ) : null}
                  </motion.div>
                ) : null}
              </div>
            </motion.div>
          </div>
        </div>

        {showFooter ? (
          <div className="relative z-10 text-center pb-10">
            <p className="text-white/25 text-sm">made with LovePage ♥</p>
          </div>
        ) : null}
      </div>
    </EnvelopeRevealShell>
  );
};

export default SkyLove;
