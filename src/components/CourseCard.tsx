import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, User, BookOpen, Target, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CourseCardProps {
  teacher: string;
  level: string;
  schedule: string[];
  curriculum: string;
  outcomes: string;
  index?: number;
  onInstructorClick: (instructor: any) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ teacher, level, schedule, curriculum, outcomes, index = 0, onInstructorClick }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const instructors = t('instructors', { returnObjects: true }) as any[];
  const instructor = Array.isArray(instructors) ? instructors.find(i => i.name === teacher) : null;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
        className="bg-white dark:bg-neutral-900/40 backdrop-blur-md border border-gray-100 dark:border-white/10 rounded-3xl p-8 shadow-sm hover:shadow-2xl dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-2 transition-all duration-500 ease-out flex flex-col h-full"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="inline-block px-4 py-1.5 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-sm font-bold rounded-full mb-4">
              {level}
            </span>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
                <User className="w-6 h-6 text-neutral-400 dark:text-neutral-500" />
                {teacher}
              </h3>
              {instructor && (
                <button 
                  onClick={() => onInstructorClick(instructor)}
                  className="p-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 rounded-full transition-colors"
                  title={t('view_profile')}
                >
                  <Info size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-8 flex-grow">
          {schedule.map((time, idx) => (
            <div key={idx} className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              <span className="text-sm">{time}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full py-4 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-50 font-bold rounded-2xl hover:bg-neutral-900 hover:text-white dark:hover:bg-neutral-50 dark:hover:text-neutral-900 transition-all duration-300 flex items-center justify-center gap-2 group"
        >
          {t('course_more')}
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            →
          </motion.span>
        </button>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 md:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-neutral-900/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10 my-auto"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 rounded-full transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="p-8 md:p-12">
                <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 pr-12 sm:pr-0">
                  <div className="flex-1">
                    <span className="inline-block px-4 py-1.5 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-sm font-bold rounded-full mb-4">
                      {level}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 dark:text-neutral-50 leading-tight">
                      {teacher}
                    </h3>
                  </div>
                  {instructor && (
                    <button 
                      onClick={() => {
                        setIsModalOpen(false);
                        onInstructorClick(instructor);
                      }}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 text-sm font-bold rounded-xl hover:bg-neutral-900 hover:text-white dark:hover:bg-neutral-50 dark:hover:text-neutral-900 transition-all shadow-sm w-fit"
                    >
                      <User size={16} />
                      {t('view_profile')}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2 mb-3 text-lg">
                        <BookOpen className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                        {t('course_curriculum')}
                      </h4>
                      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {curriculum}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2 mb-3 text-lg">
                        <Target className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                        {t('course_outcomes')}
                      </h4>
                      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {outcomes}
                      </p>
                    </div>
                  </div>

                  <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-3xl border border-gray-100 dark:border-white/10">
                    <h4 className="font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                      {t('form_schedule')}
                    </h4>
                    <div className="space-y-3">
                      {schedule.map((time, idx) => (
                        <div key={idx} className="text-sm text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 p-3 rounded-xl border border-gray-100 dark:border-white/5">
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-100 dark:border-white/10 flex justify-end">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-3 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all"
                  >
                    {t('close')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
