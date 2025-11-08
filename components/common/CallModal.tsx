import React, { useEffect, useState } from 'react';

interface CallModalProps {
    callState: 'calling' | 'incoming' | 'active';
    callTarget: { id: string, name: string };
    callType: 'video' | 'voice';
    onAction: (action: 'accept' | 'decline' | 'hangup') => void;
}

const CallModal: React.FC<CallModalProps> = ({ callState, callTarget, callType, onAction }) => {
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval: number;
        if (callState === 'active') {
            interval = window.setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [callState]);

    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const getTitle = () => {
        switch (callState) {
            case 'calling': return `Calling ${callTarget.name}...`;
            case 'incoming': return `Incoming ${callType} call from ${callTarget.name}`;
            case 'active': return `In call with ${callTarget.name}`;
        }
    };

    const getIcon = () => (
        callType === 'video' ? 
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> :
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fade-in">
            <div className="card w-full max-w-sm text-center p-8 space-y-6">
                <div className="flex justify-center items-center gap-3 text-cyan-400">
                    {getIcon()}
                    <h2 className="text-xl font-bold">{getTitle()}</h2>
                </div>
                
                {callState === 'active' && <p className="text-4xl font-mono">{formatTime(timer)}</p>}

                <div className="flex justify-center gap-4">
                    {(callState === 'calling' || callState === 'active') && (
                        <button onClick={() => onAction('hangup')} className="btn-danger p-4 rounded-full">
                           Hang Up
                        </button>
                    )}
                    {callState === 'incoming' && (
                        <>
                            <button onClick={() => onAction('decline')} className="btn-danger p-4 rounded-full">
                                Decline
                            </button>
                             <button onClick={() => onAction('accept')} className="btn-primary p-4 rounded-full">
                                Accept
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CallModal;
