import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Type, Image as ImageIcon, Music, Settings, Upload, X, Eye, Maximize, RefreshCw, Volume2, Plus, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { templateFields } from '../templates/fields';

const Builder = () => {
  const { templateId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const draftId = searchParams.get('draft');

  const [activeTab, setActiveTab] = useState('Text');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error
  const [expiryLabel, setExpiryLabel] = useState('');
  const [formData, setFormData] = useState({
    recipientName: '',
    senderName: '',
    showSenderName: true,
    showFooter: true,
    palette: 'pink',
    font: 'playful',
    scenes: {},
    reasons: [],
    musicEnabled: false,
    musicUrl: '',
    volume: 60,
  });
  const [templateName, setTemplateName] = useState('');
  const debounceRef = useRef(null);

  // Load draft from Firestore
  useEffect(() => {
    if (!draftId) { navigate('/templates'); return; }
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'pages', draftId));
        if (!snap.exists() || snap.data().status !== 'pending') {
          navigate('/templates');
          return;
        }
        const data = snap.data();
        setFormData({
          recipientName: data.recipientName || '',
          senderName: data.senderName || '',
          showSenderName: data.showSenderName ?? true,
          showFooter: data.showFooter ?? true,
          palette: data.palette || 'pink',
          font: data.font || 'playful',
          scenes: data.scenes || {},
          reasons: data.reasons || [],
          musicEnabled: data.musicEnabled ?? false,
          musicUrl: data.musicUrl || '',
          volume: 60,
        });
        setTemplateName(formatTemplateName(data.templateId));
        // Expiry countdown
        if (data.expiresAt) {
          updateExpiry(data.expiresAt.toDate());
        }
      } catch (err) {
        console.error('Failed to load draft:', err);
        navigate('/templates');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [draftId, navigate]);

  // Expiry countdown
  function updateExpiry(expiresAtDate) {
    const tick = () => {
      const diff = expiresAtDate - Date.now();
      if (diff <= 0) { setExpiryLabel('Expired'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setExpiryLabel(`${h}h ${m}m`);
    };
    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }

  function formatTemplateName(id) {
    const names = {
      'kawaii-letter': 'Kawaii Digital Letter',
      '100-reasons': '100 Reasons',
      'our-gallery': 'Our Gallery',
      'dark-romance': 'Dark Romance',
      'our-story': 'Our Story',
      'midnight-love': 'Midnight Love',
    };
    return names[id] || id;
  }

  // Save to Firestore
  const saveToFirestore = useCallback(async (data) => {
    if (!draftId) return;
    setSaveStatus('saving');
    try {
      await updateDoc(doc(db, 'pages', draftId), {
        recipientName: data.recipientName,
        senderName: data.senderName,
        showSenderName: data.showSenderName,
        showFooter: data.showFooter,
        palette: data.palette,
        font: data.font,
        scenes: data.scenes,
        reasons: data.reasons,
        musicEnabled: data.musicEnabled,
        musicUrl: data.musicUrl,
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Save failed:', err);
      setSaveStatus('error');
    }
  }, [draftId]);

  // Debounced auto-save
  useEffect(() => {
    if (loading) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => saveToFirestore(formData), 800);
    return () => clearTimeout(debounceRef.current);
  }, [formData, loading, saveToFirestore]);

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSceneInput = (key, value) => {
    setFormData(prev => ({ ...prev, scenes: { ...prev.scenes, [key]: value } }));
  };

  const handleSaveNow = async () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    await saveToFirestore(formData);
  };

  const handlePreviewPublish = async () => {
    await handleSaveNow();
    navigate(`/preview/${draftId}`);
  };

  // Reasons list handlers
  const addReason = () => {
    if (formData.reasons.length >= 100) return;
    setFormData(prev => ({ ...prev, reasons: [...prev.reasons, ''] }));
  };
  const updateReason = (i, val) => {
    const next = [...formData.reasons];
    next[i] = val;
    setFormData(prev => ({ ...prev, reasons: next }));
  };
  const removeReason = (i) => {
    setFormData(prev => ({ ...prev, reasons: prev.reasons.filter((_, idx) => idx !== i) }));
  };

  const tabs = [
    { id: 'Text', icon: <Type size={18} /> },
    { id: 'Images', icon: <ImageIcon size={18} /> },
    { id: 'Music', icon: <Music size={18} /> },
    { id: 'Settings', icon: <Settings size={18} /> },
  ];

  const fields = templateFields[templateId] || [];
  const isReasons = templateId === '100-reasons';

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary-pink animate-spin" size={40} />
          <p className="text-secondary font-medium">Loading your draft...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Top Bar */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-card shrink-0 bg-white z-10">
        <div className="flex items-center gap-4">
          <Link to={`/templates/${templateId}`} className="text-secondary hover:text-primary-pink transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col">
            <span className="font-bold text-dark text-sm">
              {templateName} <span className="text-secondary font-normal ml-1">(Draft)</span>
            </span>
            {expiryLabel && (
              <span className="text-[10px] text-amber-600 font-bold">Expires in {expiryLabel}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Save indicator */}
          <AnimatePresence mode="wait">
            {saveStatus === 'saving' && (
              <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-xs text-secondary flex items-center gap-1">
                <Loader2 size={12} className="animate-spin" /> Saving...
              </motion.span>
            )}
            {saveStatus === 'saved' && (
              <motion.span key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle2 size={12} /> Saved ✓
              </motion.span>
            )}
          </AnimatePresence>

          <button onClick={handleSaveNow} className="flex items-center gap-2 btn-outline py-2 px-4 text-sm border">
            <Save size={16} /> Save
          </button>
          <button onClick={handlePreviewPublish}
            className="flex items-center gap-2 bg-amber-500 text-white px-5 py-2 rounded-pill font-bold text-sm hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 btn-shimmer">
            Preview & Publish →
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel */}
        <div className="w-full md:w-[400px] border-r border-card flex flex-col bg-white overflow-hidden">
          <div className="flex border-b border-card shrink-0">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center py-3 gap-1 transition-all relative ${
                  activeTab === tab.id ? 'text-primary-pink font-bold' : 'text-secondary hover:text-dark'
                }`}>
                {tab.icon}
                <span className="text-[10px] uppercase tracking-wider">{tab.id}</span>
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-pink" />
                )}
              </button>
            ))}
          </div>

          <div className="flex-grow overflow-y-auto p-6 space-y-5">
            <AnimatePresence mode="wait">

              {/* TEXT TAB */}
              {activeTab === 'Text' && (
                <motion.div key="text" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }} className="space-y-4">

                  {fields.map((field) => (
                    <div key={field.key} className="space-y-1.5">
                      <label className="text-xs font-bold text-secondary uppercase tracking-wider">{field.label}</label>
                      {field.type === 'textarea' ? (
                        <textarea
                          value={formData.scenes[field.key] || ''}
                          onChange={e => handleSceneInput(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          rows={6}
                          className="w-full px-4 py-2 border border-card rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-pink/20 focus:border-primary-pink transition-all resize-none text-sm"
                        />
                      ) : (
                        <input
                          value={formData.scenes[field.key] || ''}
                          onChange={e => handleSceneInput(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-2 border border-card rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-pink/20 focus:border-primary-pink transition-all text-sm"
                        />
                      )}
                    </div>
                  ))}

                  {/* Reasons dynamic list */}
                  {isReasons && (
                    <div className="space-y-3 pt-4 border-t border-card">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-secondary uppercase tracking-wider">
                          Reasons ({formData.reasons.length}/100)
                        </label>
                        {formData.reasons.length < 100 && (
                          <button onClick={addReason}
                            className="flex items-center gap-1 text-xs font-bold text-primary-pink hover:text-primary-pink/80">
                            <Plus size={14} /> Add reason
                          </button>
                        )}
                      </div>
                      {formData.reasons.map((r, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <span className="text-xs text-secondary font-bold w-6 shrink-0">{i + 1}.</span>
                          <input
                            value={r}
                            onChange={e => updateReason(i, e.target.value)}
                            placeholder={`Reason ${i + 1}...`}
                            className="flex-grow px-3 py-2 border border-card rounded-xl focus:outline-none focus:border-primary-pink text-sm"
                          />
                          <button onClick={() => removeReason(i)} className="text-red-400 hover:text-red-600 shrink-0">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      {formData.reasons.length === 0 && (
                        <p className="text-xs text-secondary italic text-center py-4">
                          No reasons yet — click "Add reason" above
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* IMAGES TAB */}
              {activeTab === 'Images' && (
                <motion.div key="images" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }} className="space-y-6">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="space-y-2">
                      <label className="text-xs font-bold text-secondary uppercase tracking-wider">Photo {i}</label>
                      <div className="aspect-video rounded-xl border-2 border-dashed border-card flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary-pink hover:bg-primary-light/30 transition-all group">
                        <Upload className="text-secondary group-hover:text-primary-pink" size={24} />
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-dark">Click to upload or drag & drop</p>
                          <p className="text-[10px] text-secondary">PNG, JPG up to 5MB</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <p className="text-[10px] text-secondary italic text-center">Photo uploads require Firebase Storage setup</p>
                </motion.div>
              )}

              {/* MUSIC TAB */}
              {activeTab === 'Music' && (
                <motion.div key="music" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }} className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-primary-light/30 rounded-xl border border-primary-light">
                    <div>
                      <h4 className="font-bold text-dark text-sm">Background Music</h4>
                      <p className="text-xs text-secondary">Music plays when page loads</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="musicEnabled" checked={formData.musicEnabled} onChange={handleInput} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-pink"></div>
                    </label>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider">YouTube URL</label>
                    <input name="musicUrl" value={formData.musicUrl} onChange={handleInput}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full px-4 py-2 border border-card rounded-xl focus:outline-none focus:border-primary-pink text-sm" />
                    <p className="text-[10px] text-secondary italic">Paste a YouTube link to set the mood</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1">
                        <Volume2 size={14} /> Volume
                      </label>
                      <span className="text-xs font-bold text-primary-pink">{formData.volume}%</span>
                    </div>
                    <input type="range" name="volume" value={formData.volume} onChange={handleInput}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-pink" />
                  </div>
                </motion.div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'Settings' && (
                <motion.div key="settings" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-secondary uppercase tracking-wider">Recipient Name</label>
                      <input name="recipientName" value={formData.recipientName} onChange={handleInput}
                        className="w-full px-4 py-2 border border-card rounded-xl focus:outline-none focus:border-primary-pink" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-secondary uppercase tracking-wider">Sender Name</label>
                      <input name="senderName" value={formData.senderName} onChange={handleInput}
                        className="w-full px-4 py-2 border border-card rounded-xl focus:outline-none focus:border-primary-pink" />
                    </div>
                  </div>
                  <div className="border-t border-card pt-6 space-y-4">
                    {[
                      { name: 'showSenderName', label: 'Show sender name on page' },
                      { name: 'showFooter', label: 'Show LovePage footer' },
                    ].map(toggle => (
                      <div key={toggle.name} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-dark">{toggle.label}</span>
                        <input type="checkbox" name={toggle.name} checked={formData[toggle.name]} onChange={handleInput}
                          className="accent-primary-pink w-4 h-4" />
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-card pt-6 space-y-4">
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider">Color Palette</label>
                    <div className="flex gap-3">
                      {[
                        { id: 'pink', color: '#F43F73' },
                        { id: 'lavender', color: '#9B7FE8' },
                        { id: 'mint', color: '#2DD4BF' },
                        { id: 'gold', color: '#D4AF37' },
                        { id: 'navy', color: '#3B5BDB' },
                      ].map(p => (
                        <button key={p.id} onClick={() => setFormData(prev => ({ ...prev, palette: p.id }))}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            formData.palette === p.id ? 'border-dark scale-110 shadow-lg' : 'border-transparent'
                          }`} style={{ backgroundColor: p.color }} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider">Font Style</label>
                    <div className="flex gap-2">
                      {['playful', 'elegant', 'classic'].map(f => (
                        <button key={f} onClick={() => setFormData(prev => ({ ...prev, font: f }))}
                          className={`flex-1 py-2 px-3 rounded-pill text-xs font-bold capitalize transition-all ${
                            formData.font === f ? 'bg-primary-pink text-white' : 'bg-white border border-card text-secondary'
                          }`}>{f}</button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="flex-grow bg-slate-100 flex flex-col overflow-hidden">
          <div className="h-12 border-b border-card bg-white shrink-0 flex items-center justify-between px-6">
            <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest">
              <Eye size={16} className="text-primary-pink" /> Live Preview
            </div>
            {expiryLabel && (
              <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-200">
                ⏱ Draft Expires in {expiryLabel}
              </div>
            )}
            <div className="flex items-center gap-4">
              <button className="text-secondary hover:text-primary-pink flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors">
                <Maximize size={14} /> Full Screen
              </button>
              <button className="text-secondary hover:text-primary-pink flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors">
                <RefreshCw size={14} /> Refresh
              </button>
            </div>
          </div>

          <div className="flex-grow p-4 md:p-8 overflow-hidden flex items-center justify-center">
            <div className="w-full max-w-sm aspect-[9/19] bg-white rounded-[40px] border-[8px] border-dark shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 flex flex-col bg-[#FFD1DC] p-6 text-center overflow-y-auto">
                <div className="flex-grow flex flex-col items-center justify-center pt-10">
                  <div className="relative mb-8 transform hover:scale-105 transition-transform cursor-pointer">
                    <div className="w-48 h-32 bg-white rounded-xl shadow-lg border border-primary-light flex items-center justify-center relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary-pink rounded-full border-4 border-white flex items-center justify-center text-white shadow-md">
                        ❤️
                      </div>
                      <div className="absolute top-0 left-0 w-full h-full border-t-[60px] border-t-primary-light border-x-[96px] border-x-transparent"></div>
                    </div>
                  </div>
                  <p className="font-dancing text-primary-pink text-xl">
                    {formData.scenes.hint || 'Tap seal to open ♥'}
                  </p>
                  {formData.recipientName && (
                    <p className="text-primary-pink/60 text-sm mt-2">For {formData.recipientName}</p>
                  )}
                </div>
                <span className="absolute top-10 left-6 text-2xl">🌸</span>
                <span className="absolute top-20 right-6 text-2xl">🎀</span>
                <span className="absolute bottom-20 left-10 text-2xl">🎈</span>
              </div>
              {/* DRAFT Watermark */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden rotate-[-30deg]">
                <div className="whitespace-nowrap text-primary-pink/10 text-6xl font-black uppercase tracking-[1rem]">
                  DRAFT DRAFT DRAFT DRAFT DRAFT
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
