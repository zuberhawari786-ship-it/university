import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { LanguageProvider } from './contexts/LanguageContext';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/dashboards/AdminDashboard';
import TeacherDashboard from './components/dashboards/TeacherDashboard';
import StudentDashboard from './components/dashboards/StudentDashboard';
import ReceptionistDashboard from './components/dashboards/ReceptionistDashboard';
import ShopkeeperDashboard from './components/dashboards/ShopkeeperDashboard';
import { UserRole } from './types';
import Header from './components/Header';
import AndroidEmulator from './components/common/AndroidEmulator';

const AppContent: React.FC = () => {
    const { isAuthenticated, user } = useAuth();

    const renderDashboard = () => {
        switch (user?.role) {
            case UserRole.ADMIN:
                return <AdminDashboard />;
            case UserRole.TEACHER:
                return <TeacherDashboard />;
            case UserRole.STUDENT:
                return <StudentDashboard />;
            case UserRole.RECEPTIONIST:
                return <ReceptionistDashboard />;
            case UserRole.SHOPKEEPER:
                return <ShopkeeperDashboard />;
            default:
                return <LoginPage />;
        }
    };

    if (!isAuthenticated) {
        return <LoginPage />;
    }

    return (
        <div className="flex h-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <div className="flex flex-col flex-1 w-full">
                <Header />
                <div className="flex flex-1 overflow-hidden">
                    {renderDashboard()}
                </div>
            </div>
        </div>
    );
};


const App: React.FC = () => {
    return (
        <AuthProvider>
            <LanguageProvider>
                <DataProvider>
                    <AndroidEmulator>
                        <AppContent />
                    </AndroidEmulator>
                </DataProvider>
            </LanguageProvider>
        </AuthProvider>
    );
};

export default App;