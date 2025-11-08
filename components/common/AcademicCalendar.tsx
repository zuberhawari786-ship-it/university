import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole, AcademicEvent } from '../../types';

// Simplified BS date converter (for demonstration purposes)
const toBS = (date: Date): string => {
    // This is a very rough approximation and doesn't account for leap years or month differences accurately.
    // A real implementation would require a proper library.
    const bsYear = date.getFullYear() + 56;
    const bsMonth = date.getMonth() + 8;
    const bsDay = date.getDate() + 17;

    // A simple rollover logic
    const finalMonth = bsMonth % 12 + 1;
    const finalYear = bsYear + Math.floor(bsMonth / 12);
    // This day calculation is incorrect but serves for demonstration
    const finalDay = bsDay % 30 + 1;

    return `${finalYear}-${String(finalMonth).padStart(2, '0')}-${String(finalDay).padStart(2, '0')}`;
};

const CATEGORY_STYLES: { [key in AcademicEvent['category']]: string } = {
    Holiday: 'bg-red-500',
    Exam: 'bg-yellow-500',
    Event: 'bg-blue-500',
    Deadline: 'bg-purple-500',
};

const AcademicCalendar: React.FC = () => {
    const { user } = useAuth();
    const { academicEvents, addAcademicEvent, deleteAcademicEvent } = useData();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'AD' | 'BS'>('AD');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newEvent, setNewEvent] = useState({ date: '', title: '', description: '', category: 'Event' as AcademicEvent['category'] });

    const isAdmin = user?.role === UserRole.ADMIN;

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDay = firstDayOfMonth.getDay();

    const calendarDays = useMemo(() => {
        const days = [];
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
        }
        return days;
    }, [currentDate, daysInMonth, startingDay]);
    
    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEvent.date || !newEvent.title) return;
        addAcademicEvent(newEvent);
        setNewEvent({ date: '', title: '', description: '', category: 'Event' });
        setShowAddForm(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Academic Calendar</h2>
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-700 rounded-lg p-1">
                        <button onClick={() => setView('AD')} className={`px-3 py-1 text-sm rounded-md ${view === 'AD' ? 'bg-cyan-500 text-white' : ''}`}>AD</button>
                        <button onClick={() => setView('BS')} className={`px-3 py-1 text-sm rounded-md ${view === 'BS' ? 'bg-cyan-500 text-white' : ''}`}>BS</button>
                    </div>
                    {isAdmin && <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary">Add Event</button>}
                </div>
            </div>
            
            {showAddForm && (
                <div className="card p-6 animate-fade-in">
                    <form onSubmit={handleAddEvent} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="date" name="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="form-input" required/>
                            <input type="text" name="title" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="form-input" placeholder="Event Title" required/>
                             <select name="category" value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value as AcademicEvent['category']})} className="form-select">
                                {Object.keys(CATEGORY_STYLES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <textarea value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="form-input" rows={2} placeholder="Description..."/>
                        <div className="text-right">
                            <button type="submit" className="btn-primary btn-sm">Save Event</button>
                        </div>
                    </form>
                </div>
            )}
            
            <div className="card p-4">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={handlePrevMonth} className="btn-secondary">&lt;</button>
                    <h3 className="text-xl font-bold text-center">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button onClick={handleNextMonth} className="btn-secondary">&gt;</button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => {
                        const dayEvents = day ? academicEvents.filter(e => new Date(e.date).toDateString() === day.toDateString()) : [];
                        return (
                            <div key={index} className="h-28 bg-gray-900/50 rounded-md p-1.5 overflow-hidden border border-transparent hover:border-cyan-500">
                                {day && (
                                    <>
                                        <p className="text-sm font-semibold">{day.getDate()}</p>
                                        {view === 'BS' && <p className="text-xs text-cyan-400 -mt-1">{toBS(day).split('-')[2]}</p>}
                                        <div className="mt-1 space-y-1 overflow-y-auto max-h-20">
                                            {dayEvents.map(event => (
                                                <div key={event.id} className={`p-1 rounded-sm text-white text-[10px] leading-tight flex items-center justify-between ${CATEGORY_STYLES[event.category]}`}>
                                                    <span>{event.title}</span>
                                                     {isAdmin && <button onClick={() => deleteAcademicEvent(event.id)} className="opacity-50 hover:opacity-100">x</button>}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default AcademicCalendar;