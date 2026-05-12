import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createDraft } from '../utils/createDraft';
import { useAuth } from '../context/AuthContext';
import TemplateMiniDemo from './TemplateMiniDemo';
import { trackEvent } from '../utils/analytics';

const TemplateCard = ({ template, index }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -6, rotate: -0.3 }}
      className="group bg-white rounded-[24px] overflow-hidden shadow-sm border border-card hover:shadow-xl transition-all duration-300"
    >
      <Link to={`/templates/${template.id}`} onClick={() => trackEvent('template_clicked', { templateId: template.id })}>
        <div className="aspect-[3/2] overflow-hidden pt-3 bg-[radial-gradient(circle_at_top_left,#fff1f7_0%,#ffffff_52%)]">
          <TemplateMiniDemo templateId={template.id} />
        </div>
        <div className="p-4 sm:p-5 bg-white border-t border-card">
          <h3 className="text-dark font-bold text-base sm:text-lg mb-2 font-display">{template.name}</h3>
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
              className="text-primary-pink text-xs sm:text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all disabled:opacity-60"
            >
              {creating ? <Loader2 size={14} className="animate-spin" /> : null}
              {creating ? 'Creating...' : <><span>Use template</span> <motion.span variants={{ hover: { x: 3 } }}>→</motion.span></>}
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
