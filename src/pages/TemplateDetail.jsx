import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Play, Sparkles, Image, Music, Zap, Globe, Share2, Smartphone, ShieldCheck, ThumbsUp, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';
import { createDraft } from '../utils/createDraft';

const TemplateDetail = () => {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const draftId = await createDraft(templateId);
      navigate(`/create/${templateId}?draft=${draftId}`);
    } catch (err) {
      console.error('Failed to create draft:', err);
      setCreating(false);
    }
  };
  const { templateId } = useParams();

  const templateData = {
    'kawaii-letter': {
      name: 'Kawaii Digital Letter',
      description: 'A kawaii digital letter experience featuring an interactive envelope, a heartfelt letter, draggable polaroid memories, a retro TV music player, and a flower explosion finale. All text and photos are fully customizable.',
      emoji: '✉️',
      color: 'bg-[#FFD1DC]',
    }
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
            <div className="card-white p-0 overflow-hidden relative group cursor-pointer mb-8">
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

            <button className="w-full btn-outline flex items-center justify-center gap-2 mb-12">
              <Smartphone size={20} /> Open Full-Screen Live Preview
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
                <p className="text-secondary text-sm mb-6">Try the full editor for free. Pay only when you publish.</p>
                <button onClick={handleCreate} disabled={creating}
                  className="w-full btn-primary btn-shimmer py-5 text-xl flex items-center justify-center gap-2 mb-4 uppercase tracking-wide disabled:opacity-70">
                  {creating ? <><Loader2 size={20} className="animate-spin" /> Creating...</> : '▶ TRY & CUSTOMIZE FOR FREE!'}
                </button>
                
                <div className="flex justify-between items-center px-2">
                   {[
                     { icon: <ShieldCheck size={16} />, label: 'Secure Payment' },
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
                    'Create a free draft securely on this page',
                    'Template appears instantly in your editor',
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
