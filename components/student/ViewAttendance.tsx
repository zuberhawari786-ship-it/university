import React, { useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { AttendanceRecord } from '../../types';

// Modal to show detailed attendance for a subject
const DetailsModal: React.FC<{ subject: string; records: AttendanceRecord[]; onClose: () => void }> = ({ subject, records, onClose }) => {
    const sortedRecords = useMemo(() => 
        records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), 
    [records]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="card w-full max-w-lg p-6">
                <h3 className="text-xl font-bold mb-4">Attendance Details for {subject}</h3>
                <div className="max-h-96 overflow-y-auto pr-2 space-y-2">
                    {sortedRecords.map(record => (
                        <div key={record.id} className="flex justify-between items-center p-2 rounded-md bg-gray-900/50">
                            <p>{new Date(record.date).toLocaleDateString()}</p>
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                record.status === 'Present' 
                                ? 'bg-green-200 text-green-800' 
                                : 'bg-red-200 text-red-800'
                            }`}>
                                {record.status}
                            </span>
                        </div>
                    ))}
                    {sortedRecords.length === 0 && <p className="text-gray-400">No records for this subject yet.</p>}
                </div>
                <div className="text-right mt-6">
                    <button onClick={onClose} className="btn-secondary">Close</button>
                </div>
            </div>
        </div>
    );
};


const ViewAttendance: React.FC = () => {
    const { user } = useAuth();
    const { attendanceRecords, courses } = useData();
    const [detailsSubject, setDetailsSubject] = useState<{ courseName: string, subjectName: string } | null>(null);

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
    
    const calculatePercentage = (present: number, absent: number): number => {
        const total = present + absent;
        if (total === 0) return 0;
        return (present / total) * 100;
    };
    
    const recordsForModal = useMemo(() => {
        if (!detailsSubject || !user) return [];
        const courseId = courses.find(c => c.name === detailsSubject.courseName)?.id;
        return attendanceRecords.filter(r => 
            r.studentId === user.id && 
            r.courseId === courseId &&
            r.subject === detailsSubject.subjectName
        );
    }, [detailsSubject, attendanceRecords, courses, user]);


    return (
        <div className="space-y-6">
            {detailsSubject && (
                <DetailsModal 
                    subject={detailsSubject.subjectName}
                    records={recordsForModal}
                    onClose={() => setDetailsSubject(null)}
                />
            )}

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
                                            <th className="px-4 py-3">Subject</th>
                                            <th className="px-4 py-3 text-center">Attended</th>
                                            <th className="px-4 py-3 text-center">Missed</th>
                                            <th className="px-4 py-3 text-center w-1/4">Attendance %</th>
                                            <th className="px-4 py-3 text-center">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(subjects).map(([subject, stats]) => {
                                            const percentage = calculatePercentage(stats.present, stats.absent);
                                            const barColor = percentage >= 75 ? 'bg-cyan-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500';

                                            return (
                                                <tr key={subject} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                                    <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">{subject}</td>
                                                    <td className="px-4 py-4 text-center text-green-400">{stats.present}</td>
                                                    <td className="px-4 py-4 text-center text-red-400">{stats.absent}</td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                                                <div className={`${barColor} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
                                                            </div>
                                                            <span className="font-semibold text-xs w-12 text-right">{percentage.toFixed(1)}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <button 
                                                            onClick={() => setDetailsSubject({ courseName, subjectName: subject })}
                                                            className="btn-secondary btn-sm"
                                                        >
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
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
