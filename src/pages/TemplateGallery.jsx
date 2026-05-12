import { useState } from 'react';
import TemplateCard from '../components/TemplateCard';
import { AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { getShowcaseTemplateCards, TEMPLATE_GALLERY_FILTERS } from '../templates/registry';

const TemplateGallery = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const templates = getShowcaseTemplateCards();
  const visibleTags = new Set(templates.flatMap((template) => template.tags));
  const filters = TEMPLATE_GALLERY_FILTERS.filter((filter) => filter === 'All' || visibleTags.has(filter));

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f2c4d5] bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-primary-pink shadow-sm mb-4">
            Curated Love Lab
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 font-display">
            Pick a <span className="text-transparent bg-clip-text bg-pink-gradient italic">story format</span>
          </h1>
          <p className="text-secondary text-base md:text-lg">Every template follows a different interaction pattern so your gift feels one-of-one.</p>
        </div>

        {/* Filter Bar */}
        <div className="mb-12 hidden md:flex flex-wrap justify-center gap-3 rounded-[28px] border border-[#f1dce5] bg-white/80 px-4 py-5 shadow-sm">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-[#1b1328] text-white shadow-md'
                    : 'bg-white border border-[#ecd4de] text-secondary hover:border-primary-pink hover:text-primary-pink'
                }`}
              >
                {filter}
              </button>
            ))}
        </div>

        {/* Grid */}
        <div className="rounded-[32px] border border-[#f1dce5] bg-[linear-gradient(180deg,#ffffff_0%,#fff8fb_55%,#fff4f9_100%)] p-4 md:p-6">
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
      </div>
    </Layout>
  );
};

export default TemplateGallery;
