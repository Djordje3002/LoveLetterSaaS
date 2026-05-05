import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, CreditCard, ShieldCheck, Headphones, Loader2, AlertCircle } from 'lucide-react';
import HeartParticles from '../components/HeartParticles';
import { db, functions } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';

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
  const [previewOpened, setPreviewOpened] = useState(false);
  const [showCheckoutDetails, setShowCheckoutDetails] = useState(false);

  const normalizedCode = discountCode.trim().toLowerCase();
  const hasValidDiscount = normalizedCode === 'love123';
  const displayPrice = hasValidDiscount ? '$6' : '$12';

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
      } catch (err) {
        console.error(err);
        setError('Failed to load preview. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [draftId, navigate]);

  const handlePublish = async () => {
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
      <div className="flex-grow flex flex-col items-center justify-center text-center p-6 bg-[#FFD1DC] pb-48">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative mb-12"
        >
          <div
            onClick={() => setPreviewOpened((v) => !v)}
            className="w-64 h-44 bg-white rounded-2xl shadow-2xl border border-primary-light flex items-center justify-center relative transform hover:scale-105 transition-transform cursor-pointer"
          >
            {!previewOpened ? (
              <>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary-pink rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg text-2xl">
                  ❤️
                </div>
                <div className="absolute top-0 left-0 w-full h-full border-t-[80px] border-t-primary-light border-x-[128px] border-x-transparent"></div>
              </>
            ) : (
              <p className="px-6 text-center text-primary-pink font-medium">
                {pageData?.scenes?.scene2Header || 'A little preview from your letter...'}
              </p>
            )}
          </div>
          <span className="absolute -top-10 -left-10 text-5xl">🌸</span>
          <span className="absolute -top-10 -right-10 text-5xl">🎀</span>
          <span className="absolute -bottom-10 -left-10 text-5xl">🎈</span>
        </motion.div>

        <h2 className="font-dancing text-3xl text-primary-pink">
          {previewOpened ? 'Nice! Now publish to share it ✨' : (pageData?.scenes?.hint || 'Tap seal to open ♥')}
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
        <div className="bg-white/95 backdrop-blur-md border-t border-card py-3 px-6 flex justify-center gap-8 text-[10px] font-bold text-secondary uppercase tracking-widest">
          <div className="flex items-center gap-1.5"><CreditCard size={14} className="text-primary-pink" /> Secure Payment</div>
          <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-primary-pink" /> SSL Encrypted</div>
          <div className="flex items-center gap-1.5"><Headphones size={14} className="text-primary-pink" /> 24/7 Support</div>
        </div>
        {/* Action Bar */}
        <div className="min-h-24 bg-white border-t border-card shadow-[0_-8px_30px_rgba(0,0,0,0.1)] px-6 md:px-12 py-4 flex items-center justify-between gap-4">
          <div className="max-w-[360px]">
            {showCheckoutDetails ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <input
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Discount code"
                    className="w-40 px-3 py-1.5 text-xs border border-card rounded-lg focus:outline-none focus:border-primary-pink uppercase"
                  />
                  {hasValidDiscount && (
                    <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">
                      LOVE123 applied
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-dark">{displayPrice}</span>
                  <span className="text-secondary text-sm font-bold">one-time</span>
                </div>
                <p className="text-[10px] font-bold text-primary-pink uppercase tracking-widest mt-0.5">Forever live · Share anywhere</p>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-dark">Ready to make it live?</p>
                <p className="text-xs text-secondary">Click publish to reveal final checkout details and price.</p>
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
