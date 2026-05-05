import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Copy, Check, MessageCircle, Send, Plus, Download, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { db, functions } from '../firebase';
import { httpsCallable } from 'firebase/functions';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const draftId = searchParams.get('draft');

  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);

  const appUrl = import.meta.env.VITE_APP_URL || 'https://lovepage.app';
  const pageUrl = `${appUrl}/p/${draftId}`;

  useEffect(() => {
    if (!sessionId || !draftId) {
      setStatus('error');
      return;
    }
    const verify = async () => {
      try {
        const verifyPayment = httpsCallable(functions, 'verifyPayment');
        await verifyPayment({ sessionId, draftId });
        setStatus('success');
      } catch (err) {
        console.error('Verification failed:', err);
        setStatus('error');
      }
    };
    verify();
  }, [sessionId, draftId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const svgEl = document.querySelector('#qr-code svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 400, 400);
      ctx.drawImage(img, 0, 0, 400, 400);
      const a = document.createElement('a');
      a.download = 'lovepage-qr.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent('I made something special for you ♥ ' + pageUrl)}`, '_blank');
  };

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent('Something special for you ♥')}`, '_blank');
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
          <h1 className="text-2xl font-bold text-dark mb-3">Payment verification failed</h1>
          <p className="text-secondary mb-8">Something went wrong verifying your payment. If you were charged, please contact support.</p>
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

        {/* Animated checkmark */}
        <div className="w-24 h-24 border-4 border-green-500 rounded-full flex items-center justify-center mx-auto mb-8 relative">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }} className="text-5xl">✅</motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
            className="absolute inset-0 border-4 border-green-500 rounded-full animate-ping opacity-20" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-dark mb-3">🎉 Your page is live!</h1>
        <p className="text-secondary mb-8">Share it and make their day unforgettable.</p>

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
        <div className="bg-slate-50 rounded-2xl p-8 border border-card inline-block mb-8 w-full">
          <div id="qr-code" className="flex justify-center mb-4">
            <QRCodeSVG
              value={pageUrl}
              size={200}
              fgColor="#F43F73"
              bgColor="#ffffff"
              level="M"
            />
          </div>
          <button onClick={downloadQR}
            className="text-primary-pink font-bold text-sm flex items-center gap-2 mx-auto hover:underline">
            <Download size={16} /> Download QR Code
          </button>
        </div>

        <div className="w-full h-px bg-card mb-8" />

        {/* Share buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button onClick={shareWhatsApp}
            className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <MessageCircle size={24} />
          </button>
          <button onClick={shareTelegram}
            className="w-12 h-12 bg-[#0088cc] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <Send size={24} />
          </button>
          <button onClick={handleCopy}
            className="w-12 h-12 bg-primary-pink text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <Copy size={24} />
          </button>
        </div>

        <p className="text-xs text-secondary mb-6 italic">Your page is live forever at the link above. Bookmark it!</p>
        <Link to="/templates" className="flex items-center justify-center gap-2 text-primary-pink font-bold hover:gap-3 transition-all">
          <Plus size={20} /> Create another page
        </Link>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
