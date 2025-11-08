import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../mockData';
import useLocalStorage from '../hooks/useLocalStorage';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    users: User[];
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateUser: (userId: string, userData: Partial<User>) => Promise<boolean>;
    addUser: (userData: Omit<User, 'id'>) => { success: boolean; message: string; newUser?: User };
    deleteUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useLocalStorage<User[]>('ggu-users', MOCK_USERS);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

     useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (users.some(u => u.id === parsedUser.id)) {
                setUser(parsedUser);
                setIsAuthenticated(true);
            }
        }
    }, [users]);

    const login = async (username: string, password: string): Promise<boolean> => {
        const foundUser = users.find(u => u.username === username && u.password === password);
        if (foundUser) {
            const userToStore = { ...foundUser };
            delete userToStore.password;
            setUser(userToStore);
            setIsAuthenticated(true);
            sessionStorage.setItem('user', JSON.stringify(userToStore));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        sessionStorage.removeItem('user');
    };
    
    const updateUser = async (userId: string, userData: Partial<User>): Promise<boolean> => {
        setUsers(prevUsers => prevUsers.map(u => {
            if (u.id === userId) {
                const updatedUser = { ...u, ...userData };
                if(!userData.password) {
                    updatedUser.password = u.password;
                }
                return updatedUser;
            }
            return u;
        }));
        if (user && user.id === userId) {
            const updatedUserForSession = { ...user, ...userData };
            setUser(updatedUserForSession);
            sessionStorage.setItem('user', JSON.stringify(updatedUserForSession));
        }
        return true;
    };
    
    const addUser = (userData: Omit<User, 'id'>): { success: boolean; message: string; newUser?: User } => {
        if (users.some(u => u.username === userData.username)) {
            return { success: false, message: 'Username already exists.' };
        }
        
        const newUser: User = {
            ...userData,
            id: `user-${Date.now()}`,
            password: userData.password || 'password', // Ensure default password if none is provided
            subjects: userData.role === UserRole.TEACHER ? userData.subjects : undefined,
        };
        
        setUsers(prev => [...prev, newUser]);
        return { success: true, message: 'User created successfully.', newUser };
    };
    
    const deleteUser = (userId: string) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
    };


    return (
        <AuthContext.Provider value={{ user, isAuthenticated, users, login, logout, updateUser, addUser, deleteUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};