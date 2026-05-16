import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Type, Image as ImageIcon, Music, Settings, Upload, X, Eye, Volume2, Plus, Trash2, CheckCircle2, Loader2, Sparkles, RefreshCw, Play, Square } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { templateFields } from '../templates/fields';
import AuthModal from '../components/AuthModal';
import TemplateMiniDemo from '../components/TemplateMiniDemo';
import TemplateRenderer from '../components/TemplateRenderer';
import { useAuth } from '../context/AuthContext';
import { TEMPLATE_STYLE_DEFAULTS, buildQuickPersonalizedScenes, createDraft, getInitialDraftFormData } from '../utils/createDraft';
import { trackEvent } from '../utils/analytics';
import { DEFAULT_LOVE_MUSIC_URL } from '../config/music';
import { DEFAULT_TEMPLATE_ID, getTemplateConfig, normalizeTemplateId } from '../templates/registry';
import { normalizeTemplateVersion } from '../utils/pagePayload';
import { captureAppError } from '../utils/monitoring';
import useIsMobile from '../hooks/useIsMobile';
import { extractYouTubeId } from '../templates/palettes';

const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const DEFAULT_AI_SUGGEST_PATH = '/api/generate-message-suggestion';
const RAW_AI_SUGGEST_ENDPOINT = String(import.meta.env.VITE_AI_SUGGEST_ENDPOINT || '').trim();

const isAbsoluteHttpUrl = (value) => /^https?:\/\//i.test(String(value || '').trim());

const buildAiSuggestEndpoints = () => {
  const endpoints = [];
  const add = (endpoint) => {
    const normalized = String(endpoint || '').trim();
    if (!normalized || endpoints.includes(normalized)) return;
    endpoints.push(normalized);
  };

  if (RAW_AI_SUGGEST_ENDPOINT) {
    if (typeof window !== 'undefined' && isAbsoluteHttpUrl(RAW_AI_SUGGEST_ENDPOINT)) {
      try {
        const endpointUrl = new URL(RAW_AI_SUGGEST_ENDPOINT);
        if (endpointUrl.host !== window.location.host) {
          add(DEFAULT_AI_SUGGEST_PATH);
          add(RAW_AI_SUGGEST_ENDPOINT);
          return endpoints;
        }
      } catch {
        // Ignore parse errors and keep fallback ordering below.
      }
    }
    add(RAW_AI_SUGGEST_ENDPOINT);
  }

  add(DEFAULT_AI_SUGGEST_PATH);
  return endpoints;
};

const QUICK_TONES = [
  { id: 'sweet', label: 'Sweet', note: 'Warm and tender' },
  { id: 'deep', label: 'Deep', note: 'Emotional and sincere' },
  { id: 'playful', label: 'Playful', note: 'Cute and smiley' },
];

const ONBOARDING_MUSIC_OPTIONS = [
  {
    id: 'lovepage-default',
    title: 'LovePage Romantic',
    note: 'Soft lo-fi mood',
    url: DEFAULT_LOVE_MUSIC_URL,
  },
  {
    id: 'thousand-years',
    title: 'A Thousand Years',
    note: 'Dreamy slow romance',
    url: 'https://www.youtube.com/watch?v=rtOvBOTyX00',
  },
  {
    id: 'cant-help-falling',
    title: "Can't Help Falling in Love",
    note: 'Classic love vibe',
    url: 'https://www.youtube.com/watch?v=vGJTaP6anOU',
  },
  {
    id: 'all-of-me',
    title: 'All of Me',
    note: 'Modern piano-pop',
    url: 'https://www.youtube.com/watch?v=450p7goxZqg',
  },
  {
    id: 'die-with-a-smile',
    title: 'Die With A Smile',
    note: 'Current hit love ballad',
    url: 'https://www.youtube.com/watch?v=kPa7bsKwL-c',
  },
  {
    id: 'birds-of-a-feather',
    title: 'BIRDS OF A FEATHER',
    note: 'Current viral love song',
    url: 'https://www.youtube.com/watch?v=1bkjEO_Zj2g',
  },
  {
    id: 'until-i-found-you',
    title: 'Until I Found You',
    note: 'TikTok favorite love song',
    url: 'https://www.youtube.com/watch?v=GxldQ9eX2wo',
  },
  {
    id: 'perfect',
    title: 'Perfect',
    note: 'TikTok classic love song',
    url: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
  },
];

const MAX_TEMPLATE_PHOTOS = 5;
const ONBOARDING_IMAGE_TEMPLATES = new Set(['kawaii-letter']);
const LOVE_LETTER_MEMORY_CAPTION_KEYS = [
  'polaroidCaption1',
  'polaroidCaption2',
  'polaroidCaption3',
  'polaroidCaption4',
  'polaroidCaption5',
];
const LOVE_LETTER_MEMORY_CAPTION_KEY_SET = new Set(LOVE_LETTER_MEMORY_CAPTION_KEYS);

const ONBOARDING_BASE_STEPS = [
  { id: 'recipient', kind: 'recipient', title: 'Who is this for?', subtitle: "Your loved one's name" },
  { id: 'tone', kind: 'tone', title: 'Choose the vibe', subtitle: 'Pick the tone you want this page to feel like' },
];

const getOnboardingFieldSubtitle = (field) => {
  const key = String(field?.key || '');
  if (/coverTag|coverTitle|coverSubtitle/i.test(key)) return 'These lines appear on the front cover.';
  if (/recapTitle|recapSticker|collageTitle/i.test(key)) return 'Short words look best for scrapbook stickers.';
  if (/noteTo|noteFrom|endTitle|endSubtitle|endFootnote/i.test(key)) return 'This appears on the handwritten card pages.';
  if (/bouquetTitle|bouquetFlowers|bouquetNote/i.test(key)) return 'These fields build your personalized bouquet card.';
  if (/password/i.test(key)) return 'Keep it simple so they can open the page easily.';
  if (/youtube/i.test(key)) return 'Paste a YouTube link to place your favorite clip sticker.';
  if (/spotify|track|artist/i.test(key)) return 'This appears on the mini music card.';
  if (/mapPlace|memorySubtitle|voiceLabel/i.test(key)) return 'Used inside the memory spotlight card.';
  if (/date/i.test(key)) return 'Use a clear date format so it reads nicely.';
  if (/caption/i.test(key)) return 'Short and specific works best here.';
  if (/closingSubmessage/i.test(key)) return 'Small line under the final badge.';
  if (field?.type === 'textarea') return 'Write it exactly how you want it to appear.';
  return 'Set this value for your template.';
};

