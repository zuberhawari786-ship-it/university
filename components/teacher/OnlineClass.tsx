import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { OnlineClass as OnlineClassType } from '../../types';
import Whiteboard from '../common/Whiteboard';

const OnlineClass: React.FC = () => {
    const { user } = useAuth();
    const { courses, startClass, endClass, updateWhiteboardState, updateDocContent } = useData();
    const [activeClass, setActiveClass] = useState<OnlineClassType | null>(null);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [error, setError] = useState('');
    const videoRef = useRef<HTMLVideoElement>(null);
    
    const [view, setView] = useState<'whiteboard' | 'document'>('whiteboard');
    const [docContent, setDocContent] = useState('');
    
    // Throttling for updates
    const isUpdating = useRef(false);

    const teacherSubjects = useMemo(() => user?.subjects || [], [user]);

    useEffect(() => {
        if (teacherSubjects.length > 0) {
            setSelectedSubject(teacherSubjects[0]);
        }
    }, [teacherSubjects]);
    
    useEffect(() => {
        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [localStream]);

    const handleStartClass = () => {
        if (!selectedSubject || !user) {
            setError('Please select a subject.');
            return;
        }
        setError('');
        
        const course = courses.find(c => c.subjects.some(s => s.name === selectedSubject));
        if (course) {
            const newClass = startClass(user.id, user.name, selectedSubject, course.id);
            setActiveClass(newClass);
            setDocContent(newClass.docContent || '');
        } else {
             setError('Could not find a course for the selected subject.');
        }
    };

    const handleToggleCamera = async () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
            if (videoRef.current) videoRef.current.srcObject = null;
            setIsCameraActive(false);
        } else {
            setError('');
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setIsCameraActive(true);
            } catch (err: any) {
                console.error("Error accessing camera/microphone:", err);
                let errorMessage = 'An unexpected error occurred. Please check camera/mic permissions and ensure they are not in use by another application.';
                if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                    errorMessage = 'No camera or microphone found. Please ensure your devices are connected and enabled.';
                } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    errorMessage = 'Permission to access the camera and microphone was denied. Please allow access in your browser settings.';
                }
                setError(errorMessage);
            }
        }
    };

    const handleEndClass = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        if (activeClass) {
            endClass(activeClass.id);
        }
        setLocalStream(null);
        setActiveClass(null);
        setIsCameraActive(false);
    };
    
    const handleWhiteboardChange = useCallback((dataUrl: string) => {
        if (activeClass && !isUpdating.current) {
            isUpdating.current = true;
            updateWhiteboardState(activeClass.id, dataUrl);
            setTimeout(() => {
                isUpdating.current = false;
            }, 100); // Throttle updates to every 100ms
        }
    }, [activeClass, updateWhiteboardState]);
    
    const handleDocChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setDocContent(newContent);
        if (activeClass && !isUpdating.current) {
            isUpdating.current = true;
            updateDocContent(activeClass.id, newContent);
            setTimeout(() => {
                isUpdating.current = false;
            }, 250); // Throttle updates
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Live Class</h2>
            
            {!activeClass ? (
                <div className="card p-8 max-w-lg mx-auto">
                    <h3 className="text-xl font-bold mb-4">Start a New Class Session</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="label">Select Subject to Teach</label>
                            <select 
                                value={selectedSubject} 
                                onChange={e => setSelectedSubject(e.target.value)} 
                                className="form-select"
                                disabled={teacherSubjects.length === 0}
                            >
                                {teacherSubjects.length > 0 ? 
                                    teacherSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>) :
                                    <option>No subjects assigned</option>
                                }
                            </select>
                        </div>
                        <button 
                            onClick={handleStartClass} 
                            className="btn-primary w-full"
                            disabled={!selectedSubject}
                        >
                            Start Class
                        </button>
                    </div>
                </div>
            ) : (
                <div className="card p-4 md:p-6">
                    {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-md mb-4">{error}</p>}
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-2">
                        <div>
                            <h3 className="text-xl font-bold">Class in Progress</h3>
                            <p className="text-indigo-600 dark:text-indigo-400 font-semibold">{activeClass.subject}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={handleToggleCamera} className="btn-secondary">
                                {isCameraActive ? 'Stop Camera & Mic' : 'Start Camera & Mic'}
                            </button>
                            <button onClick={handleEndClass} className="btn-primary bg-red-600 hover:bg-red-700">End Class</button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                           {isCameraActive ? (
                                <video 
                                    ref={videoRef} 
                                    autoPlay 
                                    playsInline 
                                    muted
                                    className="w-full h-full object-cover"
                                    style={{ transform: 'scaleX(-1)' }}
                                />
                           ) : (
                                <div className="text-center text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2 2l20 20" />
                                    </svg>
                                    <p>Your camera is off</p>
                                </div>
                           )}
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
                                    <Whiteboard isTeacher={true} onChange={handleWhiteboardChange} />
                                ) : (
                                    <textarea
                                        value={docContent}
                                        onChange={handleDocChange}
                                        className="w-full h-full p-4 resize-none border-0 focus:ring-0 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                                        placeholder="Start typing here... students will see this live."
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OnlineClass;