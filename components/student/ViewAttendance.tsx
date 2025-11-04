import React, { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const ViewAttendance: React.FC = () => {
    const { user } = useAuth();
    const { attendanceRecords, courses } = useData();

    const studentAttendance = useMemo(() => {
        if (!user) return {};
        
        const records = attendanceRecords.filter(r => r.studentId === user.id);
        const groupedByCourseAndSubject: { [courseName: string]: { [subject: string]: { present: number; absent: number } } } = {};

        records.forEach(record => {
            const courseName = courses.find(c => c.id === record.courseId)?.name || 'Unknown Course';
            if (!groupedByCourseAndSubject[courseName]) {
                groupedByCourseAndSubject[courseName] = {};
            }
            if (!groupedByCourseAndSubject[courseName][record.subject]) {
                groupedByCourseAndSubject[courseName][record.subject] = { present: 0, absent: 0 };
            }
            if (record.status === 'Present') {
                groupedByCourseAndSubject[courseName][record.subject].present++;
            } else {
                groupedByCourseAndSubject[courseName][record.subject].absent++;
            }
        });

        return groupedByCourseAndSubject;
    }, [user, attendanceRecords, courses]);
    
    const calculatePercentage = (present: number, absent: number): string => {
        const total = present + absent;
        if (total === 0) return 'N/A';
        return ((present / total) * 100).toFixed(2) + '%';
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Attendance Record</h2>
            {Object.keys(studentAttendance).length > 0 ? (
                <div className="space-y-6">
                    {Object.entries(studentAttendance).map(([courseName, subjects]) => (
                        <div key={courseName} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{courseName}</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th className="px-6 py-3">Subject</th>
                                            <th className="px-6 py-3 text-center">Classes Attended</th>
                                            <th className="px-6 py-3 text-center">Classes Missed</th>
                                            <th className="px-6 py-3 text-center">Total Classes</th>
                                            <th className="px-6 py-3 text-center">Attendance %</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(subjects).map(([subject, stats]) => (
                                            <tr key={subject} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{subject}</td>
                                                <td className="px-6 py-4 text-center">{stats.present}</td>
                                                <td className="px-6 py-4 text-center">{stats.absent}</td>
                                                <td className="px-6 py-4 text-center">{stats.present + stats.absent}</td>
                                                <td className="px-6 py-4 text-center font-semibold">{calculatePercentage(stats.present, stats.absent)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                    <p className="text-gray-600 dark:text-gray-400">No attendance records found for you yet.</p>
                </div>
            )}
        </div>
    );
};

export default ViewAttendance;