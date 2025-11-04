import React, { useRef, useEffect, useState, useCallback } from 'react';

interface WhiteboardProps {
    isTeacher: boolean;
    dataUrl?: string;
    onChange?: (dataUrl: string) => void;
}

const Whiteboard: React.FC<WhiteboardProps> = ({ isTeacher, dataUrl, onChange }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
    const [color, setColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(3);
    
    const COLORS = ['#000000', '#e63946', '#2a9d8f', '#264653', '#e9c46a'];
    const SIZES = [1, 3, 6, 10, 15];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // For high-DPI displays
        const scale = window.devicePixelRatio;
        canvas.width = canvas.offsetWidth * scale;
        canvas.height = canvas.offsetHeight * scale;

        const context = canvas.getContext('2d');
        if (context) {
            context.scale(scale, scale);
            context.lineCap = 'round';
            context.strokeStyle = color;
            context.lineWidth = lineWidth;
            contextRef.current = context;
        }
    }, []);

    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = color;
            contextRef.current.lineWidth = lineWidth;
        }
    }, [color, lineWidth]);
    
    useEffect(() => {
        if (!isTeacher && dataUrl) {
            const canvas = canvasRef.current;
            const context = contextRef.current;
            if (canvas && context) {
                const image = new Image();
                image.onload = () => {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(image, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
                };
                image.src = dataUrl;
            }
        }
    }, [dataUrl, isTeacher]);
    
    const getCoords = (e: React.MouseEvent | React.TouchEvent): { x: number, y: number } => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        if ('touches' in e) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        }
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isTeacher || !contextRef.current) return;
        const { x, y } = getCoords(e);
        contextRef.current.beginPath();
        contextRef.current.moveTo(x, y);
        setIsDrawing(true);
    }, [isTeacher]);

    const finishDrawing = useCallback(() => {
        if (!isTeacher || !contextRef.current) return;
        contextRef.current.closePath();
        setIsDrawing(false);
        if (onChange && canvasRef.current) {
            onChange(canvasRef.current.toDataURL());
        }
    }, [isTeacher, onChange]);

    const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || !isTeacher || !contextRef.current) return;
        const { x, y } = getCoords(e);
        
        if (tool === 'pen') {
            contextRef.current.globalCompositeOperation = 'source-over';
        } else {
            contextRef.current.globalCompositeOperation = 'destination-out';
        }

        contextRef.current.lineTo(x, y);
        contextRef.current.stroke();
    }, [isDrawing, isTeacher, tool]);

    const handleClear = () => {
        if (!contextRef.current || !canvasRef.current) return;
        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        if (onChange) {
            onChange(canvasRef.current.toDataURL());
        }
    };
    
    return (
        <div className="h-full w-full bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col">
            {isTeacher && (
                <div className="p-2 border-b dark:border-gray-700 flex flex-wrap justify-center items-center gap-2">
                    {/* Tool selection */}
                    <button onClick={() => setTool('pen')} className={`p-2 rounded ${tool === 'pen' ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>Pen</button>
                    <button onClick={() => setTool('eraser')} className={`p-2 rounded ${tool === 'eraser' ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>Eraser</button>
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
                    {/* Color selection */}
                    {COLORS.map(c => (
                        <button key={c} onClick={() => setColor(c)} className="w-6 h-6 rounded-full" style={{ backgroundColor: c, border: color === c ? '2px solid #6366f1' : '2px solid transparent' }}/>
                    ))}
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
                     {/* Size selection */}
                    {SIZES.map(s => (
                        <button key={s} onClick={() => setLineWidth(s)} className={`rounded-full flex items-center justify-center ${lineWidth === s ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-600'}`} style={{width: `${s+15}px`, height: `${s+15}px`}}>
                           <div className="bg-black rounded-full" style={{width: `${s}px`, height: `${s}px`}}></div>
                        </button>
                    ))}
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
                    <button onClick={handleClear} className="p-2 rounded bg-red-500 text-white text-sm">Clear</button>
                </div>
            )}
            <div className="flex-grow relative">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseUp={finishDrawing}
                    onMouseMove={draw}
                    onTouchStart={startDrawing}
                    onTouchEnd={finishDrawing}
                    onTouchMove={draw}
                    className="w-full h-full"
                    style={{ touchAction: 'none' }}
                />
            </div>
        </div>
    );
};

export default Whiteboard;
