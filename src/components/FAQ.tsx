import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FAQ = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = t('faq_list', { returnObjects: true }) as { q: string, a: string }[];

  return (
    <section id="faq" className="py-20 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-serif font-bold text-neutral-900 dark:text-neutral-50 mb-12 text-center">{t('faq_title')}</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-neutral-900/40 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden transition-colors duration-300">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex justify-between items-center p-6 text-left font-bold text-neutral-900 dark:text-neutral-50 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors"
              >
                {faq.q}
                {openIndex === i ? <ChevronUp /> : <ChevronDown />}
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 text-neutral-600 dark:text-neutral-300 leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
