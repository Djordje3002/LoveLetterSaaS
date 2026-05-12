import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookHeart, ChevronLeft, ChevronRight } from 'lucide-react';
import { palettes, fonts, extractYouTubeId } from './palettes';

const PLACEHOLDER_BG = [
  'from-rose-200 to-pink-300',
  'from-amber-200 to-orange-300',
  'from-sky-200 to-blue-300',
  'from-violet-200 to-fuchsia-300',
  'from-emerald-200 to-teal-300',
];

const daysFromStartDate = (rawDate) => {
  if (!rawDate) return null;
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return null;
  return Math.max(0, Math.floor((Date.now() - parsed.getTime()) / 86400000));
};

const OurStory = ({
  recipientName,
  senderName,
  scenes = {},
  palette = 'pink',
  font = 'classic',
  showSenderName = true,
  showFooter = true,
  musicEnabled = false,
  musicUrl = '',
}) => {
  const pal = palettes[palette] || palettes.pink;
  const fnt = fonts[font] || fonts.classic;
  const videoId = extractYouTubeId(musicUrl);
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const daysTogether = daysFromStartDate(scenes.startDate);
  const bookTitle = scenes.storyTitle || 'Our Storybook';
  const finalLetterTitle = scenes.letterTitle || 'A Letter For You';
  const finalLetterBody = scenes.finalLetter || scenes.closingMessage || scenes.chapter2Text || 'Every chapter with you feels like home.';

  const photos = useMemo(
    () => [1, 2, 3, 4, 5].map((slot, i) => ({
      id: slot,
      imageUrl: scenes[`photo${slot}Url`] || '',
      caption: scenes[`polaroidCaption${slot}`] || `Memory ${slot}`,
      bg: PLACEHOLDER_BG[i],
    })),
    [scenes]
  );

  const photoPages = photos.filter((photo) => photo.imageUrl || photo.caption);
  const chapterSummaries = [
    { title: scenes.chapter1Title || 'How We Met', text: scenes.chapter1Text || '' },
    { title: scenes.chapter2Title || 'Our First Date', text: scenes.chapter2Text || '' },
  ].filter((chapter) => chapter.text);

  const pages = useMemo(() => {
    const compiled = [
      {
        type: 'cover',
        title: bookTitle,
        subtitle: recipientName ? `for ${recipientName}` : 'for my favorite person',
      },
      {
        type: 'chapters',
        title: 'Before the photos...',
        chapters: chapterSummaries,
      },
      ...photoPages.map((photo) => ({ type: 'photo', ...photo })),
      {
        type: 'letter',
        title: finalLetterTitle,
        body: finalLetterBody,
      },
    ];
    return compiled;
  }, [bookTitle, chapterSummaries, finalLetterBody, finalLetterTitle, photoPages, recipientName]);

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
    <div className="min-h-screen relative overflow-hidden" style={{ fontFamily: fnt.body, backgroundColor: pal.bg }}>
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage: `radial-gradient(circle at 14% 16%, ${pal.primary}20, transparent 38%), radial-gradient(circle at 84% 20%, ${pal.accent}26, transparent 40%), radial-gradient(circle at 56% 82%, ${pal.primary}18, transparent 42%)`,
          backgroundSize: '180% 180%',
          opacity: 0.75,
        }}
      />

      {musicEnabled && videoId ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0`}
          allow="autoplay"
          className="w-0 h-0 absolute opacity-0 pointer-events-none"
          title="storybook-music"
        />
      ) : null}

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl rounded-[30px] border border-[#e8d8c4] bg-[#fffaf2]/90 backdrop-blur p-4 md:p-6 shadow-[0_30px_80px_rgba(71,40,18,0.18)]">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#efd9c6] px-3 py-1 text-[#8d5a3a] text-xs font-bold uppercase tracking-widest">
              <BookHeart size={14} />
              Storybook
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#9f6d4d]">
              Page {pageIndex + 1} / {pages.length}
            </div>
          </div>

          <div className="relative rounded-[22px] border border-[#e8dccd] bg-[#fffaf0] min-h-[520px] md:min-h-[580px] overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`${currentPage.type}-${pageIndex}`}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 120 : -120, rotateY: direction > 0 ? -7 : 7 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -120 : 120, rotateY: direction > 0 ? 7 : -7 }}
                transition={{ duration: 0.36, ease: 'easeOut' }}
                className="absolute inset-0 p-6 md:p-10"
              >
                {currentPage.type === 'cover' ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <p className="text-xs font-black uppercase tracking-[0.32em] mb-4" style={{ color: pal.primary }}>
                      Our Story
                    </p>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: pal.text, fontFamily: fnt.heading }}>
                      {currentPage.title}
                    </h1>
                    <p className="text-lg text-secondary mb-6 capitalize">{currentPage.subtitle}</p>
                    {daysTogether !== null ? (
                      <div className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-white font-bold shadow-lg" style={{ backgroundColor: pal.primary }}>
                        ♥ {daysTogether.toLocaleString()} days together
                      </div>
                    ) : null}
                    {scenes.startDate ? (
                      <p className="text-sm text-secondary mt-3">Since {scenes.startDate}</p>
                    ) : null}
                  </div>
                ) : null}

                {currentPage.type === 'chapters' ? (
                  <div className="h-full">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ fontFamily: fnt.heading, color: pal.text }}>
                      {currentPage.title}
                    </h2>
                    <div className="space-y-6">
                      {(currentPage.chapters.length > 0 ? currentPage.chapters : [{ title: 'Your Story Starts Here', text: 'Add chapter text from the builder and this page will fill automatically.' }]).map((chapter, index) => (
                        <div key={`${chapter.title}-${index}`} className="rounded-2xl border border-[#e7d9c9] bg-white/95 p-5">
                          <p className="text-xs uppercase tracking-widest font-bold mb-2" style={{ color: pal.primary }}>
                            Chapter {index + 1}
                          </p>
                          <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: fnt.heading }}>{chapter.title}</h3>
                          <p className="text-secondary leading-relaxed">{chapter.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {currentPage.type === 'photo' ? (
                  <div className="h-full flex flex-col">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: fnt.heading, color: pal.text }}>
                      Photo Memory
                    </h2>
                    <div className="flex-1 rounded-2xl overflow-hidden border border-[#e5d9ca] bg-white shadow-sm">
                      {currentPage.imageUrl ? (
                        <img src={currentPage.imageUrl} alt={currentPage.caption} className="w-full h-full object-cover" />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${currentPage.bg} flex items-center justify-center text-white/75 text-6xl`}>
                          📸
                        </div>
                      )}
                    </div>
                    <p className="mt-4 text-center font-dancing text-3xl" style={{ color: pal.primary }}>
                      {currentPage.caption}
                    </p>
                  </div>
                ) : null}

                {currentPage.type === 'letter' ? (
                  <div className="h-full rounded-2xl border border-[#ded2c3] bg-[#fffdf8] p-6 md:p-8 shadow-inner">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-center" style={{ color: pal.primary, fontFamily: fnt.heading }}>
                      {currentPage.title}
                    </h2>
                    <div
                      className="h-[calc(100%-84px)] rounded-xl border border-[#e4d8c9] px-5 py-6 md:px-8 md:py-7 overflow-auto"
                      style={{
                        backgroundColor: '#fffdf9',
                        backgroundImage: 'repeating-linear-gradient(180deg, transparent, transparent 31px, rgba(176,140,109,0.24) 31px, rgba(176,140,109,0.24) 32px)',
                      }}
                    >
                      <p className="whitespace-pre-line text-[1.05rem] leading-[1.95] text-[#4f3a2c]">
                        {currentPage.body}
                      </p>
                      {showSenderName && senderName ? (
                        <p className="text-right mt-6 font-dancing text-3xl" style={{ color: pal.primary }}>
                          — {senderName}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={goBack}
              disabled={!canGoBack}
              className={`absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-all ${
                canGoBack
                  ? 'bg-white/92 border-[#e7d7c5] text-[#8c5a39] hover:scale-105'
                  : 'bg-white/60 border-[#efe5d8] text-[#c8b8a7] cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={goForward}
              disabled={!canGoForward}
              className={`absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-all ${
                canGoForward
                  ? 'bg-white/92 border-[#e7d7c5] text-[#8c5a39] hover:scale-105'
                  : 'bg-white/60 border-[#efe5d8] text-[#c8b8a7] cursor-not-allowed'
              }`}
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {showFooter ? (
          <p className="mt-5 text-xs uppercase tracking-widest font-black text-secondary">
            made with LovePage ♥
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default OurStory;
