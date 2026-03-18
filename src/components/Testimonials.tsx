import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

export const Testimonials = () => {
  const { t } = useTranslation();
  const initialTestimonials = [
    { id: 1, name: t('t1_name'), quote: t('t1_quote'), avatar: 'https://i.pravatar.cc/150?u=dilnoza' },
    { id: 2, name: t('t2_name'), quote: t('t2_quote'), avatar: 'https://i.pravatar.cc/150?u=azizbek' },
    { id: 3, name: t('t3_name'), quote: t('t3_quote'), avatar: 'https://i.pravatar.cc/150?u=madina' },
    { id: 4, name: t('t4_name'), quote: t('t4_quote'), avatar: 'https://i.pravatar.cc/150?u=jasur' },
    { id: 5, name: t('t5_name'), quote: t('t5_quote'), avatar: 'https://i.pravatar.cc/150?u=gulnora' },
    { id: 6, name: t('t6_name'), quote: t('t6_quote'), avatar: 'https://i.pravatar.cc/150?u=bobur' }
  ];
  const [visibleCount, setVisibleCount] = useState(3);
  const displayedTestimonials = initialTestimonials.slice(0, visibleCount);

  return (
    <section id="testimonials" className="py-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-serif font-bold text-neutral-900 dark:text-neutral-50 text-center mb-12">{t('testimonials_title')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayedTestimonials.map((t) => (
            <motion.div 
              key={t.id}
              whileHover={{ y: -5 }}
              className="bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md p-8 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm transition-colors duration-300"
            >
              <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mb-6 mx-auto border-2 border-white dark:border-neutral-800" referrerPolicy="no-referrer" />
              <p className="text-neutral-700 dark:text-neutral-300 italic mb-6 leading-relaxed">"{t.quote}"</p>
              <h4 className="font-bold text-neutral-900 dark:text-neutral-50">{t.name}</h4>
            </motion.div>
          ))}
        </div>
        
        {visibleCount < initialTestimonials.length && (
          <div className="text-center mt-12">
            <button 
              onClick={() => setVisibleCount(initialTestimonials.length)}
              className="bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-900 px-8 py-3 rounded-full font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-lg"
            >
              {t('testimonials_more')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