const buildTemplateOnboardingSteps = (templateId) => {
  const fields = templateFields[templateId] || [];
  const isLoveLetter = templateId === 'kawaii-letter';
  const loveLetterCaptionFields = isLoveLetter
    ? fields.filter((field) => LOVE_LETTER_MEMORY_CAPTION_KEY_SET.has(field.key))
    : [];

  const templateSpecificSteps = [];
  let insertedLoveLetterCaptionStep = false;

  for (const field of fields) {
    if (isLoveLetter && LOVE_LETTER_MEMORY_CAPTION_KEY_SET.has(field.key)) {
      if (!insertedLoveLetterCaptionStep && loveLetterCaptionFields.length) {
        templateSpecificSteps.push({
          id: 'love-letter-memory-captions',
          kind: 'memory-captions',
          title: 'Memory captions',
          subtitle: 'Add all 5 memory captions in one place.',
          fields: loveLetterCaptionFields,
        });
        insertedLoveLetterCaptionStep = true;
      }
      continue;
    }

    templateSpecificSteps.push({
      id: `scene:${field.key}`,
      kind: 'scene',
      field,
      title: field.label,
      subtitle: getOnboardingFieldSubtitle(field),
    });
  }

  const hasPhotoStep = ONBOARDING_IMAGE_TEMPLATES.has(templateId);

  return [
    ...ONBOARDING_BASE_STEPS,
    ...templateSpecificSteps,
    ...(hasPhotoStep
      ? [{
        id: 'images',
        kind: 'images',
        title: 'Add your memories',
        subtitle: `Upload up to ${MAX_TEMPLATE_PHOTOS} photos for your Love Letter.`,
      }]
      : []),
    {
      id: 'music',
      kind: 'music',
      title: 'Add music?',
      subtitle: 'Optional, but it makes the reveal feel more cinematic',
    },
  ];
};

const resolveTemplateId = (id) => {
  const normalizedId = normalizeTemplateId(id);
  return TEMPLATE_STYLE_DEFAULTS[normalizedId] ? normalizedId : DEFAULT_TEMPLATE_ID;
};

const getFieldSectionLabel = (templateId, key) => {
  if (/^age|^headline|^subheadline|^wishLine/i.test(key)) return 'Birthday Setup';
  if (/^chat/i.test(key)) return 'Chat Setup';
  if (templateId === 'our-year-book' && /^scene2Header$/i.test(key)) return 'Scrapbook';
  if (/^coverTag|^coverTitle|^coverSubtitle/i.test(key)) return 'Cover';
  if (/^recapTitle|^recapSticker|^collageTitle/i.test(key)) return 'Scrapbook';
  if (/^noteTo|^noteFrom|^endTitle|^endSubtitle|^endFootnote/i.test(key)) return 'Note & Ending';
  if (/^bouquetTitle|^bouquetFlowers|^bouquetNote/i.test(key)) return 'Personal Bouquet';
  if (/^lockFromLabel|^lockToLabel|^envelopeHint/i.test(key)) return 'Gate & Envelope';
  if (/^favoriteLabel|^youtubeUrl|^spotifyTrackTitle|^spotifyArtist|^scene2Header/i.test(key)) return 'Mood Board';
  if (/^scratchLabel|^photo\d+Url/i.test(key)) return 'Scratch Memories';
  if (/^mapTitle|^mapPlace|^memorySubtitle|^voiceLabel/i.test(key)) return 'Memory Map';
  if (/^access/i.test(key) || /^welcome/i.test(key)) return 'Private Gate';
  if (/^heartColor/i.test(key)) return 'Home Style';
  if (/^question|^yesLabel|^noLabel|^noTaunt|^celebration/i.test(key)) return 'Question Flow';
  if (/^confession|^introLine|^continueLabel|^questionCta/i.test(key)) return 'Confession Flow';
  if (/^story|^chapter|^startDate/i.test(key)) return 'Story Timeline';
  if (/^gallery|^polaroidCaption|^memories/i.test(key)) return 'Memories';
  if (/reason/i.test(key)) return 'Reasons';
  if (/letter|closing|scene2Header|scene3Header|hint|finalLetter|letterTitle/i.test(key)) return 'Letter';
  if (templateId === 'our-gallery') return 'Gallery';
  return 'Content';
};

