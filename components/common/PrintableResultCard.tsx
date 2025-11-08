import React from 'react';
import { Result, Exam, Student } from '../../types';

const PrintableResultCard: React.FC<{ result: Result; exam?: Exam; student?: Student }> = ({ result, exam, student }) => {
    // FIX: Explicitly typed the accumulator and value in reduce to resolve arithmetic operation error.
    const totalMarks = Object.values(result.marks).reduce((sum: number, mark: number) => sum + (mark || 0), 0);
    const maxMarks = Object.keys(result.marks).length * 100;
    const percentage = maxMarks > 0 ? ((totalMarks / maxMarks) * 100).toFixed(2) : 0;

    if (!student || !exam) {
        return <div className="p-4">Loading student or exam data...</div>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 printable">
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Result Card</h2>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{exam?.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div><strong>Student Name:</strong> {student?.name}</div>
                <div><strong>Roll Number:</strong> {student?.rollNumber}</div>
                <div><strong>Exam Date:</strong> {exam ? new Date(exam.date).toLocaleDateString() : 'N/A'}</div>
                <div><strong>Course:</strong> {exam?.courseId.toUpperCase()}</div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Subject</th>
                            <th scope="col" className="px-6 py-3 text-right">Marks Obtained</th>
                            <th scope="col" className="px-6 py-3 text-right">Max Marks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(result.marks).map(([subject, mark]) => (
                            <tr key={subject} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{subject}</td>
                                <td className="px-6 py-4 text-right">{mark}</td>
                                <td className="px-6 py-4 text-right">100</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="font-semibold text-gray-800 dark:text-white">
                         <tr className="bg-gray-50 dark:bg-gray-700">
                            <td className="px-6 py-3">Total</td>
                            <td className="px-6 py-3 text-right">{totalMarks}</td>
                            <td className="px-6 py-3 text-right">{maxMarks}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div className="mt-6 flex justify-between items-center text-lg font-bold">
                 <span>Percentage: {percentage}%</span>
                 <span>Grade: <span className="text-green-600 dark:text-green-400">{result.grade}</span></span>
            </div>
        </div>
    );
};

export default PrintableResultCard;
