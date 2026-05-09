import React, { useState } from 'react';
import TemplateCard from '../components/TemplateCard';
import { AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';

const TemplateGallery = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Love', 'Chat', 'Reasons', 'Gallery', 'Story', 'Elegant', 'Date', 'Birthday'];

  const templates = [
    { id: 'kawaii-letter', name: 'Kawaii Letter', tags: ['Most Popular', 'Love'] },
    { id: 'iva-birthday', name: 'Full House of Love', tags: ['Full Experience', 'Love'] },
    { id: 'chat-reveal', name: 'Chat Reveal', tags: ['Love', 'Chat'] },
    { id: 'date-invite', name: 'Will You Be My Valentine?', tags: ['Date', 'Love'] },
    { id: 'sky-love', name: 'Sky Love', tags: ['Night', 'Love'] },
    { id: '100-reasons', name: '100 Reasons', tags: ['Reasons', 'Love'] },
    { id: 'our-gallery', name: 'Our Gallery', tags: ['Gallery', 'Memories'] },
    { id: 'dark-romance', name: 'Dark Romance', tags: ['Elegant', 'Letter'] },
    { id: 'our-story', name: 'Our Story', tags: ['Story', 'Timeline'] },
    { id: 'midnight-love', name: 'Midnight Love', tags: ['Night', 'Elegant'] },
    { id: 'rose-whisper', name: 'Rose Whisper', tags: ['Love', 'Elegant'] },
    { id: 'golden-promise', name: 'Golden Promise', tags: ['Love', 'Letter'] },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-pink-gradient italic">Beautiful</span> Templates
          </h1>
          <p className="text-secondary text-lg">Each template is a unique interactive experience — perfect for any occasion</p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-pill font-medium transition-all duration-300 ${
                activeFilter === filter
                  ? 'bg-pink-gradient text-white shadow-md'
                  : 'bg-white border border-card text-secondary hover:border-primary-pink hover:text-primary-pink'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {templates
              .filter((t) => activeFilter === 'All' || t.tags.includes(activeFilter))
              .map((template, i) => (
                <TemplateCard key={template.id} template={template} index={i} />
              ))}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
};

export default TemplateGallery;
