
import React from 'react';
import { useData } from '../../contexts/DataContext';

const ViewRoutines: React.FC = () => {
    const { exams, courses } = useData();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Exam Routines</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Time</th>
                                <th scope="col" className="px-6 py-3">Exam Name</th>
                                <th scope="col" className="px-6 py-3">Course</th>
                                <th scope="col" className="px-6 py-3">Subjects</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exams.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(exam => {
                                const course = courses.find(c => c.id === exam.courseId);
                                return (
                                    <tr key={exam.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{new Date(exam.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">{exam.time}</td>
                                        <td className="px-6 py-4">{exam.name}</td>
                                        <td className="px-6 py-4">{course?.name || 'N/A'}</td>
                                        <td className="px-6 py-4">{exam.subjects.join(', ')}</td>
                                    </tr>
                                );
                            })}
                            {exams.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-4">No exam routines available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ViewRoutines;
