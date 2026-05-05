import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createDraft } from '../utils/createDraft';

const TemplateCard = ({ template, index }) => {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const handleUse = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreating(true);
    try {
      const draftId = await createDraft(template.id);
      navigate(`/create/${template.id}?draft=${draftId}`);
    } catch (err) {
      console.error(err);
      setCreateError('Could not create draft. Please check your connection and try again.');
      setCreating(false);
    }
  };
  const renderThumbnail = () => {
    switch (template.id) {
      case 'kawaii-letter':
        return (
          <div className="w-full h-full bg-gingham flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-2 left-2 text-xl">🌸</div>
            <div className="absolute top-2 right-2 text-xl">🎀</div>
            <div className="absolute bottom-2 right-2 text-xl">💕</div>
            <div className="absolute bottom-4 left-4 text-xs">✨</div>
            
            <motion.div 
              className="relative z-10 group-hover:animate-bob"
            >
              <div className="w-24 h-16 bg-white border-2 border-primary-pink rounded-sm relative shadow-sm">
                <div className="absolute top-0 left-0 w-full h-full border-t-[30px] border-t-primary-light border-x-[48px] border-x-transparent"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-primary-pink rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white">❤️</div>
              </div>
            </motion.div>
            <div className="absolute inset-0 bg-primary-pink/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        );

      case '100-reasons':
        return (
          <div className="w-full h-full bg-gradient-to-br from-violet-100 to-rose-100 flex items-center justify-center p-4">
            <div className="grid grid-cols-3 gap-2 w-full">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="aspect-[3/4] bg-white rounded-sm shadow-sm border border-pink-50 flex items-center justify-center text-xs text-primary-pink"
                  style={{ perspective: 1000 }}
                  whileHover={{ rotateY: 180 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  {i < 2 ? '❤️' : '💌'}
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'our-gallery':
        return (
          <div className="w-full h-full bg-[#FFF8F0] flex items-center justify-center relative overflow-hidden">
            {[
              { rot: -8, x: -10, color: 'bg-rose-200' },
              { rot: 0, x: 0, color: 'bg-amber-200' },
              { rot: 6, x: 10, color: 'bg-sky-200' }
            ].map((p, i) => (
              <motion.div
                key={i}
                className={`absolute w-24 h-28 bg-white p-1.5 shadow-md border border-gray-100 rounded-sm`}
                style={{ rotate: p.rot, x: p.x }}
                variants={{
                  hover: { 
                    x: (i - 1) * 35,
                    rotate: (i - 1) * 15,
                    transition: { type: 'spring', stiffness: 300 }
                  }
                }}
              >
                <div className={`w-full h-18 ${p.color} rounded-xs`}></div>
                <div className="h-4 mt-2 bg-gray-50 rounded-xs"></div>
              </motion.div>
            ))}
          </div>
        );

      case 'dark-romance':
        return (
          <div className="w-full h-full bg-[#1C1007] bg-gradient-to-br from-[#1C1007] to-[#2D1A0E] flex items-center justify-center relative overflow-hidden">
            <motion.h3 
              className="font-playfair text-xl text-[#D4AF37] italic"
              whileHover={{ textShadow: "0 0 15px rgba(212, 175, 55, 0.8)" }}
            >
              For You
            </motion.h3>
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-1 bg-amber-400 rounded-full animate-ember"
                style={{ 
                  left: `${10 + Math.random() * 80}%`, 
                  bottom: '0%',
                  animationDelay: `${Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
        );

      case 'our-story':
        return (
          <div className="w-full h-full bg-[#F5ECD7] flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 12px' }}></div>
             <div className="relative group/book" style={{ perspective: 1000 }}>
                <motion.div 
                  className="w-20 h-28 bg-[#4A2C2A] rounded-r-md rounded-l-sm shadow-lg border-l-4 border-l-black/20 flex flex-col items-center justify-center p-2 text-center"
                  whileHover={{ rotateY: -30 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-1 h-8 bg-rose-600 absolute -top-1 right-2"></div>
                  <span className="text-[8px] text-[#D4AF37] font-playfair uppercase tracking-widest leading-tight">Our<br/>Story</span>
                </motion.div>
             </div>
          </div>
        );

      case 'midnight-love':
        return (
          <div className="w-full h-full bg-[#0D1B3E] bg-gradient-to-br from-[#0D1B3E] to-[#1A0533] flex items-center justify-center relative overflow-hidden">
             {[...Array(25)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse-slow"
                  style={{ 
                    left: `${Math.random() * 100}%`, 
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`
                  }}
                ></div>
             ))}
             <motion.span 
              className="font-playfair text-2xl text-white z-10"
              whileHover={{ scale: 1.1, textShadow: "0 0 20px rgba(255,255,255,0.6)" }}
             >
               Sofia
             </motion.span>
          </div>
        );

      default:
        return <div className="w-full h-full bg-rose-50"></div>;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.1 }}
      whileHover="hover"
      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <Link to={`/templates/${template.id}`}>
        <div className="aspect-[3/2] overflow-hidden">
          {renderThumbnail()}
        </div>
        <div className="p-5 bg-white border-t border-card">
          <h3 className="text-dark font-bold text-lg mb-2">{template.name}</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {template.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-primary-pink bg-primary-light px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
              </div>
              <span className="text-xs text-secondary font-medium">5.0</span>
            </div>
            <button
              onClick={handleUse}
              disabled={creating}
              className="text-primary-pink text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all disabled:opacity-60"
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
