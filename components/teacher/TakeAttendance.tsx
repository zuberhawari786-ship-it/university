import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useData } from '../../contexts/DataContext';
import { Student } from '../../types';

const CameraModal: React.FC<{ onConfirm: () => void; onCancel: () => void; student: Student }> = ({ onConfirm, onCancel, student }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState('');

    const startCamera = useCallback(async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && videoRef.current) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err: any) {
                console.error("Error accessing camera: ", err);
                let errorMessage = 'An unexpected error occurred. Please check camera permissions and ensure it is not in use by another application.';
                if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                    errorMessage = 'No camera found. Please ensure a camera is connected and enabled.';
                } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    errorMessage = 'Permission to access the camera was denied. Please allow camera access in your browser settings.';
                }
                setError(errorMessage);
            }
        }
    }, []);
    
    const stopCamera = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }, []);

    React.useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [startCamera, stopCamera]);

    const handleConfirm = () => {
        stopCamera();
        onConfirm();
    };
    
     const handleCancel = () => {
        stopCamera();
        onCancel();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg text-center">
                <h3 className="text-xl font-bold mb-2">Confirming Attendance for {student.name}</h3>
                {error ? (
                     <div className="my-4 p-3 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 rounded-md text-sm">
                        <p className="font-bold mb-1">Error Accessing Camera</p>
                        <p>{error}</p>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-500 mb-4">Please ensure the student's face is clearly visible.</p>
                        <video ref={videoRef} autoPlay playsInline className="w-full h-64 bg-gray-900 rounded-md mb-4 object-cover"></video>
                    </>
                )}
                <div className="flex justify-center space-x-4 mt-4">
                    <button onClick={handleCancel} className="btn-secondary">Cancel</button>
                    <button onClick={handleConfirm} className="btn-primary" disabled={!!error}>Confirm Presence</button>
                </div>
            </div>
        </div>
    );
};


const TakeAttendance: React.FC = () => {
    const { courses, students, attendanceRecords, addAttendanceRecord } = useData();
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [studentForCamera, setStudentForCamera] = useState<Student | null>(null);

    const selectedCourse = useMemo(() => courses.find(c => c.id === selectedCourseId), [courses, selectedCourseId]);
    const subjects = useMemo(() => {
        if (!selectedCourse) return [];
        return selectedCourse.subjects.map(s => s.name);
    }, [selectedCourse]);

    const studentsInCourse = useMemo(() => {
        return students.filter(s => s.isRegistered && s.details?.courseId === selectedCourseId);
    }, [students, selectedCourseId]);

    const handleMarkAttendance = (studentId: string, status: 'Present' | 'Absent') => {
        if (!selectedCourseId || !selectedSubject || !attendanceDate) return;
        const record = {
            studentId,
            courseId: selectedCourseId,
            subject: selectedSubject,
            date: new Date(attendanceDate).toISOString(),
            status
        };
        addAttendanceRecord(record);
    };

    const handlePresentClick = (student: Student) => {
        setStudentForCamera(student);
        setIsCameraOpen(true);
    };

    const handleConfirmPresence = () => {
        if (studentForCamera) {
            handleMarkAttendance(studentForCamera.id, 'Present');
        }
        setIsCameraOpen(false);
        setStudentForCamera(null);
    };

    const getAttendanceStatus = (studentId: string): 'Present' | 'Absent' | undefined => {
        const dateISO = new Date(attendanceDate).toISOString();
        const record = attendanceRecords.find(r => 
            r.studentId === studentId && 
            r.courseId === selectedCourseId && 
            r.subject === selectedSubject && 
            r.date === dateISO
        );
        return record?.status;
    };

    return (
        <div className="space-y-6">
            {isCameraOpen && studentForCamera && (
                <CameraModal 
                    student={studentForCamera}
                    onConfirm={handleConfirmPresence} 
                    onCancel={() => { setIsCameraOpen(false); setStudentForCamera(null); }} 
                />
            )}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Take Attendance</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <label className="label">Date</label>
                    <input type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} className="form-input"/>
                </div>
                <div>
                    <label className="label">Course</label>
                    <select value={selectedCourseId} onChange={e => {setSelectedCourseId(e.target.value); setSelectedSubject('')}} className="form-select">
                        <option value="">-- Select Course --</option>
                        {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="label">Subject</label>
                    <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="form-select" disabled={!selectedCourseId}>
                        <option value="">-- Select Subject --</option>
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {selectedCourseId && selectedSubject && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Students List</h3>
                    <div className="space-y-4">
                        {studentsInCourse.map(student => {
                            const status = getAttendanceStatus(student.id);
                            return (
                                <div key={student.id} className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg">
                                    <div className="flex items-center">
                                        <img src={student.photo} alt={student.name} className="h-10 w-10 rounded-full object-cover mr-4"/>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">{student.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Roll: {student.rollNumber}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => handlePresentClick(student)} className={`btn-sm ${status === 'Present' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'}`}>Present</button>
                                        <button onClick={() => handleMarkAttendance(student.id, 'Absent')} className={`btn-sm ${status === 'Absent' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800'}`}>Absent</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TakeAttendance;