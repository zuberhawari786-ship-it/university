import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { UserRole } from '../types';

interface CreateAccountPageProps {
    onBackToLogin: () => void;
}

const CreateAccountPage: React.FC<CreateAccountPageProps> = ({ onBackToLogin }) => {
    const { addUser } = useAuth();
    const { addStudentProfile, universityInfo } = useData();
    
    const [step, setStep] = useState(1); // 1: MethodSelection, 2: Input, 3: OTP, 4: Details
    const [method, setMethod] = useState<'mobile' | 'email' | null>(null);

    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [otpInput, setOtpInput] = useState('');
    const [formData, setFormData] = useState({ name: '', username: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const selectMethod = (selectedMethod: 'mobile' | 'email') => {
        setMethod(selectedMethod);
        setError('');
        setStep(2);
    };

    const handleInputSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        let isValid = false;
        if (method === 'mobile') {
            const nepaliMobileRegex = /^(98|97|96)\d{8}$/;
            if (nepaliMobileRegex.test(mobileNumber)) {
                isValid = true;
            } else {
                setError('Please enter a valid 10-digit Nepali mobile number (starting with 98, 97, or 96).');
            }
        } else if (method === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(email)) {
                isValid = true;
            } else {
                setError('Please enter a valid email address.');
            }
        }

        if (!isValid) return;

        setIsLoading(true);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(otp);
        const contactValue = method === 'mobile' ? `+977 ${mobileNumber}` : email;
        console.log(`Generated OTP for ${contactValue}: ${otp}`);

        setTimeout(() => {
            alert(`Your OTP for Golden Gate University is: ${otp}`);
            setIsLoading(false);
            setStep(3);
        }, 1500);
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (otpInput === generatedOtp) {
            if (method === 'email') {
                const usernameFromEmail = email.split('@')[0].toLowerCase();
                setFormData(prev => ({ ...prev, username: usernameFromEmail }));
            }
            setStep(4);
        } else {
            setError('Invalid OTP. Please try again.');
        }
    };
    
    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (formData.password.length < 6) {
             setError('Password must be at least 6 characters long.');
            return;
        }
        if (!method) {
            setError('An unknown error occurred. Please start over.');
            return;
        }

        setIsLoading(true);
        
        const result = addUser({
            name: formData.name,
            username: formData.username,
            password: formData.password,
            role: UserRole.STUDENT,
        });

        if (result.success && result.newUser) {
            const contactInfo = {
                type: method,
                value: method === 'mobile' ? mobileNumber : email
            };
            addStudentProfile(result.newUser, contactInfo);
            setFeedback('Account created successfully! You can now log in.');
            setTimeout(() => {
                onBackToLogin();
            }, 3000);
        } else {
            setError(result.message || 'An error occurred during account creation.');
        }
        setIsLoading(false);
    };
    
    const goBack = () => {
        setError('');
        if (step > 1) {
            // If at OTP or Details step, go back to input step
            if(step > 2) {
                setStep(step - 1);
            } else { // if at Input step, go back to method selection
                 setMethod(null);
                 setStep(1);
            }
        }
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="mt-8 space-y-4">
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">How would you like to sign up?</p>
                        <button onClick={() => selectMethod('email')} className="btn-secondary w-full">Sign up with Email</button>
                        <button onClick={() => selectMethod('mobile')} className="btn-secondary w-full">Sign up with Nepali Mobile</button>
                    </div>
                );
            case 2:
                return (
                    <form className="mt-8 space-y-6" onSubmit={handleInputSubmit}>
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                           {method === 'email' ? 'Enter your email address to begin.' : 'Enter your Nepali mobile number to begin.'}
                        </p>
                        {method === 'email' && (
                             <div>
                                <label htmlFor="email" className="sr-only">Email</label>
                                <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder="example@gmail.com" />
                            </div>
                        )}
                        {method === 'mobile' && (
                            <div>
                                <label htmlFor="mobile" className="sr-only">Mobile Number</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">🇳🇵 +977</span>
                                    <input id="mobile" name="mobile" type="tel" autoComplete="tel" required value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="pl-20 form-input" placeholder="98XXXXXXXX" />
                                </div>
                            </div>
                        )}
                        <button type="submit" disabled={isLoading} className="btn-primary w-full">{isLoading ? 'Sending...' : 'Send OTP'}</button>
                    </form>
                );
            case 3:
                return (
                    <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">An OTP has been sent to {method === 'mobile' ? `+977 ${mobileNumber}` : email}.</p>
                        <div>
                            <label htmlFor="otp" className="sr-only">OTP</label>
                            <input id="otp" name="otp" type="text" required value={otpInput} onChange={(e) => setOtpInput(e.target.value)} className="form-input text-center tracking-[0.5em]" placeholder="******" maxLength={6} />
                        </div>
                        <button type="submit" className="btn-primary w-full">Verify & Proceed</button>
                    </form>
                );
            case 4:
                return (
                     <form className="mt-8 space-y-6" onSubmit={handleDetailsSubmit}>
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">Verified! Now, set up your profile.</p>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <input name="name" type="text" autoComplete="name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="form-input rounded-t-md rounded-b-none" placeholder="Full Name" />
                            <input name="username" type="text" autoComplete="username" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="form-input rounded-none" placeholder="Username" />
                            <input name="password" type="password" autoComplete="new-password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="form-input rounded-none" placeholder="Password (min. 6 characters)" />
                            <input name="confirmPassword" type="password" autoComplete="new-password" required value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="form-input rounded-b-md rounded-t-none" placeholder="Confirm Password" />
                        </div>
                        <button type="submit" disabled={isLoading} className="btn-primary w-full">{isLoading ? 'Creating Account...' : 'Create Account'}</button>
                    </form>
                );
        }
    };
    
    return (
        <div className="h-full flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-4">
                <div className="text-center">
                    <img src={universityInfo.logo} alt="University Logo" className="mx-auto h-12 w-auto mb-4"/>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Create Your Account
                    </h2>
                </div>
                {error && <p className="text-red-500 text-sm text-center -mb-2">{error}</p>}
                {feedback && <p className="text-green-600 text-sm text-center -mb-2">{feedback}</p>}
                
                <div className="relative">
                     {step > 1 && !feedback && (
                        <button onClick={goBack} className="absolute -top-2 left-0 text-sm text-indigo-600 hover:text-indigo-500">
                            &larr; Back
                        </button>
                    )}
                    {renderStep()}
                </div>

                <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <button type="button" onClick={onBackToLogin} className="font-medium text-indigo-600 hover:text-indigo-500">Sign In</button>
                </p>
            </div>
        </div>
    );
};

export default CreateAccountPage;