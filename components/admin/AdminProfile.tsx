
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AdminProfile: React.FC = () => {
    // FIX: Replaced non-existent 'updateCredentials' with 'updateUser' from AuthContext.
    const { user, updateUser } = useAuth();
    const [username, setUsername] = useState(user?.username || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [feedback, setFeedback] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setFeedback('');

        if (password && password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (user) {
            // FIX: Replaced non-existent 'updateCredentials' with 'updateUser' from AuthContext.
            const success = await updateUser(user.id, {
                username: username,
                password: password || undefined
            });
            if (success) {
                setFeedback('Profile updated successfully!');
                setPassword('');
                setConfirmPassword('');
            } else {
                setError('Failed to update profile.');
            }
            setTimeout(() => {
                setFeedback('');
                setError('');
            }, 3000);
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="username" className="label">Admin Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-input mt-1"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password"  className="label">New Password (leave blank to keep current)</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input mt-1"
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword"  className="label">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-input mt-1"
                    />
                </div>
                
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <div className="flex justify-end items-center pt-4">
                    {feedback && <p className="text-green-600 dark:text-green-400 text-sm mr-4">{feedback}</p>}
                    <button type="submit" className="btn-primary">Update Profile</button>
                </div>
            </form>
        </div>
    );
};

export default AdminProfile;