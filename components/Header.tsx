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
        <header className="flex items-center justify-between p-4 bg-transparent border-b border-gray-700">
            <div className="flex items-center">
                <img src={universityInfo.logo} alt="Logo" className="h-8 w-auto mr-4"/>
                <h1 className="text-xl font-bold">{universityInfo.name}</h1>
            </div>
            <div className="flex items-center">
                {user && (
                    <div className="flex items-center gap-4 p-2 rounded-none bg-black/30 border border-gray-700">
                        <span className="text-sm font-medium">{t('header.welcome', { name: user.name, role: user.role })}</span>
                        <LanguageSwitcher />
                        <button 
                            onClick={logout} 
                            className="btn-danger">
                            {t('header.logout')}
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;