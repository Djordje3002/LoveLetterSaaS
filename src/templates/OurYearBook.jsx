import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookHeart, Camera, ChevronLeft, ChevronRight, Sparkles, Star } from 'lucide-react';
import { extractYouTubeId } from './palettes';

const STICKERS = ['✿', '✦', '♥', '✧', '❀', '✶'];

const Polaroid = ({ photoUrl, caption, className = '', rotate = '-2deg' }) => (
  <div className={`rounded-[8px] bg-[#fffdf9] p-2 shadow-[0_10px_20px_rgba(34,15,42,0.2)] ${className}`} style={{ transform: `rotate(${rotate})` }}>
    <div className="aspect-square overflow-hidden rounded-[6px] bg-[#d9d1df]">
      {photoUrl ? (
        <img src={photoUrl} alt={caption || 'memory'} className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-[#e2d8ea] via-[#d2c4df] to-[#c8b4d4]" />
      )}
    </div>
    <p className="mt-2 text-[11px] italic leading-tight text-[#4b3457]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      {caption}
    </p>
  </div>
);

const VintageTag = ({ children, className = '' }) => (
  <div className={`inline-flex items-center gap-1 rounded-full border border-[#e3d6ec] bg-[#f7effc] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#6b4b7a] ${className}`}>
    <Sparkles size={11} />
    {children}
  </div>
);

const OurYearBook = ({
  recipientName,
  senderName,
  scenes = {},
  showSenderName = true,
  showFooter = true,
  musicEnabled = false,
  musicUrl = '',
}) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const hiddenMusicId = extractYouTubeId(musicUrl);

  const photos = useMemo(
    () => [1, 2, 3, 4, 5].map((slot) => ({
      id: slot,
      src: String(scenes[`photo${slot}Url`] || '').trim(),
      caption: String(scenes[`polaroidCaption${slot}`] || `Memory ${slot}`).trim(),
    })),
    [scenes]
  );

  const coverTitle = String(scenes.coverTitle || 'our year.').trim();
  const coverSubtitle = String(scenes.coverSubtitle || 'you make me happy ♡').trim();
  const coverTag = String(scenes.coverTag || 'a love letter').trim();

  const recapTitle = String(scenes.recapTitle || '2026 recap').trim();
  const recapSticker = String(scenes.recapSticker || 'ReCap').trim();
  const recapQuote = String(
    scenes.scene2Header || scenes.recapQuote || 'You make me happy in a way no one else can.'
  ).trim();

  const collageTitle = String(scenes.collageTitle || 'i love you').trim();

  const noteTo = String(scenes.noteTo || recipientName || 'you').trim();
  const noteFrom = String(scenes.noteFrom || (showSenderName && senderName ? senderName : 'me')).trim();
  const noteBody = String(
    scenes.letterText
    || 'I love you.\\nThank you for every little memory we keep making together.\\nYou are my favorite part of every ordinary day.'
  ).trim();

  const endTitle = String(scenes.endTitle || 'the end.').trim();
  const endSubtitle = String(scenes.endSubtitle || 'until next time,').trim();
  const endFootnote = String(scenes.endFootnote || 'p.s. i love you.').trim();

  const pages = useMemo(
    () => [
      { type: 'cover' },
      { type: 'recap' },
      { type: 'open-book' },
      { type: 'collage-note' },
      { type: 'ending' },
    ],
    []
  );

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        setDirection(1);
        setPageIndex((current) => Math.min(current + 1, pages.length - 1));
      }
      if (event.key === 'ArrowLeft') {
        setDirection(-1);
        setPageIndex((current) => Math.max(current - 1, 0));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [pages.length]);

  const canGoBack = pageIndex > 0;
  const canGoForward = pageIndex < pages.length - 1;

  const goBack = () => {
    if (!canGoBack) return;
    setDirection(-1);
    setPageIndex((current) => Math.max(current - 1, 0));
  };

  const goForward = () => {
    if (!canGoForward) return;
    setDirection(1);
    setPageIndex((current) => Math.min(current + 1, pages.length - 1));
  };

  const currentPage = pages[pageIndex];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f4eedf] text-[#2f2338]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {musicEnabled && hiddenMusicId ? (
        <iframe
          src={`https://www.youtube.com/embed/${hiddenMusicId}?autoplay=1&loop=1&playlist=${hiddenMusicId}&controls=0`}
          allow="autoplay"
          className="absolute h-0 w-0 opacity-0 pointer-events-none"
          title="our-year-music"
        />
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[160px] border-b border-[#eadfcb] bg-[linear-gradient(180deg,#f4a8b6_0%,#e88da8_40%,#f4eedf_100%)] opacity-70" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[160px] bg-[radial-gradient(circle_at_10%_85%,rgba(255,255,255,0.72),transparent_44%),radial-gradient(circle_at_32%_45%,rgba(255,215,232,0.88),transparent_30%),radial-gradient(circle_at_62%_28%,rgba(250,222,170,0.82),transparent_32%),radial-gradient(circle_at_86%_56%,rgba(255,255,255,0.72),transparent_35%)]" />

      <div className="relative z-10 min-h-screen px-4 py-6 sm:py-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-4 flex items-center justify-between gap-2 px-1 sm:px-2">
            <VintageTag>our year book</VintageTag>
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#77598a]">Page {pageIndex + 1} / {pages.length}</p>
          </div>

          <div className="relative rounded-[26px] border border-[#e2d3c6] bg-[#f7f1e8] p-3 sm:p-4 shadow-[0_30px_80px_rgba(91,66,107,0.2)]">
            <div className="relative h-[72vh] min-h-[470px] sm:min-h-[520px] max-h-[760px] overflow-hidden rounded-[20px] border border-[#dfcfbf] bg-[#f6efdf]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`${currentPage.type}-${pageIndex}`}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 130 : -130, rotateY: direction > 0 ? -9 : 9, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                  exit={{ opacity: 0, x: direction > 0 ? -130 : 130, rotateY: direction > 0 ? 9 : -9, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -90) goForward();
                    if (info.offset.x > 90) goBack();
                  }}
                  className="absolute inset-0 overflow-y-auto overscroll-contain p-4 sm:p-6 md:p-7"
                >
                  {currentPage.type === 'cover' ? (
                    <div className="mx-auto flex h-full max-w-[420px] items-center justify-center">
                      <div className="relative h-[92%] w-full rounded-[12px] border border-[#cfb8d8] bg-[linear-gradient(150deg,#c8a7de_0%,#b58fd4_42%,#d6b8ea_100%)] p-4 sm:p-6 shadow-[12px_18px_30px_rgba(71,43,92,0.3)]">
                        <div className="absolute inset-0 rounded-[12px] bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.3),transparent_44%),radial-gradient(circle_at_82%_74%,rgba(115,74,149,0.24),transparent_46%)]" />
                        <div className="relative h-full rounded-[8px] border border-white/35 bg-[#f8f1e7] p-4 sm:p-6 text-center shadow-inner">
                          <p className="text-[11px] uppercase tracking-[0.22em] text-[#7c5c8f]">{coverTag}</p>
                          <h1 className="mt-4 sm:mt-6 break-words text-[2.6rem] sm:text-[3.6rem] leading-[0.88] italic text-[#4f2f67]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            {coverTitle}
                          </h1>
                          <p className="mt-5 text-lg italic text-[#74508a]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{coverSubtitle}</p>
                          <div className="mt-10 flex items-center justify-center gap-3 text-[#8f69a5]">
                            <BookHeart size={22} />
                            <span className="text-[12px] uppercase tracking-[0.2em]">slide to open</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {currentPage.type === 'recap' ? (
                    <div className="relative mx-auto h-full max-w-[930px] rounded-[12px] border border-[#d8c7e6] bg-[linear-gradient(145deg,#c6a5dc_0%,#d4bbeb_48%,#b995d4_100%)] p-4 shadow-[0_16px_34px_rgba(73,47,95,0.28)]">
                      <div className="grid h-full grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="relative rounded-[10px] bg-[#fffaf5] p-3 shadow-sm">
                          <div className="absolute left-2 top-2 rounded bg-black/85 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-white">film reel</div>
                          <div className="grid h-full grid-cols-3 gap-2">
                            <Polaroid photoUrl={photos[0].src} caption={photos[0].caption} rotate="-6deg" />
                            <Polaroid photoUrl={photos[1].src} caption={photos[1].caption} rotate="3deg" />
                            <Polaroid photoUrl={photos[2].src} caption={photos[2].caption} rotate="-3deg" />
                          </div>
                        </div>

                        <div className="relative rounded-[10px] bg-[#fffaf5] p-4 shadow-sm">
                          <p className="text-[12px] uppercase tracking-[0.24em] text-[#7d5b90]">{recapTitle}</p>
                          <h2 className="mt-2 break-words text-3xl sm:text-4xl leading-[0.9] italic text-[#5f3d78]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            {recapSticker}
                          </h2>
                          <p className="mt-4 rounded-[10px] border border-[#e7d9f1] bg-[#f6ebff] p-3 text-[15px] italic leading-relaxed text-[#5c3d6f]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            {recapQuote}
                          </p>
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <Polaroid photoUrl={photos[3].src} caption={photos[3].caption} rotate="-4deg" />
                            <Polaroid photoUrl={photos[4].src} caption={photos[4].caption} rotate="5deg" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {currentPage.type === 'open-book' ? (
                    <div className="relative mx-auto h-full max-w-[980px] rounded-[16px] border border-[#d9c8ea] bg-[#f8f2ff] p-4 shadow-[0_16px_30px_rgba(74,45,100,0.25)]">
                      <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-[#ccb7db]" />
                      <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="relative rounded-[12px] border border-[#e2d4ef] bg-[#fffdf9] p-3">
                          <p className="text-[11px] uppercase tracking-[0.2em] text-[#7e5c95]">left page</p>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <Polaroid photoUrl={photos[0].src} caption={photos[0].caption} rotate="-5deg" />
                            <Polaroid photoUrl={photos[1].src} caption={photos[1].caption} rotate="4deg" />
                          </div>
                          <p className="mt-3 text-sm italic text-[#5b456d]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            little moments, big feelings.
                          </p>
                        </div>
                        <div className="relative rounded-[12px] border border-[#e2d4ef] bg-[#fffdf9] p-3">
                          <p className="text-[11px] uppercase tracking-[0.2em] text-[#7e5c95]">right page</p>
                          <div className="mt-2 rounded-[10px] border border-[#e8dbf2] bg-[#f5ebff] p-2">
                            <Polaroid photoUrl={photos[2].src} caption={photos[2].caption} rotate="-2deg" />
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1.5 text-[#8f6ca6]">
                            {STICKERS.map((sticker, idx) => (
                              <span key={`sticker-${idx}`} className="rounded-full border border-[#e0d1ee] bg-white px-2 py-0.5 text-xs">{sticker}</span>
                            ))}
                          </div>
                          <p className="mt-2 text-sm text-[#5b456d] italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            {collageTitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {currentPage.type === 'collage-note' ? (
                    <div className="relative mx-auto h-full max-w-[950px] rounded-[12px] border border-[#d6c2e8] bg-[linear-gradient(145deg,#cfb0e4_0%,#c49cdd_55%,#b08acb_100%)] p-4 shadow-[0_16px_34px_rgba(68,41,95,0.28)]">
                      <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-[1.15fr_0.85fr]">
                        <div className="relative rounded-[10px] border border-white/45 bg-[#f8f0ff] p-3">
                          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full border border-[#dccaea] bg-white px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[#74558a]">
                            <Camera size={11} /> memory tape
                          </div>
                          <div className="grid grid-cols-2 gap-2 pt-6">
                            <Polaroid photoUrl={photos[0].src} caption={photos[0].caption} rotate="-7deg" />
                            <Polaroid photoUrl={photos[1].src} caption={photos[1].caption} rotate="6deg" />
                            <Polaroid photoUrl={photos[3].src} caption={photos[3].caption} rotate="-4deg" />
                            <Polaroid photoUrl={photos[4].src} caption={photos[4].caption} rotate="5deg" />
                          </div>
                        </div>

                        <div className="relative rounded-[10px] border border-[#d8c7e8] bg-[#fffdf9] p-4">
                          <div className="absolute right-4 top-3 rotate-[16deg] text-2xl text-[#7d5e97]">📎</div>
                          <p className="text-[11px] uppercase tracking-[0.22em] text-[#765588]">to {noteTo}</p>
                          <div className="mt-3 rounded-[10px] border border-[#e6d9f2] bg-[#fff] p-4 shadow-inner">
                            <p className="whitespace-pre-line text-[15px] leading-relaxed text-[#473158]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                              {noteBody}
                            </p>
                            <p className="mt-4 text-right text-sm italic text-[#65477b]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                              — {noteFrom}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {currentPage.type === 'ending' ? (
                    <div className="mx-auto flex h-full max-w-[420px] items-center justify-center">
                      <div className="relative h-[92%] w-full rounded-[12px] border border-[#cfb8d8] bg-[linear-gradient(150deg,#c8a7de_0%,#b58fd4_42%,#d6b8ea_100%)] p-6 shadow-[12px_18px_30px_rgba(71,43,92,0.3)]">
                        <div className="relative h-full rounded-[8px] border border-white/40 bg-[#f8f1e7] p-6 text-center">
                          <h2 className="break-words text-[2.8rem] sm:text-[3.8rem] leading-[0.88] italic text-[#4f2f67]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            {endTitle}
                          </h2>
                          <p className="mt-6 text-2xl italic text-[#6e4d84]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{endSubtitle}</p>
                          <p className="mt-6 text-lg italic text-[#6b4f7d]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{endFootnote}</p>
                          <div className="mt-8 flex items-center justify-center gap-2 text-[#8f69a5]">
                            <Star size={16} className="fill-current" />
                            <span className="text-[11px] uppercase tracking-[0.22em]">made with love</span>
                            <Star size={16} className="fill-current" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </motion.div>
              </AnimatePresence>

              <button
                type="button"
                onClick={goBack}
                disabled={!canGoBack}
                className={`absolute left-2 top-1/2 z-20 h-11 w-11 -translate-y-1/2 rounded-full border flex items-center justify-center transition-all sm:left-3 ${
                  canGoBack
                    ? 'border-[#e2d2e9] bg-white/90 text-[#674a79] hover:scale-105'
                    : 'cursor-not-allowed border-[#eadff0] bg-white/65 text-[#c1aecf]'
                }`}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={goForward}
                disabled={!canGoForward}
                className={`absolute right-2 top-1/2 z-20 h-11 w-11 -translate-y-1/2 rounded-full border flex items-center justify-center transition-all sm:right-3 ${
                  canGoForward
                    ? 'border-[#e2d2e9] bg-white/90 text-[#674a79] hover:scale-105'
                    : 'cursor-not-allowed border-[#eadff0] bg-white/65 text-[#c1aecf]'
                }`}
              >
                <ChevronRight size={20} />
              </button>

              <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full border border-[#e5d8eb] bg-white/90 px-3 py-1.5">
                {pages.map((page, idx) => (
                  <button
                    key={`dot-${page.type}-${idx}`}
                    type="button"
                    onClick={() => {
                      if (idx === pageIndex) return;
                      setDirection(idx > pageIndex ? 1 : -1);
                      setPageIndex(idx);
                    }}
                    className={`h-2.5 w-2.5 rounded-full transition-all ${idx === pageIndex ? 'bg-[#8f68a5] scale-110' : 'bg-[#d6c7e2]'}`}
                    aria-label={`Go to page ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {showFooter ? (
            <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-[#7d648f]">made with LovePage</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default OurYearBook;
