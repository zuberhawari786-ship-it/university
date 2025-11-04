import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LANGUAGES = {
    en: 'English',
    ne: 'नेपाली',
    hi: 'हिन्दी',
    bho: 'भोजपुरी'
};

const LanguageSwitcher: React.FC = () => {
    const { locale, setLocale, t } = useLanguage();

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLocale(e.target.value as 'en' | 'ne' | 'hi' | 'bho');
    };

    return (
        <div className="relative">
            <select
                value={locale}
                onChange={handleLanguageChange}
                aria-label={t('languageSwitcher.changeLanguage')}
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-3 pr-8 text-sm leading-5 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
                {Object.entries(LANGUAGES).map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
            </div>
        </div>
    );
};

export default LanguageSwitcher;
