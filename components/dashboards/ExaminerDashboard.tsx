import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import { UserRole } from '../../types';
import ExamManagement from '../admin/ExamManagement';
import Chat from '../common/Chat';
import { useLanguage } from '../../contexts/LanguageContext';
import ManageProjects from '../common/ManageProjects';
import UserProfile from '../common/UserProfile';

const ExaminerDashboard: React.FC = () => {
    const [activePage, setActivePage] = useState('dashboard');
    const { t } = useLanguage();

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return <div><h1 className="text-2xl font-bold mb-4">{t('dashboard.examiner.title')}</h1><p>{t('dashboard.examiner.welcome')}</p></div>;
            case 'exams':
                return <ExamManagement />;
            case 'project-submissions':
                return <ManageProjects />;
            case 'chat':
                return <Chat />;
            case 'profile':
                return <UserProfile />;
            default:
                return <div>Select a page</div>;
        }
    };

    return (
        <div className="flex flex-1">
            <Sidebar userRole={UserRole.EXAMINER} activePage={activePage} setActivePage={setActivePage} />
            <main className="flex-1 p-6 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
};

export default ExaminerDashboard;