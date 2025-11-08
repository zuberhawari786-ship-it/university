import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { ChatThread, User } from '../../types';
import CallModal from './CallModal';

const NewChatModal: React.FC<{
    onClose: () => void;
    onStartChat: (userId: string) => void;
}> = ({ onClose, onStartChat }) => {
    const { user, users } = useAuth();
    const otherUsers = users.filter(u => u.id !== user?.id);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="card p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">Start a New Conversation</h3>
                <div className="max-h-80 overflow-y-auto">
                    {otherUsers.map(u => (
                        <div key={u.id}
                            onClick={() => onStartChat(u.id)}
                            className="p-3 flex justify-between items-center hover:bg-[rgba(0,191,255,0.1)] rounded-md cursor-pointer"
                        >
                            <span>{u.name} ({u.role})</span>
                            <span className="text-xs btn-secondary btn-sm">Chat</span>
                        </div>
                    ))}
                </div>
                <div className="text-right mt-4">
                    <button onClick={onClose} className="btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    );
};

const Chat: React.FC = () => {
    const { user, users } = useAuth();
    const { chatThreads, chatMessages, addChatMessage, startChatThread } = useData();
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    // Calling state
    const [callState, setCallState] = useState<'idle' | 'calling' | 'incoming' | 'active'>('idle');
    const [callTarget, setCallTarget] = useState<{ id: string, name: string} | null>(null);
    const [callType, setCallType] = useState<'video' | 'voice'>('voice');

    const userThreads = useMemo(() => {
        return chatThreads.filter(t => t.participantIds.includes(user?.id || ''));
    }, [chatThreads, user]);

    const messagesForThread = useMemo(() => {
        return chatMessages.filter(m => m.threadId === selectedThreadId);
    }, [chatMessages, selectedThreadId]);
    
    useEffect(() => {
        if (!selectedThreadId && userThreads.length > 0) {
            setSelectedThreadId(userThreads[0].id);
        }
    }, [userThreads, selectedThreadId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messagesForThread]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedThreadId || !user) return;
        addChatMessage(selectedThreadId, user.id, user.name, newMessage.trim());
        setNewMessage('');
    };

    const handleStartNewChat = (otherUserId: string) => {
        const otherUser = users.find(u => u.id === otherUserId);
        if (!user || !otherUser) return;
        
        const participantIds = [user.id, otherUser.id];
        const participantNames = { [user.id]: user.name, [otherUser.id]: otherUser.name };
        
        const threadId = startChatThread(participantIds, participantNames);
        setSelectedThreadId(threadId);
        setShowNewChatModal(false);
    };
    
    const getOtherParticipant = (thread: ChatThread | undefined) => {
        if (!thread) return null;
        const otherId = thread.participantIds.find(id => id !== user?.id);
        const otherName = thread.participantNames[otherId || ''] || 'Unknown User';
        return { id: otherId || '', name: otherName };
    };
    
    // --- Calling Logic ---
    const handleInitiateCall = (type: 'video' | 'voice') => {
        const currentThread = userThreads.find(t => t.id === selectedThreadId);
        const target = getOtherParticipant(currentThread);
        if (target) {
            setCallTarget(target);
            setCallType(type);
            setCallState('calling');
            // Simulate incoming call for the other user
            setTimeout(() => {
                // In a real app, this would be a push notification/websocket event
                // For this demo, we can just imagine the other user gets this prompt
                console.log(`Simulating incoming ${type} call for ${target.name}`);
            }, 500);
        }
    };

    const handleCallAction = (action: 'accept' | 'decline' | 'hangup') => {
        switch (action) {
            case 'accept':
                setCallState('active');
                break;
            case 'decline':
            case 'hangup':
                setCallState('idle');
                setCallTarget(null);
                break;
        }
    };
    // --- End Calling Logic ---

    const currentThread = userThreads.find(t => t.id === selectedThreadId);
    const otherParticipant = getOtherParticipant(currentThread);

    return (
        <>
            {showNewChatModal && <NewChatModal onClose={() => setShowNewChatModal(false)} onStartChat={handleStartNewChat}/>}
            {callState !== 'idle' && callTarget && (
                <CallModal 
                    callState={callState}
                    callTarget={callTarget}
                    callType={callType}
                    onAction={handleCallAction}
                />
            )}
            <div className="flex h-[calc(100vh-100px)] card overflow-hidden">
                {/* Thread List Panel */}
                <div className="w-1/3 border-r dark:border-[var(--border-color)] flex flex-col">
                    <div className="p-4 border-b dark:border-[var(--border-color)] flex justify-between items-center">
                        <h2 className="text-xl font-bold">Messages</h2>
                        <button onClick={() => setShowNewChatModal(true)} className="btn-primary btn-sm">New Chat</button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {userThreads.map(thread => (
                            <div key={thread.id}
                                 onClick={() => setSelectedThreadId(thread.id)}
                                 className={`p-4 cursor-pointer border-l-4 ${selectedThreadId === thread.id ? 'border-[var(--primary-400)] bg-[rgba(0,191,255,0.1)]' : 'border-transparent hover:bg-[rgba(0,191,255,0.05)]'}`}
                            >
                                <h3 className="font-semibold">{getOtherParticipant(thread)?.name}</h3>
                                <p className="text-sm text-[var(--text-muted)] truncate">{thread.lastMessage?.content || 'No messages yet'}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Message Panel */}
                <div className="w-2/3 flex flex-col">
                    {selectedThreadId && otherParticipant ? (
                        <>
                            <div className="p-4 border-b dark:border-[var(--border-color)] flex justify-between items-center">
                                <h3 className="text-lg font-bold">{otherParticipant.name}</h3>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => handleInitiateCall('voice')} aria-label="Start voice call" className="text-gray-400 hover:text-white transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    </button>
                                     <button onClick={() => handleInitiateCall('video')} aria-label="Start video call" className="text-gray-400 hover:text-white transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto bg-[rgba(0,0,0,0.2)]">
                                {messagesForThread.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'} mb-4`}>
                                        <div className={`max-w-md p-3 rounded-lg shadow-md ${msg.senderId === user?.id ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                            <p className="font-bold text-sm">{msg.senderId !== user?.id ? msg.senderName : ''}</p>
                                            <p>{msg.content}</p>
                                            <p className="text-xs text-right opacity-75 mt-1">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="p-4 border-t dark:border-[var(--border-color)]">
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="form-input flex-1"
                                    />
                                    <button type="submit" className="btn-primary">Send</button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-[var(--text-muted)]">
                            <p>Select a conversation or start a new one.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Chat;