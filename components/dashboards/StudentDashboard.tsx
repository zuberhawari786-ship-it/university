import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import { UserRole } from '../../types';
import ViewRoutines from '../student/ViewRoutines';
import ViewSyllabus from '../student/ViewSyllabus';
import ViewResults from '../student/ViewResults';
import NoticeBoard from '../common/NoticeBoard';
import StudentRegistration from '../student/StudentRegistration';
import ExamApplication from '../student/ExamApplication';
import IdCard from '../student/IdCard';
import ViewAttendance from '../student/ViewAttendance';
import StudentFees from '../student/StudentFees';
import Chat from '../common/Chat';
import Gallery from '../common/Gallery';
import NotesAndBooksShop from '../student/NotesAndBooksShop';
import OnlineShop from '../student/OnlineShop';
import JoinClass from '../student/JoinClass';
import ComplaintBox from '../student/ComplaintBox';
import { useLanguage } from '../../contexts/LanguageContext';
import TVApp from '../common/TVApp';
import CampusPulse from '../common/CampusPulse';
import AcademicCalendar from '../common/AcademicCalendar';
import MyHostel from '../student/MyHostel';
import ProjectSubmission from '../student/ProjectSubmission';
import ResourceCenter from '../common/ResourceCenter';
import UserProfile from '../common/UserProfile';

const StudentDashboard: React.FC = () => {
    const [activePage, setActivePage] = useState('dashboard');
    const { t } = useLanguage();

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return <div><h1 className="text-2xl font-bold mb-4">{t('dashboard.student.title')}</h1><p>{t('dashboard.student.welcome')}</p></div>;
            case 'campus-pulse':
                return <CampusPulse />;
            case 'chat':
                return <Chat />;
            case 'join-class':
                return <JoinClass />;
            case 'registration':
                return <StudentRegistration setActivePage={setActivePage} />;
            case 'id-card':
                return <IdCard />;
            case 'my-hostel':
                return <MyHostel />;
            case 'calendar':
                return <AcademicCalendar />;
            case 'project-work':
                return <ProjectSubmission />;
            case 'resource-center':
                return <ResourceCenter />;
            case 'routines':
                return <ViewRoutines />;
            case 'syllabus':
                return <ViewSyllabus />;
            case 'results':
                return <ViewResults />;
            case 'attendance':
                return <ViewAttendance />;
            case 'exam-application':
                return <ExamApplication setActivePage={setActivePage} />;
            case 'fees':
                return <StudentFees />;
            case 'complaint-box':
                return <ComplaintBox />;
            case 'book-shop':
                return <NotesAndBooksShop />;
            case 'online-shop':
                return <OnlineShop />;
            case 'tv':
                return <TVApp />;
            case 'gallery':
                return <Gallery />;
            case 'notices':
                return <NoticeBoard />;
            case 'profile':
                return <UserProfile />;
            default:
                return <div>Select a page</div>;
        }
    };

    return (
        <div className="flex flex-1">
            <Sidebar userRole={UserRole.STUDENT} activePage={activePage} setActivePage={setActivePage} />
            <main className="flex-1 p-6 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
};

export default StudentDashboard;