import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, UserRole } from '../../types';
import { useData } from '../../contexts/DataContext';

const UserManagement: React.FC = () => {
    const { users, addUser, deleteUser, updateUser } = useAuth();
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">User Management</h2>
                <button onClick={() => { setShowAddForm(true); setEditingUser(null); }} className="btn-primary">Add User</button>
            </div>
            
            {(showAddForm || editingUser) && (
                <UserForm 
                    user={editingUser}
                    onClose={() => { setShowAddForm(false); setEditingUser(null); }} 
                    addUser={addUser}
                    updateUser={updateUser}
                />
            )}

            <UserTable users={users} onEdit={setEditingUser} onDelete={deleteUser} />
        </div>
    );
};

const UserTable: React.FC<{ users: User[], onEdit: (user: User) => void, onDelete: (userId: string) => void }> = ({ users, onEdit, onDelete }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Username</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                        <td className="px-6 py-4">{user.name}</td>
                        <td className="px-6 py-4">{user.username}</td>
                        <td className="px-6 py-4">{user.role}</td>
                        <td className="px-6 py-4 space-x-2">
                            <button onClick={() => onEdit(user)} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Edit</button>
                            <button onClick={() => onDelete(user.id)} className="font-medium text-red-600 dark:text-red-400 hover:underline">Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const UserForm: React.FC<{
    user: User | null;
    onClose: () => void;
    addUser: (userData: Omit<User, 'id'>) => { success: boolean, message: string };
    updateUser: (userId: string, userData: Partial<User>) => Promise<boolean>;
}> = ({ user, onClose, addUser, updateUser }) => {
    const { courses } = useData();
    const allSubjects = useMemo(() => courses.flatMap(c => c.subjects.map(s => s.name)), [courses]);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        username: user?.username || '',
        password: '',
        role: user?.role || UserRole.STUDENT,
        subjects: user?.subjects || [],
    });
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // FIX: Explicitly type 'option' as HTMLOptionElement to resolve 'unknown' type error.
        const selectedSubjects = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
        setFormData({ ...formData, subjects: selectedSubjects });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback({ type: '', message: '' });

        if (user) { // Editing
            const userData: Partial<User> = {
                name: formData.name,
                username: formData.username,
                role: formData.role,
            };
            if(formData.password) userData.password = formData.password;
            if(formData.role === UserRole.TEACHER) userData.subjects = formData.subjects;
            
            const success = await updateUser(user.id, userData);
            if (success) {
                setFeedback({ type: 'success', message: 'User updated successfully!' });
                setTimeout(onClose, 1500);
            } else {
                 setFeedback({ type: 'error', message: 'Failed to update user.' });
            }
        } else { // Adding
            const result = addUser({ name: formData.name, username: formData.username, password: formData.password, role: formData.role, subjects: formData.subjects });
            if (result.success) {
                 setFeedback({ type: 'success', message: result.message });
                 setTimeout(onClose, 1500);
            } else {
                 setFeedback({ type: 'error', message: result.message });
            }
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-4">{user ? 'Edit User' : 'Add New User'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-[auto_1fr_auto_1fr] gap-x-6 gap-y-4 items-center">
                    <label htmlFor="name" className="label">Full Name</label>
                    <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" required />

                    <label htmlFor="role" className="label">Role</label>
                    <select id="role" name="role" value={formData.role} onChange={handleChange} className="form-select" required >{Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}</select>

                    <label htmlFor="username" className="label">Username</label>
                    <input id="username" type="text" name="username" value={formData.username} onChange={handleChange} className="form-input" required />
                    
                    <label htmlFor="password" className="label">Password</label>
                    <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} className="form-input" placeholder={user ? "Leave blank to keep current" : ""} required={!user} />
                </div>

                {formData.role === UserRole.TEACHER && (
                    <div className="col-span-full">
                        <label className="label">Assign Subjects</label>
                        <select
                            multiple
                            name="subjects"
                            value={formData.subjects}
                            onChange={handleSubjectChange}
                            className="form-input h-32"
                        >
                            {allSubjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple subjects.</p>
                    </div>
                )}

                {feedback.message && <p className={feedback.type === 'success' ? 'text-green-600' : 'text-red-500'}>{feedback.message}</p>}
                <div className="flex justify-end gap-4 pt-2">
                    <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                    <button type="submit" className="btn-primary">{user ? 'Update User' : 'Create User'}</button>
                </div>
            </form>
        </div>
    );
};

export default UserManagement;