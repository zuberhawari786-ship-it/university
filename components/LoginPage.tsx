import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import CreateAccountPage from './CreateAccountPage';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { universityInfo } = useData();
    const { t } = useLanguage();
    const [view, setView] = useState<'login' | 'register'>('login');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const success = await login(username, password);
        if (!success) {
            setError(t('loginPage.invalidCredentials'));
        }
        setIsLoading(false);
    };

    if (view === 'register') {
        return <CreateAccountPage onBackToLogin={() => setView('login')} />;
    }

    return (
        <div className="h-full flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-8">
                <div className="text-center">
                    <img src={universityInfo.logo} alt="University Logo" className="mx-auto h-12 w-auto mb-4"/>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        {universityInfo.name}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {t('loginPage.signInToYourAccount')}
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-lg -space-y-px">
                        <div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder={t('loginPage.username')}
                            />
                        </div>
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder={t('loginPage.password')}
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                            {isLoading ? t('loginPage.signingIn') : t('loginPage.signIn')}
                        </button>
                    </div>
                </form>
                 <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <button
                        type="button"
                        onClick={() => setView('register')}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Create one
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;