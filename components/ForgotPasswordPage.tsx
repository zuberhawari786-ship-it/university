import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';

interface ForgotPasswordPageProps {
    onBackToLogin: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onBackToLogin }) => {
    const { users, updateUser } = useAuth();
    
    const [step, setStep] = useState(1); // 1: Find User, 2: Verify OTP, 3: Reset Password
    const [username, setUsername] = useState('');
    const [foundUser, setFoundUser] = useState<User | null>(null);
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [otpInput, setOtpInput] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Step 1 handler
    const handleFindUser = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (user) {
            setFoundUser(user);
            setIsLoading(true);
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedOtp(otp);
            console.log(`Generated OTP for ${user.username}: ${otp}`); // For simulation
            
            setTimeout(() => {
                alert(`(For Demo) Your OTP is: ${otp}`);
                setIsLoading(false);
                setStep(2);
            }, 1500);
        } else {
            setError('No account found with that username.');
        }
    };

    // Step 2 handler
    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (otpInput === generatedOtp) {
            setStep(3);
        } else {
            setError('Invalid OTP. Please try again.');
        }
    };

    // Step 3 handler
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        if (!foundUser) {
            setError('An error occurred. Please start over.');
            return;
        }

        setIsLoading(true);
        const success = await updateUser(foundUser.id, { password: newPassword });

        if (success) {
            setFeedback('Password reset successfully! Redirecting to login...');
            setTimeout(() => {
                onBackToLogin();
            }, 3000);
        } else {
            setError('Failed to reset password. Please try again.');
        }
        setIsLoading(false);
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <form className="space-y-4" onSubmit={handleFindUser}>
                         <p className="text-sm text-center text-[var(--text-muted)]">Enter your username to find your account.</p>
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input id="username" name="username" type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="form-input" placeholder="Username" />
                        </div>
                        <button type="submit" disabled={isLoading} className="btn-primary w-full">{isLoading ? 'Searching...' : 'Find Account'}</button>
                    </form>
                );
            case 2:
                return (
                    <form className="space-y-4" onSubmit={handleVerifyOtp}>
                        <p className="text-sm text-center text-[var(--text-muted)]">An OTP has been sent to your registered contact method.</p>
                        <div>
                            <label htmlFor="otp" className="sr-only">OTP</label>
                            <input id="otp" name="otp" type="text" required value={otpInput} onChange={(e) => setOtpInput(e.target.value)} className="form-input text-center tracking-[0.5em]" placeholder="******" maxLength={6} />
                        </div>
                        <button type="submit" className="btn-primary w-full">Verify & Proceed</button>
                    </form>
                );
            case 3:
                 return (
                     <form className="space-y-4" onSubmit={handleResetPassword}>
                        <p className="text-sm text-center text-[var(--text-muted)]">Verification successful. Set your new password.</p>
                        <div>
                            <label htmlFor="newPassword" className="sr-only">New Password</label>
                            <input id="newPassword" name="newPassword" type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-input" placeholder="New Password (min. 6 characters)" />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">Confirm New Password</label>
                            <input id="confirmPassword" name="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-input" placeholder="Confirm New Password" />
                        </div>
                        <button type="submit" disabled={isLoading} className="btn-primary w-full">{isLoading ? 'Resetting...' : 'Reset Password'}</button>
                    </form>
                );
            default:
                return null;
        }
    }
    
    return (
        <div className="h-full w-full flex items-center justify-center p-4">
            <div className="w-full max-w-sm card p-8 space-y-6 animate-fade-in">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white">
                        Reset Your Password
                    </h2>
                </div>
                
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                {feedback && <p className="text-green-400 text-sm text-center">{feedback}</p>}

                {!feedback && renderStepContent()}
                
                <div className="text-center text-sm">
                    <button
                        type="button"
                        onClick={onBackToLogin}
                        className="font-medium text-[var(--primary-400)] hover:text-[var(--primary-500)]"
                    >
                        &larr; Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;