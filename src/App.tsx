import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Phone, MapPin, Send, Instagram, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Button } from './components/Button';
import { CourseCard } from './components/CourseCard';
import { ContactForm } from './components/ContactForm';
import { CourseRegistrationForm } from './components/CourseRegistrationForm';
import { LanguageSelector } from './components/LanguageSelector';
import { ThemeToggle } from './components/ThemeToggle';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Gallery } from './components/Gallery';
import { ScrollToTop } from './components/ScrollToTop';
import { CourseDropdown } from './components/CourseDropdown';
import { sendTelegramMessage } from './services/telegramService';
import { Logo } from './components/Logo';
import { InstructorModal } from './components/InstructorModal';

const NavLink = ({ href, children, onClick }: { href: string, children: React.ReactNode, onClick?: () => void }) => (
  <a 
    href={href} 
    onClick={onClick}
    className="relative text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white font-medium text-sm transition-colors group py-2"
  >
    {children}
    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black dark:bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
  </a>
);

export default function App() {
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], ['0%', '30%']);
  const courses = t('courses_list', { returnObjects: true }) as any[];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleConsultation = async (data: any) => {
    console.log('Konsultatsiya yuborildi:', data);
    const success = await sendTelegramMessage(data.name, data.phone, 'Konsultatsiya', '-', '-');
    return success;
  };

  const handleRegistration = async (data: any) => {
    console.log('Kursga yozilish yuborildi:', data);
    const success = await sendTelegramMessage(
      data.name, 
      data.phone, 
      data.course, 
      data.teacher, 
      data.schedule,
      data.email,
      data.contactMethod
    );
    return success;
  };

  return (
    <div className="min-h-screen text-neutral-900 dark:text-neutral-100 font-sans bg-site-gradient transition-colors duration-300">
      <header className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl shadow-md border-b border-neutral-200/50 dark:border-white/5 py-3' : 'bg-transparent py-6'}`}>
        <nav className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Logo className={`w-32 h-auto transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-90'}`} />
          
          {/* Desktop menu */}
          <div className="hidden md:flex gap-8 items-center bg-white/40 dark:bg-neutral-800/40 backdrop-blur-md px-8 py-2.5 rounded-full border border-white/50 dark:border-neutral-700/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <NavLink href="#home">{t('home')}</NavLink>
            <CourseDropdown courses={courses} onInstructorClick={setSelectedInstructor} />
            <NavLink href="#about">{t('about')}</NavLink>
            <NavLink href="#contact">{t('contact')}</NavLink>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white/40 dark:bg-neutral-800/40 backdrop-blur-md rounded-full border border-white/50 dark:border-neutral-700/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] px-1 py-0.5">
              <LanguageSelector />
              <div className="w-[1px] h-4 bg-gray-300 dark:bg-neutral-700 mx-1"></div>
              <ThemeToggle />
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="hidden md:block bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-7 py-2.5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 font-medium">{t('enroll')}</Button>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2.5 bg-white/40 dark:bg-neutral-800/40 backdrop-blur-md border border-white/50 dark:border-neutral-700/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white hover:bg-white/60 dark:hover:bg-neutral-700/60 rounded-full transition-all" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

      </header>

      {/* Mobile menu - Moved outside header for better viewport coverage */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xl z-[60] md:hidden"
            />
            
            {/* Side Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-xs bg-white/30 dark:bg-neutral-950/30 backdrop-blur-[24px] z-[70] md:hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] border-l border-white/20 dark:border-white/10 flex flex-col overflow-hidden"
            >
              <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-neutral-800/50">
                <Logo className="w-24 h-auto" />
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="px-6 py-8 flex flex-col gap-2">
                <a href="#home" className="text-xl font-serif font-bold text-neutral-900 dark:text-neutral-50 bg-neutral-900/5 dark:bg-white/5 hover:bg-neutral-900/10 dark:hover:bg-white/10 p-4 rounded-2xl transition-all flex items-center justify-between group" onClick={() => setIsMenuOpen(false)}>
                  {t('home')}
                  <span className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">→</span>
                </a>
                <a href="#courses" className="text-xl font-serif font-bold text-neutral-900 dark:text-neutral-50 bg-neutral-900/5 dark:bg-white/5 hover:bg-neutral-900/10 dark:hover:bg-white/10 p-4 rounded-2xl transition-all flex items-center justify-between group" onClick={() => setIsMenuOpen(false)}>
                  {t('courses')}
                  <span className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">→</span>
                </a>
                <a href="#about" className="text-xl font-serif font-bold text-neutral-900 dark:text-neutral-50 bg-neutral-900/5 dark:bg-white/5 hover:bg-neutral-900/10 dark:hover:bg-white/10 p-4 rounded-2xl transition-all flex items-center justify-between group" onClick={() => setIsMenuOpen(false)}>
                  {t('about')}
                  <span className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">→</span>
                </a>
                <a href="#contact" className="text-xl font-serif font-bold text-neutral-900 dark:text-neutral-50 bg-neutral-900/5 dark:bg-white/5 hover:bg-neutral-900/10 dark:hover:bg-white/10 p-4 rounded-2xl transition-all flex items-center justify-between group" onClick={() => setIsMenuOpen(false)}>
                  {t('contact')}
                  <span className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">→</span>
                </a>
                
                <div className="mt-4 pt-6">
                  <Button onClick={() => { setIsModalOpen(true); setIsMenuOpen(false); }} className="w-full bg-black text-white dark:bg-white dark:text-black hover:scale-[1.02] active:scale-[0.98] rounded-2xl py-4 shadow-xl font-bold transition-all">{t('enroll')}</Button>
                </div>
              </div>

              <div className="mt-auto p-6 border-t border-gray-100 dark:border-neutral-800/50 bg-gray-50/50 dark:bg-neutral-800/30">
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">{t('social')}</p>
                  <div className="flex gap-4">
                    <a href="https://t.me/INTENSIVE_Nemis_Tili" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">Telegram</a>
                    <a href="https://www.instagram.com/intensive_nemis_tili/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">Instagram</a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 md:p-6 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-neutral-900 max-w-lg w-full relative rounded-3xl shadow-2xl transition-colors duration-300 my-auto"
          >
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black dark:hover:text-white transition-colors z-10 p-2 bg-gray-100 dark:bg-neutral-800 rounded-full">
              <X size={20} />
            </button>
            <div className="overflow-hidden rounded-3xl">
              <CourseRegistrationForm onSendMessage={handleRegistration} courses={courses} onClose={() => setIsModalOpen(false)} />
            </div>
          </motion.div>
        </div>
      )}

      <main>
        {/* Full-screen Hero section */}
        <section id="home" className="relative h-screen flex items-center justify-center text-center px-6 overflow-hidden">
          {/* Background Image with Parallax and subtle zoom */}
          <motion.div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-110" 
            style={{ 
              backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1920&h=1080&auto=format&fit=crop')`,
              y: backgroundY
            }}
            animate={{ scale: [1.05, 1.1, 1.05] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          ></motion.div>
          
          {/* Removed previous overlays to match user request */}

          <div className="relative z-10 max-w-4xl mx-auto mt-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight break-words text-white drop-shadow-lg">
                {t('hero_title')}
              </h2>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto break-words text-gray-100 drop-shadow-md font-medium">
                {t('hero_desc')}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <a href="#contact">
                <Button 
                  variant="secondary" 
                  className="bg-white text-black hover:bg-gray-100 rounded-full px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {t('consultation')}
                </Button>
              </a>
            </motion.div>
          </div>
        </section>

        {/* Content sections with white background */}
        <div className="transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <section id="courses" className="mb-20">
              <h2 className="text-4xl font-serif font-bold text-neutral-900 dark:text-neutral-50 mb-10 text-center">{t('courses_title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((c, i) => (
                  <CourseCard 
                    key={i} 
                    index={i} 
                    {...c} 
                    onInstructorClick={setSelectedInstructor}
                  />
                ))}
              </div>
            </section>

            <section id="about" className="mb-20 p-12 bg-white/80 dark:bg-neutral-900/40 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-sm rounded-3xl transition-colors duration-300">
              <h2 className="text-4xl font-serif font-bold text-neutral-900 dark:text-neutral-50 mb-6">{t('about_title')}</h2>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">{t('about_desc')}</p>
            </section>

            <Gallery />

            <Testimonials />
            <FAQ />

            <section id="contact" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start py-20">
              <div className="bg-white dark:bg-neutral-900/40 backdrop-blur-md p-8 md:p-12 border border-gray-100 dark:border-white/10 shadow-lg rounded-3xl transition-colors duration-300">
                <ContactForm onSendMessage={handleConsultation} />
              </div>
              <div className="space-y-8">
                <h2 className="text-4xl font-serif font-bold text-neutral-900 dark:text-neutral-50">{t('contact_title')}</h2>
                <p className="text-neutral-600 dark:text-neutral-300 text-lg leading-relaxed">{t('contact_desc')}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-neutral-900/60 p-6 rounded-2xl border border-gray-100 dark:border-white/10 transition-colors duration-300">
                    <h4 className="font-bold text-neutral-900 dark:text-neutral-50 mb-2">{t('phone')}</h4>
                    <p className="text-neutral-700 dark:text-neutral-300">+998 94 047 31 32</p>
                    <p className="text-neutral-700 dark:text-neutral-300">+998 78 113 94 95</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-neutral-900/60 p-6 rounded-2xl border border-gray-100 dark:border-white/10 transition-colors duration-300">
                    <h4 className="font-bold text-neutral-900 dark:text-neutral-50 mb-2">{t('social')}</h4>
                    <a href="https://t.me/INTENSIVE_Nemis_Tili" target="_blank" rel="noopener noreferrer" className="block text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white underline">Telegram</a>
                    <a href="https://www.instagram.com/intensive_nemis_tili/" target="_blank" rel="noopener noreferrer" className="block text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white underline">Instagram</a>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-neutral-900/60 p-6 rounded-2xl border border-gray-100 dark:border-white/10 transition-colors duration-300">
                  <h4 className="font-bold text-neutral-900 dark:text-neutral-50 mb-2">{t('address')}</h4>
                  <p className="text-neutral-700 dark:text-neutral-300 mb-4">Toshkent shahri, Cho'pon ota ko'chasi, INTENSIVE Nemis tili markazi</p>
                  <a href="https://www.google.com/maps/place/%D0%A3%D1%87%D0%B5%D0%B1%D0%BD%D1%8B%D0%B9+%D1%86%D0%B5%D0%BD%D1%82%D1%80+Bright+Future+Education/@41.2830482,69.2110868,20.47z/data=!4m6!3m5!1s0x38ae8d6d19d245ed:0x3abeb45f8605133c!8m2!3d41.2831089!4d69.2112071!16s%2Fg%2F11hdxvwycz?entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D" className="text-neutral-900 dark:text-neutral-50 font-semibold underline">{t('view_map')}</a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-neutral-900 dark:bg-black text-white pt-16 pb-8 transition-colors duration-300 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5 flex flex-col items-start">
            <div className="mb-6 p-2 -ml-2 rounded-xl bg-white/[0.03] border border-white/5 inline-block shadow-inner backdrop-blur-sm">
              <Logo className="w-40 h-auto text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
            </div>
            <p className="text-gray-400 text-base leading-relaxed max-w-md opacity-80">
              {t('footer_desc')}
            </p>
          </div>
          
          <div className="md:col-span-3">
            <h3 className="text-xl font-serif font-bold mb-6 text-white tracking-tight">{t('footer_links')}</h3>
            <ul className="space-y-5">
              <li>
                <a href="#home" className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group py-0.5">
                  <span className="w-0 group-hover:w-4 h-[1px] bg-white transition-all duration-300"></span>
                  {t('home')}
                </a>
              </li>
              <li>
                <a href="#courses" className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group py-0.5">
                  <span className="w-0 group-hover:w-4 h-[1px] bg-white transition-all duration-300"></span>
                  {t('courses')}
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group py-0.5">
                  <span className="w-0 group-hover:w-4 h-[1px] bg-white transition-all duration-300"></span>
                  {t('about')}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group py-0.5">
                  <span className="w-0 group-hover:w-4 h-[1px] bg-white transition-all duration-300"></span>
                  {t('contact')}
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-xl font-serif font-bold mb-6 text-white tracking-tight">{t('footer_contact')}</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                  <MapPin size={20} className="text-gray-300" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">{t('address')}</p>
                  <p className="text-gray-300 text-sm leading-snug">Toshkent shahri, Cho'pon ota ko'chasi, INTENSIVE Nemis tili markazi</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                  <Phone size={20} className="text-gray-300" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">{t('phone')}</p>
                  <div className="flex flex-col gap-1">
                    <a href="tel:+998940473132" className="text-gray-300 text-sm hover:text-white transition-colors">+998 94 047 31 32</a>
                    <a href="tel:+998781139495" className="text-gray-300 text-sm hover:text-white transition-colors">+998 78 113 94 95</a>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <a 
                  href="https://t.me/INTENSIVE_Nemis_Tili" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 rounded-full hover:bg-[#0088cc] hover:-translate-y-1 transition-all duration-300 group shadow-lg"
                >
                  <Send size={20} className="text-gray-300 group-hover:text-white" />
                </a>
                <a 
                  href="https://www.instagram.com/intensive_nemis_tili/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 rounded-full hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:-translate-y-1 transition-all duration-300 group shadow-lg"
                >
                  <Instagram size={20} className="text-gray-300 group-hover:text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">
            &copy; 2026 INTENSIVE Nemis tili markazi. {t('footer_copyright')}
          </p>
          <div className="flex gap-8 text-gray-600 text-xs uppercase tracking-widest font-bold">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      <ScrollToTop />
      
      <InstructorModal 
        instructor={selectedInstructor}
        isOpen={!!selectedInstructor}
        onClose={() => setSelectedInstructor(null)}
      />
    </div>
  );
}
