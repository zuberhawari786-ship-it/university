import React, { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const MyHostel: React.FC = () => {
    const { user } = useAuth();
    const { students, hostels, hostelBookings } = useData();

    const student = useMemo(() => students.find(s => s.id === user?.id), [students, user]);

    const roomPartner = useMemo(() => {
        if (!student?.hostelInfo) return null;
        const booking = hostelBookings.find(b => b.roomId === student.hostelInfo!.roomId && b.studentId !== student.id);
        if (!booking) return null;
        return students.find(s => s.id === booking.studentId);
    }, [student, hostelBookings, students]);

    if (!student?.isRegistered) {
        return (
            <div className="card p-8 text-center">
                <h2 className="text-xl font-bold mb-2">Registration Required</h2>
                <p>Please complete your main university registration to be eligible for hostel allocation.</p>
            </div>
        );
    }
    
    if (!student.hostelInfo) {
        return (
            <div className="card p-8 text-center">
                <h2 className="text-xl font-bold mb-2">Not Assigned to a Hostel</h2>
                <p>You have not been assigned a hostel room yet. Please contact the reception for assistance.</p>
            </div>
        );
    }
    
    const hostelName = hostels.find(h => h.id === student.hostelInfo?.hostelId)?.name;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Hostel Information</h2>
            
            <div className="card p-8 max-w-2xl mx-auto">
                <div className="text-center mb-6">
                     <svg className="mx-auto h-16 w-16 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    <h3 className="text-2xl font-bold mt-2">{hostelName}</h3>
                    <p className="text-lg text-gray-400">Room Number: {student.hostelInfo.roomNumber}</p>
                </div>
                
                <div className="form-section">
                    <h4 className="form-section-title">Your Details</h4>
                    <div className="flex items-center gap-4">
                        <img src={student.photo} alt="Your Photo" className="w-16 h-16 rounded-full"/>
                        <div>
                            <p className="font-bold text-lg">{student.name}</p>
                            <p className="text-sm text-gray-400">{student.rollNumber}</p>
                        </div>
                    </div>
                </div>

                 <div className="form-section">
                    <h4 className="form-section-title">Room Partner</h4>
                    {roomPartner ? (
                        <div className="flex items-center gap-4">
                            <img src={roomPartner.photo} alt={roomPartner.name} className="w-16 h-16 rounded-full"/>
                            <div>
                                <p className="font-bold text-lg">{roomPartner.name}</p>
                                <p className="text-sm text-gray-400">{roomPartner.rollNumber}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-400">You do not have a room partner assigned yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyHostel;