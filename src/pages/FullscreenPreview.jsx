import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Globe2,
  QrCode,
  Infinity as InfinityIcon,
  LockKeyhole,
  X,
  Heart,
  CheckCircle2,
  Wallet,
} from 'lucide-react';
import { db, functions } from '../firebase';
import { deleteField, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import TemplateRenderer from '../components/TemplateRenderer';
import { trackEvent } from '../utils/analytics';
import { DEFAULT_TEMPLATE_ID, getTemplateConfig, getTemplatePriceCents } from '../templates/registry';
import { buildTemplatePayload } from '../utils/pagePayload';
import { captureAppError } from '../utils/monitoring';

const FullscreenPreview = () => {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  const testPublishEnabled = String(import.meta.env.VITE_ENABLE_TEST_PUBLISH || '').trim().toLowerCase() === 'true';
  const allowUnsafeClientPublishFallback = String(import.meta.env.VITE_UNSAFE_LOCAL_TEST_PUBLISH || '').trim().toLowerCase() === 'true';
  const templateId = pageData?.templateId || DEFAULT_TEMPLATE_ID;
  const payload = buildTemplatePayload(pageData || {});
  const templateTitle = getTemplateConfig(templateId).title;
  const giftRecipientName = pageData ? (String(payload.recipientName || '').trim() || 'you') : 'you';
  const priceCents = getTemplatePriceCents(templateId);
  const displayPrice = `$${(priceCents / 100).toFixed(2)}`;

  useEffect(() => {
    if (!draftId) {
      navigate('/templates');
      return;
    }

    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'pages', draftId));
        if (!snap.exists()) {
          navigate('/templates');
          return;
        }

        const data = snap.data();
        if (data.status === 'active') {
          navigate(`/p/${draftId}`);
          return;
        }

        setPageData(data);
        trackEvent('preview_opened', { templateId: data.templateId, draftId });
      } catch (err) {
        captureAppError(err, { scope: 'preview.load', draftId });
        setError('Failed to load preview. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [draftId, navigate]);

  const openPublishModal = () => {
    trackEvent('publish_clicked', { draftId, templateId: pageData?.templateId });

    if (!user) {
      setError('Please sign in or create an account before publishing.');
      setAuthOpen(true);
      return;
    }

    setError(null);
    setPublishModalOpen(true);
  };

  const startPaidCheckout = async () => {
    setPublishing(true);
    setError(null);

    try {
      const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');
      const response = await createCheckoutSession({ draftId });
      const checkoutUrl = String(response?.data?.url || '');

      if (!checkoutUrl) {
        throw new Error('Checkout URL missing');
      }

      trackEvent('checkout_started', { draftId, templateId: pageData?.templateId });
      window.location.assign(checkoutUrl);
    } catch (err) {
      captureAppError(err, { scope: 'preview.checkout', draftId, templateId: pageData?.templateId });
      setError('Could not start secure payment right now. Please try again.');
      trackEvent('checkout_start_failed', {
        draftId,
        templateId: pageData?.templateId,
        code: String(err?.code || ''),
      });
      setPublishing(false);
    }
  };

  const publishWithoutPayment = async (method = 'instant') => {
    if (!testPublishEnabled) {
      setError('Test publish is disabled in this environment.');
      return;
    }

    setPublishing(true);
    setError(null);

    try {
      const publishForTest = httpsCallable(functions, 'publishForTest');
      await publishForTest({ draftId, method });
      trackEvent('publish_skipped_payment', { draftId, templateId: pageData?.templateId, method });
      setPublishModalOpen(false);
      navigate(`/success?draft=${draftId}&test=1&method=${method}`);
    } catch (err) {
      captureAppError(err, { scope: 'preview.testPublish', draftId, method });

      if (allowUnsafeClientPublishFallback && user?.uid) {
        try {
          await updateDoc(doc(db, 'pages', draftId), {
            status: 'active',
            stripeSessionId: `test-skip-${method}`,
            publishedAt: serverTimestamp(),
            expiresAt: null,
            checkoutOwnerUid: user.uid,
            checkoutStartedAt: serverTimestamp(),
            ownerEmail: deleteField(),
            checkoutOwnerEmail: deleteField(),
          });
          trackEvent('publish_skipped_payment_client_fallback', {
            draftId,
            templateId: pageData?.templateId,
            method,
          });
          setPublishModalOpen(false);
          navigate(`/success?draft=${draftId}&test=1&method=${method}`);
          return;
        } catch (fallbackErr) {
          captureAppError(fallbackErr, { scope: 'preview.testPublish.fallback', draftId, method });
        }
      }

      setError('Could not publish right now. Please try again.');
      trackEvent('publish_skipped_payment_failed', {
        draftId,
        templateId: pageData?.templateId,
        method,
        code: String(err?.code || ''),
      });
    } finally {
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
      <Link
        to={pageData ? `/create/${pageData.templateId}?draft=${draftId}` : '/templates'}
        className="absolute top-6 left-6 z-[60] h-11 pl-3 pr-4 bg-white/85 backdrop-blur-md rounded-full flex items-center justify-center gap-2 text-dark hover:text-primary-pink transition-colors shadow-lg border border-white/60 group text-sm font-bold"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
        Back
      </Link>

      <div className="absolute top-6 right-6 z-[60] bg-dark/70 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-sm">
        PREVIEW
      </div>
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
        <div className="rounded-full bg-black/60 backdrop-blur-md border border-white/30 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
          Special Gift Just For {giftRecipientName}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto pb-56 md:pb-52">
        <TemplateRenderer pageData={pageData} musicEnabled />
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden rotate-[-30deg]">
          <div className="whitespace-nowrap text-black/5 text-[120px] font-black uppercase tracking-[2rem]">
            DRAFT DRAFT
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        {error && (
          <div className="bg-red-50 border-t border-red-200 px-6 py-2 flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div className="bg-[#fff8eb]/95 backdrop-blur-md border-t border-[#e8dcc6] py-3 px-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-[10px] font-bold text-[#7a6553] uppercase tracking-widest">
          <div className="flex items-center gap-1.5"><Globe2 size={14} className="text-[#d0792f]" /> Live Link</div>
          <div className="flex items-center gap-1.5"><QrCode size={14} className="text-[#d0792f]" /> QR Code</div>
          <div className="flex items-center gap-1.5"><InfinityIcon size={14} className="text-[#d0792f]" /> Forever Hosting</div>
          <div className="flex items-center gap-1.5"><LockKeyhole size={14} className="text-[#d0792f]" /> Secure Payment</div>
        </div>

        <div className="min-h-24 bg-[#fffdf8] border-t border-[#eadfca] shadow-[0_-8px_30px_rgba(89,62,27,0.12)] px-6 md:px-12 py-4 flex items-center justify-between gap-4">
          <div className="max-w-[360px]">
            <p className="text-sm font-bold text-[#4f341d]">Ready to finish your gift?</p>
            <p className="text-xs text-[#876f5a]">
              {testPublishEnabled
                ? 'Open the publish card to test now or continue to secure payment.'
                : 'Open the publish card to continue to secure payment and go live.'}
            </p>
          </div>
          <button
            onClick={openPublishModal}
            disabled={publishing}
            className="btn-primary btn-shimmer py-4 px-8 text-lg font-bold flex items-center gap-2 uppercase tracking-wide disabled:opacity-70"
          >
            {publishing ? (
              <><Loader2 size={20} className="animate-spin" /> Working...</>
            ) : (
              !user
                ? 'Sign In To Continue →'
                : 'Finish & Publish →'
            )}
          </button>
        </div>
      </div>

      {publishModalOpen && (
        <div className="fixed inset-0 z-[80] bg-black/55 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="w-full max-w-[560px] rounded-[30px] bg-white shadow-[0_28px_80px_rgba(20,10,35,0.45)] border border-[#f1e7eb] p-5 md:p-7 relative">
            <button
              type="button"
              onClick={() => setPublishModalOpen(false)}
              className="absolute right-4 top-4 text-[#9ca3af] hover:text-[#4b5563] transition-colors"
            >
              <X size={28} />
            </button>

            <div className="mx-auto w-20 h-20 rounded-full bg-[#f8e9f0] border border-[#f1d1df] flex items-center justify-center mb-4">
              <Heart size={36} className="text-[#e86a8a]" fill="currentColor" />
            </div>
            <h2 className="text-center text-[2.3rem] md:text-[2.6rem] font-playfair font-bold text-[#131a2f] leading-[0.95] mb-2">Publish Your Gift</h2>
            <p className="text-center text-[#6b7280] text-[1rem] md:text-[1.1rem] mb-4">Unlock your custom "{templateTitle}"</p>

            <div className="rounded-3xl border border-[#f0dbe4] bg-[#fbf3f7] p-4 md:p-5 mb-4">
              <p className="text-[1.45rem] md:text-[1.6rem] font-playfair font-bold text-[#20283a] mb-2.5">What you get forever:</p>
              <div className="space-y-2 text-[#4b5563] text-[0.95rem] md:text-[1.04rem]">
                {[
                  'Instant Shareable Link & QR Code',
                  'Lifetime Unlimited Hosting',
                  'Remove All Draft Watermarks',
                  'Edit Content Anytime',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 size={20} className="text-[#5abf89] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[#e7e7ea] bg-[#f9f9fb] px-4 md:px-5 py-3.5 md:py-4 mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#9ca3af]">One-time payment</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[2.2rem] md:text-[2.4rem] leading-none font-black text-[#111827]">{displayPrice}</span>
                  <span className="text-[1.4rem] text-[#9ca3af] line-through">$12.00</span>
                  <span className="text-[0.9rem] font-bold text-[#e3627f] bg-[#ffe3ea] px-2 py-0.5 rounded-full">Save 33%</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-full bg-[#e6f7ee] flex items-center justify-center">
                <LockKeyhole size={24} className="text-[#5abf89]" />
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={startPaidCheckout}
                disabled={publishing}
                className="w-full rounded-full bg-gradient-to-r from-[#ea6f90] to-[#d84f74] text-white text-[1.08rem] md:text-[1.16rem] font-bold py-3.5 shadow-[0_10px_26px_rgba(234,111,144,0.35)] disabled:opacity-70 flex items-center justify-center gap-2"
              >
                <Wallet size={20} />
                {publishing ? 'Preparing checkout...' : 'Instant Payment (Secure)'}
              </button>

              {testPublishEnabled ? (
                <div className="rounded-2xl border border-[#e5d7de] bg-[#fbf7fa] p-3 space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#9ca3af]">Developer test mode</p>
                  <button
                    type="button"
                    onClick={() => publishWithoutPayment('instant')}
                    disabled={publishing}
                    className="w-full rounded-full bg-[#081538] text-white text-sm font-bold py-2.5 shadow-[0_8px_20px_rgba(8,21,56,0.25)] disabled:opacity-70"
                  >
                    {publishing ? 'Publishing...' : 'Instant Publish (Test)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => publishWithoutPayment('local')}
                    disabled={publishing}
                    className="w-full rounded-full bg-[#2f1747] text-white text-sm font-bold py-2.5 shadow-[0_8px_20px_rgba(47,23,71,0.25)] disabled:opacity-70"
                  >
                    {publishing ? 'Publishing...' : 'Local Publish (Test)'}
                  </button>
                </div>
              ) : null}
            </div>

            <p className="text-center text-[#9ca3af] text-[11px] mt-3.5">Payments are secure and encrypted</p>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode="signin"
        title="Sign in before publishing"
      />
    </div>
  );
};

export default FullscreenPreview;
