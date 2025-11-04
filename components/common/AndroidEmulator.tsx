import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AndroidEmulator: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { logout } = useAuth();
    
    // Draggable window logic
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const windowRef = useRef<HTMLDivElement>(null);
    const desktopRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Center the window on initial render
        if (desktopRef.current && windowRef.current) {
            const desktopWidth = desktopRef.current.offsetWidth;
            const desktopHeight = desktopRef.current.offsetHeight;
            const windowWidth = windowRef.current.offsetWidth;
            const windowHeight = windowRef.current.offsetHeight;
            setPosition({
                x: (desktopWidth - windowWidth) / 2,
                y: (desktopHeight - windowHeight) / 2,
            });
        }
    }, []);

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (windowRef.current) {
            setIsDragging(true);
            const rect = windowRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
            e.preventDefault();
        }
    };

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isDragging && windowRef.current && desktopRef.current) {
            const parentRect = desktopRef.current.getBoundingClientRect();
            let newX = e.clientX - dragOffset.x - parentRect.left;
            let newY = e.clientY - dragOffset.y - parentRect.top;

            // Constrain movement within the desktop
            const windowRect = windowRef.current.getBoundingClientRect();
            newX = Math.max(0, Math.min(newX, parentRect.width - windowRect.width));
            newY = Math.max(0, Math.min(newY, parentRect.height - windowRect.height));

            setPosition({ x: newX, y: newY });
        }
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div
            ref={desktopRef}
            className="desktop-background"
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
        >
            <div
                ref={windowRef}
                className="app-window"
                style={{ top: `${position.y}px`, left: `${position.x}px` }}
            >
                <div
                    className="window-title-bar"
                    onMouseDown={onMouseDown}
                >
                    <span />
                    <div className="window-controls">
                        <button className="window-control-btn minimize" aria-label="Minimize"></button>
                        <button className="window-control-btn maximize" aria-label="Maximize"></button>
                        <button className="window-control-btn close" aria-label="Close" onClick={logout}></button>
                    </div>
                </div>
                <div className="window-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AndroidEmulator;