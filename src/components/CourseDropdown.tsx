import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, User, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CourseDropdown = ({ courses, onInstructorClick }: { courses: any[], onInstructorClick: (instructor: any) => void }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const instructors = t('instructors', { returnObjects: true }) as any[];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      className="relative group" 
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <a 
        href="#courses" 
        className="relative flex items-center gap-1 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-50 font-medium text-sm transition-colors py-2"
        onClick={() => setIsOpen(false)}
      >
        {t('courses')}
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-900 dark:bg-neutral-50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
      </a>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[800px] bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 z-50 flex gap-8"
          >
            {/* Invisible bridge to prevent hover loss */}
            <div className="absolute -top-4 left-0 right-0 h-4 bg-transparent" />
            
            <div className="w-3/5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6 flex items-center gap-2">
                <GraduationCap size={14} />
                {t('courses_title')}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {courses.map((course, idx) => (
                  <a 
                    key={idx} 
                    href="#courses"
                    onClick={() => setIsOpen(false)}
                    className="group/item flex flex-col p-4 rounded-2xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-neutral-100 dark:hover:border-white/10"
                  >
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-900 rounded-full self-start mb-2">
                      {course.level}
                    </span>
                    <span className="font-bold text-sm text-neutral-900 dark:text-neutral-50 mb-1 group-hover/item:text-neutral-600 dark:group-hover/item:text-neutral-300 transition-colors">
                      {course.teacher}
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 leading-relaxed">
                      {course.curriculum}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="w-2/5 border-l border-neutral-100 dark:border-white/10 pl-8">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6 flex items-center gap-2">
                <User size={14} />
                {t('instructors_title')}
              </h4>
              <div className="space-y-2">
                {Array.isArray(instructors) && instructors.map((instructor, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      onInstructorClick(instructor);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors text-left group/inst"
                  >
                    <img 
                      src={instructor.photo} 
                      alt={instructor.name} 
                      className="w-10 h-10 rounded-full object-cover border border-neutral-100 dark:border-white/10"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-neutral-50 group-hover/inst:text-neutral-600 dark:group-hover/inst:text-neutral-300 transition-colors">
                        {instructor.name}
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                        {t('view_profile')}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
