import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Student } from '../../types';

const HostelManagement: React.FC = () => {
    const { hostels, addHostel, rooms, addRoomToHostel, hostelBookings, bookRoomForStudent, cancelBooking, students } = useData();
    const [activeTab, setActiveTab] = useState('bookings');

    // State for forms
    const [newHostelName, setNewHostelName] = useState('');
    const [newRoomData, setNewRoomData] = useState({ hostelId: hostels[0]?.id || '', roomNumber: '', capacity: 2 });
    const [bookingData, setBookingData] = useState({ studentId: '', roomId: '' });
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const unassignedStudents = useMemo(() => students.filter(s => s.isRegistered && !s.hostelInfo), [students]);
    
    const roomsWithOccupancy = useMemo(() => {
        return rooms.map(room => {
            const occupants = hostelBookings.filter(b => b.roomId === room.id);
            return { ...room, occupants: occupants.length };
        });
    }, [rooms, hostelBookings]);
    
    const availableRooms = useMemo(() => roomsWithOccupancy.filter(r => r.occupants < r.capacity), [roomsWithOccupancy]);

    const handleAddHostel = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newHostelName.trim()) return;
        addHostel(newHostelName);
        setNewHostelName('');
    };
    
    const handleAddRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newRoomData.hostelId || !newRoomData.roomNumber.trim() || newRoomData.capacity <= 0) return;
        addRoomToHostel(newRoomData.hostelId, newRoomData.roomNumber, newRoomData.capacity);
        setNewRoomData({ hostelId: newRoomData.hostelId, roomNumber: '', capacity: 2 });
    };

    const handleBookRoom = (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback({ type: '', message: '' });
        if (!bookingData.studentId || !bookingData.roomId) return;
        const result = bookRoomForStudent(bookingData.studentId, bookingData.roomId);
        setFeedback({ type: result.success ? 'success' : 'error', message: result.message });
        if(result.success) {
            setBookingData({ studentId: '', roomId: '' });
        }
    };
    
    const handleCancelBooking = (studentId: string) => {
        if(window.confirm("Are you sure you want to remove this student from their room?")) {
            cancelBooking(studentId);
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Hostel Management</h2>
            
            <div className="card">
                <div className="flex border-b border-[var(--border-color)]">
                    <button onClick={() => setActiveTab('bookings')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'bookings' ? 'text-white border-b-2 border-cyan-400' : 'text-gray-400'}`}>Bookings</button>
                    <button onClick={() => setActiveTab('rooms')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'rooms' ? 'text-white border-b-2 border-cyan-400' : 'text-gray-400'}`}>Manage Rooms</button>
                    <button onClick={() => setActiveTab('hostels')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'hostels' ? 'text-white border-b-2 border-cyan-400' : 'text-gray-400'}`}>Manage Hostels</button>
                </div>
                
                <div className="p-6">
                    {activeTab === 'bookings' && <div className="space-y-6">
                        <form onSubmit={handleBookRoom} className="form-section">
                            <h3 className="form-section-title">Assign Student to Room</h3>
                            {feedback.message && <p className={`mb-4 text-sm ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{feedback.message}</p>}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <select value={bookingData.studentId} onChange={e => setBookingData({...bookingData, studentId: e.target.value})} className="form-select" required>
                                    <option value="">-- Select Student --</option>
                                    {unassignedStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.registrationNumber})</option>)}
                                </select>
                                <select value={bookingData.roomId} onChange={e => setBookingData({...bookingData, roomId: e.target.value})} className="form-select" required>
                                    <option value="">-- Select Available Room --</option>
                                    {availableRooms.map(r => <option key={r.id} value={r.id}>{hostels.find(h=>h.id===r.hostelId)?.name} - {r.roomNumber} ({r.occupants}/{r.capacity})</option>)}
                                </select>
                                <button type="submit" className="btn-primary">Book Room</button>
                            </div>
                        </form>
                        
                        <div>
                            <h3 className="text-lg font-bold mb-2">Current Bookings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {roomsWithOccupancy.filter(r => r.occupants > 0).map(room => (
                                    <div key={room.id} className="p-4 border border-[var(--border-color)] rounded-lg">
                                        <p className="font-bold">{hostels.find(h=>h.id===room.hostelId)?.name} - Room {room.roomNumber}</p>
                                        <p className="text-xs text-gray-400">Occupancy: {room.occupants} / {room.capacity}</p>
                                        <ul className="mt-2 text-sm space-y-1">
                                            {hostelBookings.filter(b => b.roomId === room.id).map(booking => {
                                                const student = students.find(s => s.id === booking.studentId);
                                                return <li key={booking.id} className="flex justify-between items-center">
                                                    <span>- {student?.name}</span>
                                                    <button onClick={() => handleCancelBooking(student!.id)} className="text-red-400 text-xs hover:underline">Cancel</button>
                                                </li>
                                            })}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>}
                    
                    {activeTab === 'rooms' && <div className="space-y-6">
                        <form onSubmit={handleAddRoom} className="form-section">
                             <h3 className="form-section-title">Add New Room</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <select name="hostelId" value={newRoomData.hostelId} onChange={e => setNewRoomData({...newRoomData, hostelId: e.target.value})} className="form-select md:col-span-2">
                                    {hostels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                                </select>
                                <input type="text" value={newRoomData.roomNumber} onChange={e => setNewRoomData({...newRoomData, roomNumber: e.target.value})} className="form-input" placeholder="Room Number (e.g., A-101)"/>
                                <input type="number" min="1" value={newRoomData.capacity} onChange={e => setNewRoomData({...newRoomData, capacity: parseInt(e.target.value)})} className="form-input" placeholder="Capacity"/>
                                <div className="md:col-span-4 text-right">
                                     <button type="submit" className="btn-primary">Add Room</button>
                                </div>
                            </div>
                        </form>
                         <div>
                            <h3 className="text-lg font-bold mb-2">Room List</h3>
                            <ul className="space-y-2">
                                {rooms.map(room => (
                                     <li key={room.id} className="p-2 border border-[var(--border-color)] rounded-md flex justify-between">
                                        <span>{hostels.find(h => h.id === room.hostelId)?.name} - Room {room.roomNumber}</span>
                                        <span className="text-gray-400">Capacity: {room.capacity}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>}

                    {activeTab === 'hostels' && <div className="space-y-6">
                         <form onSubmit={handleAddHostel} className="form-section">
                            <h3 className="form-section-title">Add New Hostel</h3>
                            <div className="flex gap-4">
                                <input type="text" value={newHostelName} onChange={e => setNewHostelName(e.target.value)} className="form-input flex-grow" placeholder="e.g., Boys Hostel C"/>
                                <button type="submit" className="btn-primary">Add Hostel</button>
                            </div>
                        </form>
                         <div>
                            <h3 className="text-lg font-bold mb-2">Hostel List</h3>
                            <ul className="space-y-2">
                                {hostels.map(hostel => <li key={hostel.id} className="p-2 border border-[var(--border-color)] rounded-md">{hostel.name}</li>)}
                            </ul>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    );
};

export default HostelManagement;