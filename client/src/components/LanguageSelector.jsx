import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' }
];

const LanguageSelector = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    const handleLanguageChange = (langCode) => {
        i18n.changeLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <div className="fixed top-5 right-5 z-50">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full shadow-lg hover:bg-white/20 transition-all font-medium"
            >
                <span className="text-xl">{currentLang.flag}</span>
                <span className="hidden sm:inline">{currentLang.name}</span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="py-2">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors
                    ${i18n.language === lang.code ? 'text-red-400 bg-white/5' : 'text-slate-300'}
                  `}
                                >
                                    <span className="text-xl">{lang.flag}</span>
                                    <span className="font-medium">{lang.name}</span>
                                    {i18n.language === lang.code && (
                                        <motion.div layoutId="activeLang" className="ml-auto w-2 h-2 rounded-full bg-red-400" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageSelector;
