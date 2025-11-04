import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'en' | 'ne' | 'hi' | 'bho';
type Translations = Record<string, string>;

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [locale, setLocaleState] = useState<Locale>(() => {
        const savedLocale = localStorage.getItem('locale');
        return (savedLocale && ['en', 'ne', 'hi', 'bho'].includes(savedLocale)) ? (savedLocale as Locale) : 'en';
    });

    const [translations, setTranslations] = useState<Record<Locale, Translations> | null>(null);

    useEffect(() => {
        const fetchTranslations = async () => {
            try {
                const [en, ne, hi, bho] = await Promise.all([
                    fetch('/locales/en.json').then(res => res.json()),
                    fetch('/locales/ne.json').then(res => res.json()),
                    fetch('/locales/hi.json').then(res => res.json()),
                    fetch('/locales/bho.json').then(res => res.json()),
                ]);
                setTranslations({ en, ne, hi, bho });
            } catch (error) {
                console.error("Failed to load translations:", error);
                 try {
                    const en = await fetch('/locales/en.json').then(res => res.json());
                    // Create empty objects for other languages to avoid crashes
                    const emptyTranslations = { en, ne: {}, hi: {}, bho: {} };
                    setTranslations(emptyTranslations as Record<Locale, Translations>);
                } catch (e) {
                    console.error("Failed to load fallback English translation:", e);
                }
            }
        };

        fetchTranslations();
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('locale', newLocale);
    };

    const t = (key: string, replacements?: Record<string, string | number>): string => {
        if (!translations) {
            return key; // Return key if translations are not loaded yet
        }
        
        let translation = translations[locale]?.[key] || translations['en']?.[key] || key;
        
        if (replacements) {
            Object.keys(replacements).forEach(placeholder => {
                const regex = new RegExp(`\\{${placeholder}\\}`, 'g');
                translation = translation.replace(regex, String(replacements[placeholder]));
            });
        }

        return translation;
    };
    
    if (!translations) {
        return null; // Prevent rendering child components until translations are loaded
    }

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
