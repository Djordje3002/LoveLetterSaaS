import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Play, Sparkles, Image, Music, Zap, Globe, Share2, Smartphone, ThumbsUp, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';
import { createDraft } from '../utils/createDraft';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../utils/analytics';

const TemplateDetail = () => {
  const navigate = useNavigate();
  const [creatingEditor, setCreatingEditor] = useState(false);
  const [createError, setCreateError] = useState('');
  const { templateId } = useParams();
  const { user } = useAuth();

  const createDraftAndNavigate = async (target) => {
    if (creatingEditor) return;
    trackEvent(target === 'preview' ? 'template_preview_clicked' : 'template_customize_clicked', { templateId, loggedIn: Boolean(user) });
    if (target === 'preview') {
      navigate(`/preview-demo/${templateId}`);
      return;
    }
    if (!user) {
      navigate(`/create/${templateId}`);
      return;
    }
    setCreateError('');
    setCreatingEditor(true);
    try {
      const draftId = await createDraft(templateId);
      trackEvent('draft_created', { templateId, draftId });
      navigate(`/create/${templateId}?draft=${draftId}`);
    } catch (err) {
      console.error('Failed to create draft:', err);
      setCreateError(err?.message || 'Could not create your draft. Please check your connection and try again.');
    } finally {
      setCreatingEditor(false);
    }
  };

  const templateData = {
    'kawaii-letter': {
      name: 'Kawaii Digital Letter',
      description: 'A kawaii digital letter experience featuring an interactive envelope, a heartfelt letter, draggable polaroid memories, a retro TV music player, and a flower explosion finale. All text and photos are fully customizable.',
      emoji: '✉️',
      color: 'bg-[#FFD1DC]',
    },
    '100-reasons': {
      name: '100 Reasons',
      description: 'Flip beautifully animated cards revealing all the reasons you love someone. Includes confetti finale and playful interactions.',
      emoji: '💯',
      color: 'bg-gradient-to-br from-violet-200 to-rose-200',
    },
    'our-gallery': {
      name: 'Our Gallery',
      description: 'A cinematic gallery-style experience for your memories with smooth transitions, captions, and romantic atmosphere.',
      emoji: '🖼️',
      color: 'bg-gradient-to-br from-amber-200 to-orange-200',
    },
    'dark-romance': {
      name: 'Dark Romance',
      description: 'A dramatic, elegant letter template with ember effects and moody visuals for a timeless romantic vibe.',
      emoji: '🕯️',
      color: 'bg-gradient-to-br from-[#1C1007] to-[#2D1A0E]',
    },
    'our-story': {
      name: 'Our Story',
      description: 'An interactive storybook with left/right page arrows, photo-gallery pages from your uploads, and a final heartfelt letter page.',
      emoji: '📖',
      color: 'bg-[#F5ECD7]',
    },
    'midnight-love': {
      name: 'Midnight Love',
      description: 'A starry night template with a typewriter-style reveal and dreamy motion effects for heartfelt long-form letters.',
      emoji: '🌙',
      color: 'bg-gradient-to-br from-[#0D1B3E] to-[#1A0533]',
    },
    'rose-whisper': {
      name: 'Rose Whisper',
      description: 'A gentle romantic style built on our signature letter flow, with softer elegant tones and refined typography.',
      emoji: '🌹',
      color: 'bg-gradient-to-br from-rose-200 to-pink-200',
    },
    'golden-promise': {
      name: 'Golden Promise',
      description: 'A warm golden variation of the love letter experience, perfect for heartfelt promises and anniversary notes.',
      emoji: '✨',
      color: 'bg-gradient-to-br from-amber-200 to-yellow-100',
    },
    'date-invite': {
      name: 'Will You Be My Valentine?',
      description: 'A playful confession journey with clickable reveals, draggable memories, a runaway "No" button, and confetti when they say yes. Every line and photo is customizable.',
      emoji: '💘',
      color: 'bg-gradient-to-br from-pink-200 via-rose-200 to-red-200',
    },
    'iva-birthday': {
      name: 'IVA Birthday',
      description: 'A private birthday-themed experience with a playful entry gate, love question, memory gallery, reasons grid, and mini diary.',
      emoji: '🎂',
      color: 'bg-gradient-to-br from-[#13263f] to-[#2c4f7c]',
    },
  };

  const template = templateData[templateId] || templateData['kawaii-letter'];

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
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-24">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/templates" className="flex items-center gap-2 text-primary-pink font-bold hover:gap-3 transition-all">
            <ArrowLeft size={20} /> All Templates
          </Link>
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Star size={18} className="fill-current" />
            <Star size={18} className="fill-current" />
            <Star size={18} className="fill-current" />
            <Star size={18} className="fill-current" />
            <Star size={18} className="fill-current" />
            <span className="ml-1">5.0</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-7">
            {/* Video Placeholder */}
            <div
              onClick={() => createDraftAndNavigate('preview')}
              className="card-white p-0 overflow-hidden relative group cursor-pointer mb-8"
            >
              <div className={`aspect-video ${template.color} flex flex-col items-center justify-center text-white relative`}>
                <div className="absolute top-4 left-4 bg-dark/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Template Demo
                </div>
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                  <Play size={40} className="fill-white ml-2" />
                </div>
                <div className="absolute bottom-6 left-6 text-2xl font-bold font-playfair drop-shadow-md">
                  {template.name}
                </div>
              </div>
            </div>

            <button
              onClick={() => createDraftAndNavigate('preview')}
              disabled={creatingEditor}
              className="w-full btn-outline flex items-center justify-center gap-2 mb-12 disabled:opacity-70"
            >
              <Smartphone size={20} />
              Open Full-Screen Live Preview
            </button>

            {/* Inclusions */}
            <div className="card-white">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="text-primary-pink" /> What's included
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {inclusions.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-secondary font-medium">
                    <div className="text-primary-pink">{item.icon}</div>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <span className="text-primary-pink font-bold text-sm mb-2 block uppercase tracking-widest">♥ Interactive Gift Template</span>
              <h1 className="text-4xl font-bold mb-6">{template.name}</h1>
              <p className="text-secondary leading-relaxed mb-8">
                {template.description}
              </p>
              
              <div className="border-t border-card pt-8 mb-8">
                <h4 className="font-bold text-dark mb-1">Customize template</h4>
                <p className="text-secondary text-sm mb-6">Customize first. Create an account only when you save or publish.</p>
                <button onClick={() => createDraftAndNavigate('editor')} disabled={creatingEditor}
                  className="w-full btn-primary btn-shimmer py-5 text-xl flex items-center justify-center gap-2 mb-4 uppercase tracking-wide disabled:opacity-70">
                  {creatingEditor ? <><Loader2 size={20} className="animate-spin" /> Creating...</> : '▶ TRY & CUSTOMIZE!'}
                </button>
                {createError && (
                  <p className="text-sm text-red-500 font-medium mb-4">{createError}</p>
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
                      <p className="text-sm text-secondary font-medium">{step}</p>
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
