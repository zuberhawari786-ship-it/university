import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Exam, Result, Student, ExamType, ApplicationStatus } from '../../types';

const EnterMarks: React.FC = () => {
    const { exams, students, results, addResult, updateResult, entranceApplications, updateEntranceApplicationResult } = useData();
    const { user } = useAuth();
    const [selectedExamId, setSelectedExamId] = useState('');
    const [marks, setMarks] = useState<{ [entityId: string]: { [subject: string]: number } }>({});
    const [feedback, setFeedback] = useState('');

    const teacherSubjects = useMemo(() => user?.subjects || [], [user]);

    const selectedExam = useMemo(() => exams.find(e => e.id === selectedExamId), [exams, selectedExamId]);
    const isEntranceExam = selectedExam?.type === ExamType.ENTRANCE;

    const studentsForExam = useMemo(() => {
        if (!selectedExam || isEntranceExam) return [];
        return students.filter(s => s.isRegistered && s.details?.courseId === selectedExam.courseId);
    }, [students, selectedExam, isEntranceExam]);
    
    const applicantsForExam = useMemo(() => {
        if (!selectedExam || !isEntranceExam) return [];
        return entranceApplications.filter(app => app.courseId === selectedExam.courseId);
    }, [entranceApplications, selectedExam, isEntranceExam]);

    const subjectsForTeacherInExam = useMemo(() => {
        if (!selectedExam) return [];
        return selectedExam.subjects.filter(subject => teacherSubjects.includes(subject));
    }, [selectedExam, teacherSubjects]);

    const handleMarkChange = (entityId: string, subject: string, value: string) => {
        const score = parseInt(value, 10);
        if (isNaN(score) && value !== '') return;
        setMarks(prev => ({
            ...prev,
            [entityId]: {
                ...prev[entityId],
                [subject]: isNaN(score) ? 0 : Math.max(0, Math.min(100, score)),
            }
        }));
    };
    
    const getGrade = (avg: number) => {
        if (avg >= 90) return 'A+';
        if (avg >= 80) return 'A';
        if (avg >= 70) return 'B+';
        if (avg >= 60) return 'B';
        if (avg >= 50) return 'C';
        if (avg >= 40) return 'D';
        return 'F';
    };

    const handleSubmit = (entityId: string) => {
        if (!selectedExam) return;

        if (isEntranceExam) {
            const applicantMarks = marks[entityId] || {};
            const existingApplication = entranceApplications.find(app => app.id === entityId);
            const finalMarks = { ...existingApplication?.marks, ...applicantMarks };

            // FIX: Explicitly typed the accumulator and value in reduce to resolve arithmetic operation error.
            const totalMarks = Object.values(finalMarks).reduce((sum: number, mark: number) => sum + (mark || 0), 0);
            const average = selectedExam.subjects.length > 0 ? totalMarks / selectedExam.subjects.length : 0;
            const grade = getGrade(average);

            updateEntranceApplicationResult(entityId, finalMarks, grade);
            setFeedback(`Marks for ${existingApplication?.applicantName} submitted!`);

        } else {
            const studentMarks = marks[entityId] || {};
            const existingResult = results.find(r => r.studentId === entityId && r.examId === selectedExamId);
            const finalMarks = { ...existingResult?.marks, ...studentMarks };

            if (Object.keys(finalMarks).length < selectedExam.subjects.length) {
                setFeedback('Warning: Not all subject marks are entered. Submitting partial result.');
            }
            
            // FIX: Explicitly typed the accumulator and value in reduce to resolve arithmetic operation error.
            const totalMarks = Object.values(finalMarks).reduce((sum: number, mark: number) => sum + (mark || 0), 0);
            const average = selectedExam.subjects.length > 0 ? totalMarks / selectedExam.subjects.length : 0;
            const grade = getGrade(average);

            if (existingResult) {
                updateResult({ ...existingResult, marks: finalMarks, grade });
                setFeedback(`Marks for ${students.find(s=>s.id === entityId)?.name} updated!`);
            } else {
                addResult({ studentId: entityId, examId: selectedExamId, marks: finalMarks, grade, isPublished: false, isEditable: true });
                setFeedback(`Marks for ${students.find(s=>s.id === entityId)?.name} submitted!`);
            }
        }

        setTimeout(() => setFeedback(''), 3000);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Enter Student Marks</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <label className="label">Select Exam</label>
                <select value={selectedExamId} onChange={e => setSelectedExamId(e.target.value)} className="form-select">
                    <option value="">-- Select an Exam --</option>
                    {exams.map(exam => <option key={exam.id} value={exam.id}>{exam.name}</option>)}
                </select>
            </div>

            {selectedExam && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Entering Marks for: {selectedExam.name}</h3>
                    {feedback && <p className="text-green-600 mb-4">{feedback}</p>}
                    <div className="overflow-x-auto">
                        {isEntranceExam ? (
                             <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-500 dark:text-gray-400">
                                        <th className="p-2">Applicant Name</th>
                                        {selectedExam.subjects.map(sub => <th key={sub} className="p-2">{sub} ( /100)</th>)}
                                        <th className="p-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applicantsForExam.map(applicant => {
                                        const isDisabled = applicant.status === ApplicationStatus.ADMITTED;
                                        return (
                                            <tr key={applicant.id} className="border-t dark:border-gray-700">
                                                <td className="p-2 font-medium">{applicant.applicantName}<br/><span className="text-xs text-gray-500">{applicant.email}</span></td>
                                                {selectedExam.subjects.map(subject => (
                                                    <td key={subject} className="p-2">
                                                        <input 
                                                            type="number" 
                                                            className="form-input w-24"
                                                            value={marks[applicant.id]?.[subject] ?? applicant.marks?.[subject] ?? ''}
                                                            onChange={e => handleMarkChange(applicant.id, subject, e.target.value)}
                                                            disabled={isDisabled}
                                                        />
                                                    </td>
                                                ))}
                                                <td className="p-2">
                                                    <button onClick={() => handleSubmit(applicant.id)} className="btn-primary btn-sm" disabled={isDisabled}>
                                                        Submit
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <>
                                {subjectsForTeacherInExam.length === 0 && <p className="text-yellow-600">You are not assigned to teach any subjects in this exam.</p>}
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-gray-500 dark:text-gray-400">
                                            <th className="p-2">Student Name</th>
                                            {subjectsForTeacherInExam.map(sub => <th key={sub} className="p-2">{sub} ( /100)</th>)}
                                            <th className="p-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {studentsForExam.map(student => {
                                            const result = results.find(r => r.studentId === student.id && r.examId === selectedExamId);
                                            return (
                                                <tr key={student.id} className="border-t dark:border-gray-700">
                                                    <td className="p-2 font-medium">{student.name}<br/><span className="text-xs text-gray-500">{student.rollNumber}</span></td>
                                                    {subjectsForTeacherInExam.map(subject => (
                                                        <td key={subject} className="p-2">
                                                            <input 
                                                                type="number" 
                                                                className="form-input w-24"
                                                                value={marks[student.id]?.[subject] ?? result?.marks[subject] ?? ''}
                                                                onChange={e => handleMarkChange(student.id, subject, e.target.value)}
                                                                disabled={result?.isPublished && !result?.isEditable}
                                                            />
                                                        </td>
                                                    ))}
                                                    <td className="p-2">
                                                        {subjectsForTeacherInExam.length > 0 &&
                                                            <button onClick={() => handleSubmit(student.id)} className="btn-primary btn-sm" disabled={result?.isPublished && !result?.isEditable}>
                                                                {result ? 'Update' : 'Submit'}
                                                            </button>
                                                        }
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnterMarks;
