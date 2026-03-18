import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

export const CourseRegistrationForm = ({ onSendMessage, courses = [], onClose }: any) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    contactMethod: '', 
    course: '', 
    teacher: '', 
    schedule: '' 
  });
  const [errors, setErrors] = useState({ phone: '', email: '' });
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Memoized unique course levels
  const uniqueLevels = useMemo(() => {
    return [...new Set(courses.map((c: any) => c.level))].filter(Boolean);
  }, [courses]);

  // Memoized teachers for the selected level
  const availableTeachers = useMemo(() => {
    if (!formData.course) return [];
    return courses
      .filter((c: any) => c.level === formData.course)
      .map((c: any) => c.teacher)
      .filter(Boolean);
  }, [courses, formData.course]);

  // Memoized schedules for the selected level and teacher
  const availableSchedules = useMemo(() => {
    if (!formData.course || !formData.teacher) return [];
    const courseMatch = courses.find(
      (c: any) => c.level === formData.course && c.teacher === formData.teacher
    );
    return courseMatch?.schedule || [];
  }, [courses, formData.course, formData.teacher]);

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[0-9]{9,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = { phone: '', email: '' };
    let hasError = false;

    if (!validatePhone(formData.phone)) {
      newErrors.phone = t('invalid_phone');
      hasError = true;
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = t('invalid_email');
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setErrors({ phone: '', email: '' });
    setIsLoading(true);
    const success = await onSendMessage(formData);
    setIsLoading(false);
    if (success) {
      setFormData({ 
        name: '', 
        phone: '', 
        email: '', 
        contactMethod: '', 
        course: '', 
        teacher: '', 
        schedule: '' 
      });
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        if (onClose) onClose();
      }, 4000);
    } else {
      alert(t('form_error'));
    }
  };

  if (isSent) {
    return (
      <div className="bg-white dark:bg-neutral-800 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
        <h2 className="text-3xl font-serif font-bold text-black dark:text-white mb-4">{t('form_sent_title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">{t('form_sent_desc')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-800 p-8 md:p-12 transition-colors duration-300">
      <h2 className="text-4xl font-serif font-bold text-black dark:text-white mb-8">{t('enroll')}</h2>
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input 
            type="text" 
            placeholder={t('form_name')}
            className="w-full p-4 bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <div className="space-y-1">
            <input 
              type="tel" 
              placeholder={t('form_phone')}
              className={`w-full p-4 bg-gray-50 dark:bg-neutral-700 border ${errors.phone ? 'border-red-500' : 'border-gray-200 dark:border-neutral-600'} text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors`}
              value={formData.phone}
              onChange={(e) => {
                setFormData({...formData, phone: e.target.value});
                if (errors.phone) setErrors({...errors, phone: ''});
              }}
              required
            />
            {errors.phone && <p className="text-red-500 text-xs ml-2">{errors.phone}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <input 
              type="email" 
              placeholder={t('form_email')}
              className={`w-full p-4 bg-gray-50 dark:bg-neutral-700 border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-neutral-600'} text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors`}
              value={formData.email}
              onChange={(e) => {
                setFormData({...formData, email: e.target.value});
                if (errors.email) setErrors({...errors, email: ''});
              }}
              required
            />
            {errors.email && <p className="text-red-500 text-xs ml-2">{errors.email}</p>}
          </div>
          <select 
            className="w-full p-4 bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white appearance-none transition-colors"
            value={formData.contactMethod}
            onChange={(e) => setFormData({...formData, contactMethod: e.target.value})}
            required
          >
            <option value="">{t('form_contact_method')}</option>
            <option value="Telegram">{t('form_contact_telegram')}</option>
            <option value="Phone">{t('form_contact_phone')}</option>
          </select>
        </div>
        
        {/* Course Level Selection */}
        <select 
          className="w-full p-4 bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white appearance-none transition-colors"
          value={formData.course}
          onChange={(e) => setFormData({...formData, course: e.target.value, teacher: '', schedule: ''})}
          required
        >
          <option value="">{t('form_course')}</option>
          {uniqueLevels.map((level: string) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>

        {/* Teacher Selection - Dynamically loaded based on Course */}
        {formData.course && (
          <select 
            className="w-full p-4 bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white appearance-none transition-colors"
            value={formData.teacher}
            onChange={(e) => setFormData({...formData, teacher: e.target.value, schedule: ''})}
            required
          >
            <option value="">{t('form_teacher')}</option>
            {availableTeachers.map((teacher: string) => (
              <option key={teacher} value={teacher}>{teacher}</option>
            ))}
            {availableTeachers.length === 0 && (
              <option disabled>{t('no_teachers_available')}</option>
            )}
          </select>
        )}

        {/* Schedule Selection - Dynamically loaded based on Teacher */}
        {formData.teacher && (
          <select 
            className="w-full p-4 bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white appearance-none transition-colors"
            value={formData.schedule}
            onChange={(e) => setFormData({...formData, schedule: e.target.value})}
            required
          >
            <option value="">{t('form_schedule')}</option>
            {availableSchedules.map((s: string) => (
              <option key={s} value={s}>{s}</option>
            ))}
            {availableSchedules.length === 0 && (
              <option disabled>{t('no_schedules_available')}</option>
            )}
          </select>
        )}

        <Button 
          className="w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-xl py-4 text-lg flex items-center justify-center gap-2 mt-4 transition-colors"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
          {t('form_submit')}
        </Button>
      </div>
    </form>
  );
};
