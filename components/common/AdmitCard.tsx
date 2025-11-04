
import React from 'react';
import { UniversityInfo } from '../../types';

interface AdmitCardProps {
    title: string;
    studentInfo: {
        name: string;
        photo: string;
        rollNumber: string;
        courseName?: string;
        registrationNumber?: string;
    };
    examInfo: {
        name: string;
        date: string;
        time: string;
        subjects: string[];
        venue: string;
    };
    universityInfo: UniversityInfo;
}

const AdmitCard: React.FC<AdmitCardProps> = ({ title, studentInfo, examInfo, universityInfo }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border-4 border-indigo-500 printable">
            <div className="text-center border-b-2 border-indigo-500 pb-4 mb-4">
                <img src={universityInfo.logo} alt="Logo" className="h-10 mx-auto mb-2" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{universityInfo.name}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
            </div>
            <div className="flex items-start space-x-6">
                <img src={studentInfo.photo} alt="Student" className="h-32 w-28 rounded-lg object-cover border-2 border-gray-300" />
                <div className="flex-1">
                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">{studentInfo.name}</h3>
                    <div className="mt-2 space-y-1 text-sm">
                        <div className="flex justify-between"><span className="font-semibold text-gray-600 dark:text-gray-400">Roll No:</span><span>{studentInfo.rollNumber}</span></div>
                        {studentInfo.registrationNumber && <div className="flex justify-between"><span className="font-semibold text-gray-600 dark:text-gray-400">Reg. No:</span><span>{studentInfo.registrationNumber}</span></div>}
                        {studentInfo.courseName && <div className="flex justify-between"><span className="font-semibold text-gray-600 dark:text-gray-400">Course:</span><span>{studentInfo.courseName}</span></div>}
                    </div>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-center mb-2">{examInfo.name}</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div><strong>Date:</strong> {new Date(examInfo.date).toLocaleDateString()}</div>
                    <div><strong>Time:</strong> {examInfo.time}</div>
                    <div className="col-span-2"><strong>Venue:</strong> {examInfo.venue}</div>
                    <div className="col-span-2"><strong>Subjects:</strong> {examInfo.subjects.join(', ')}</div>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-dashed border-gray-400 text-xs text-gray-500 dark:text-gray-400">
                <p className="font-bold">Instructions:</p>
                <ul className="list-disc list-inside ml-2">
                    <li>Bring this admit card to the examination hall.</li>
                    <li>No electronic devices are allowed inside the hall.</li>
                    <li>Reach the venue at least 30 minutes before the exam time.</li>
                </ul>
            </div>
        </div>
    );
};

export default AdmitCard;
