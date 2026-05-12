import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Play, Sparkles, Image, Music, Zap, Globe, Share2, Smartphone, ThumbsUp, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';
import { createDraft } from '../utils/createDraft';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../utils/analytics';
import { DEFAULT_TEMPLATE_ID, TEMPLATE_BY_ID, getTemplateConfig } from '../templates/registry';

const TemplateDetail = () => {
  const navigate = useNavigate();
  const [creatingEditor, setCreatingEditor] = useState(false);
  const [createError, setCreateError] = useState('');
  const { templateId } = useParams();
  const { user } = useAuth();
  const resolvedTemplateId = TEMPLATE_BY_ID[templateId] ? templateId : DEFAULT_TEMPLATE_ID;

  const createDraftAndNavigate = async (target) => {
    if (creatingEditor) return;
    trackEvent(target === 'preview' ? 'template_preview_clicked' : 'template_customize_clicked', { templateId: resolvedTemplateId, loggedIn: Boolean(user) });
    if (target === 'preview') {
      navigate(`/preview-demo/${resolvedTemplateId}`);
      return;
    }
    if (!user) {
      navigate(`/create/${resolvedTemplateId}?onboarding=1`);
      return;
    }
    setCreateError('');
    setCreatingEditor(true);
    try {
      const draftId = await createDraft(resolvedTemplateId);
      trackEvent('draft_created', { templateId: resolvedTemplateId, draftId });
      navigate(`/create/${resolvedTemplateId}?draft=${draftId}&onboarding=1`);
    } catch (err) {
      console.error('Failed to create draft:', err);
      setCreateError(err?.message || 'Could not create your draft. Please check your connection and try again.');
    } finally {
      setCreatingEditor(false);
    }
  };
  const template = getTemplateConfig(resolvedTemplateId);

  const inclusions = [
    { icon: <Image size={20} />, label: 'Customizable text & images' },
    { icon: <Music size={20} />, label: 'Background music support' },
    { icon: <Zap size={20} />, label: 'Easy-to-use editor' },
    { icon: <Globe size={20} />, label: 'Unlimited hosting' },
    { icon: <Share2 size={20} />, label: 'Shareable link and QR Code' },
    { icon: <Smartphone size={20} />, label: 'Mobile-responsive design' },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-24">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8">
          <Link to="/templates" className="flex items-center gap-2 rounded-full border border-[#f0d7e1] bg-white px-4 py-2 text-sm sm:text-base text-primary-pink font-bold hover:gap-3 transition-all shadow-sm">
            <ArrowLeft size={18} /> All Templates
          </Link>
          <div className="flex items-center gap-1 rounded-full border border-[#f0d7e1] bg-white px-3.5 py-2 text-amber-500 font-bold shadow-sm">
            <Star size={16} className="fill-current" />
            <Star size={16} className="fill-current" />
            <Star size={16} className="fill-current" />
            <Star size={16} className="fill-current" />
            <Star size={16} className="fill-current" />
            <span className="ml-1 text-sm">5.0</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column */}
          <div className="lg:col-span-7">
            {/* Video Placeholder */}
            <div
              onClick={() => createDraftAndNavigate('preview')}
              className="rounded-[28px] border border-[#f1dbe4] bg-white p-0 overflow-hidden relative group cursor-pointer mb-8 shadow-sm"
            >
              <div className={`aspect-video ${template.color} flex flex-col items-center justify-center text-white relative`}>
                <div className="absolute top-4 left-4 bg-dark/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Template Demo
                </div>
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                  <Play size={40} className="fill-white ml-2" />
                </div>
                <div className="absolute bottom-6 left-6 text-lg sm:text-2xl font-bold font-playfair drop-shadow-md">
                  {template.title}
                </div>
              </div>
            </div>

            <button
              onClick={() => createDraftAndNavigate('preview')}
              disabled={creatingEditor}
              className="w-full btn-outline bg-white text-sm sm:text-base flex items-center justify-center gap-2 mb-12 disabled:opacity-70"
            >
              <Smartphone size={18} />
              Open Full-Screen Live Preview
            </button>

            {/* Inclusions */}
            <div className="rounded-[28px] border border-[#f1dbe4] bg-white p-5 sm:p-6 shadow-sm">
              <h3 className="text-lg sm:text-xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="text-primary-pink" /> What's included
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {inclusions.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm sm:text-base text-secondary font-medium">
                    <div className="text-primary-pink">{item.icon}</div>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 rounded-[30px] border border-[#f1dbe4] bg-white/90 p-5 sm:p-6 shadow-sm">
              <span className="text-primary-pink font-bold text-sm mb-2 block uppercase tracking-widest">♥ Interactive Gift Template</span>
              <h1 className="text-3xl sm:text-4xl font-bold mb-6">{template.title}</h1>
              <p className="text-sm sm:text-base text-secondary leading-relaxed mb-8">
                {template.description}
              </p>
              
              <div className="border-t border-card pt-8 mb-8">
                <h4 className="font-bold text-dark mb-1">Customize template</h4>
                <p className="text-secondary text-sm mb-6">Customize first. Create an account only when you save or publish.</p>
                <button onClick={() => createDraftAndNavigate('editor')} disabled={creatingEditor}
                  className="w-full rounded-full bg-gradient-to-r from-[#f43f73] to-[#f973a5] text-white py-4 sm:py-5 text-base sm:text-xl font-bold flex items-center justify-center gap-2 mb-4 uppercase tracking-wide shadow-lg shadow-pink-500/20 hover:scale-[1.01] transition-transform disabled:opacity-70">
                  {creatingEditor ? <><Loader2 size={20} className="animate-spin" /> Creating...</> : '▶ TRY & CUSTOMIZE!'}
                </button>
                {createError && (
                  <p className="text-xs sm:text-sm text-red-500 font-medium mb-4 break-words">{createError}</p>
                )}
                
                <div className="flex justify-start gap-10 items-center px-2">
                   {[
                     { icon: <Zap size={16} />, label: 'Instant Access' },
                     { icon: <ThumbsUp size={16} />, label: 'Satisfaction' }
                   ].map((item, i) => (
                     <div key={i} className="flex flex-col items-center gap-1">
                        <div className="text-primary-pink">{item.icon}</div>
                        <span className="text-[10px] font-bold text-secondary text-center uppercase tracking-tighter">{item.label}</span>
                     </div>
                   ))}
                </div>
              </div>

              <div className="border-t border-card pt-8">
                <h4 className="font-bold text-dark mb-4">How to use this template</h4>
                <div className="space-y-4">
                  {[
                    'Open the editor and customize',
                    'Sign in only when you save your draft',
                    'Publish when ready and share your link'
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-6 h-6 rounded-full bg-primary-light text-primary-pink flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-secondary font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TemplateDetail;
