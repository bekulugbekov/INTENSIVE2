import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'uz', name: 'UZ' },
    { code: 'ru', name: 'RU' },
    { code: 'en', name: 'EN' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 bg-transparent text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-50 text-sm font-semibold py-2 px-3 rounded-full hover:bg-neutral-100/50 dark:hover:bg-white/5 transition-all focus:outline-none"
      >
        {currentLanguage.name}
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-100 dark:border-white/10 rounded-2xl shadow-xl py-2 w-24 z-50 overflow-hidden">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`block w-full text-center px-4 py-2.5 text-sm transition-colors ${i18n.language === lang.code ? 'font-bold text-neutral-900 bg-neutral-50 dark:text-neutral-50 dark:bg-white/10' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50/80 dark:text-neutral-400 dark:hover:text-neutral-50 dark:hover:bg-white/5'}`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
