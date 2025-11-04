import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import { UserRole } from '../../types';
import EnterMarks from '../teacher/EnterMarks';
import ViewRoutines from '../student/ViewRoutines';
import ViewSyllabus from '../student/ViewSyllabus';
import NoticeBoard from '../common/NoticeBoard';
import TakeAttendance from '../teacher/TakeAttendance';
import Chat from '../common/Chat';
import SyllabusDesigner from '../teacher/SyllabusDesigner';
import Gallery from '../common/Gallery';
import OnlineClass from '../teacher/OnlineClass';
import { useLanguage } from '../../contexts/LanguageContext';


const TeacherDashboard: React.FC = () => {
    const [activePage, setActivePage] = useState('dashboard');
    const { t } = useLanguage();

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                 return <div><h1 className="text-2xl font-bold mb-4">{t('dashboard.teacher.title')}</h1><p>{t('dashboard.teacher.welcome')}</p></div>;
            case 'chat':
                return <Chat />;
            case 'online-class':
                return <OnlineClass />;
            case 'attendance':
                return <TakeAttendance />;
            case 'marks':
                return <EnterMarks />;
            case 'syllabus-designer':
                return <SyllabusDesigner />;
            case 'routines':
                return <ViewRoutines />;
            case 'syllabus':
                return <ViewSyllabus />;
            case 'gallery':
                return <Gallery />;
            case 'notices':
                return <NoticeBoard />;
            default:
                return <div>Select a page</div>;
        }
    };

    return (
        <div className="flex flex-1">
            <Sidebar userRole={UserRole.TEACHER} activePage={activePage} setActivePage={setActivePage} />
            <main className="flex-1 p-6 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
};

export default TeacherDashboard;