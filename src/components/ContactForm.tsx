import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

export const ContactForm = ({ onSendMessage }: any) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [errors, setErrors] = useState({ phone: '' });
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[0-9]{9,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhone(formData.phone)) {
      setErrors({ phone: t('invalid_phone') });
      return;
    }

    setErrors({ phone: '' });
    setIsLoading(true);
    const success = await onSendMessage(formData);
    setIsLoading(false);
    if (success) {
      setFormData({ name: '', phone: '' });
      setIsSent(true);
      setTimeout(() => setIsSent(false), 5000);
    } else {
      alert(t('form_error'));
    }
  };

  if (isSent) {
    return (
      <div className="bg-white dark:bg-neutral-900 p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
        <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
        <h2 className="text-3xl font-serif font-bold text-black dark:text-white mb-4">{t('contact_sent_title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">{t('form_sent_desc')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-4xl font-serif font-bold text-black dark:text-white mb-6">{t('consultation')}</h2>
      <div className="space-y-4">
        <input 
          type="text" 
          placeholder={t('contact_name')}
          className="w-full p-4 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        <div className="space-y-1">
          <input 
            type="tel" 
            placeholder={t('form_phone')}
            className={`w-full p-4 bg-gray-50 dark:bg-neutral-800 border ${errors.phone ? 'border-red-500' : 'border-gray-200 dark:border-neutral-700'} text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors`}
            value={formData.phone}
            onChange={(e) => {
              setFormData({...formData, phone: e.target.value});
              if (errors.phone) setErrors({ phone: '' });
            }}
            required
          />
          {errors.phone && <p className="text-red-500 text-xs ml-2">{errors.phone}</p>}
        </div>
        <Button 
          className="w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-xl py-4 text-lg flex items-center justify-center gap-2 transition-colors"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
          {t('form_submit')}
        </Button>
      </div>
    </form>
  );
};
