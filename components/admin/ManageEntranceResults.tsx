

import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { ApplicationStatus, EntranceApplication, ExamType } from '../../types';
import AdmitCard from '../common/AdmitCard';

const PrintEntranceAdmitCardModal: React.FC<{ application: EntranceApplication; onClose: () => void }> = ({ application, onClose }) => {
    const { courses, universityInfo, exams } = useData();
    const course = courses.find(c => c.id === application.courseId);
    const entranceExam = exams.find(e => e.type === ExamType.ENTRANCE && e.courseId === application.courseId);

    const handlePrint = () => {
        window.print();
    };
    
    const entranceRollNo = `ENT-${application.id.slice(-5).toUpperCase()}`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 no-print">
            <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg w-full max-w-2xl">
                <AdmitCard
                    title="Entrance Exam Admit Card"
                    studentInfo={{
                        name: application.applicantName,
                        photo: application.documents.photo,
                        rollNumber: entranceRollNo,
                        courseName: course?.name || 'N/A',
                    }}
                    examInfo={{
                        name: entranceExam?.name || 'University Entrance Test',
                        date: entranceExam?.date || 'To be announced',
                        time: entranceExam?.time || 'To be announced',
                        subjects: entranceExam?.subjects || ['General Aptitude', 'Course-specific test'],
                        venue: 'Main Examination Hall',
                    }}
                    universityInfo={universityInfo}
                />
                <div className="flex justify-end gap-4 pt-6">
                    <button type="button" onClick={onClose} className="btn-secondary">Close</button>
                    <button type="button" onClick={handlePrint} className="btn-primary">Print</button>
                </div>
            </div>
        </div>
    );
};


const ManageEntranceResults: React.FC = () => {
    const { entranceApplications, updateEntranceApplicationStatus } = useData();
    const [printingApp, setPrintingApp] = useState<EntranceApplication | null>(null);

    const handleStatusChange = (id: string, status: ApplicationStatus) => {
        if (window.confirm(`Are you sure you want to ${status.toLowerCase()} this application?`)) {
            updateEntranceApplicationStatus(id, status);
        }
    };

    return (
        <>
            {printingApp && <PrintEntranceAdmitCardModal application={printingApp} onClose={() => setPrintingApp(null)} />}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Manage Entrance Applications</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Applicant Name</th>
                                <th scope="col" className="px-6 py-3">Course</th>
                                <th scope="col" className="px-6 py-3">Contact</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Grade</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entranceApplications.map(app => (
                                <tr key={app.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td className="px-6 py-4">{app.applicantName}</td>
                                    <td className="px-6 py-4">{app.courseId.toUpperCase()}</td>
                                    <td className="px-6 py-4">{app.email}</td>
                                    <td className="px-6 py-4">{app.status}</td>
                                    <td className="px-6 py-4 font-bold">{app.grade || 'Not Graded'}</td>
                                    <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                                        {app.status === ApplicationStatus.PENDING && (
                                            <>
                                                <button onClick={() => handleStatusChange(app.id, ApplicationStatus.APPROVED)} className="font-medium text-green-600 hover:underline">Approve</button>
                                                <button onClick={() => handleStatusChange(app.id, ApplicationStatus.REJECTED)} className="font-medium text-red-600 hover:underline">Reject</button>
                                            </>
                                        )}
                                        {app.status === ApplicationStatus.APPROVED && (
                                            <button onClick={() => setPrintingApp(app)} className="font-medium text-indigo-600 hover:underline">Print Admit Card</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {entranceApplications.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-4">No entrance applications submitted yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ManageEntranceResults;