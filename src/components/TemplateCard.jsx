import { useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { ArrowRight, Loader2, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createDraft } from '../utils/createDraft';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../utils/analytics';
import useIsMobile from '../hooks/useIsMobile';

const TEMPLATE_CARD_MESSAGES = {
  'full-house-love': 'A private love world with a gate, letter, memories, and 100 reasons.',
  'kawaii-letter': 'A romantic letter reveal with photo moments and a sweet ending.',
  'bouquet-garden': 'A bouquet-style secret board with passcode, music, and memories.',
  'our-year-book': 'A sliding book of pages for photos, messages, and your story.',
  'date-invite': 'A playful yes/no love confession with motion and a happy finale.',
};

const TEMPLATE_PREVIEW_IMAGES = {
  'kawaii-letter': '/template-art/love-letter.svg',
  'full-house-love': '/template-art/full-house-love.svg',
  'bouquet-garden': '/template-art/bouquet-garden.svg',
  'our-year-book': '/template-art/our-love-book.svg',
  'date-invite': '/template-art/valentine.svg',
};

const getTemplatePreviewImage = (templateId) => TEMPLATE_PREVIEW_IMAGES[templateId] || TEMPLATE_PREVIEW_IMAGES['kawaii-letter'];

const TEMPLATE_CARD_SCENES = {
  'kawaii-letter': {
    overlay: 'linear-gradient(180deg, rgba(255,246,249,0.12) 0%, rgba(246,56,113,0.9) 100%)',
    glow: '#ff78a5',
    ink: '#fff6fa',
  },
  'full-house-love': {
    overlay: 'linear-gradient(180deg, rgba(10,24,44,0.1) 0%, rgba(13,39,70,0.92) 100%)',
    glow: '#77d7ff',
    ink: '#f3fbff',
  },
  'bouquet-garden': {
    overlay: 'linear-gradient(180deg, rgba(121,13,40,0.08) 0%, rgba(96,9,31,0.9) 100%)',
    glow: '#ff9bb7',
    ink: '#fff7ef',
  },
  'our-year-book': {
    overlay: 'linear-gradient(180deg, rgba(117,77,139,0.08) 0%, rgba(79,47,103,0.88) 100%)',
    glow: '#d8b7ef',
    ink: '#fff7ed',
  },
  'date-invite': {
    overlay: 'linear-gradient(180deg, rgba(255,87,129,0.08) 0%, rgba(211,28,82,0.9) 100%)',
    glow: '#ff6f9d',
    ink: '#fff7fb',
  },
};

const TemplateCard = ({ template, index }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const shouldSimplifyPreview = isMobile || prefersReducedMotion;
  const cardMessage = TEMPLATE_CARD_MESSAGES[template.id] || 'A personalized page made to feel thoughtful, private, and easy to share.';
  const previewImage = getTemplatePreviewImage(template.id);
  const scene = TEMPLATE_CARD_SCENES[template.id] || TEMPLATE_CARD_SCENES['kawaii-letter'];

  const handleUse = async (e) => {
    e.preventDefault();
    trackEvent('template_use_clicked', { templateId: template.id, loggedIn: Boolean(user) });
    if (!user) {
      navigate(`/create/${template.id}?onboarding=1`);
      return;
    }
    setCreateError('');
    setCreating(true);
    try {
      const draftId = await createDraft(template.id);
      trackEvent('draft_created', { templateId: template.id, draftId });
      navigate(`/create/${template.id}?draft=${draftId}&onboarding=1`);
    } catch (err) {
      console.error(err);
      setCreateError(err?.message || 'Could not create draft. Please check your connection and try again.');
      setCreating(false);
    }
  };
  return (
    <motion.div
      layout
      initial={shouldSimplifyPreview ? false : { opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={shouldSimplifyPreview ? { duration: 0.16 } : { delay: index * 0.06, type: 'spring', stiffness: 130, damping: 18 }}
      whileHover={shouldSimplifyPreview ? undefined : { y: -10, rotate: index % 2 === 0 ? -0.35 : 0.35, scale: 1.012 }}
      className="group relative"
    >
      <Link className="block h-full" to={`/templates/${template.id}`} onClick={() => trackEvent('template_clicked', { templateId: template.id })}>
        <div className="relative min-h-[410px] overflow-hidden rounded-[34px] border border-white/70 bg-[#fff7fb] shadow-[0_22px_58px_rgba(44,31,42,0.12)] transition-shadow duration-300 group-hover:shadow-[0_34px_74px_rgba(44,31,42,0.18)]">
          <img
            src={previewImage}
            alt={`${template.name} preview`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0" style={{ background: scene.overlay }} />
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-2xl"
            style={{ background: scene.glow, opacity: shouldSimplifyPreview ? 0.18 : 0.32 }}
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-8 h-48 w-48 rounded-full blur-3xl"
            style={{ background: scene.glow, opacity: shouldSimplifyPreview ? 0.18 : 0.28 }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.28),transparent_18%),radial-gradient(circle_at_80%_36%,rgba(255,255,255,0.18),transparent_18%)]" />

          <div className="relative flex min-h-[410px] flex-col justify-between p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full border border-white/45 bg-white/24 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur">
                {template.tags[0] || 'Love'}
              </span>
              <span className="rounded-full border border-white/45 bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-sm backdrop-blur">
                Digital Gift
              </span>
            </div>

            <div className="pointer-events-none my-8 min-h-[128px]" />

            <div>
              <div className="mb-3 flex items-center gap-1 text-amber-300 drop-shadow-sm">
                {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
                <span className="ml-1 text-[11px] font-bold text-white/85">5.0</span>
              </div>
              <h3 className="font-display text-2xl font-bold leading-none text-white sm:text-3xl">{template.name}</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-white/82">
                {cardMessage}
              </p>
              <div className="mt-5 flex items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {template.tags.slice(1, 3).map(tag => (
                    <span key={tag} className="rounded-full border border-white/35 bg-white/18 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white/88 backdrop-blur">
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={handleUse}
                  disabled={creating}
                  className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-black text-[#241729] shadow-lg transition-all group-hover:gap-2 disabled:opacity-60 sm:text-sm"
                >
                  {creating ? <Loader2 size={14} className="animate-spin" /> : null}
                  {creating ? 'Creating...' : <><span>Use template</span> <ArrowRight size={14} /></>}
                </button>
              </div>
              {createError && (
                <p className="mt-3 text-[11px] font-bold text-white">{createError}</p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default TemplateCard;
