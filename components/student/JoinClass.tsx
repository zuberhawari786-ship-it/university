import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Student } from '../../types';
import Whiteboard from '../common/Whiteboard';

const JoinClass: React.FC = () => {
    const { user } = useAuth();
    const { students, onlineClasses } = useData();
    const [joinedClassId, setJoinedClassId] = useState<string | null>(null);
    const [view, setView] = useState<'whiteboard' | 'document'>('whiteboard');

    const student = useMemo(() => students.find(s => s.id === user?.id) as Student | undefined, [students, user]);
    
    const availableClasses = useMemo(() => {
        if (!student || !student.details) return [];
        return onlineClasses.filter(c => c.isActive && c.courseId === student.details?.courseId);
    }, [onlineClasses, student]);

    const handleJoinClass = (classId: string) => {
        setJoinedClassId(classId);
    };

    const handleLeaveClass = () => {
        setJoinedClassId(null);
    };
    
    const joinedClassInfo = joinedClassId ? onlineClasses.find(c => c.id === joinedClassId) : null;

    if (!student?.isRegistered) {
         return (
            <div className="text-center p-8 card">
                <h2 className="text-xl font-bold mb-2">Registration Required</h2>
                <p>You must complete your registration before joining classes.</p>
            </div>
        );
    }
    
    if (joinedClassId && joinedClassInfo) {
        return (
             <div className="card p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-2">
                    <div>
                        <h3 className="text-xl font-bold">Joined: {joinedClassInfo.subject}</h3>
                        <p className="text-gray-500 dark:text-gray-400">with {joinedClassInfo.teacherName}</p>
                    </div>
                    <button onClick={handleLeaveClass} className="btn-primary bg-red-600 hover:bg-red-700 w-full md:w-auto">Leave Class</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                        <p className="text-gray-400">Teacher's Video Feed</p>
                    </div>
                    <div className="aspect-video flex flex-col bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
                       <div className="flex-shrink-0 flex border-b border-gray-200 dark:border-gray-700">
                           <button
                               onClick={() => setView('whiteboard')}
                               className={`flex-1 py-2 text-sm font-semibold transition-colors ${view === 'whiteboard' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                           >
                               Whiteboard
                           </button>
                           <button
                               onClick={() => setView('document')}
                               className={`flex-1 py-2 text-sm font-semibold transition-colors ${view === 'document' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                           >
                               Live Document
                           </button>
                       </div>
                       <div className="flex-grow relative">
                           {view === 'whiteboard' ? (
                               <Whiteboard isTeacher={false} dataUrl={joinedClassInfo.whiteboardState} />
                           ) : (
                               <div className="w-full h-full p-4 overflow-y-auto bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                                   {joinedClassInfo.docContent || "The teacher hasn't typed anything yet."}
                               </div>
                           )}
                       </div>
                   </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Join a Live Class</h2>

            <div className="card p-6">
                <h3 className="text-xl font-semibold mb-4">Active Classes for You</h3>
                {availableClasses.length > 0 ? (
                    <div className="space-y-3">
                        {availableClasses.map(liveClass => (
                            <div key={liveClass.id} className="flex justify-between items-center p-4 border dark:border-gray-700 rounded-lg">
                                <div>
                                    <p className="font-bold text-lg">{liveClass.subject}</p>
                                    <p className="text-sm text-gray-500">Teacher: {liveClass.teacherName}</p>
                                </div>
                                <button onClick={() => handleJoinClass(liveClass.id)} className="btn-primary">Join Now</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">There are no active classes for your course right now.</p>
                )}
            </div>
        </div>
    );
};

export default JoinClass;