import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import { UserRole } from '../../types';
import UniversitySettings from '../admin/UniversitySettings';
import UserManagement from '../admin/UserManagement';
import CurriculumManagement from '../admin/CurriculumManagement';
import ExamManagement from '../admin/ExamManagement';
import ManageSubmissions from '../admin/ManageSubmissions';
import StudentDatabase from '../admin/StudentDatabase';
import ManageNotices from '../admin/ManageNotices';
import AdminProfile from '../admin/AdminProfile';
import ManageEntranceResults from '../admin/ManageEntranceResults';
import FeeManagement from '../admin/FeeManagement';
import Chat from '../common/Chat';
import Gallery from '../common/Gallery';
import ManageComplaints from '../admin/ManageComplaints';
import { useLanguage } from '../../contexts/LanguageContext';
import SearchEngine from '../common/SearchEngine';
import RemoteSupport from '../admin/RemoteSupport';

const AdminDashboard: React.FC = () => {
    const [activePage, setActivePage] = useState('dashboard');
    const { t } = useLanguage();

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return <div><h1 className="text-2xl font-bold mb-4">{t('dashboard.admin.title')}</h1><p>{t('dashboard.admin.welcome')}</p></div>;
            case 'search':
                return <SearchEngine />;
            case 'chat':
                return <Chat />;
            case 'users':
                return <UserManagement />;
            case 'curriculum':
                return <CurriculumManagement />;
            case 'exams':
                return <ExamManagement />;
            case 'fees':
                return <FeeManagement />;
            case 'submissions':
                return <ManageSubmissions />;
            case 'entrance':
                return <ManageEntranceResults />;
            case 'database':
                return <StudentDatabase />;
            case 'remote-support':
                return <RemoteSupport />;
            case 'complaints':
                return <ManageComplaints />;
            case 'notices':
                return <ManageNotices />;
            case 'gallery':
                return <Gallery />;
            case 'settings':
                return <UniversitySettings />;
            case 'profile':
                return <AdminProfile />;
            default:
                return <div>Select a page</div>;
        }
    };

    return (
        <div className="flex flex-1">
            <Sidebar userRole={UserRole.ADMIN} activePage={activePage} setActivePage={setActivePage} />
            <main className="flex-1 p-6 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboard;