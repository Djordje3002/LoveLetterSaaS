import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, Globe2, QrCode, Infinity, LockKeyhole } from 'lucide-react';
import { db, functions } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
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

const TEMPLATES = {
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
  const [showCheckoutDetails, setShowCheckoutDetails] = useState(false);

  const normalizedCode = discountCode.trim().toLowerCase();
  const hasValidDiscount = normalizedCode === 'love123';
  const displayPrice = hasValidDiscount ? '$6' : '$12';
  const TemplateComponent = pageData ? TEMPLATES[pageData.templateId] : null;
  const giftRecipientName = pageData ? (String(pageData.recipientName || '').trim() || 'you') : 'you';

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

  if (!TemplateComponent) {
    return (
      <div className="h-screen flex items-center justify-center bg-primary-light p-6 text-center">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-3">Unknown template</h1>
          <p className="text-secondary mb-6">This draft uses a template that is not available in the app.</p>
          <Link to="/templates" className="btn-primary">Back to templates</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white relative flex flex-col overflow-hidden">
      {/* Back Button */}
      <Link
        to={pageData ? `/create/${pageData.templateId}?draft=${draftId}` : '/templates'}
        className="absolute top-6 left-6 z-[60] h-11 pl-3 pr-4 bg-white/85 backdrop-blur-md rounded-full flex items-center justify-center gap-2 text-dark hover:text-primary-pink transition-colors shadow-lg border border-white/60 group text-sm font-bold"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
        Back
      </Link>

      {/* DRAFT badge */}
      <div className="absolute top-6 right-6 z-[60] bg-dark/70 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-sm">
        PREVIEW
      </div>
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
        <div className="rounded-full bg-black/60 backdrop-blur-md border border-white/30 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
          Special Gift Just For {giftRecipientName}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto pb-56 md:pb-52">
        <TemplateComponent
          recipientName={pageData.recipientName}
          senderName={pageData.senderName}
          scenes={pageData.scenes || {}}
          reasons={pageData.reasons || []}
          palette={pageData.palette || 'pink'}
          font={pageData.font || 'playful'}
          showSenderName={pageData.showSenderName ?? true}
          showFooter={pageData.showFooter ?? true}
          musicEnabled
          musicUrl={pageData.musicUrl || DEFAULT_LOVE_MUSIC_URL}
        />
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
