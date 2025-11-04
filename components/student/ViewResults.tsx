import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Result, Exam, Student } from '../../types';
import PrintableResultCard from '../common/PrintableResultCard';


const ViewResults: React.FC = () => {
    const { user } = useAuth();
    const { results, exams, students } = useData();
    const [selectedResult, setSelectedResult] = useState<Result | null>(null);

    const studentResults = results.filter(r => r.studentId === user?.id && r.isPublished);
    const currentStudent = students.find(s => s.id === user?.id);

    const handlePrint = () => {
        window.print();
    };

    if (selectedResult) {
        const exam = exams.find(e => e.id === selectedResult.examId);
        return (
            <div>
                <button onClick={() => setSelectedResult(null)} className="btn-primary mb-4 no-print">&larr; Back to Results</button>
                <PrintableResultCard result={selectedResult} exam={exam} student={currentStudent as Student} />
                <div className="text-center mt-6 no-print">
                    <button onClick={handlePrint} className="btn-primary">Print Result Card</button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Exam Results</h2>
            {studentResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {studentResults.map(result => {
                        const exam = exams.find(e => e.id === result.examId);
                        return (
                            <div key={result.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{exam?.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Date: {exam ? new Date(exam.date).toLocaleDateString() : 'N/A'}</p>
                                <div className="mt-4 pt-4 border-t dark:border-gray-700 flex justify-between items-center">
                                    <span className="font-bold text-xl">Grade: <span className="text-green-600 dark:text-green-400">{result.grade}</span></span>
                                    <button onClick={() => setSelectedResult(result)} className="btn-primary text-sm">View Details</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-gray-600 dark:text-gray-400">No results have been published for you yet.</p>
            )}
        </div>
    );
};

export default ViewResults;