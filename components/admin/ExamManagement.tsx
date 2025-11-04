import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { ExamType, Result, Student, Exam } from '../../types';
import PrintableResultCard from '../common/PrintableResultCard';

const ResultViewerModal: React.FC<{ result: Result; onClose: () => void }> = ({ result, onClose }) => {
    const { exams, students } = useData();
    const student = students.find(s => s.id === result.studentId);
    const exam = exams.find(e => e.id === result.examId);

    const handlePrint = () => {
        window.print();
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 no-print">
            <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg w-full max-w-2xl">
                <PrintableResultCard result={result} exam={exam} student={student} />
                <div className="flex justify-end gap-4 pt-6">
                    <button type="button" onClick={onClose} className="btn-secondary">Close</button>
                    <button type="button" onClick={handlePrint} className="btn-primary">Print</button>
                </div>
            </div>
        </div>
    );
};


const ExamManagement: React.FC = () => {
    const { courses, exams, results, students, addExam, toggleResultEdit, deleteExam } = useData();
    const [newExam, setNewExam] = useState({ name: '', type: ExamType.SEMESTER, courseId: courses[0]?.id || '', date: '', time: '', subjects: '' });
    const [feedback, setFeedback] = useState('');
    const [viewingResult, setViewingResult] = useState<Result | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewExam(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newExam.name || !newExam.courseId || !newExam.date || !newExam.time || !newExam.subjects) {
            setFeedback('Please fill all fields.');
            setTimeout(() => setFeedback(''), 3000);
            return;
        }
        addExam({ ...newExam, subjects: newExam.subjects.split(',').map(s => s.trim()) });
        setFeedback('Exam scheduled successfully!');
        setNewExam({ name: '', type: ExamType.SEMESTER, courseId: courses[0]?.id || '', date: '', time: '', subjects: '' });
        setTimeout(() => setFeedback(''), 3000);
    };

    const handleDeleteExam = (examId: string, examName: string) => {
        if(window.confirm(`Are you sure you want to delete the exam "${examName}"? All associated results will also be deleted. This cannot be undone.`)) {
            deleteExam(examId);
        }
    }

    return (
        <div className="space-y-8">
            {viewingResult && <ResultViewerModal result={viewingResult} onClose={() => setViewingResult(null)} />}
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Schedule New Exam</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg border dark:border-gray-700">
                        <div>
                            <label className="label">Exam Name</label>
                            <input type="text" name="name" value={newExam.name} onChange={handleInputChange} className="form-input" />
                        </div>
                        <div>
                            <label className="label">Exam Type</label>
                            <select name="type" value={newExam.type} onChange={handleInputChange} className="form-select">
                                {Object.values(ExamType).map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="label">Course</label>
                            <select name="courseId" value={newExam.courseId} onChange={handleInputChange} className="form-select">
                                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="label">Subjects (comma-separated)</label>
                            <input type="text" name="subjects" value={newExam.subjects} onChange={handleInputChange} className="form-input" />
                        </div>
                        <div>
                            <label className="label">Date</label>
                            <input type="date" name="date" value={newExam.date} onChange={handleInputChange} className="form-input" />
                        </div>
                        <div>
                            <label className="label">Time</label>
                            <input type="time" name="time" value={newExam.time} onChange={handleInputChange} className="form-input" />
                        </div>
                    </div>
                     <div className="flex justify-end items-center pt-2">
                        {feedback && <p className="text-green-600 dark:text-green-400 text-sm mr-4">{feedback}</p>}
                        <button type="submit" className="btn-primary">Schedule Exam</button>
                    </div>
                </form>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Scheduled Exams</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Exam Name</th>
                                <th scope="col" className="px-6 py-3">Course</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exams.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(exam => (
                                <tr key={exam.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td className="px-6 py-4">{exam.name}</td>
                                    <td className="px-6 py-4">{courses.find(c => c.id === exam.courseId)?.name || 'N/A'}</td>
                                    <td className="px-6 py-4">{new Date(exam.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleDeleteExam(exam.id, exam.name)} className="font-medium text-red-600 dark:text-red-400 hover:underline">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {exams.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-4">No exams scheduled yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Manage Submitted Results</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Student</th>
                                <th scope="col" className="px-6 py-3">Exam</th>
                                <th scope="col" className="px-6 py-3">Grade</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map(result => {
                                const student = students.find(s => s.id === result.studentId);
                                const exam = exams.find(e => e.id === result.examId);
                                return (
                                    <tr key={result.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td className="px-6 py-4">{student?.name}</td>
                                        <td className="px-6 py-4">{exam?.name}</td>
                                        <td className="px-6 py-4">{result.grade}</td>
                                        <td className="px-6 py-4">{result.isEditable ? 'Unlocked' : 'Locked'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                            <button onClick={() => setViewingResult(result)} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">View</button>
                                            <button onClick={() => toggleResultEdit(result.id)} className={`px-3 py-1 text-xs font-medium rounded-full ${result.isEditable ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                                                {result.isEditable ? 'Lock' : 'Unlock for Edit'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {results.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-4">No results have been submitted yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExamManagement;