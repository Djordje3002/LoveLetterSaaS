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

const TEMPLATE_PREVIEW_IMAGES = [
  'https://picsum.photos/seed/love-1/900/600',
  'https://picsum.photos/seed/love-2/900/600',
  'https://picsum.photos/seed/love-3/900/600',
  'https://picsum.photos/seed/love-4/900/600',
  'https://picsum.photos/seed/love-5/900/600',
  'https://picsum.photos/seed/love-6/900/600',
];

const getTemplatePreviewImage = (templateId, index) => {
  const raw = `${templateId}-${index}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i += 1) hash = (hash * 31 + raw.charCodeAt(i)) >>> 0;
  return TEMPLATE_PREVIEW_IMAGES[hash % TEMPLATE_PREVIEW_IMAGES.length];
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
  const previewImage = getTemplatePreviewImage(template.id, index);

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
      className="group relative overflow-hidden rounded-[30px] border border-[#f3d3df] bg-white shadow-[0_12px_34px_rgba(44,31,42,0.08)] transition-shadow duration-300 hover:shadow-[0_24px_60px_rgba(44,31,42,0.14)]"
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#f45c8d]/70 to-transparent" />
      <Link className="block h-full" to={`/templates/${template.id}`} onClick={() => trackEvent('template_clicked', { templateId: template.id })}>
        <div className={`relative aspect-[3/2] overflow-hidden pt-3 ${shouldSimplifyPreview ? 'bg-white' : 'bg-[radial-gradient(circle_at_top_left,#fff1f7_0%,#ffffff_52%)]'}`}>
          <img
            src={previewImage}
            alt={`${template.name} preview`}
            loading="lazy"
            className="h-full w-full object-cover rounded-t-[22px]"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/22 to-transparent rounded-t-[22px]" />
        </div>
        <div className="relative p-4 sm:p-5 bg-white border-t border-[#f5dce5]">
          <div className="mb-2 flex items-start justify-between gap-3">
            <h3 className="text-dark font-bold text-base sm:text-lg font-display leading-tight">{template.name}</h3>
          </div>
          <p className="mb-4 min-h-[42px] text-xs sm:text-[13px] leading-relaxed text-secondary">
            {cardMessage}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {template.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-primary-pink bg-primary-light px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
              </div>
              <span className="text-[11px] sm:text-xs text-secondary font-medium">5.0</span>
            </div>
            <button
              onClick={handleUse}
              disabled={creating}
              className="text-primary-pink text-xs sm:text-sm font-bold flex items-center gap-1.5 rounded-full px-1 py-1 transition-all group-hover:gap-2 disabled:opacity-60"
            >
              {creating ? <Loader2 size={14} className="animate-spin" /> : null}
              {creating ? 'Creating...' : <><span>Use template</span> <ArrowRight size={14} /></>}
            </button>
          </div>
          {createError && (
            <p className="mt-3 text-[11px] text-red-500 font-medium">{createError}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default TemplateCard;
