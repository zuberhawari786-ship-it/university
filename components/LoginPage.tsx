import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import CreateAccountPage from './CreateAccountPage';
import ForgotPasswordPage from './ForgotPasswordPage';

const LoginPage: React.FC<{ onEnterPublicPortal: () => void }> = ({ onEnterPublicPortal }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { universityInfo } = useData();
    const { t } = useLanguage();
    const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const success = await login(username, password);
        if (!success) {
            setError(t('loginPage.invalidCredentials'));
            setIsLoading(false);
        }
    };

    if (view === 'register') {
        return <CreateAccountPage onBackToLogin={() => setView('login')} />;
    }
    
    if (view === 'forgot') {
        return <ForgotPasswordPage onBackToLogin={() => setView('login')} />;
    }

    return (
        <div className="h-full w-full flex items-center justify-center p-4">
            <div className="w-full max-w-sm card p-8 space-y-6 animate-fade-in">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-white">
                        {universityInfo.name}
                    </h2>
                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                        {t('loginPage.signInToYourAccount')}
                    </p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="sr-only">{t('loginPage.username')}</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-input"
                            placeholder={t('loginPage.username')}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">{t('loginPage.password')}</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            placeholder={t('loginPage.password')}
                        />
                    </div>

                    <div className="text-right text-sm">
                        <button
                            type="button"
                            onClick={() => setView('forgot')}
                            className="font-medium text-[var(--primary-400)] hover:text-[var(--primary-500)]"
                        >
                            Forgot your password?
                        </button>
                    </div>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full"
                        >
                            {isLoading ? t('loginPage.signingIn') : t('loginPage.signIn')}
                        </button>
                    </div>
                </form>
                 <p className="text-center text-sm text-[var(--text-muted)]">
                    Don't have an account?{' '}
                    <button
                        type="button"
                        onClick={() => setView('register')}
                        className="font-medium text-[var(--primary-400)] hover:text-[var(--primary-500)]"
                    >
                        Create one
                    </button>
                </p>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <span className="flex-shrink mx-4 text-xs text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-600"></div>
                </div>

                <button
                    type="button"
                    onClick={onEnterPublicPortal}
                    className="btn-secondary w-full"
                >
                    Enter as Guest
                </button>

            </div>
        </div>
    );
};

export default LoginPage;