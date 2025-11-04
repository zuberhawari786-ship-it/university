
import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Student, ExamApplication as ExamApplicationType, ApplicationStatus } from '../../types';
import AdmitCard from '../common/AdmitCard';

const PrintAdmitCardModal: React.FC<{ application: ExamApplicationType; onClose: () => void }> = ({ application, onClose }) => {
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


const ExamApplication: React.FC<{ setActivePage: (page: string) => void }> = ({ setActivePage }) => {
    const { user } = useAuth();
    const { students, exams, addExamApplication, examApplications } = useData();
    const [selectedExamId, setSelectedExamId] = useState('');
    const [isDeclared, setIsDeclared] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [printingApp, setPrintingApp] = useState<ExamApplicationType | null>(null);
    
    const student = useMemo(() => students.find(s => s.id === user?.id), [students, user]);
    const studentApplications = useMemo(() => examApplications.filter(app => app.studentId === student?.id), [examApplications, student]);

    const availableExams = useMemo(() => {
        if (!student || !student.details) return [];
        return exams.filter(exam => 
            exam.courseId === student.details?.courseId &&
            !studentApplications.some(app => app.examId === exam.id)
        );
    }, [exams, student, studentApplications]);
    
    const selectedExam = useMemo(() => {
        if (!selectedExamId) return null;
        return exams.find(e => e.id === selectedExamId);
    }, [selectedExamId, exams]);

    if (!student?.isRegistered) {
        return (
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-2">Registration Required</h2>
                <p>You must complete your registration before applying for exams.</p>
            </div>
        );
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!student || !selectedExamId || !student.registrationNumber || !isDeclared) {
            setFeedback('Please select an exam and agree to the declaration.');
            return;
        }
        addExamApplication({
            studentId: student.id,
            examId: selectedExamId,
            registrationNumber: student.registrationNumber,
        });
        setFeedback('Application submitted successfully!');
        setSelectedExamId('');
        setIsDeclared(false);
        setTimeout(() => setFeedback(''), 3000);
    };
    
    const getStatusColor = (status: ApplicationStatus) => {
        switch (status) {
            case ApplicationStatus.APPROVED: return 'bg-green-100 text-green-800';
            case ApplicationStatus.REJECTED: return 'bg-red-100 text-red-800';
            case ApplicationStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-8">
            {printingApp && <PrintAdmitCardModal application={printingApp} onClose={() => setPrintingApp(null)} />}
            
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Exam Registration Form</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <section>
                        <h3 className="form-section-title">Select Examination</h3>
                        <div>
                            <label className="label">Select an available exam from the list</label>
                            <select value={selectedExamId} onChange={e => { setSelectedExamId(e.target.value); setIsDeclared(false); }} className="form-select" required>
                                <option value="" disabled>-- Select an exam --</option>
                                {availableExams.map(exam => <option key={exam.id} value={exam.id}>{exam.name} ({exam.type})</option>)}
                            </select>
                            {availableExams.length === 0 && <p className="text-sm text-gray-500 mt-2">No new exams available for application at this time.</p>}
                        </div>
                    </section>

                    {selectedExam && student && (
                        <>
                            <section>
                                <h3 className="form-section-title">Exam Details</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm p-4 bg-gray-50 dark:bg-gray-900/50 rounded-md">
                                    <div><strong className="block text-gray-500">Exam Name</strong>{selectedExam.name}</div>
                                    <div><strong className="block text-gray-500">Type</strong>{selectedExam.type}</div>
                                    <div><strong className="block text-gray-500">Date & Time</strong>{new Date(selectedExam.date).toLocaleDateString()} at {selectedExam.time}</div>
                                    <div className="col-span-2"><strong className="block text-gray-500">Subjects</strong>{selectedExam.subjects.join(', ')}</div>
                                </div>
                            </section>
                            
                            <section>
                                <h3 className="form-section-title">Applicant Details</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                     <div><strong className="block text-gray-500">Name</strong>{student.name}</div>
                                     <div><strong className="block text-gray-500">Registration No.</strong>{student.registrationNumber}</div>
                                </div>
                            </section>

                            <section>
                                <h3 className="form-section-title">Declaration</h3>
                                <div className="flex items-start">
                                    <input
                                        id="declaration"
                                        type="checkbox"
                                        checked={isDeclared}
                                        onChange={(e) => setIsDeclared(e.target.checked)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
                                    />
                                    <label htmlFor="declaration" className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                                        I hereby declare that the information provided is true and correct. I have read the examination rules and agree to abide by them.
                                    </label>
                                </div>
                            </section>
                        </>
                    )}
                    
                    <div className="flex justify-end items-center pt-4 border-t dark:border-gray-700">
                        {feedback && <p className="text-green-600 dark:text-green-400 text-sm mr-4">{feedback}</p>}
                        <button 
                            type="submit" 
                            className="btn-primary" 
                            disabled={!selectedExamId || !isDeclared}
                        >
                            Submit Application
                        </button>
                    </div>
                </form>
            </div>

            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Applications</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                           <tr>
                                <th className="text-left p-2">Exam Name</th>
                                <th className="text-left p-2">Status</th>
                                <th className="text-left p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentApplications.map(app => {
                                const exam = exams.find(e => e.id === app.examId);
                                return (
                                <tr key={app.id} className="border-t dark:border-gray-700">
                                    <td className="p-2">{exam?.name || 'Unknown Exam'}</td>
                                    <td className="p-2"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>{app.status}</span></td>
                                    <td className="p-2">
                                        {app.status === ApplicationStatus.APPROVED && (
                                            <button onClick={() => setPrintingApp(app)} className="btn-secondary btn-sm">View Admit Card</button>
                                        )}
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                     {studentApplications.length === 0 && <p className="text-center text-sm text-gray-500 py-4">You have not applied for any exams yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default ExamApplication;
