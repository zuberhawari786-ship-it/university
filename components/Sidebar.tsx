import React from 'react';
import { UserRole } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
    userRole: UserRole;
    activePage: string;
    setActivePage: (page: string) => void;
}

const iconClasses = "h-5 w-5 mr-3 flex-shrink-0";

const NAV_ICONS = {
    dashboard: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    pulse: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 5.636a9 9 0 0112.728 0m-12.728 0a5 5 0 017.072 0" /></svg>,
    chat: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
    users: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm6-11a3 3 0 100-6 3 3 0 000 6z" /></svg>,
    curriculum: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg>,
    exams: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    fees: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    entrance: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>,
    tracking: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    notices: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    settings: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    profile: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    attendance: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
    marks: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
    routines: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    syllabus: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg>,
    registration: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
    idCard: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
    results: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    examApplication: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    admission: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>,
    examApps: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
    feeCollection: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    gallery: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    shop: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    books: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg>,
    package: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10M4 7v10l8 4" /></svg>,
    video: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
    complaint: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>,
    remoteSupport: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    tv: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    calendar: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    hostel: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    project: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
    research: <svg className={iconClasses} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
};


const NAV_ITEMS_STRUCTURE = {
    [UserRole.ADMIN]: [
        { id: 'dashboard', labelKey: 'sidebar.dashboard', icon: NAV_ICONS.dashboard },
        { id: 'campus-pulse', labelKey: 'sidebar.campusPulse', icon: NAV_ICONS.pulse },
        { id: 'chat', labelKey: 'sidebar.messages', icon: NAV_ICONS.chat },
        { id: 'users', labelKey: 'sidebar.userManagement', icon: NAV_ICONS.users },
        { id: 'student-tracking', labelKey: 'sidebar.studentTracking', icon: NAV_ICONS.tracking },
        { id: 'curriculum', labelKey: 'sidebar.curriculum', icon: NAV_ICONS.curriculum },
        { id: 'exams', labelKey: 'sidebar.examManagement', icon: NAV_ICONS.exams },
        { id: 'resource-center', labelKey: 'sidebar.resourceCenter', icon: NAV_ICONS.package },
        { id: 'fees', labelKey: 'sidebar.feeManagement', icon: NAV_ICONS.fees },
        { id: 'hostel', labelKey: 'sidebar.hostelManagement', icon: NAV_ICONS.hostel },
        { id: 'entrance', labelKey: 'sidebar.entranceResults', icon: NAV_ICONS.entrance },
        { id: 'calendar', labelKey: 'sidebar.academicCalendar', icon: NAV_ICONS.calendar },
        { id: 'remote-support', labelKey: 'sidebar.remoteSupport', icon: NAV_ICONS.remoteSupport },
        { id: 'complaints', labelKey: 'sidebar.manageComplaints', icon: NAV_ICONS.complaint },
        { id: 'notices', labelKey: 'sidebar.manageNotices', icon: NAV_ICONS.notices },
        { id: 'gallery', labelKey: 'sidebar.gallery', icon: NAV_ICONS.gallery },
        { id: 'settings', labelKey: 'sidebar.universitySettings', icon: NAV_ICONS.settings },
        { id: 'profile', labelKey: 'sidebar.adminProfile', icon: NAV_ICONS.profile },
    ],
    [UserRole.TEACHER]: [
        { id: 'dashboard', labelKey: 'sidebar.dashboard', icon: NAV_ICONS.dashboard },
        { id: 'campus-pulse', labelKey: 'sidebar.campusPulse', icon: NAV_ICONS.pulse },
        { id: 'chat', labelKey: 'sidebar.messages', icon: NAV_ICONS.chat },
        { id: 'online-class', labelKey: 'sidebar.liveClass', icon: NAV_ICONS.video },
        { id: 'attendance', labelKey: 'sidebar.takeAttendance', icon: NAV_ICONS.attendance },
        { id: 'marks', labelKey: 'sidebar.enterMarks', icon: NAV_ICONS.marks },
        { id: 'project-submissions', labelKey: 'sidebar.projectSubmissions', icon: NAV_ICONS.project },
        { id: 'syllabus-designer', labelKey: 'sidebar.syllabusDesigner', icon: NAV_ICONS.marks },
        { id: 'resource-center', labelKey: 'sidebar.resourceCenter', icon: NAV_ICONS.package },
        { id: 'calendar', labelKey: 'sidebar.academicCalendar', icon: NAV_ICONS.calendar },
        { id: 'routines', labelKey: 'sidebar.viewRoutines', icon: NAV_ICONS.routines },
        { id: 'syllabus', labelKey: 'sidebar.viewSyllabus', icon: NAV_ICONS.syllabus },
        { id: 'gallery', labelKey: 'sidebar.gallery', icon: NAV_ICONS.gallery },
        { id: 'notices', labelKey: 'sidebar.noticeBoard', icon: NAV_ICONS.notices },
        { id: 'profile', labelKey: 'sidebar.myProfile', icon: NAV_ICONS.profile },
    ],
    [UserRole.STUDENT]: [
        { id: 'dashboard', labelKey: 'sidebar.dashboard', icon: NAV_ICONS.dashboard },
        { id: 'campus-pulse', labelKey: 'sidebar.campusPulse', icon: NAV_ICONS.pulse },
        { id: 'chat', labelKey: 'sidebar.messages', icon: NAV_ICONS.chat },
        { id: 'join-class', labelKey: 'sidebar.joinClass', icon: NAV_ICONS.video },
        { id: 'registration', labelKey: 'sidebar.myRegistration', icon: NAV_ICONS.registration },
        { id: 'id-card', labelKey: 'sidebar.idCard', icon: NAV_ICONS.idCard },
        { id: 'my-hostel', labelKey: 'sidebar.myHostel', icon: NAV_ICONS.hostel },
        { id: 'calendar', labelKey: 'sidebar.academicCalendar', icon: NAV_ICONS.calendar },
        { id: 'project-work', labelKey: 'sidebar.projectWork', icon: NAV_ICONS.project },
        { id: 'resource-center', labelKey: 'sidebar.resourceCenter', icon: NAV_ICONS.package },
        { id: 'routines', labelKey: 'sidebar.examRoutines', icon: NAV_ICONS.routines },
        { id: 'syllabus', labelKey: 'sidebar.syllabus', icon: NAV_ICONS.syllabus },
        { id: 'results', labelKey: 'sidebar.viewResults', icon: NAV_ICONS.results },
        { id: 'attendance', labelKey: 'sidebar.myAttendance', icon: NAV_ICONS.attendance },
        { id: 'exam-application', labelKey: 'sidebar.applyForExam', icon: NAV_ICONS.examApplication },
        { id: 'fees', labelKey: 'sidebar.myFees', icon: NAV_ICONS.fees },
        { id: 'complaint-box', labelKey: 'sidebar.complaintBox', icon: NAV_ICONS.complaint },
        { id: 'book-shop', labelKey: 'sidebar.notesAndBooksShop', icon: NAV_ICONS.books },
        { id: 'online-shop', labelKey: 'sidebar.onlineShop', icon: NAV_ICONS.shop },
        { id: 'tv', labelKey: 'sidebar.universityTV', icon: NAV_ICONS.tv },
        { id: 'gallery', labelKey: 'sidebar.gallery', icon: NAV_ICONS.gallery },
        { id: 'notices', labelKey: 'sidebar.noticeBoard', icon: NAV_ICONS.notices },
        { id: 'profile', labelKey: 'sidebar.myProfile', icon: NAV_ICONS.profile },
    ],
    [UserRole.RECEPTIONIST]: [
        { id: 'dashboard', labelKey: 'sidebar.dashboard', icon: NAV_ICONS.dashboard },
        { id: 'campus-pulse', labelKey: 'sidebar.campusPulse', icon: NAV_ICONS.pulse },
        { id: 'chat', labelKey: 'sidebar.messages', icon: NAV_ICONS.chat },
        { id: 'entrance', labelKey: 'sidebar.entranceForm', icon: NAV_ICONS.entrance },
        { id: 'admission', labelKey: 'sidebar.studentAdmission', icon: NAV_ICONS.admission },
        { id: 'exam-applications', labelKey: 'sidebar.manageExamApps', icon: NAV_ICONS.examApps },
        { id: 'fee-collection', labelKey: 'sidebar.feeCollection', icon: NAV_ICONS.feeCollection },
        { id: 'hostel', labelKey: 'sidebar.hostelManagement', icon: NAV_ICONS.hostel },
        { id: 'calendar', labelKey: 'sidebar.academicCalendar', icon: NAV_ICONS.calendar },
        { id: 'gallery', labelKey: 'sidebar.gallery', icon: NAV_ICONS.gallery },
        { id: 'notices', labelKey: 'sidebar.noticeBoard', icon: NAV_ICONS.notices },
        { id: 'profile', labelKey: 'sidebar.myProfile', icon: NAV_ICONS.profile },
    ],
    [UserRole.SHOPKEEPER]: [
        { id: 'dashboard', labelKey: 'sidebar.dashboard', icon: NAV_ICONS.dashboard },
        { id: 'campus-pulse', labelKey: 'sidebar.campusPulse', icon: NAV_ICONS.pulse },
        { id: 'products', labelKey: 'sidebar.manageProducts', icon: NAV_ICONS.package },
        { id: 'chat', labelKey: 'sidebar.messages', icon: NAV_ICONS.chat },
        { id: 'profile', labelKey: 'sidebar.myProfile', icon: NAV_ICONS.profile },
    ],
    [UserRole.EXAMINER]: [
        { id: 'dashboard', labelKey: 'sidebar.dashboard', icon: NAV_ICONS.dashboard },
        { id: 'exams', labelKey: 'sidebar.examManagement', icon: NAV_ICONS.exams },
        { id: 'project-submissions', labelKey: 'sidebar.projectSubmissions', icon: NAV_ICONS.project },
        { id: 'chat', labelKey: 'sidebar.messages', icon: NAV_ICONS.chat },
        { id: 'profile', labelKey: 'sidebar.myProfile', icon: NAV_ICONS.profile },
    ],
    [UserRole.ACCOUNTING]: [
        { id: 'dashboard', labelKey: 'sidebar.dashboard', icon: NAV_ICONS.dashboard },
        { id: 'fees', labelKey: 'sidebar.feeManagement', icon: NAV_ICONS.fees },
        { id: 'fee-collection', labelKey: 'sidebar.feeCollection', icon: NAV_ICONS.feeCollection },
        { id: 'chat', labelKey: 'sidebar.messages', icon: NAV_ICONS.chat },
        { id: 'profile', labelKey: 'sidebar.myProfile', icon: NAV_ICONS.profile },
    ],
    [UserRole.RESEARCHER]: [
        { id: 'dashboard', labelKey: 'sidebar.dashboard', icon: NAV_ICONS.dashboard },
        { id: 'research-portal', labelKey: 'sidebar.researchPortal', icon: NAV_ICONS.research },
        { id: 'resource-center', labelKey: 'sidebar.resourceCenter', icon: NAV_ICONS.package },
        { id: 'campus-pulse', labelKey: 'sidebar.campusPulse', icon: NAV_ICONS.pulse },
        { id: 'chat', labelKey: 'sidebar.messages', icon: NAV_ICONS.chat },
        { id: 'calendar', labelKey: 'sidebar.academicCalendar', icon: NAV_ICONS.calendar },
        { id: 'gallery', labelKey: 'sidebar.gallery', icon: NAV_ICONS.gallery },
        { id: 'notices', labelKey: 'sidebar.noticeBoard', icon: NAV_ICONS.notices },
        { id: 'profile', labelKey: 'sidebar.myProfile', icon: NAV_ICONS.profile },
    ],
};

const Sidebar: React.FC<SidebarProps> = ({ userRole, activePage, setActivePage }) => {
    const { t } = useLanguage();
    const navItems = NAV_ITEMS_STRUCTURE[userRole] || [];

    return (
        <aside className="w-64 bg-transparent border-r border-[var(--border-color)] flex-shrink-0 p-4 overflow-y-auto">
            <nav>
                <ul>
                    {navItems.map(item => (
                        <li key={item.id}>
                            <button
                                onClick={() => setActivePage(item.id)}
                                className={`w-full text-left px-4 py-2.5 my-1 rounded-md text-sm font-medium transition-colors flex items-center relative
                                    ${activePage === item.id 
                                        ? 'bg-[rgba(0,191,255,0.15)] text-white shadow-[0_0_10px_rgba(0,191,255,0.5)]' 
                                        : 'text-[var(--text-main)] hover:bg-[rgba(0,191,255,0.1)]'
                                    }`}
                            >
                                {activePage === item.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-r-full shadow-[0_0_8px_var(--primary-400)]"></div>}
                                {item.icon}
                                <span>{t(item.labelKey)}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;