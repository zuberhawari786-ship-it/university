import React from 'react';
import { User } from '../../types';
import { useData } from '../../contexts/DataContext';

interface SimulatedStudentViewProps {
    student: User;
}

const SimulatedStudentView: React.FC<SimulatedStudentViewProps> = ({ student }) => {
    const { universityInfo } = useData();

    // Dummy sidebar items for students
    const studentNavItems = [
        'Dashboard', 'Messages', 'Join Class', 'My Registration',
        'ID Card', 'Exam Routines', 'Syllabus', 'View Results',
        'My Attendance', 'Apply for Exam', 'My Fees', 'Complaint Box'
    ];

    return (
        <div className="h-[70vh] w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col pointer-events-none select-none">
            {/* Fake Header */}
            <header className="flex-shrink-0 flex items-center justify-between p-3 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
                <div className="flex items-center">
                    <img src={universityInfo.logo} alt="Logo" className="h-6 w-auto mr-3"/>
                    <h1 className="text-md font-bold text-gray-900 dark:text-white">{universityInfo.name}</h1>
                </div>
                <div className="flex items-center">
                    <span className="text-xs font-medium">Welcome, {student.name} (Student)</span>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Fake Sidebar */}
                <aside className="w-48 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex-shrink-0 p-3 overflow-y-auto">
                    <nav>
                        <ul>
                            {studentNavItems.map(item => (
                                <li key={item}>
                                    <div
                                        className={`w-full text-left px-3 py-2 my-1 rounded-md text-sm font-medium flex items-center text-gray-600 dark:text-gray-300 ${item === 'Dashboard' ? 'bg-indigo-600 text-white shadow-md' : ''}`}
                                    >
                                        {item}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>
                {/* Fake Main Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                     <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
                     <p>Welcome, {student.name}! Use the sidebar to navigate through the portal.</p>
                     <div className="mt-6 p-4 border border-dashed border-gray-400 rounded-md bg-gray-200 dark:bg-gray-800">
                        <p className="text-center font-semibold text-gray-700 dark:text-gray-300">
                            This is a simulated view. Controls are disabled during a remote session.
                        </p>
                     </div>
                </main>
            </div>
        </div>
    );
};

export default SimulatedStudentView;
