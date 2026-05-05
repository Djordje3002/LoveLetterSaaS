import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Sparkles } from 'lucide-react';
import { palettes, fonts, extractYouTubeId } from './palettes';

const DateInviteLetter = ({
  recipientName,
  senderName,
  scenes = {},
  palette = 'pink',
  font = 'elegant',
  showSenderName = true,
  showFooter = true,
  musicEnabled = false,
  musicUrl = '',
}) => {
  const pal = palettes[palette] || palettes.pink;
  const fnt = fonts[font] || fonts.elegant;
  const videoId = extractYouTubeId(musicUrl);
  const [answer, setAnswer] = useState('');

  const headline = scenes.inviteHeadline || 'Will you go on a date with me?';
  const message = scenes.inviteMessage || 'I have a little plan for us, and I would love to spend that time with you.';
  const when = scenes.dateWhen || 'Saturday, 7:00 PM';
  const where = scenes.dateWhere || 'Our favorite place';
  const dressCode = scenes.dressCode || 'Come exactly as you are';
  const rsvpNote = scenes.rsvpContact || "Tell me yes when you're ready 💌";

  return (
    <div className="min-h-screen px-6 py-12 md:py-20" style={{ backgroundColor: pal.bg, fontFamily: fnt.body }}>
      {musicEnabled && videoId && (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0`}
          allow="autoplay"
          className="w-0 h-0 absolute opacity-0"
          title="bg music"
        />
      )}

      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-card rounded-3xl shadow-xl p-8 md:p-12"
        >
          <p className="text-xs uppercase tracking-[0.25em] font-bold mb-4" style={{ color: pal.primary }}>
            Date Invitation
          </p>
          <h1 className="text-4xl md:text-5xl mb-6 font-bold leading-tight" style={{ fontFamily: fnt.heading, color: pal.text }}>
            {headline}
          </h1>
          <p className="text-secondary leading-relaxed text-lg mb-10">
            {message}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl border border-card p-4 bg-primary-light/30">
              <p className="text-xs uppercase tracking-widest font-bold mb-2 text-secondary">When</p>
              <p className="font-bold text-dark flex items-center gap-2"><CalendarDays size={16} style={{ color: pal.primary }} /> {when}</p>
            </div>
            <div className="rounded-2xl border border-card p-4 bg-primary-light/30">
              <p className="text-xs uppercase tracking-widest font-bold mb-2 text-secondary">Where</p>
              <p className="font-bold text-dark flex items-center gap-2"><MapPin size={16} style={{ color: pal.primary }} /> {where}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-card p-4 mb-10">
            <p className="text-xs uppercase tracking-widest font-bold mb-2 text-secondary">Dress Code</p>
            <p className="font-medium text-dark">{dressCode}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setAnswer('yes')}
              className="flex-1 text-white font-bold py-3 rounded-pill transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: pal.primary }}
            >
              Yes, I would love to
            </button>
            <button
              onClick={() => setAnswer('maybe')}
              className="flex-1 border-2 font-bold py-3 rounded-pill transition-all"
              style={{ borderColor: pal.primary, color: pal.primary }}
            >
              Maybe, tell me more
            </button>
          </div>

          {answer && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 rounded-2xl p-4 border border-card bg-primary-light/40">
              <p className="font-bold flex items-center gap-2" style={{ color: pal.primary }}>
                <Sparkles size={16} />
                {answer === 'yes' ? 'Yay! This made my day.' : "I'd still love to make this special for us."}
              </p>
              <p className="text-sm text-secondary mt-2">{rsvpNote}</p>
            </motion.div>
          )}

          {(scenes.closingMessage || (showSenderName && senderName)) && (
            <div className="mt-10 text-right">
              {scenes.closingMessage && (
                <p className="font-dancing text-3xl" style={{ color: pal.primary }}>{scenes.closingMessage}</p>
              )}
              {showSenderName && senderName && (
                <p className="font-dancing text-2xl text-secondary mt-1">— {senderName}</p>
              )}
            </div>
          )}
          {recipientName && (
            <p className="text-xs text-secondary mt-6">Made especially for {recipientName}</p>
          )}
        </motion.div>

        {showFooter && (
          <p className="text-center text-secondary text-sm mt-8">made with LovePage ♥</p>
        )}
      </div>
    </div>
  );
};

export default DateInviteLetter;
