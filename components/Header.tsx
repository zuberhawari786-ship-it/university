import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const { universityInfo } = useData();
    const { t } = useLanguage();

    return (
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-md">
            <div className="flex items-center">
                <img src={universityInfo.logo} alt="Logo" className="h-8 w-auto mr-4"/>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{universityInfo.name}</h1>
            </div>
            <div className="flex items-center">
                {user && (
                    <div className="flex items-center gap-4 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 ring-1 ring-gray-900/10 dark:ring-white/20 shadow-sm">
                        <span className="text-sm font-medium">{t('header.welcome', { name: user.name, role: user.role })}</span>
                        <LanguageSwitcher />
                        <button 
                            onClick={logout} 
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            {t('header.logout')}
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;