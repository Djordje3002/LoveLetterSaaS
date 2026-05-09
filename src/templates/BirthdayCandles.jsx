import { motion } from 'framer-motion'
import { palettes, fonts, extractYouTubeId } from './palettes'

const toOrdinal = (value) => {
  const n = Number.parseInt(String(value || '').trim(), 10)
  if (!Number.isFinite(n) || n <= 0) return null
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`
  const mod10 = n % 10
  if (mod10 === 1) return `${n}st`
  if (mod10 === 2) return `${n}nd`
  if (mod10 === 3) return `${n}rd`
  return `${n}th`
}

const BirthdayCandles = ({
  recipientName,
  senderName,
  scenes = {},
  palette = 'gold',
  font = 'playful',
  showSenderName = true,
  showFooter = true,
  musicEnabled = false,
  musicUrl = '',
}) => {
  const pal = palettes[palette] || palettes.gold
  const fnt = fonts[font] || fonts.playful
  const videoId = extractYouTubeId(musicUrl)

  const ordinalAge = toOrdinal(scenes.age)
  const displayName = String(recipientName || '').trim() || 'Birthday Star'
  const headline = scenes.headline || (ordinalAge ? `Happy ${ordinalAge} Birthday, ${displayName}!` : `Happy Birthday, ${displayName}!`)
  const subheadline = scenes.subheadline || 'Tonight is for wishes, candles, and celebrating you.'
  const letterText = scenes.letterText || 'You deserve a year full of laughter, calm, and beautiful surprises.'
  const closing = scenes.wishLine || scenes.closingMessage || 'May this year be your best one yet.'

  const ageNumber = Number.parseInt(String(scenes.age || '').trim(), 10)
  const candleCount = Number.isFinite(ageNumber) && ageNumber > 0
    ? Math.min(Math.max(ageNumber, 4), 12)
    : 7

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        fontFamily: fnt.body,
        background:
          'radial-gradient(circle at 50% -12%, #fff8de 0%, #ffe5be 36%, #ffd2a0 66%, #f7b785 100%)',
      }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage: `radial-gradient(circle at 16% 20%, ${pal.primary}24, transparent 35%), radial-gradient(circle at 84% 16%, ${pal.accent}2c, transparent 38%), radial-gradient(circle at 50% 86%, #ffffff9a, transparent 46%)`,
          backgroundSize: '170% 170%',
        }}
      />

      {musicEnabled && videoId ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0`}
          allow="autoplay"
          className="w-0 h-0 absolute opacity-0"
          title="birthday-template-music"
        />
      ) : null}

      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.span
          key={`party-${i}`}
          className="absolute text-2xl md:text-3xl"
          style={{
            left: `${6 + i * 15}%`,
            top: `${7 + (i % 3) * 9}%`,
          }}
          animate={{ y: [0, -10, 0], rotate: [0, -7, 7, 0], opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 3 + i * 0.24, repeat: Infinity, ease: 'easeInOut' }}
        >
          {i % 2 === 0 ? '✨' : '🎉'}
        </motion.span>
      ))}

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-5 py-14 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-[#ffd8ad] bg-white/65 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.24em]"
          style={{ color: '#9b5f28' }}
        >
          Candlelight Edition
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[2.15rem] md:text-[4rem] font-bold mt-4 mb-3 leading-[1.06] max-w-4xl"
          style={{ fontFamily: fnt.heading, color: '#5b2f12' }}
        >
          {headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.22 }}
          className="text-[#744d33] text-sm md:text-lg max-w-2xl mb-9"
        >
          {subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="w-full max-w-3xl"
        >
          <div className="relative rounded-[28px] border border-[#efcfaa] bg-[#fff8eb]/95 shadow-[0_32px_90px_rgba(118,68,24,0.26)] p-5 md:p-8 overflow-hidden">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#f5cc95] to-transparent" />

            <div className="relative h-52 md:h-56 mb-6">
              <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[94%] h-16 rounded-[18px] bg-gradient-to-r from-[#cb733f] via-[#f09f61] to-[#c86d39] border border-[#a95b31]" />
              <div className="absolute left-1/2 bottom-[46px] -translate-x-1/2 w-[82%] h-[58px] rounded-[16px] bg-gradient-to-r from-[#ffd39a] via-[#ffe7b9] to-[#ffce90] border border-[#d6aa6c]" />
              <div className="absolute left-1/2 bottom-[92px] -translate-x-1/2 w-[66%] h-[48px] rounded-[14px] bg-gradient-to-r from-[#ffc0d2] via-[#ffdce8] to-[#ffb7cd] border border-[#d793ab]" />

              <div className="absolute left-1/2 bottom-[136px] -translate-x-1/2 w-[74%] flex items-end justify-center gap-1.5 md:gap-2">
                {Array.from({ length: candleCount }).map((_, idx) => (
                  <div key={`candle-${idx}`} className="relative flex flex-col items-center">
                    <motion.span
                      className="absolute -top-4 text-[14px]"
                      animate={{ y: [0, -2.4, 0], scale: [1, 1.14, 1], opacity: [0.82, 1, 0.82] }}
                      transition={{ duration: 0.78 + (idx % 4) * 0.1, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      🔥
                    </motion.span>
                    <div className="w-2.5 h-9 rounded-sm bg-[#ff5a6f] border border-[#d53d52]" />
                  </div>
                ))}
              </div>

              {ordinalAge ? (
                <div className="absolute right-2 md:right-5 top-2 rounded-full bg-white/90 border border-[#eec79c] px-3.5 py-1 text-xs font-black text-[#90572d] shadow-sm">
                  {ordinalAge}
                </div>
              ) : null}
            </div>

            <div className="rounded-2xl border border-[#efd8bc] bg-white p-4 md:p-6 text-left shadow-[inset_0_1px_0_#fff8f1]">
              <p className="text-[#a2562c] font-bold mb-3 text-base">{closing}</p>
              {String(letterText).split('\n').filter(Boolean).map((paragraph, index) => (
                <p key={`birthday-line-${index}`} className="text-[#5a4332] leading-7 mb-2.5 last:mb-0">
                  {paragraph}
                </p>
              ))}

              <div className="pt-5 text-right">
                {showSenderName && senderName ? (
                  <p className="font-dancing text-2xl md:text-[2rem] text-[#7a4d35]">— {senderName}</p>
                ) : null}
              </div>
            </div>
          </div>
        </motion.div>

        {showFooter ? (
          <p className="text-[#915f3a] text-sm mt-8">made with LovePage ♥</p>
        ) : null}
      </div>
    </div>
  )
}

export default BirthdayCandles
