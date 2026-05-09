import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Loader2, AlertCircle, Globe2, QrCode, Infinity, LockKeyhole } from 'lucide-react';
import HeartParticles from '../components/HeartParticles';
import { db, functions } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import { trackEvent } from '../utils/analytics';

const normalizeText = (value) => String(value || '').replace(/\s+/g, ' ').trim();

const pickLetterPreviewText = (draftData) => {
  const scenes = draftData?.scenes || {};
  const candidates = [
    scenes.scene2Header,
    scenes.letterText,
    scenes.homeTitle,
    scenes.finalLetter,
    scenes.scene1Text,
    scenes.scene1Header,
    scenes.scene2Text,
    scenes.confession1Text,
    scenes.questionSubtitle,
    'My love, this little note is just the beginning of something beautiful...',
  ];
  return candidates.map(normalizeText).find(Boolean) || 'My love, this little note is just the beginning of something beautiful...';
};

const FullscreenPreview = () => {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const { user } = useAuth();
  const [discountCode, setDiscountCode] = useState('');
  const [previewState, setPreviewState] = useState('closed'); // closed | opening | opened
  const [showCheckoutDetails, setShowCheckoutDetails] = useState(false);
  const openTimerRef = useRef(null);

  const normalizedCode = discountCode.trim().toLowerCase();
  const hasValidDiscount = normalizedCode === 'love123';
  const displayPrice = hasValidDiscount ? '$6' : '$12';
  const isEnvelopeClosed = previewState === 'closed';
  const isEnvelopeOpening = previewState === 'opening';
  const isEnvelopeOpened = previewState === 'opened';
  const letterPreviewText = useMemo(() => pickLetterPreviewText(pageData), [pageData]);

  useEffect(() => {
    if (!draftId) { navigate('/templates'); return; }
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'pages', draftId));
        if (!snap.exists()) { navigate('/templates'); return; }
        const data = snap.data();
        if (data.status === 'active') {
          navigate(`/p/${draftId}`);
          return;
        }
        setPageData(data);
        trackEvent('preview_opened', { templateId: data.templateId, draftId });
      } catch (err) {
        console.error(err);
        setError('Failed to load preview. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [draftId, navigate]);

  useEffect(() => () => {
    if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
  }, []);

  const handleEnvelopeOpen = () => {
    if (!isEnvelopeClosed) return;
    setPreviewState('opening');
    openTimerRef.current = window.setTimeout(() => {
      setPreviewState('opened');
    }, 560);
  };

  const handlePublish = async () => {
    trackEvent('publish_clicked', { draftId, templateId: pageData?.templateId, checkoutDetailsVisible: showCheckoutDetails });
    if (!user) {
      setError('Please sign in or create an account before payment.');
      setAuthOpen(true);
      return;
    }
    if (!showCheckoutDetails) {
      setError(null);
      setShowCheckoutDetails(true);
      return;
    }
    setPublishing(true);
    setError(null);
    try {
      const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');
      const result = await createCheckoutSession({ draftId, discountCode: normalizedCode });
      trackEvent('checkout_started', { draftId, templateId: pageData?.templateId, discountApplied: hasValidDiscount });
      window.location.href = result.data.url;
    } catch (err) {
      console.error(err);
      setError('Payment setup failed. Please try again.');
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FFD1DC]">
        <Loader2 className="text-primary-pink animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="h-screen bg-white relative flex flex-col overflow-hidden">
      <HeartParticles />

      {/* Back Button */}
      <Link
        to={pageData ? `/create/${pageData.templateId}?draft=${draftId}` : '/templates'}
        className="absolute top-6 left-6 z-[60] w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-dark hover:text-primary-pink transition-colors shadow-lg border border-white/50 group"
      >
        <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
      </Link>

      {/* DRAFT badge */}
      <div className="absolute top-6 right-6 z-[60] bg-dark/70 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-sm">
        PREVIEW
      </div>

      {/* Template Preview */}
      <div className="flex-grow flex flex-col items-center justify-center text-center p-6 bg-[radial-gradient(circle_at_20%_12%,#ffe9ef_0%,#ffd9e4_42%,#f7bfd0_100%)] pb-56 md:pb-52">
        <motion.div
          initial={{ scale: 0.84, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="relative mb-14 w-[320px] h-[292px] sm:w-[360px] sm:h-[328px]"
        >
          {/* Rising letter */}
          <motion.div
            animate={isEnvelopeOpened
              ? { y: -130, rotate: -1.8, scale: 1 }
              : isEnvelopeOpening
                ? { y: [8, -148, -130], rotate: [0, -4, -1.8], scale: [0.97, 1.02, 1] }
                : { y: 8, rotate: 0, scale: 0.97 }}
            transition={isEnvelopeOpening
              ? { duration: 0.72, ease: ['easeOut', 'easeOut', 'easeInOut'], times: [0, 0.74, 1] }
              : { type: 'spring', stiffness: 170, damping: 18 }}
            className="absolute left-1/2 bottom-[84px] -translate-x-1/2 w-[250px] sm:w-[280px] h-[174px] sm:h-[198px] rounded-[12px] border border-[#d2b985] overflow-hidden z-10 shadow-[0_18px_36px_rgba(99,67,30,0.22)]"
            style={{
              backgroundColor: '#f2dfb8',
              backgroundImage: 'radial-gradient(circle at 14% 16%, rgba(140,104,60,0.20), transparent 38%), radial-gradient(circle at 88% 82%, rgba(127,87,45,0.17), transparent 34%), repeating-linear-gradient(180deg, rgba(111,77,38,0.04), rgba(111,77,38,0.04) 1px, transparent 1px, transparent 22px), radial-gradient(circle at 48% -30%, rgba(255,255,255,0.65), rgba(255,255,255,0) 70%)',
            }}
          >
            <div className="absolute inset-0 opacity-50 pointer-events-none" style={{ background: 'linear-gradient(128deg, rgba(255,255,255,0.68), transparent 46%)' }} />
            <div className="absolute inset-[8px] rounded-[8px] border border-[#d9be8e]/70 pointer-events-none" />
            <p className="relative h-full px-6 py-5 sm:px-7 sm:py-6 text-left text-[#5a3c20] text-sm sm:text-base leading-[1.7] tracking-[0.01em] font-medium font-playfair overflow-hidden">
              {letterPreviewText}
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-9 bg-gradient-to-t from-[#ead3a3] to-transparent pointer-events-none" />
          </motion.div>

          {/* Envelope */}
          <button
            type="button"
            onClick={handleEnvelopeOpen}
            disabled={!isEnvelopeClosed}
            className={`absolute inset-0 group ${isEnvelopeClosed ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[300px] sm:w-[336px] h-[196px] sm:h-[216px]">
              <div className="absolute inset-0 rounded-[18px] bg-gradient-to-b from-[#ffe9f0] via-[#ffd1de] to-[#ef9fb6] border border-[#e8a6bb] shadow-[0_24px_44px_rgba(197,71,115,0.28)]" />
              <div className="absolute inset-x-0 bottom-0 h-[124px] sm:h-[136px] bg-gradient-to-r from-[#f4c0cf] via-[#f8d2dd] to-[#f2b9ca] [clip-path:polygon(0_0,50%_85%,100%_0,100%_100%,0_100%)] rounded-b-[18px]" />
              <div className="absolute inset-x-[12px] bottom-[10px] h-[1px] bg-white/45" />

              <motion.div
                animate={isEnvelopeOpened || isEnvelopeOpening ? { rotateX: -182, y: -4 } : { rotateX: 0, y: 0 }}
                transition={{ duration: 0.54, ease: [0.2, 0.75, 0.22, 1] }}
                className="absolute left-0 right-0 top-0 h-[118px] sm:h-[132px] origin-top [transform-style:preserve-3d] [perspective:1200px]"
              >
                <div className="w-full h-full bg-gradient-to-b from-[#ffe3ec] to-[#f6bbcd] border-x border-t border-[#e9acc0] [clip-path:polygon(0_0,100%_0,50%_100%)] rounded-t-[16px]" />
              </motion.div>

              <AnimatePresence>
                {isEnvelopeClosed && (
                  <motion.div
                    initial={{ scale: 0.68, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.35, opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 top-[76px] sm:top-[84px] -translate-x-1/2 z-20 w-14 h-14 rounded-full bg-gradient-to-br from-[#f34f80] to-[#dc305f] text-white border-4 border-white shadow-xl flex items-center justify-center text-xl"
                  >
                    ❤️
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </button>

          <span className="absolute -top-10 -left-10 text-5xl">🌸</span>
          <span className="absolute -top-10 -right-10 text-5xl">🎀</span>
          <span className="absolute -bottom-10 -left-10 text-5xl">🎈</span>
        </motion.div>

        <h2 className="font-dancing text-3xl text-primary-pink">
          {isEnvelopeOpened ? 'Your message is unfolding beautifully ✨' : (pageData?.scenes?.hint || 'Tap the wax seal to open ♥')}
        </h2>
        {pageData?.recipientName && (
          <p className="text-primary-pink/70 mt-2 font-medium">For {pageData.recipientName}</p>
        )}

        {/* Draft watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden rotate-[-30deg]">
          <div className="whitespace-nowrap text-black/5 text-[120px] font-black uppercase tracking-[2rem]">
            DRAFT DRAFT
          </div>
        </div>
      </div>

      {/* Payment Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {error && (
          <div className="bg-red-50 border-t border-red-200 px-6 py-2 flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        {/* Trust Strip */}
        <div className="bg-[#fff8eb]/95 backdrop-blur-md border-t border-[#e8dcc6] py-3 px-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-[10px] font-bold text-[#7a6553] uppercase tracking-widest">
          <div className="flex items-center gap-1.5"><Globe2 size={14} className="text-[#d0792f]" /> Live Link</div>
          <div className="flex items-center gap-1.5"><QrCode size={14} className="text-[#d0792f]" /> QR Code</div>
          <div className="flex items-center gap-1.5"><Infinity size={14} className="text-[#d0792f]" /> Forever Hosting</div>
          <div className="flex items-center gap-1.5"><LockKeyhole size={14} className="text-[#d0792f]" /> Secure Payment</div>
        </div>
        {/* Action Bar */}
        <div className="min-h-24 bg-[#fffdf8] border-t border-[#eadfca] shadow-[0_-8px_30px_rgba(89,62,27,0.12)] px-6 md:px-12 py-4 flex items-center justify-between gap-4">
          <div className="max-w-[360px]">
            {showCheckoutDetails ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <input
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Discount code"
                    className="w-40 px-3 py-1.5 text-xs border border-[#dfd0b5] rounded-lg focus:outline-none focus:border-[#c9853e] uppercase bg-white"
                  />
                  {hasValidDiscount && (
                    <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">
                      LOVE123 applied
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#4f341d]">{displayPrice}</span>
                  <span className="text-[#876f5a] text-sm font-bold">one-time</span>
                </div>
	                <p className="text-[10px] font-bold text-[#bf6d2f] uppercase tracking-widest mt-0.5">Includes live link, heart QR code, forever hosting, and share tools</p>
              </>
            ) : (
              <>
	                <p className="text-sm font-bold text-[#4f341d]">Ready to make it live?</p>
	                <p className="text-xs text-[#876f5a]">First click shows price and discount box. Second click starts secure checkout.</p>
              </>
            )}
          </div>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="btn-primary btn-shimmer py-4 px-8 text-lg font-bold flex items-center gap-2 uppercase tracking-wide disabled:opacity-70"
          >
            {publishing ? (
              <><Loader2 size={20} className="animate-spin" /> Processing...</>
            ) : (
              !user
                ? 'Sign In To Continue →'
                : showCheckoutDetails
                  ? 'Continue To Payment →'
                  : 'Publish & Share Page →'
            )}
          </button>
        </div>
      </div>
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode="signin"
        title="Sign in before payment"
      />
    </div>
  );
};

export default FullscreenPreview;
