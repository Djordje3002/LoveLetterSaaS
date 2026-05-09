import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Type, Image as ImageIcon, Music, Settings, Upload, X, Eye, Volume2, Plus, Trash2, CheckCircle2, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { templateFields } from '../templates/fields';
import AuthModal from '../components/AuthModal';
import TemplateMiniDemo from '../components/TemplateMiniDemo';
import { useAuth } from '../context/AuthContext';
import { TEMPLATE_STYLE_DEFAULTS, buildQuickPersonalizedScenes, createDraft, getInitialDraftFormData } from '../utils/createDraft';
import { trackEvent } from '../utils/analytics';
import { DEFAULT_LOVE_MUSIC_URL } from '../config/music';
import KawaiiLetter from '../templates/KawaiiLetter';
import ReasonsILoveYou from '../templates/ReasonsILoveYou';
import OurGallery from '../templates/OurGallery';
import DarkRomance from '../templates/DarkRomance';
import OurStory from '../templates/OurStory';
import MidnightLove from '../templates/MidnightLove';
import RoseWhisper from '../templates/RoseWhisper';
import GoldenPromise from '../templates/GoldenPromise';
import DateInviteLetter from '../templates/DateInviteLetter';
import IvaBirthday from '../templates/IvaBirthday';
import SkyLove from '../templates/SkyLove';
import ChatReveal from '../templates/ChatReveal';

const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const AI_SUGGEST_ENDPOINT = import.meta.env.VITE_AI_SUGGEST_ENDPOINT || '/api/generate-message-suggestion';

const QUICK_TONES = [
  { id: 'sweet', label: 'Sweet', note: 'Warm and tender' },
  { id: 'deep', label: 'Deep', note: 'Emotional and sincere' },
  { id: 'playful', label: 'Playful', note: 'Cute and smiley' },
];

const TEMPLATES_WITH_IMAGES = new Set(['our-gallery', 'our-story', 'date-invite', 'iva-birthday']);
const TEMPLATES_WITHOUT_RECIPIENT_SETTING = new Set(['kawaii-letter', 'rose-whisper', 'golden-promise']);
const TEMPLATES_WITHOUT_PALETTE_SETTING = new Set(['kawaii-letter', 'rose-whisper', 'golden-promise', 'chat-reveal']);
const DEFAULT_TEMPLATE_ID = 'kawaii-letter';
const resolveTemplateId = (id) => (TEMPLATE_STYLE_DEFAULTS[id] ? id : DEFAULT_TEMPLATE_ID);
const LIVE_PREVIEW_TEMPLATES = {
  'kawaii-letter': KawaiiLetter,
  '100-reasons': ReasonsILoveYou,
  'our-gallery': OurGallery,
  'dark-romance': DarkRomance,
  'our-story': OurStory,
  'midnight-love': MidnightLove,
  'rose-whisper': RoseWhisper,
  'golden-promise': GoldenPromise,
  'date-invite': DateInviteLetter,
  'iva-birthday': IvaBirthday,
  'sky-love': SkyLove,
  'chat-reveal': ChatReveal,
};

