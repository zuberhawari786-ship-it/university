

import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { ApplicationStatus, ExamApplication } from '../../types';
import AdmitCard from '../common/AdmitCard';

const PrintAdmitCardModal: React.FC<{ application: ExamApplication; onClose: () => void }> = ({ application, onClose }) => {
    const { students, exams, courses, universityInfo } = useData();
    const student = students.find(s => s.id === application.studentId);
    const exam = exams.find(e => e.id === application.examId);
    const course = courses.find(c => c.id === exam?.courseId);

    if (!student || !exam) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 no-print">
            <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg w-full max-w-2xl">
                <AdmitCard
                    title={`${exam.type} Exam Admit Card`}
                    studentInfo={{
                        name: student.name,
                        photo: student.photo,
                        rollNumber: student.rollNumber || 'N/A',
                        registrationNumber: student.registrationNumber || 'N/A',
                        courseName: course?.name || 'N/A',
                    }}
                    examInfo={{
                        name: exam.name,
                        date: exam.date,
                        time: exam.time,
                        subjects: exam.subjects,
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

const ManageSubmissions: React.FC = () => {
    const { examApplications, students, exams, updateExamApplicationStatus } = useData();
    const [printingApp, setPrintingApp] = useState<ExamApplication | null>(null);

    const handleStatusChange = (id: string, status: ApplicationStatus) => {
        if (window.confirm(`Are you sure you want to ${status.toLowerCase()} this application?`)) {
            updateExamApplicationStatus(id, status);
        }
    };
    
    const getStatusColor = (status: ApplicationStatus) => {
        switch (status) {
            case ApplicationStatus.APPROVED: return 'text-green-600';
            case ApplicationStatus.REJECTED: return 'text-red-600';
            case ApplicationStatus.PENDING: return 'text-yellow-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <>
            {printingApp && <PrintAdmitCardModal application={printingApp} onClose={() => setPrintingApp(null)} />}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Manage Exam Applications</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Student Name</th>
                                <th scope="col" className="px-6 py-3">Registration No.</th>
                                <th scope="col" className="px-6 py-3">Exam</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {examApplications.map(app => {
                                const student = students.find(s => s.id === app.studentId);
                                const exam = exams.find(e => e.id === app.examId);
                                return (
                                    <tr key={app.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td className="px-6 py-4">{student?.name || 'N/A'}</td>
                                        <td className="px-6 py-4">{app.registrationNumber}</td>
                                        <td className="px-6 py-4">{exam?.name || 'N/A'}</td>
                                        <td className={`px-6 py-4 font-semibold ${getStatusColor(app.status)}`}>{app.status}</td>
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
                                );
                            })}
                            {examApplications.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-4">No submissions yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ManageSubmissions;
