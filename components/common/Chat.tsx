import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { ChatThread, User } from '../../types';

const NewChatModal: React.FC<{
    onClose: () => void;
    onStartChat: (userId: string) => void;
}> = ({ onClose, onStartChat }) => {
    const { user, users } = useAuth();
    const otherUsers = users.filter(u => u.id !== user?.id);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">Start a New Conversation</h3>
                <div className="max-h-80 overflow-y-auto">
                    {otherUsers.map(u => (
                        <div key={u.id}
                            onClick={() => onStartChat(u.id)}
                            className="p-3 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                        >
                            <span>{u.name} ({u.role})</span>
                            <span className="text-xs bg-indigo-100 text-indigo-800 p-1 rounded">Chat</span>
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
    
    const getOtherParticipantName = (thread: ChatThread) => {
        const otherId = thread.participantIds.find(id => id !== user?.id);
        return thread.participantNames[otherId || ''] || 'Unknown User';
    };

    return (
        <>
            {showNewChatModal && <NewChatModal onClose={() => setShowNewChatModal(false)} onStartChat={handleStartNewChat}/>}
            <div className="flex h-[calc(100vh-100px)] bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                {/* Thread List Panel */}
                <div className="w-1/3 border-r dark:border-gray-700 flex flex-col">
                    <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-xl font-bold">Messages</h2>
                        <button onClick={() => setShowNewChatModal(true)} className="btn-primary btn-sm">New Chat</button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {userThreads.map(thread => (
                            <div key={thread.id}
                                 onClick={() => setSelectedThreadId(thread.id)}
                                 className={`p-4 cursor-pointer border-l-4 ${selectedThreadId === thread.id ? 'border-indigo-500 bg-gray-100 dark:bg-gray-900' : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                            >
                                <h3 className="font-semibold">{getOtherParticipantName(thread)}</h3>
                                <p className="text-sm text-gray-500 truncate">{thread.lastMessage?.content || 'No messages yet'}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Message Panel */}
                <div className="w-2/3 flex flex-col">
                    {selectedThreadId ? (
                        <>
                            <div className="p-4 border-b dark:border-gray-700">
                                <h3 className="text-lg font-bold">{getOtherParticipantName(userThreads.find(t=>t.id === selectedThreadId)!)}</h3>
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
                                {messagesForThread.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'} mb-4`}>
                                        <div className={`max-w-md p-3 rounded-lg ${msg.senderId === user?.id ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                                            <p className="font-bold text-sm">{msg.senderId !== user?.id ? msg.senderName : ''}</p>
                                            <p>{msg.content}</p>
                                            <p className="text-xs text-right opacity-75 mt-1">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
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
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            <p>Select a conversation or start a new one.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Chat;