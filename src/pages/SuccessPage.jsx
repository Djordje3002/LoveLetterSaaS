import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Copy, Check, Plus, Loader2, AlertCircle, Download, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { db, functions } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import DecorativeHeartQr from '../components/DecorativeHeartQr';
import { trackEvent } from '../utils/analytics';
import { getAppUrl } from '../utils/appUrl';
import { captureAppError } from '../utils/monitoring';

const loadImage = (src) => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = reject;
  image.src = src;
});

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

const canvasToBlob = (canvas) => new Promise((resolve, reject) => {
  canvas.toBlob((blob) => {
    if (blob) resolve(blob);
    else reject(new Error('Could not create image file.'));
  }, 'image/png');
});

const getQrSvgSource = (root) => {
  const svg = root?.querySelector('#qr-code svg');
  if (!svg) return '';

  const clone = svg.cloneNode(true);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  return new XMLSerializer().serializeToString(clone);
};

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const draftId = searchParams.get('draft');
  const testMode = searchParams.get('test') === '1';
  const testMethod = searchParams.get('method') || 'instant';

  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);

  const appUrl = getAppUrl();
  const pageUrl = `${appUrl}/p/${draftId}`;
  const shareCaption = `I made something special for you. Open this when you have a quiet minute: ${pageUrl}`;

  const copyWithFallback = async (text) => {
    if (window.isSecureContext && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn('Clipboard API unavailable, using fallback copy method.', err);
      }
    }

    try {
      const helper = document.createElement('textarea');
      helper.value = text;
      helper.setAttribute('readonly', '');
      helper.style.position = 'fixed';
      helper.style.left = '-9999px';
      document.body.appendChild(helper);
      helper.select();
      const copied = document.execCommand('copy');
      document.body.removeChild(helper);
      return copied;
    } catch (fallbackErr) {
      captureAppError(fallbackErr, { scope: 'success.copyFallback', draftId });
      return false;
    }
  };

  useEffect(() => {
    let cancelled = false;
    const setStatusSafely = (nextStatus) => {
      if (!cancelled) setStatus(nextStatus);
    };

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const waitForActivePage = async () => {
      if (!draftId) return false;
      for (let attempt = 0; attempt < 6; attempt += 1) {
        try {
          const snap = await getDoc(doc(db, 'pages', draftId));
          if (snap.exists() && snap.data()?.status === 'active') {
            return true;
          }
        } catch (err) {
          captureAppError(err, { scope: 'success.checkActive', draftId });
        }
        await wait(280 * (attempt + 1));
      }
      return false;
    };

    const verify = async () => {
      if (!draftId) {
        setStatusSafely('error');
        return;
      }

      if (testMode) {
        const isActive = await waitForActivePage();
        if (isActive) {
          setStatusSafely('success');
          trackEvent('published_test_mode', { draftId, method: testMethod });
        } else {
          setStatusSafely('error');
        }
        return;
      }

      if (!sessionId) {
        const isActive = await waitForActivePage();
        setStatusSafely(isActive ? 'success' : 'error');
        return;
      }

      try {
        const verifyPayment = httpsCallable(functions, 'verifyPayment');
        await verifyPayment({ sessionId, draftId });
        const isActive = await waitForActivePage();
        setStatusSafely(isActive ? 'success' : 'error');
        if (isActive) {
          trackEvent('paid', { draftId });
        }
      } catch (err) {
        captureAppError(err, { scope: 'success.verifyPayment', draftId, sessionId });
        const isActive = await waitForActivePage();
        setStatusSafely(isActive ? 'success' : 'error');
      }
    };

    verify();
    return () => {
      cancelled = true;
    };
  }, [sessionId, draftId, testMode, testMethod]);

  const handleCopy = async () => {
    const copiedOk = await copyWithFallback(pageUrl);
    if (!copiedOk) return;
    trackEvent('share_link_copied', { draftId });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyShareCaption = async () => {
    const copiedOk = await copyWithFallback(shareCaption);
    if (!copiedOk) return;
    trackEvent('share_caption_copied', { draftId });
  };

  const downloadQrCode = async () => {
    try {
      const blob = await createFullQrImageBlob();
      if (!blob) return;
      downloadBlob(blob, `lovepage-heart-qr-${draftId || 'gift'}.png`);
      trackEvent('qr_downloaded', { draftId, type: 'heart_image' });
    } catch (err) {
      captureAppError(err, { scope: 'success.downloadQrCode', draftId });
    }
  };

  const createFullQrImageBlob = async () => {
    const qrRoot = qrRef.current?.querySelector('#qr-code');
    const qrLayer = qrRef.current?.querySelector('#qr-code > div');
    const svgSource = getQrSvgSource(qrRef.current);
    if (!qrRoot || !qrLayer || !svgSource) return null;

    const rootRect = qrRoot.getBoundingClientRect();
    const styles = window.getComputedStyle(qrLayer);
    const qrSize = parseFloat(styles.width);
    const qrLeft = parseFloat(styles.left);
    const qrTop = parseFloat(styles.top);
    const scale = 1600 / rootRect.width;

    const [heartImage, qrImage] = await Promise.all([
      loadImage('/custom-heart-qr.png'),
      loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgSource)}`),
    ]);

    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(heartImage, 0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(qrLeft * scale, qrTop * scale);
    ctx.rotate(Math.PI / 4);
    const outputQrSize = qrSize * scale;
    ctx.drawImage(qrImage, -outputQrSize / 2, -outputQrSize / 2, outputQrSize, outputQrSize);
    ctx.restore();

    return canvasToBlob(canvas);
  };

  const sharePage = async () => {
    try {
      const shareData = {
        title: shareCaption,
        text: shareCaption,
        url: pageUrl,
      };

      if (navigator.share) {
        const blob = await createFullQrImageBlob();
        if (blob) {
          const file = new File([blob], `lovepage-heart-qr-${draftId || 'gift'}.png`, { type: 'image/png' });
          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({ ...shareData, files: [file] });
            trackEvent('native_share_clicked', { draftId, withImage: true });
            return;
          }
        }

        await navigator.share(shareData);
        trackEvent('native_share_clicked', { draftId, withImage: false });
        return;
      }

      await copyShareCaption();
    } catch (err) {
      if (err?.name !== 'AbortError') {
        captureAppError(err, { scope: 'success.sharePage', draftId });
      }
    }
  };

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-primary-light flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary-pink animate-spin" size={48} />
          <p className="font-bold text-dark">Activating your page...</p>
          <p className="text-secondary text-sm">This only takes a second</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-primary-light flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-red-500" size={40} />
          </div>
          <h1 className="text-2xl font-bold text-dark mb-3">Could not open publish result</h1>
          <p className="text-secondary mb-8">Something went wrong opening your share page. Please try again.</p>
          <div className="flex flex-col gap-3">
            {draftId && (
              <button onClick={() => navigate(`/preview/${draftId}`)}
                className="btn-primary w-full">← Try again</button>
            )}
            <Link to="/" className="text-secondary text-sm hover:text-dark">Back to home</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-light flex items-center justify-center p-6">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="max-w-xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">

        <div className="w-24 h-24 border-4 border-green-500 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-8">
          <Check size={44} className="text-green-600" strokeWidth={3} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-dark mb-3">{testMode ? '🎉 Your test page is live!' : '🎉 Your page is live!'}</h1>
        <p className="text-secondary mb-8">{testMode ? 'Published without payment for testing. Share it now.' : 'Share it and make their day unforgettable.'}</p>

        <div className="w-full h-px bg-card mb-8" />

        {/* Shareable Link */}
        <div className="text-left mb-8">
          <label className="text-xs font-bold text-secondary uppercase tracking-widest block mb-3">Your shareable link</label>
          <div className="flex gap-2">
            <div className="flex-grow bg-slate-50 border border-card px-4 py-3 rounded-xl text-primary-pink font-bold text-sm flex items-center overflow-hidden">
              <span className="truncate">{pageUrl}</span>
            </div>
            <button onClick={handleCopy}
              className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
                copied ? 'bg-green-500 text-white' : 'bg-primary-pink text-white hover:bg-primary-pink/90'
              }`}>
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* QR Code */}
        <div ref={qrRef} className="flex justify-center mb-8">
          <DecorativeHeartQr
            size={392}
            qrRatio={0.495}
            qrOffsetRatio={0.065}
            value={pageUrl}
          />
        </div>

        <div className="w-full h-px bg-card mb-8" />

        {/* Share buttons */}
        <div className="flex justify-center gap-4 mb-5">
          <button onClick={downloadQrCode}
            aria-label="Download QR code"
            className="w-12 h-12 bg-primary-pink text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <Download size={24} />
          </button>
          <button onClick={sharePage}
            aria-label="Share page"
            className="w-12 h-12 bg-primary-pink text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <Share2 size={24} />
          </button>
          <button onClick={handleCopy}
            aria-label="Copy page link"
            className="w-12 h-12 bg-primary-pink text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <Copy size={24} />
          </button>
        </div>

        <Link to="/templates" className="flex items-center justify-center gap-2 text-primary-pink font-bold hover:gap-3 transition-all">
          <Plus size={20} /> Create another page
        </Link>
        <p className="text-xs text-secondary mt-5">
          Want a fully custom page or website? <Link to="/contact" className="text-primary-pink font-bold hover:underline">Contact me.</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