const Builder = () => {
  const { templateId } = useParams();
  const activeTemplateId = resolveTemplateId(templateId);
  const templateConfig = getTemplateConfig(activeTemplateId);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const draftId = searchParams.get('draft');
  const forceOnboarding = searchParams.get('onboarding') === '1';
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const simplifyMobileVisuals = isMobile || prefersReducedMotion;

  const [activeTab, setActiveTab] = useState('Text');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error
  const [saveErrorMessage, setSaveErrorMessage] = useState('');
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
  const [showQuickStart, setShowQuickStart] = useState(forceOnboarding || !draftId);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    recipientName: '',
    tone: 'sweet',
    musicEnabled: false,
    musicUrl: '',
    scenes: {},
  });
  const [previewTrackId, setPreviewTrackId] = useState('');
  const [mobileWorkspaceView, setMobileWorkspaceView] = useState('editor');
  const onboardingSceneFields = useMemo(() => templateFields[activeTemplateId] || [], [activeTemplateId]);
  const onboardingSteps = useMemo(() => buildTemplateOnboardingSteps(activeTemplateId), [activeTemplateId]);

  useEffect(() => {
    if (!templateId || templateId === activeTemplateId) return;
    const queryString = searchParams.toString();
    navigate(`/create/${activeTemplateId}${queryString ? `?${queryString}` : ''}`, { replace: true });
  }, [activeTemplateId, navigate, searchParams, templateId]);

  const startExpiryTimer = useCallback((expiresAtDate) => {
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
  }, []);

  // Load draft from Firestore
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (!draftId) {
        setFormData(getInitialDraftFormData(activeTemplateId));
        setTemplateName(templateConfig.title);
        setExpiryLabel('');
        setSaveStatus('idle');
        setShowQuickStart(true);
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'pages', draftId));
        if (!snap.exists() || snap.data().status !== 'pending') {
          navigate('/templates');
          return;
        }
        const data = snap.data();
        const normalizedDraftTemplateId = normalizeTemplateId(data.templateId || activeTemplateId);
        if (data.templateId && !TEMPLATE_STYLE_DEFAULTS[normalizedDraftTemplateId]) {
          navigate('/templates', { replace: true });
          return;
        }
        const draftTemplateId = resolveTemplateId(normalizedDraftTemplateId);
        if (draftTemplateId !== activeTemplateId) {
          navigate(`/create/${draftTemplateId}?draft=${draftId}`, { replace: true });
          return;
        }
        setFormData({
          templateVersion: normalizeTemplateVersion(data.templateVersion),
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
        setTemplateName(getTemplateConfig(draftTemplateId).title);
        setShowQuickStart(forceOnboarding);
        // Expiry countdown
        if (data.expiresAt) startExpiryTimer(data.expiresAt.toDate());
      } catch (err) {
        captureAppError(err, { scope: 'builder.loadDraft', draftId, templateId: activeTemplateId });
        navigate('/templates');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeTemplateId, draftId, forceOnboarding, navigate, startExpiryTimer, templateConfig.title]);

  useEffect(() => {
    trackEvent('builder_opened', { templateId: activeTemplateId, hasDraft: Boolean(draftId) });
  }, [activeTemplateId, draftId]);

  useEffect(() => {
    if (!showQuickStart) return;
    const recipient = String(formData.recipientName || '').trim();
    const generatedDefaults = buildQuickPersonalizedScenes(activeTemplateId, {
      recipientName: recipient,
      tone: 'sweet',
    });
    const initialScenes = onboardingSceneFields.reduce((acc, field) => {
      const existingValue = formData.scenes?.[field.key];
      const generatedValue = generatedDefaults[field.key];
      acc[field.key] = String(existingValue ?? generatedValue ?? '');
      return acc;
    }, {});
    const onboardingPhotoScenes = Array.from({ length: MAX_TEMPLATE_PHOTOS }, (_, idx) => idx + 1).reduce((acc, slot) => {
      const key = `photo${slot}Url`;
      const existingValue = String(formData.scenes?.[key] || '').trim();
      if (existingValue) acc[key] = existingValue;
      return acc;
    }, {});

    setOnboardingStep(0);
    setOnboardingData({
      recipientName: recipient,
      tone: 'sweet',
      musicEnabled: Boolean(formData.musicEnabled),
      musicUrl: String(formData.musicUrl || ''),
      scenes: {
        ...initialScenes,
        ...onboardingPhotoScenes,
      },
    });
  }, [
    showQuickStart,
    activeTemplateId,
    onboardingSceneFields,
    formData.recipientName,
    formData.musicEnabled,
    formData.musicUrl,
    formData.scenes,
  ]);

  useEffect(() => () => {
    if (expiryIntervalRef.current) clearInterval(expiryIntervalRef.current);
  }, []);

  // Save to Firestore
  const saveToFirestore = useCallback(async (data, targetDraftId = draftId, options = {}) => {
    const { syncRoute = true } = options;
    if (!targetDraftId) return null;
    setSaveStatus('saving');
    setSaveErrorMessage('');
    try {
      await updateDoc(doc(db, 'pages', targetDraftId), {
        templateId: activeTemplateId,
        templateVersion: normalizeTemplateVersion(data.templateVersion),
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
      captureAppError(err, { scope: 'builder.saveDraft', draftId: targetDraftId, templateId: activeTemplateId });
      const errorCode = String(err?.code || '');
      const canRecoverWithNewDraft = Boolean(
        user
        && targetDraftId === draftId
        && (errorCode.includes('permission-denied') || errorCode.includes('not-found'))
      );

      if (canRecoverWithNewDraft) {
        try {
          const recreatedDraftId = await createDraft(activeTemplateId, data);
          trackEvent('draft_recreated_after_save_failure', {
            templateId: activeTemplateId,
            draftId: recreatedDraftId,
            originalDraftId: targetDraftId,
          });
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2000);
          if (syncRoute) {
            navigate(`/create/${activeTemplateId}?draft=${recreatedDraftId}`, { replace: true });
          }
          return recreatedDraftId;
        } catch (recoveryErr) {
          captureAppError(recoveryErr, { scope: 'builder.recoverDraft', draftId: targetDraftId, templateId: activeTemplateId });
        }
      }

      setSaveErrorMessage(
        errorCode.includes('permission-denied')
          ? 'This draft is locked. Try saving again to continue with a fresh draft.'
          : 'Could not save right now. Please try again.'
      );
      setSaveStatus('error');
      return null;
    }
  }, [activeTemplateId, draftId, navigate, user]);

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

  const onboardingPreviewScenes = {
    ...formData.scenes,
    ...buildQuickPersonalizedScenes(activeTemplateId, {
      recipientName: onboardingData.recipientName,
      tone: onboardingData.tone,
    }),
    ...onboardingData.scenes,
  };

  const currentOnboardingStep = onboardingSteps[onboardingStep] || onboardingSteps[0];
  const isCurrentStepValid = (() => {
    if (!currentOnboardingStep) return true;
    if (currentOnboardingStep.kind === 'recipient') return Boolean(onboardingData.recipientName.trim());
    if (currentOnboardingStep.kind === 'scene') {
      const value = onboardingData.scenes?.[currentOnboardingStep.field.key];
      if (currentOnboardingStep.field.type === 'select') {
        return Boolean(String(value || currentOnboardingStep.field.options?.[0]?.value || '').trim());
      }
      return Boolean(String(value || '').trim());
    }
    if (currentOnboardingStep.kind === 'memory-captions') {
      const fields = currentOnboardingStep.fields || [];
      return fields.every((field) => Boolean(String(onboardingData.scenes?.[field.key] || '').trim()));
    }
    if (currentOnboardingStep.kind === 'images') return true;
    return true;
  })();

  const updateOnboardingValue = (key, value) => {
    setOnboardingData((prev) => ({ ...prev, [key]: value }));
  };

  const updateOnboardingSceneValue = (key, value) => {
    setOnboardingData((prev) => ({ ...prev, scenes: { ...prev.scenes, [key]: value } }));
  };

  const applyOnboardingAndContinue = () => {
    const normalizedSceneValues = onboardingSceneFields.reduce((acc, field) => {
      const value = String(onboardingData.scenes?.[field.key] || '').trim();
      if (value) acc[field.key] = value;
      return acc;
    }, {});
    const uploadedPhotoScenes = Array.from({ length: MAX_TEMPLATE_PHOTOS }, (_, idx) => idx + 1).reduce((acc, slot) => {
      const key = `photo${slot}Url`;
      const value = String(onboardingData.scenes?.[key] || '').trim();
      if (value) acc[key] = value;
      return acc;
    }, {});

    setFormData((prev) => ({
      ...prev,
      recipientName: onboardingData.recipientName.trim(),
      musicEnabled: Boolean(onboardingData.musicEnabled),
      musicUrl: onboardingData.musicEnabled
        ? String(onboardingData.musicUrl || '').trim() || DEFAULT_LOVE_MUSIC_URL
        : String(onboardingData.musicUrl || '').trim(),
      scenes: {
        ...prev.scenes,
        ...buildQuickPersonalizedScenes(activeTemplateId, {
          recipientName: onboardingData.recipientName.trim(),
          tone: onboardingData.tone,
        }),
        ...normalizedSceneValues,
        ...uploadedPhotoScenes,
      },
    }));
    setActiveTab('Text');
    setShowQuickStart(false);
    trackEvent('onboarding_completed', {
      templateId: activeTemplateId,
      tone: onboardingData.tone,
      hasRecipient: Boolean(onboardingData.recipientName.trim()),
      fieldsCompleted: Object.keys(normalizedSceneValues).length,
      photosUploaded: Object.keys(uploadedPhotoScenes).length,
      musicEnabled: Boolean(onboardingData.musicEnabled),
    });
  };

  const goToNextOnboardingStep = () => {
    if (!isCurrentStepValid) return;
    if (onboardingStep >= onboardingSteps.length - 1) {
      applyOnboardingAndContinue();
      return;
    }
    setOnboardingStep((current) => Math.min(current + 1, onboardingSteps.length - 1));
  };

  const goToPreviousOnboardingStep = () => {
    setOnboardingStep((current) => Math.max(current - 1, 0));
  };

  const requestSuggestion = async ({
    fieldType,
    fieldKey,
    fieldLabel,
    currentValue,
    recipientName,
    senderName,
  }) => {
    const suggestionDraftId = draftId || localDraftKeyRef.current;
    const requestBody = {
      fieldType,
      draftId: suggestionDraftId,
      fieldKey,
      fieldLabel,
      currentValue,
      recipientName,
      senderName,
      templateId: activeTemplateId,
    };
    const endpoints = buildAiSuggestEndpoints();
    let lastError = null;

    for (let index = 0; index < endpoints.length; index += 1) {
      const endpoint = endpoints[index];
      const hasFallback = index < endpoints.length - 1;

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          const apiMessage = typeof payload?.error === 'string'
            ? payload.error
            : payload?.error?.message;
          const error = new Error(apiMessage || `AI request failed (${response.status})`);
          error.status = response.status;
          throw error;
        }

        const suggestion = String(payload?.suggestion || '').trim();
        if (!suggestion) {
          const error = new Error('No suggestion returned');
          error.status = 502;
          throw error;
        }
        return suggestion;
      } catch (err) {
        lastError = err;
        const message = String(err?.message || '').toLowerCase();
        const status = Number(err?.status || 0);
        const retryable = (
          status === 0
          || status === 403
          || status === 404
          || status === 405
          || status === 502
          || message.includes('failed to fetch')
          || message.includes('load failed')
          || message.includes('networkerror')
          || message.includes('origin is not allowed')
          || message.includes('no suggestion returned')
        );

        if (hasFallback && retryable) continue;
        throw err;
      }
    }

    if (lastError) throw lastError;
    throw new Error('AI suggestion failed. Please try again.');
  };

  const handleGenerateSuggestion = async (field) => {
    setAiErrorByField(prev => ({ ...prev, [field.key]: '' }));
    setGeneratingByField(prev => ({ ...prev, [field.key]: true }));
    try {
      const suggestion = await requestSuggestion({
        fieldType: field.type,
        fieldKey: field.key,
        fieldLabel: field.label,
        currentValue: formData.scenes[field.key] || '',
        recipientName: formData.recipientName || '',
        senderName: formData.senderName || '',
      });
      handleSceneInput(field.key, suggestion);
    } catch (err) {
      captureAppError(err, { scope: 'builder.aiSuggestion', fieldKey: field.key, templateId: activeTemplateId });
      const normalizedMessage = String(err?.message || '').toLowerCase();
      const message = normalizedMessage.includes('failed to fetch') || normalizedMessage.includes('load failed')
        ? 'AI is unavailable right now on this network/domain. Please try again in a moment.'
        : err?.message?.includes('AI endpoint is not configured')
        ? 'AI endpoint is not configured yet.'
        : err?.message || 'AI suggestion failed. Please try again.';
      setAiErrorByField(prev => ({ ...prev, [field.key]: message }));
    } finally {
      setGeneratingByField(prev => ({ ...prev, [field.key]: false }));
    }
  };

  const handleGenerateOnboardingSuggestion = async (field) => {
    const recipientForSuggestion = String(onboardingData.recipientName || formData.recipientName || '').trim();
    const senderForSuggestion = String(formData.senderName || '').trim();

    setAiErrorByField(prev => ({ ...prev, [field.key]: '' }));
    setGeneratingByField(prev => ({ ...prev, [field.key]: true }));
    try {
      const suggestion = await requestSuggestion({
        fieldType: field.type,
        fieldKey: field.key,
        fieldLabel: field.label,
        currentValue: onboardingData.scenes?.[field.key] || '',
        recipientName: recipientForSuggestion,
        senderName: senderForSuggestion,
      });
      updateOnboardingSceneValue(field.key, suggestion);
    } catch (err) {
      captureAppError(err, { scope: 'builder.onboardingAiSuggestion', fieldKey: field.key, templateId: activeTemplateId });
      const normalizedMessage = String(err?.message || '').toLowerCase();
      const message = normalizedMessage.includes('failed to fetch') || normalizedMessage.includes('load failed')
        ? 'AI is unavailable right now on this network/domain. Please try again in a moment.'
        : err?.message?.includes('AI endpoint is not configured')
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
            return saveToFirestore(formData, draftId, { syncRoute });
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
      captureAppError(err, { scope: 'builder.createDraft', templateId: activeTemplateId });
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

  const photoSlots = Array.from({ length: MAX_TEMPLATE_PHOTOS }, (_, idx) => idx + 1);

  const triggerPhotoPicker = (slot) => {
    const input = fileInputRefs.current[slot];
    if (input) input.click();
  };

  const setPhotoUrl = (slot, url) => {
    const key = `photo${slot}Url`;
    setFormData(prev => ({ ...prev, scenes: { ...prev.scenes, [key]: url } }));
  };

  const setOnboardingPhotoUrl = (slot, url) => {
    const key = `photo${slot}Url`;
    setOnboardingData(prev => ({ ...prev, scenes: { ...prev.scenes, [key]: url } }));
  };

  const removePhoto = (slot) => {
    setUploadError('');
    setPhotoUrl(slot, '');
  };

  const removeOnboardingPhoto = (slot) => {
    setUploadError('');
    setOnboardingPhotoUrl(slot, '');
  };

  const uploadPhotoFile = async (slot, file) => {
    const uploadDraftId = draftId || localDraftKeyRef.current;

    if (!IMAGE_TYPES.includes(file.type)) {
      throw new Error('Please upload a JPG, PNG, or WEBP image.');
    }

    if (file.size > IMAGE_MAX_BYTES) {
      throw new Error('Image is too large. Max size is 5MB.');
    }

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Cloudinary is not configured. Add cloud name and upload preset to .env.');
    }

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

    return payload.secure_url;
  };

  const handlePhotoSelected = async (slot, event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setUploadError('');
    setUploadingBySlot(prev => ({ ...prev, [slot]: true }));
    try {
      const photoUrl = await uploadPhotoFile(slot, file);
      setPhotoUrl(slot, photoUrl);
    } catch (err) {
      captureAppError(err, { scope: 'builder.uploadImage', slot, templateId: activeTemplateId });
      setUploadError(err?.message || 'Upload failed. Check Cloudinary setup and try again.');
    } finally {
      setUploadingBySlot(prev => ({ ...prev, [slot]: false }));
    }
  };

  const handleOnboardingPhotoSelected = async (slot, event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setUploadError('');
    setUploadingBySlot(prev => ({ ...prev, [slot]: true }));
    try {
      const photoUrl = await uploadPhotoFile(slot, file);
      setOnboardingPhotoUrl(slot, photoUrl);
    } catch (err) {
      captureAppError(err, { scope: 'builder.onboardingUploadImage', slot, templateId: activeTemplateId });
      setUploadError(err?.message || 'Upload failed. Check Cloudinary setup and try again.');
    } finally {
      setUploadingBySlot(prev => ({ ...prev, [slot]: false }));
    }
  };

  const tabs = [
    { id: 'Text', icon: <Type size={18} /> },
    ...(templateConfig.supportsImages ? [{ id: 'Images', icon: <ImageIcon size={18} /> }] : []),
    { id: 'Music', icon: <Music size={18} /> },
    { id: 'Settings', icon: <Settings size={18} /> },
  ];
  const showRecipientSetting = !templateConfig.hideRecipientSetting;
  const showPaletteSetting = !templateConfig.hidePaletteSetting;
  const senderPlaceholder = user?.displayName
    || user?.email?.split('@')[0]
    || 'From your heart';
  const recipientPlaceholder = 'Who is this for?';

  const currentTab = activeTab === 'Images' && !templateConfig.supportsImages ? 'Text' : activeTab;

  const fields = templateFields[activeTemplateId] || [];
  const groupedFields = fields.reduce((sections, field) => {
    const section = getFieldSectionLabel(activeTemplateId, field.key);
    if (!sections[section]) sections[section] = [];
    sections[section].push(field);
    return sections;
  }, {});
  const sectionOrder = ['Birthday Setup', 'Private Gate', 'Home Style', 'Chat Setup', 'Confession Flow', 'Question Flow', 'Story Timeline', 'Gallery', 'Memories', 'Reasons', 'Letter', 'Content'];
  const orderedSections = sectionOrder.filter((name) => groupedFields[name]?.length > 0);
  const isReasons = activeTemplateId === '100-reasons';

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
    const defaults = TEMPLATE_STYLE_DEFAULTS[activeTemplateId] || TEMPLATE_STYLE_DEFAULTS['kawaii-letter'];
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
  const previewTrack = ONBOARDING_MUSIC_OPTIONS.find((track) => track.id === previewTrackId);
  const previewVideoId = previewTrack ? extractYouTubeId(previewTrack.url) : '';

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
    const safeStepsCount = Math.max(onboardingSteps.length, 1);
    const progressPercent = Math.round(((onboardingStep + 1) / safeStepsCount) * 100);
    const previewHeadline = onboardingPreviewScenes.scene2Header
      || onboardingPreviewScenes.headline
      || onboardingPreviewScenes.storyTitle
      || onboardingPreviewScenes.galleryTitle
      || onboardingPreviewScenes.questionTitle
      || onboardingPreviewScenes.introLine
      || `A letter for ${onboardingData.recipientName || 'you'}`;
    const previewBody = onboardingPreviewScenes.letterText
      || onboardingPreviewScenes.introText
      || onboardingPreviewScenes.chapter1Text
      || onboardingPreviewScenes.subheadline
      || onboardingPreviewScenes.questionSubtitle
      || onboardingPreviewScenes.chatScript
      || 'Your message preview will appear here.';
    const previewRecipient = onboardingData.recipientName.trim() || 'your love';
    const isLastStep = onboardingStep === onboardingSteps.length - 1;
    const isFirstOnboardingScreen = onboardingStep === 0;
    const currentStepId = currentOnboardingStep?.id;

    return (
      <div className={`min-h-screen text-white px-3 sm:px-4 md:px-8 py-5 md:py-8 ${simplifyMobileVisuals ? 'bg-[#111629]' : 'bg-[radial-gradient(circle_at_15%_15%,#2b2144_0%,#171b2a_45%,#0f1320_100%)]'}`}>
        <div className="mx-auto max-w-[1440px] mb-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <Link to={`/templates/${activeTemplateId}`} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/80 hover:bg-white/10 transition-colors">
              <ArrowLeft size={15} /> Templates
            </Link>
            <p className="hidden md:block text-[11px] uppercase tracking-[0.25em] text-[#f5bad3] font-bold">{templateConfig.title} onboarding</p>
          </div>
          <div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#f06ea9] via-[#f68bb7] to-[#f3b1ca]"
                initial={false}
                animate={{ width: `${progressPercent}%` }}
                transition={{ type: 'spring', stiffness: 220, damping: 28 }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.2em] text-white/45">
              <span>Step {onboardingStep + 1}</span>
              <span>{progressPercent}%</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6 xl:gap-10 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-[30px] border p-6 md:p-8 xl:p-10 ${simplifyMobileVisuals ? 'border-white/12 bg-[#1a2238] shadow-none' : 'border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] shadow-[0_30px_90px_rgba(8,10,20,0.52)] backdrop-blur-xl'}`}
          >
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f6a8c9] mb-3">Quick personalize</p>
            {isFirstOnboardingScreen ? (
              <>
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 font-display leading-tight">{currentOnboardingStep.title}</h1>
                <p className="text-white/75 text-base sm:text-xl md:text-2xl leading-relaxed mb-8 max-w-3xl">{currentOnboardingStep.subtitle}</p>
              </>
            ) : (
              <>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 font-display leading-tight">{currentOnboardingStep.title}</h2>
                <p className="text-white/55 text-sm md:text-base mb-8 max-w-2xl">{currentOnboardingStep.subtitle}</p>
              </>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepId}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                className="space-y-5"
              >
                {currentOnboardingStep?.kind === 'recipient' && (
                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-[#f8b6d2]">Loved one&apos;s name *</label>
                    <input
                      value={onboardingData.recipientName}
                      onChange={(e) => updateOnboardingValue('recipientName', e.target.value)}
                      placeholder="Enter the name"
                      className="mt-2 w-full max-w-2xl px-4 py-4 rounded-2xl border border-white/15 bg-white/5 text-white text-xl placeholder:text-white/45 focus:outline-none focus:border-[#f6a8c9]"
                      autoFocus
                    />
                    <p className="mt-2 text-xs text-white/45">{onboardingData.recipientName.length} / 150</p>
                  </div>
                )}
                {currentOnboardingStep?.kind === 'tone' && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f8b6d2] mb-3">Tone selection</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {QUICK_TONES.map((tone) => (
                        <button
                          key={tone.id}
                          type="button"
                          onClick={() => updateOnboardingValue('tone', tone.id)}
                          className={`text-left rounded-2xl border p-4 transition-all ${
                            onboardingData.tone === tone.id
                              ? 'border-[#f6a8c9] bg-[#f6a8c9]/15 text-white shadow-lg'
                              : 'border-white/15 bg-white/5 text-white/80 hover:border-[#f6a8c9]/65'
                          }`}
                        >
                          <span className="block text-lg font-bold">{tone.label}</span>
                          <span className="text-xs text-white/65">{tone.note}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {currentOnboardingStep?.kind === 'scene' && (
                  <div>
                    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <label className="text-xs font-bold uppercase tracking-[0.2em] text-[#f8b6d2] leading-tight">
                        {currentOnboardingStep.field.label} *
                      </label>
                      {currentOnboardingStep.field.type !== 'select' ? (
                        <button
                          type="button"
                          onClick={() => handleGenerateOnboardingSuggestion(currentOnboardingStep.field)}
                          disabled={Boolean(generatingByField[currentOnboardingStep.field.key])}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#f6a8c9]/50 bg-[#f6a8c9]/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#f8b6d2] hover:bg-[#f6a8c9]/18 disabled:opacity-60"
                        >
                          {generatingByField[currentOnboardingStep.field.key] ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Sparkles size={12} />
                          )}
                          AI Suggest
                        </button>
                      ) : null}
                    </div>
                    {currentOnboardingStep.field.type === 'textarea' ? (
                      <textarea
                        value={onboardingData.scenes?.[currentOnboardingStep.field.key] || ''}
                        onChange={(e) => updateOnboardingSceneValue(currentOnboardingStep.field.key, e.target.value)}
                        placeholder={currentOnboardingStep.field.placeholder || `Write ${currentOnboardingStep.field.label.toLowerCase()}...`}
                        rows={7}
                        className="mt-2 w-full max-w-3xl px-4 py-4 rounded-2xl border border-white/15 bg-white/5 text-white text-lg placeholder:text-white/45 focus:outline-none focus:border-[#f6a8c9] resize-none"
                        autoFocus
                      />
                    ) : currentOnboardingStep.field.type === 'select' ? (
                      <select
                        value={onboardingData.scenes?.[currentOnboardingStep.field.key] || currentOnboardingStep.field.options?.[0]?.value || ''}
                        onChange={(e) => updateOnboardingSceneValue(currentOnboardingStep.field.key, e.target.value)}
                        className="mt-2 w-full max-w-2xl px-4 py-4 rounded-2xl border border-white/15 bg-[#1d2437] text-white text-base focus:outline-none focus:border-[#f6a8c9]"
                        autoFocus
                      >
                        {(currentOnboardingStep.field.options || []).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={onboardingData.scenes?.[currentOnboardingStep.field.key] || ''}
                        onChange={(e) => updateOnboardingSceneValue(currentOnboardingStep.field.key, e.target.value)}
                        placeholder={currentOnboardingStep.field.placeholder || `Enter ${currentOnboardingStep.field.label.toLowerCase()}`}
                        className="mt-2 w-full max-w-2xl px-4 py-4 rounded-2xl border border-white/15 bg-white/5 text-white text-xl placeholder:text-white/45 focus:outline-none focus:border-[#f6a8c9]"
                        autoFocus
                      />
                    )}
                    {currentOnboardingStep.field.type !== 'select' ? (
                      <p className="mt-2 text-xs text-white/45">
                        {String(onboardingData.scenes?.[currentOnboardingStep.field.key] || '').length}
                        {' / '}
                        {currentOnboardingStep.field.type === 'textarea' ? '1600' : '180'}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-white/55">Pick the heart color you want to use across this template.</p>
                    )}
                    {aiErrorByField[currentOnboardingStep.field.key] ? (
                      <p className="mt-1 text-xs text-rose-300 font-medium">{aiErrorByField[currentOnboardingStep.field.key]}</p>
                    ) : null}
                  </div>
                )}
                {currentOnboardingStep?.kind === 'memory-captions' && (
                  <div className="space-y-4 max-w-3xl">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f8b6d2]">
                      Memory captions 1-5 *
                    </p>
                    <div className="space-y-3">
                      {(currentOnboardingStep.fields || []).map((field, index) => (
                        <div key={field.key} className="space-y-1.5">
                          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/70">
                              {field.label}
                            </label>
                            <button
                              type="button"
                              onClick={() => handleGenerateOnboardingSuggestion(field)}
                              disabled={Boolean(generatingByField[field.key])}
                              className="inline-flex items-center gap-1.5 rounded-full border border-[#f6a8c9]/50 bg-[#f6a8c9]/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#f8b6d2] hover:bg-[#f6a8c9]/18 disabled:opacity-60"
                            >
                              {generatingByField[field.key] ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <Sparkles size={12} />
                              )}
                              AI Suggest
                            </button>
                          </div>
                          <input
                            value={onboardingData.scenes?.[field.key] || ''}
                            onChange={(e) => updateOnboardingSceneValue(field.key, e.target.value)}
                            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                            className="w-full px-4 py-3 rounded-2xl border border-white/15 bg-white/5 text-white text-base placeholder:text-white/45 focus:outline-none focus:border-[#f6a8c9]"
                            autoFocus={index === 0}
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-white/45">
                              {String(onboardingData.scenes?.[field.key] || '').length} / 180
                            </span>
                            {aiErrorByField[field.key] ? (
                              <span className="text-[11px] text-rose-300 font-medium">{aiErrorByField[field.key]}</span>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {currentOnboardingStep?.kind === 'images' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f8b6d2]">Photo uploads</p>
                      <p className="text-xs text-white/60">
                        {photoSlots.filter((slot) => String(onboardingData.scenes?.[`photo${slot}Url`] || '').trim()).length}
                        {' / '}
                        {MAX_TEMPLATE_PHOTOS}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {photoSlots.map((slot) => (
                        <div
                          key={`onboarding-photo-${slot}`}
                          className="rounded-2xl border border-white/15 bg-white/5 p-3"
                        >
                          <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
                            Photo {slot}
                          </label>
                          <input
                            ref={(el) => { fileInputRefs.current[slot] = el; }}
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            onChange={(e) => handleOnboardingPhotoSelected(slot, e)}
                          />
                          <div
                            onClick={() => !uploadingBySlot[slot] && triggerPhotoPicker(slot)}
                            className="mt-2 aspect-video cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-white/20 bg-black/15 flex items-center justify-center"
                          >
                            {onboardingData.scenes?.[`photo${slot}Url`] ? (
                              <img
                                src={onboardingData.scenes[`photo${slot}Url`]}
                                alt={`Onboarding upload ${slot}`}
                                className="h-full w-full object-cover"
                              />
                            ) : uploadingBySlot[slot] ? (
                              <Loader2 className="animate-spin text-white" size={22} />
                            ) : (
                              <div className="text-center">
                                <p className="text-xs font-bold text-white">Click to upload</p>
                                <p className="text-[10px] text-white/65">PNG, JPG, WEBP</p>
                              </div>
                            )}
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => triggerPhotoPicker(slot)}
                              disabled={Boolean(uploadingBySlot[slot])}
                              className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#f8b6d2] disabled:opacity-50"
                            >
                              {onboardingData.scenes?.[`photo${slot}Url`] ? 'Replace' : 'Upload'}
                            </button>
                            {onboardingData.scenes?.[`photo${slot}Url`] ? (
                              <button
                                type="button"
                                onClick={() => removeOnboardingPhoto(slot)}
                                className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/70 hover:text-white"
                              >
                                Remove
                              </button>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-white/55">
                      Add up to {MAX_TEMPLATE_PHOTOS} memories. You can also skip and upload later.
                    </p>
                    {uploadError ? (
                      <p className="text-xs text-rose-300 font-medium">{uploadError}</p>
                    ) : null}
                  </div>
                )}
                {currentOnboardingStep?.kind === 'music' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-white/15 bg-white/5">
                      <div>
                        <p className="text-sm font-bold text-white">Background music</p>
                        <p className="text-xs text-white/60">Play music when the page opens</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={onboardingData.musicEnabled}
                          onChange={(e) => updateOnboardingValue('musicEnabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-white/25 rounded-full peer peer-checked:bg-[#f06ea9] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all" />
                      </label>
                    </div>

                    <div className={`${onboardingData.musicEnabled ? 'opacity-100' : 'opacity-60'} ${simplifyMobileVisuals ? '' : 'transition-opacity'}`}>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f8b6d2] mb-2.5">Pick a track</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {ONBOARDING_MUSIC_OPTIONS.map((track) => {
                          const isActive = onboardingData.musicEnabled && String(onboardingData.musicUrl || '').trim() === track.url;
                          const isPreviewing = previewTrackId === track.id;
                          return (
                            <div
                              key={track.id}
                              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                                isActive
                                  ? 'border-[#f6a8c9] bg-[#f6a8c9]/18 text-white shadow-lg'
                                  : 'border-white/15 bg-white/5 text-white/80 hover:border-[#f6a8c9]/65'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  updateOnboardingValue('musicEnabled', true);
                                  updateOnboardingValue('musicUrl', track.url);
                                }}
                                className="min-w-0 flex-1 text-left"
                              >
                                <span className="block text-sm font-bold">{track.title}</span>
                                <span className="text-[11px] text-white/65">{track.note}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreviewTrackId(isPreviewing ? '' : track.id)}
                                className={`shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full border ${
                                  isPreviewing
                                    ? 'border-[#f6a8c9] bg-[#f6a8c9] text-[#121827]'
                                    : 'border-white/20 bg-white/10 text-white hover:border-[#f6a8c9]/70'
                                }`}
                                aria-label={isPreviewing ? `Stop preview ${track.title}` : `Preview ${track.title}`}
                                title={isPreviewing ? 'Stop preview' : 'Preview song'}
                              >
                                {isPreviewing ? <Square size={14} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {previewTrack && previewVideoId && (
                        <div className="mt-3 overflow-hidden rounded-2xl border border-white/15 bg-black/25">
                          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2">
                            <p className="truncate text-xs font-bold text-white/80">Previewing {previewTrack.title}</p>
                            <button
                              type="button"
                              onClick={() => setPreviewTrackId('')}
                              className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#f8b6d2]"
                            >
                              Stop
                            </button>
                          </div>
                          <iframe
                            key={previewTrack.id}
                            src={`https://www.youtube.com/embed/${previewVideoId}?autoplay=1&controls=1&rel=0`}
                            title={`${previewTrack.title} preview`}
                            allow="autoplay; encrypted-media"
                            className="h-[96px] w-full border-0"
                          />
                        </div>
                      )}

                      <label className="text-xs font-bold uppercase tracking-[0.2em] text-[#f8b6d2]">YouTube URL (optional)</label>
                      <input
                        value={onboardingData.musicUrl}
                        onChange={(e) => updateOnboardingValue('musicUrl', e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="mt-2 w-full max-w-2xl px-4 py-4 rounded-2xl border border-white/15 bg-white/5 text-white text-base placeholder:text-white/45 focus:outline-none focus:border-[#f6a8c9]"
                        disabled={!onboardingData.musicEnabled}
                      />
                      <p className="mt-2 text-xs text-white/45">
                        {onboardingData.musicEnabled
                          ? 'Leave empty to use the default romantic track.'
                          : 'Turn music on if you want a soundtrack.'}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={goToPreviousOnboardingStep}
                disabled={onboardingStep === 0}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white/80 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={16} /> Back
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowQuickStart(false);
                    trackEvent('quick_personalize_skipped', { templateId: activeTemplateId });
                  }}
                  className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white/70 hover:bg-white/5"
                >
                  Skip and edit manually
                </button>
                <button
                  type="button"
                  onClick={goToNextOnboardingStep}
                  disabled={!isCurrentStepValid}
                  className="btn-primary px-6 py-3 text-sm font-bold disabled:opacity-55 disabled:cursor-not-allowed"
                >
                  {isLastStep ? 'Create my page →' : 'Next →'}
                </button>
              </div>
            </div>
          </motion.div>

          {isLastStep ? (
            <motion.div
              initial={{ opacity: 0, y: 24, rotate: 1 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: 0.1 }}
              className="hidden xl:flex rounded-[36px] border border-white/12 bg-[#0f1422]/90 p-5 shadow-[0_30px_90px_rgba(6,10,28,0.6)] flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs uppercase tracking-[0.24em] font-bold text-[#f5bad3]">Live preview</p>
                <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white/60">Mobile</span>
              </div>
              <div className="relative mx-auto w-[280px] h-[590px] rounded-[40px] border border-[#5f4d78]/55 bg-[linear-gradient(180deg,#131a2d_0%,#101827_100%)] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[38%] h-1.5 rounded-full bg-white/20" />
                <div className="h-full rounded-[30px] overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_25%_20%,rgba(246,168,201,0.26),transparent_36%),#131a2c] flex flex-col">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#f8b6d2] font-bold truncate">{templateConfig.title}</p>
                    <p className="text-[13px] text-white/90 font-semibold truncate">For {previewRecipient}</p>
                  </div>
                  <div className="flex-1 px-3 pt-3">
                    <div className="rounded-2xl border border-white/10 overflow-hidden">
                      <TemplateMiniDemo templateId={activeTemplateId} reduceMotion={simplifyMobileVisuals} />
                    </div>
                  </div>
                  <div className="px-4 py-4">
                    <h3 className="text-sm font-display text-white mb-1 line-clamp-2">{previewHeadline}</h3>
                    <p className="text-xs leading-5 text-white/70 line-clamp-4 whitespace-pre-line">{previewBody}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen md:h-auto min-h-screen flex flex-col bg-white overflow-hidden overflow-x-hidden md:overflow-visible">
      {/* Top Bar */}
      <div className="min-h-16 md:h-16 flex flex-wrap md:flex-nowrap items-start sm:items-center justify-between px-2.5 sm:px-3 md:px-6 py-2 md:py-0 border-b border-card shrink-0 bg-white sticky top-0 z-30 gap-2">
        <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
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
        <div className="flex items-center w-full sm:w-auto flex-wrap justify-end gap-1.5 md:gap-2 shrink-0">
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
                {saveErrorMessage || 'Save failed'}
              </motion.span>
            )}
          </AnimatePresence>

          <button onClick={handleSaveNow} className="flex items-center gap-1 md:gap-2 btn-outline py-2 px-2 sm:px-2.5 md:px-4 text-xs md:text-sm border shrink-0">
            <Save size={15} /> <span className="hidden sm:inline">Save</span>
          </button>
          <button onClick={handlePreviewPublish}
            className="flex items-center gap-1 md:gap-2 bg-amber-500 text-white px-2.5 sm:px-3 md:px-5 py-2 rounded-pill font-bold text-xs md:text-sm hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 btn-shimmer shrink-0">
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

      <div className="flex-grow flex flex-col md:flex-row overflow-hidden md:overflow-visible">
        {/* Left Panel */}
        <div className={`${showEditorPanel ? 'flex' : 'hidden'} md:flex w-full md:w-[400px] md:shrink-0 md:min-h-[calc(100vh-4rem)] border-r border-card flex-col bg-white overflow-hidden md:overflow-visible`}>
          <div className="flex border-b border-card shrink-0">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center py-3 gap-1 transition-all relative ${
                  currentTab === tab.id ? 'text-primary-pink font-bold' : 'text-secondary hover:text-dark'
                }`}>
                {tab.icon}
                <span className="text-[10px] uppercase tracking-wider">{tab.id}</span>
                {currentTab === tab.id && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-pink" />
                )}
              </button>
            ))}
          </div>

          <div className="flex-grow overflow-y-auto md:overflow-visible p-4 sm:p-6 space-y-5">
            <AnimatePresence mode="wait">

              {/* TEXT TAB */}
              {currentTab === 'Text' && (
                <motion.div key="text" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }} className="space-y-4">

                  {orderedSections.map((sectionName) => (
                    <div key={sectionName} className="space-y-3 rounded-2xl border border-card bg-white p-4">
                      <p className="text-[10px] font-black text-secondary uppercase tracking-[0.18em]">{sectionName}</p>
                      {groupedFields[sectionName].map((field) => (
                        <div key={field.key} className="space-y-1.5">
                          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <label className="text-xs font-bold text-secondary uppercase tracking-wider leading-tight">{field.label}</label>
                            {field.type !== 'select' ? (
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
                            ) : null}
                          </div>
                          {field.type === 'textarea' ? (
                            <textarea
                              value={formData.scenes[field.key] || ''}
                              onChange={(e) => handleSceneInput(field.key, e.target.value)}
                              placeholder={field.placeholder}
                              rows={/letter|final|script/i.test(field.key) ? 10 : 6}
                              className="w-full px-4 py-2 border border-card rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-pink/20 focus:border-primary-pink transition-all resize-y overflow-y-auto text-sm min-h-[120px] max-h-[420px]"
                            />
                          ) : field.type === 'select' ? (
                            <select
                              value={formData.scenes[field.key] || field.options?.[0]?.value || ''}
                              onChange={(e) => handleSceneInput(field.key, e.target.value)}
                              className="w-full px-4 py-2 border border-card rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-pink/20 focus:border-primary-pink transition-all text-sm bg-white"
                            >
                              {(field.options || []).map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              value={formData.scenes[field.key] || ''}
                              onChange={(e) => handleSceneInput(field.key, e.target.value)}
                              placeholder={field.placeholder}
                              className="w-full px-4 py-2 border border-card rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-pink/20 focus:border-primary-pink transition-all text-sm"
                            />
                          )}
                          <div className="flex items-center justify-between">
                            {aiErrorByField[field.key] ? (
                              <p className="text-[11px] text-red-500 font-medium">{aiErrorByField[field.key]}</p>
                            ) : <span />}
                            {field.type !== 'select' ? (
                              <span className="text-[10px] text-secondary">{String(formData.scenes[field.key] || '').length} chars</span>
                            ) : (
                              <span className="text-[10px] text-secondary">Selection saved</span>
                            )}
                          </div>
                        </div>
                      ))}
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
              {currentTab === 'Images' && (
                <motion.div key="images" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-secondary">Photos</p>
                    <p className="text-[11px] text-secondary">
                      {photoSlots.filter((slot) => String(formData.scenes?.[`photo${slot}Url`] || '').trim()).length}
                      {' / '}
                      {MAX_TEMPLATE_PHOTOS}
                    </p>
                  </div>
                  {photoSlots.map(i => (
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
              {currentTab === 'Music' && (
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
              {currentTab === 'Settings' && (
                <motion.div key="settings" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }} className="space-y-6">
                  <div className="space-y-4 rounded-2xl border border-card p-4 bg-white">
                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs font-bold text-secondary uppercase tracking-wider">Names & Signature</p>
                      <div className="flex flex-wrap items-center gap-2">
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
        <div className={`${showPreviewPanel ? 'flex' : 'hidden'} md:flex flex-grow bg-slate-100 flex-col overflow-hidden w-full md:sticky md:top-16 md:h-[calc(100vh-4rem)]`}>
          <div className="h-12 border-b border-card bg-white shrink-0 flex items-center justify-between px-6">
            <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest">
              <Eye size={16} className="text-primary-pink" /> Live Preview
            </div>
          </div>

          <div className="flex-grow overflow-hidden p-0 md:p-2">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full h-full max-w-full rounded-none md:rounded-[16px] border-0 md:border border-card shadow-none md:shadow-xl bg-white overflow-hidden relative">
                <div className="builder-real-preview absolute inset-0 bg-white overflow-hidden">
                <TemplateRenderer
                  pageData={{
                    templateId: activeTemplateId,
                    templateVersion: formData.templateVersion,
                    recipientName: formData.recipientName,
                    senderName: formData.senderName,
                    scenes: formData.scenes || {},
                    reasons: formData.reasons || [],
                    palette: formData.palette || 'pink',
                    font: formData.font || 'playful',
                    showSenderName: formData.showSenderName ?? true,
                    showFooter: formData.showFooter ?? true,
                    musicUrl: formData.musicUrl || DEFAULT_LOVE_MUSIC_URL,
                  }}
                  musicEnabled
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