const Builder = () => {
  const { templateId } = useParams();
  const activeTemplateId = resolveTemplateId(templateId);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const draftId = searchParams.get('draft');
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('Text');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error
  const [expiryLabel, setExpiryLabel] = useState('');
  const [formData, setFormData] = useState(() => getInitialDraftFormData(activeTemplateId));
  const [templateName, setTemplateName] = useState('');
  const debounceRef = useRef(null);
  const expiryIntervalRef = useRef(null);
  const fileInputRefs = useRef({});
  const localDraftKeyRef = useRef(`local-${activeTemplateId || 'draft'}`);
  const [uploadingBySlot, setUploadingBySlot] = useState({});
  const [uploadError, setUploadError] = useState('');
  const [generatingByField, setGeneratingByField] = useState({});
  const [aiErrorByField, setAiErrorByField] = useState({});
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingAuthAction, setPendingAuthAction] = useState('');
  const [showQuickStart, setShowQuickStart] = useState(!draftId);
  const [quickRecipient, setQuickRecipient] = useState('');
  const [quickTone, setQuickTone] = useState('sweet');
  const [mobileWorkspaceView, setMobileWorkspaceView] = useState('editor');
  // Load draft from Firestore
  useEffect(() => {
    setLoading(true);
    if (!draftId) {
      setFormData(getInitialDraftFormData(activeTemplateId));
      setTemplateName(formatTemplateName(activeTemplateId));
      setExpiryLabel('');
      setSaveStatus('idle');
      setShowQuickStart(true);
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'pages', draftId));
        if (!snap.exists() || snap.data().status !== 'pending') {
          navigate('/templates');
          return;
        }
        const data = snap.data();
        if (data.templateId && !TEMPLATE_STYLE_DEFAULTS[data.templateId]) {
          navigate('/templates', { replace: true });
          return;
        }
        if (data.templateId && data.templateId !== activeTemplateId) {
          navigate(`/create/${data.templateId}?draft=${draftId}`, { replace: true });
          return;
        }
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
        setShowQuickStart(false);
        // Expiry countdown
        if (data.expiresAt) startExpiryTimer(data.expiresAt.toDate());
      } catch (err) {
        console.error('Failed to load draft:', err);
        navigate('/templates');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeTemplateId, draftId, navigate]);

  useEffect(() => {
    trackEvent('builder_opened', { templateId: activeTemplateId, hasDraft: Boolean(draftId) });
  }, [activeTemplateId, draftId]);

  // Expiry countdown
  function startExpiryTimer(expiresAtDate) {
    if (expiryIntervalRef.current) clearInterval(expiryIntervalRef.current);
    const tick = () => {
      const diff = expiresAtDate - Date.now();
      if (diff <= 0) { setExpiryLabel('Expired'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setExpiryLabel(`${h}h ${m}m`);
    };
    tick();
    expiryIntervalRef.current = setInterval(tick, 60000);
  }

  useEffect(() => () => {
    if (expiryIntervalRef.current) clearInterval(expiryIntervalRef.current);
  }, []);

  function formatTemplateName(id) {
    const names = {
      'kawaii-letter': 'Kawaii Digital Letter',
      '100-reasons': '100 Reasons',
      'our-gallery': 'Our Gallery',
      'dark-romance': 'Dark Romance',
      'our-story': 'Our Story',
      'midnight-love': 'Midnight Love',
      'rose-whisper': 'Rose Whisper',
      'golden-promise': 'Golden Promise',
      'date-invite': 'Will You Be My Valentine?',
      'iva-birthday': 'Full House of Love',
      'sky-love': 'Sky Love',
      'chat-reveal': 'Chat Reveal',
    };
    return names[id] || id;
  }

  // Save to Firestore
  const saveToFirestore = useCallback(async (data, targetDraftId = draftId) => {
    if (!targetDraftId) return null;
    setSaveStatus('saving');
    try {
      await updateDoc(doc(db, 'pages', targetDraftId), {
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
      return targetDraftId;
    } catch (err) {
      console.error('Save failed:', err);
      setSaveStatus('error');
      return null;
    }
  }, [draftId]);

  // Debounced auto-save
  useEffect(() => {
    if (loading || !draftId || !user) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => saveToFirestore(formData), 800);
    return () => clearTimeout(debounceRef.current);
  }, [draftId, formData, loading, saveToFirestore, user]);

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSceneInput = (key, value) => {
    setFormData(prev => ({ ...prev, scenes: { ...prev.scenes, [key]: value } }));
  };

  const applyQuickPersonalize = () => {
    const personalizedScenes = buildQuickPersonalizedScenes(activeTemplateId, {
      recipientName: quickRecipient,
      tone: quickTone,
    });
    setFormData(prev => ({
      ...prev,
      recipientName: quickRecipient.trim(),
      scenes: { ...prev.scenes, ...personalizedScenes },
    }));
    setActiveTab('Text');
    setShowQuickStart(false);
    trackEvent('quick_personalize_applied', { templateId: activeTemplateId, tone: quickTone, hasRecipient: Boolean(quickRecipient.trim()) });
  };

  const handleGenerateSuggestion = async (field) => {
    const suggestionDraftId = draftId || localDraftKeyRef.current;
    setAiErrorByField(prev => ({ ...prev, [field.key]: '' }));
    setGeneratingByField(prev => ({ ...prev, [field.key]: true }));
    try {
      const response = await fetch(AI_SUGGEST_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fieldType: field.type,
          draftId: suggestionDraftId,
          fieldKey: field.key,
          fieldLabel: field.label,
          currentValue: formData.scenes[field.key] || '',
          recipientName: formData.recipientName || '',
          senderName: formData.senderName || '',
          templateId: activeTemplateId,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 404 && AI_SUGGEST_ENDPOINT.startsWith('/api/')) {
          throw new Error('Set VITE_AI_SUGGEST_ENDPOINT to your deployed Vercel API URL.');
        }
        throw new Error(payload?.error || 'AI request failed');
      }

      const suggestion = payload?.suggestion || '';
      if (!suggestion) throw new Error('No suggestion returned');
      handleSceneInput(field.key, suggestion);
    } catch (err) {
      console.error('Suggestion generation failed:', err);
      const message = err?.message?.includes('AI endpoint is not configured')
        ? 'AI endpoint is not configured yet.'
        : err?.message || 'AI suggestion failed. Please try again.';
      setAiErrorByField(prev => ({ ...prev, [field.key]: message }));
    } finally {
      setGeneratingByField(prev => ({ ...prev, [field.key]: false }));
    }
  };

  const ensureRemoteDraft = useCallback(async ({ syncRoute = true } = {}) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (draftId) {
      try {
        const existingSnap = await getDoc(doc(db, 'pages', draftId));
        if (existingSnap.exists()) {
          const existingData = existingSnap.data();
          if ((existingData?.templateId || '') === activeTemplateId) {
            return saveToFirestore(formData, draftId);
          }
        }
      } catch (err) {
        console.warn('Could not verify existing draft before saving:', err);
      }
    }

    setSaveStatus('saving');
    try {
      const createdDraftId = await createDraft(activeTemplateId, formData);
      trackEvent('draft_created', { templateId: activeTemplateId, draftId: createdDraftId });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      if (syncRoute) {
        navigate(`/create/${activeTemplateId}?draft=${createdDraftId}`, { replace: true });
      }
      return createdDraftId;
    } catch (err) {
      console.error('Draft creation failed:', err);
      setSaveStatus('error');
      return null;
    }
  }, [activeTemplateId, draftId, formData, navigate, saveToFirestore]);

  const requireAccountFor = (action) => {
    setPendingAuthAction(action);
    setAuthOpen(true);
  };

  const handleSaveNow = async () => {
    if (!user) {
      requireAccountFor('save');
      return;
    }
    await ensureRemoteDraft();
  };

  const handlePreviewPublish = async () => {
    if (!user) {
      requireAccountFor('publish');
      return;
    }
    const targetDraftId = await ensureRemoteDraft({ syncRoute: false });
    if (targetDraftId) navigate(`/preview/${targetDraftId}`);
  };

  const handleAuthSuccess = async () => {
    const action = pendingAuthAction || 'save';
    const targetDraftId = await ensureRemoteDraft({ syncRoute: action !== 'publish' });
    if (!targetDraftId) {
      throw new Error('Could not save your draft. Please check your connection and try again.');
    }
    setPendingAuthAction('');
    if (action === 'publish') navigate(`/preview/${targetDraftId}`);
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

  const triggerPhotoPicker = (slot) => {
    const input = fileInputRefs.current[slot];
    if (input) input.click();
  };

  const setPhotoUrl = (slot, url) => {
    const key = `photo${slot}Url`;
    setFormData(prev => ({ ...prev, scenes: { ...prev.scenes, [key]: url } }));
  };

  const removePhoto = (slot) => {
    setUploadError('');
    setPhotoUrl(slot, '');
  };

  const handlePhotoSelected = async (slot, event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const uploadDraftId = draftId || localDraftKeyRef.current;

    if (!IMAGE_TYPES.includes(file.type)) {
      setUploadError('Please upload a JPG, PNG, or WEBP image.');
      return;
    }

    if (file.size > IMAGE_MAX_BYTES) {
      setUploadError('Image is too large. Max size is 5MB.');
      return;
    }

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      setUploadError('Cloudinary is not configured. Add cloud name and upload preset to .env.');
      return;
    }

    setUploadError('');
    setUploadingBySlot(prev => ({ ...prev, [slot]: true }));
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      form.append('folder', `loveletters/drafts/${uploadDraftId}`);
      form.append('public_id', `photo${slot}-${Date.now()}`);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: form,
      });

      const payload = await response.json();
      if (!response.ok || !payload.secure_url) {
        throw new Error(payload?.error?.message || 'Cloudinary upload failed');
      }

      setPhotoUrl(slot, payload.secure_url);
    } catch (err) {
      console.error('Image upload failed:', err);
      setUploadError('Upload failed. Check Cloudinary setup and try again.');
    } finally {
      setUploadingBySlot(prev => ({ ...prev, [slot]: false }));
    }
  };

  const tabs = [
    { id: 'Text', icon: <Type size={18} /> },
    ...(TEMPLATES_WITH_IMAGES.has(activeTemplateId) ? [{ id: 'Images', icon: <ImageIcon size={18} /> }] : []),
    { id: 'Music', icon: <Music size={18} /> },
    { id: 'Settings', icon: <Settings size={18} /> },
  ];
  const showRecipientSetting = !TEMPLATES_WITHOUT_RECIPIENT_SETTING.has(activeTemplateId);
  const showPaletteSetting = !TEMPLATES_WITHOUT_PALETTE_SETTING.has(activeTemplateId);
  const senderPlaceholder = user?.displayName
    || user?.email?.split('@')[0]
    || 'From your heart';
  const recipientPlaceholder = 'Who is this for?';

  useEffect(() => {
    if (activeTab === 'Images' && !TEMPLATES_WITH_IMAGES.has(activeTemplateId)) {
      setActiveTab('Text');
    }
  }, [activeTab, activeTemplateId]);

  const fields = templateFields[activeTemplateId] || [];
  const isReasons = activeTemplateId === '100-reasons';
  const LivePreviewTemplate = LIVE_PREVIEW_TEMPLATES[activeTemplateId] || KawaiiLetter;

  const useProfileForSender = () => {
    const profileName = (user?.displayName || user?.email?.split('@')[0] || '').trim();
    if (!profileName) return;
    setFormData((prev) => ({ ...prev, senderName: profileName }));
  };

  const clearNames = () => {
    setFormData((prev) => ({
      ...prev,
      recipientName: showRecipientSetting ? '' : prev.recipientName,
      senderName: '',
    }));
  };

  const swapNames = () => {
    if (!showRecipientSetting) return;
    setFormData((prev) => ({
      ...prev,
      recipientName: prev.senderName || '',
      senderName: prev.recipientName || '',
    }));
  };

  const resetStyleToTemplateDefault = () => {
    const defaults = TEMPLATE_STYLE_DEFAULTS[activeTemplateId] || TEMPLATE_STYLE_DEFAULTS.kawaii-letter;
    setFormData((prev) => ({
      ...prev,
      palette: defaults.palette,
      font: defaults.font,
      showSenderName: true,
      showFooter: true,
    }));
  };

  const showEditorPanel = mobileWorkspaceView === 'editor';
  const showPreviewPanel = mobileWorkspaceView === 'preview';

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

  if (showQuickStart) {
    const previewScenes = {
      ...formData.scenes,
      ...buildQuickPersonalizedScenes(activeTemplateId, { recipientName: quickRecipient, tone: quickTone }),
    };

    return (
      <div className="min-h-screen bg-[#fff8f4] flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#f0ddd4] shadow-[0_24px_70px_rgba(124,74,63,0.12)] rounded-[28px] p-8 md:p-10"
          >
            <Link to={`/templates/${activeTemplateId}`} className="inline-flex items-center gap-2 text-secondary hover:text-primary-pink text-sm font-bold mb-8">
              <ArrowLeft size={16} /> Back to template
            </Link>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary-pink mb-3">Quick personalize</p>
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">Make the first draft feel personal.</h1>
            <p className="text-secondary text-lg mb-8 max-w-2xl">
              Add their name and choose the mood. We will fill the starter message, then you can edit every word in the full builder.
            </p>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-secondary uppercase tracking-wider">Recipient name</label>
                <input
                  value={quickRecipient}
                  onChange={(e) => setQuickRecipient(e.target.value)}
                  placeholder="e.g. Sofia"
                  className="mt-2 w-full max-w-md px-4 py-3 border border-card rounded-xl focus:outline-none focus:border-primary-pink text-lg"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-bold text-secondary uppercase tracking-wider">Tone</label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {QUICK_TONES.map((tone) => (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => setQuickTone(tone.id)}
                      className={`text-left rounded-2xl border p-4 transition-all ${
                        quickTone === tone.id
                          ? 'border-primary-pink bg-primary-light text-dark shadow-sm'
                          : 'border-card bg-white text-secondary hover:border-primary-pink/50'
                      }`}
                    >
                      <span className="block font-black">{tone.label}</span>
                      <span className="text-xs">{tone.note}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-9">
              <button
                onClick={applyQuickPersonalize}
                className="btn-primary btn-shimmer px-7 py-4 text-base font-bold flex items-center justify-center gap-2"
              >
                <Sparkles size={18} /> Fill my message
              </button>
              <button
                onClick={() => {
                  setShowQuickStart(false);
                  trackEvent('quick_personalize_skipped', { templateId: activeTemplateId });
                }}
                className="btn-outline px-7 py-4 text-base font-bold"
              >
                Skip and edit manually
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, rotate: 1.5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.15 }}
            className="hidden lg:block rounded-[34px] bg-[#1f1520] p-4 shadow-[0_30px_80px_rgba(44,21,35,0.28)]"
          >
            <div className="aspect-[9/16] rounded-[26px] overflow-hidden bg-white relative">
              <div className="h-[58%] border-b border-card/70">
                <TemplateMiniDemo templateId={activeTemplateId} />
              </div>
              <div className="h-[42%] bg-white p-4">
                <div className="rounded-xl border border-card bg-slate-50 p-4 h-full">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-primary-pink mb-2">{formatTemplateName(activeTemplateId)}</p>
                  <h3 className="font-playfair text-base text-dark mb-2 line-clamp-2">
                    {previewScenes.scene2Header || previewScenes.questionTitle || previewScenes.introLine || `A letter for ${quickRecipient || 'you'}`}
                  </h3>
                  <p className="text-xs leading-5 text-secondary line-clamp-5 whitespace-pre-line">
                    {previewScenes.letterText || previewScenes.confession1Text || previewScenes.questionSubtitle || 'Your personalized message will appear here.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Top Bar */}
      <div className="h-16 flex items-center justify-between px-2.5 sm:px-3 md:px-6 border-b border-card shrink-0 bg-white z-10 gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <Link to={`/templates/${activeTemplateId}`} className="text-secondary hover:text-primary-pink transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-dark text-sm whitespace-nowrap truncate">
              {templateName} <span className="text-secondary font-normal ml-1 hidden sm:inline">(Draft)</span>
            </span>
            {expiryLabel && (
              <span className="text-[10px] text-amber-600 font-bold whitespace-nowrap truncate">Expires in {expiryLabel}</span>
            )}
            {!draftId && (
              <span className="text-[10px] text-primary-pink font-bold whitespace-nowrap truncate">Preview mode · sign in when saving</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          {/* Save indicator */}
          <AnimatePresence mode="wait">
            {saveStatus === 'saving' && (
              <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="hidden lg:flex text-xs text-secondary items-center gap-1">
                <Loader2 size={12} className="animate-spin" /> Saving...
              </motion.span>
            )}
            {saveStatus === 'saved' && (
              <motion.span key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="hidden lg:flex text-xs text-green-600 items-center gap-1">
                <CheckCircle2 size={12} /> Saved ✓
              </motion.span>
            )}
            {saveStatus === 'error' && (
              <motion.span key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="hidden lg:inline text-xs text-red-500 font-medium">
                Save failed
              </motion.span>
            )}
          </AnimatePresence>

          <button onClick={handleSaveNow} className="flex items-center gap-1 md:gap-2 btn-outline py-2 px-2 sm:px-2.5 md:px-4 text-xs md:text-sm border">
            <Save size={15} /> <span className="hidden sm:inline">Save</span>
          </button>
          <button onClick={handlePreviewPublish}
            className="flex items-center gap-1 md:gap-2 bg-amber-500 text-white px-2.5 sm:px-3 md:px-5 py-2 rounded-pill font-bold text-xs md:text-sm hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 btn-shimmer whitespace-nowrap">
            <span className="sm:hidden">Publish</span>
            <span className="hidden sm:inline">Preview & Publish</span> →
          </button>
        </div>
      </div>

      <div className="md:hidden h-11 border-b border-card bg-white px-3 py-1.5">
        <div className="h-full w-full rounded-full border border-card bg-slate-50 p-0.5 grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => setMobileWorkspaceView('editor')}
            className={`rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${showEditorPanel ? 'bg-white text-primary-pink border border-primary-pink/20' : 'text-secondary'}`}
          >
            Editor
          </button>
          <button
            type="button"
            onClick={() => setMobileWorkspaceView('preview')}
            className={`rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${showPreviewPanel ? 'bg-white text-primary-pink border border-primary-pink/20' : 'text-secondary'}`}
          >
            Preview
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel */}
        <div className={`${showEditorPanel ? 'flex' : 'hidden'} md:flex w-full md:w-[400px] border-r border-card flex-col bg-white overflow-hidden`}>
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
                      <div className="flex items-center justify-between gap-2">
                        <label className="text-xs font-bold text-secondary uppercase tracking-wider">{field.label}</label>
                        <button
                          type="button"
                          onClick={() => handleGenerateSuggestion(field)}
                          disabled={Boolean(generatingByField[field.key])}
                          className="inline-flex items-center gap-1.5 rounded-full border border-primary-pink/35 bg-primary-pink/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-pink hover:bg-primary-pink/15 disabled:opacity-60"
                        >
                          {generatingByField[field.key] ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Sparkles size={12} />
                          )}
                          AI Suggest
                        </button>
                      </div>
                      {field.type === 'textarea' ? (
                        <textarea
                          value={formData.scenes[field.key] || ''}
                          onChange={e => handleSceneInput(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          rows={/letter|final|script/i.test(field.key) ? 10 : 6}
                          className="w-full px-4 py-2 border border-card rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-pink/20 focus:border-primary-pink transition-all resize-y overflow-y-auto text-sm min-h-[120px] max-h-[420px]"
                        />
                      ) : (
                        <input
                          value={formData.scenes[field.key] || ''}
                          onChange={e => handleSceneInput(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-2 border border-card rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-pink/20 focus:border-primary-pink transition-all text-sm"
                        />
                      )}
                      {aiErrorByField[field.key] && (
                        <p className="text-[11px] text-red-500 font-medium">{aiErrorByField[field.key]}</p>
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
                      <input
                        ref={(el) => { fileInputRefs.current[i] = el; }}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(e) => handlePhotoSelected(i, e)}
                      />
                      <div
                        onClick={() => !uploadingBySlot[i] && triggerPhotoPicker(i)}
                        className="aspect-video rounded-xl border-2 border-dashed border-card flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary-pink hover:bg-primary-light/30 transition-all group relative overflow-hidden"
                      >
                        {formData.scenes[`photo${i}Url`] ? (
                          <>
                            <img
                              src={formData.scenes[`photo${i}Url`]}
                              alt={`Uploaded memory ${i}`}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-2 left-2 right-2 flex gap-2">
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); triggerPhotoPicker(i); }}
                                className="flex-1 bg-white/95 text-dark text-[10px] font-bold rounded-lg py-1.5"
                              >
                                Replace
                              </button>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removePhoto(i); }}
                                className="w-9 bg-white/95 text-red-500 rounded-lg flex items-center justify-center"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            {uploadingBySlot[i] ? (
                              <Loader2 className="text-primary-pink animate-spin" size={24} />
                            ) : (
                              <Upload className="text-secondary group-hover:text-primary-pink" size={24} />
                            )}
                            <div className="text-center">
                              <p className="text-[10px] font-bold text-dark">
                                {uploadingBySlot[i] ? 'Uploading...' : 'Click to upload'}
                              </p>
                              <p className="text-[10px] text-secondary">PNG, JPG, WEBP up to 5MB</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  {uploadError && (
                    <p className="text-[11px] text-red-500 text-center font-medium">{uploadError}</p>
                  )}
                  <p className="text-[10px] text-secondary italic text-center">Uploads are hosted on Cloudinary and saved to your draft automatically.</p>
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
                  <div className="space-y-4 rounded-2xl border border-card p-4 bg-white">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-bold text-secondary uppercase tracking-wider">Names & Signature</p>
                      <div className="flex items-center gap-2">
                        {user && (
                          <button
                            type="button"
                            onClick={useProfileForSender}
                            className="text-[10px] font-bold uppercase tracking-wide text-primary-pink border border-primary-pink/35 rounded-full px-2.5 py-1 hover:bg-primary-light/60"
                          >
                            Use my profile
                          </button>
                        )}
                        {showRecipientSetting && (
                          <button
                            type="button"
                            onClick={swapNames}
                            className="text-[10px] font-bold uppercase tracking-wide text-secondary border border-card rounded-full px-2.5 py-1 hover:bg-slate-50"
                          >
                            Swap
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={clearNames}
                          className="text-[10px] font-bold uppercase tracking-wide text-secondary border border-card rounded-full px-2.5 py-1 hover:bg-slate-50"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    {showRecipientSetting && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-secondary uppercase tracking-wider">Recipient Name</label>
                        <input
                          name="recipientName"
                          value={formData.recipientName}
                          onChange={handleInput}
                          placeholder={recipientPlaceholder}
                          className="w-full px-4 py-2 border border-card rounded-xl focus:outline-none focus:border-primary-pink"
                        />
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-secondary uppercase tracking-wider">Sender Name</label>
                      <input
                        name="senderName"
                        value={formData.senderName}
                        onChange={handleInput}
                        placeholder={senderPlaceholder}
                        className="w-full px-4 py-2 border border-card rounded-xl focus:outline-none focus:border-primary-pink"
                      />
                    </div>
                  </div>
                  <div className="border-t border-card pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-secondary uppercase tracking-wider">Visibility</p>
                      <button
                        type="button"
                        onClick={resetStyleToTemplateDefault}
                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-secondary hover:text-dark"
                      >
                        <RefreshCw size={11} />
                        Reset defaults
                      </button>
                    </div>
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
                  {showPaletteSetting && (
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
                  )}
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
        <div className={`${showPreviewPanel ? 'flex' : 'hidden'} md:flex flex-grow bg-slate-100 flex-col overflow-hidden w-full`}>
          <div className="h-12 border-b border-card bg-white shrink-0 flex items-center justify-between px-6">
            <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest">
              <Eye size={16} className="text-primary-pink" /> Live Preview
            </div>
          </div>

          <div className="flex-grow overflow-hidden p-0 md:p-2">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full h-full max-w-full rounded-none md:rounded-[16px] border-0 md:border border-card shadow-none md:shadow-xl bg-white overflow-hidden relative">
                <div className="builder-real-preview absolute inset-0 bg-white overflow-hidden">
                <LivePreviewTemplate
                  recipientName={formData.recipientName}
                  senderName={formData.senderName}
                  scenes={formData.scenes || {}}
                  reasons={formData.reasons || []}
                  palette={formData.palette || 'pink'}
                  font={formData.font || 'playful'}
                  showSenderName={formData.showSenderName ?? true}
                  showFooter={formData.showFooter ?? true}
                  musicEnabled
                  musicUrl={formData.musicUrl || DEFAULT_LOVE_MUSIC_URL}
                />
                </div>
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                  <div className="rounded-full bg-black/60 backdrop-blur-md border border-white/30 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg">
                    Special Gift Just For {String(formData.recipientName || '').trim() || 'you'}
                  </div>
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
      <AuthModal
        isOpen={authOpen}
        onClose={() => {
          setAuthOpen(false);
          setPendingAuthAction('');
        }}
        onSuccess={handleAuthSuccess}
        initialMode="signup"
        title={pendingAuthAction === 'publish' ? 'Create account to publish' : 'Create account to save'}
      />
    </div>
  );
};

export default Builder;
