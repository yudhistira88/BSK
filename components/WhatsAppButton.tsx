
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useData } from '../context/DataContext';
import { WhatsAppIcon } from './icons';

const WhatsAppButton: React.FC = () => {
    const { data } = useData();
    const phoneNumber = data.footer.phone.replace(/[\s+-]/g, '');

    const [isExpanded, setIsExpanded] = useState(true);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStartPos = useRef({ x: 0, y: 0 });
    const nodeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize position to bottom right
        if (nodeRef.current) {
            const rect = nodeRef.current.getBoundingClientRect();
            setPosition({
                x: window.innerWidth - rect.width - 20, // 20px from right edge (right-5)
                y: window.innerHeight - rect.height - 20, // 20px from bottom edge (bottom-5)
            });
        }
    }, []);
    
    const handleDragStart = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        dragStartPos.current = {
            x: clientX - position.x,
            y: clientY - position.y,
        };
        // Prevent text selection
        e.preventDefault();
    }, [position]);

    const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDragging) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        
        let newX = clientX - dragStartPos.current.x;
        let newY = clientY - dragStartPos.current.y;

        // Boundary checks
        if (nodeRef.current) {
            const rect = nodeRef.current.getBoundingClientRect();
            newX = Math.max(0, Math.min(newX, window.innerWidth - rect.width));
            newY = Math.max(0, Math.min(newY, window.innerHeight - rect.height));
        }

        setPosition({ x: newX, y: newY });
    }, [isDragging]);

    const handleDragEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleDragMove);
            window.addEventListener('touchmove', handleDragMove);
            window.addEventListener('mouseup', handleDragEnd);
            window.addEventListener('touchend', handleDragEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('touchmove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchend', handleDragEnd);
        };
    }, [isDragging, handleDragMove, handleDragEnd]);

    if (!phoneNumber) return null;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}`;

    return (
        <div
            ref={nodeRef}
            className="fixed z-50 transition-all duration-300 ease-out wow animate__animated animate__fadeInUp"
            data-wow-delay="1s"
            style={{ 
                top: `${position.y}px`, 
                left: `${position.x}px`,
                cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
        >
            {isExpanded ? (
                // Expanded View
                <div 
                    className={`relative flex items-center gap-3 pl-3 pr-6 py-3 bg-gradient-to-r from-teal-400 to-cyan-500 text-white rounded-full shadow-lg transition-all duration-300 transform origin-bottom-right ${isExpanded ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                >
                     <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3"
                        onClick={(e) => e.stopPropagation()} // Prevent drag when clicking link
                        style={{cursor: 'pointer'}}
                        aria-label="Hubungi kami di WhatsApp"
                     >
                        <div className="bg-white/10 p-2 rounded-full">
                            <WhatsAppIcon className="w-8 h-8" />
                        </div>
                        <div className="text-left leading-tight">
                            <p className="font-bold text-md">Hubungi Kami</p>
                            <p className="text-sm">Online</p>
                        </div>
                    </a>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                        className="absolute -top-2 -right-2 w-7 h-7 bg-white text-gray-600 rounded-full shadow-md flex items-center justify-center hover:bg-gray-200 transition-all"
                        aria-label="Tutup"
                        style={{cursor: 'pointer'}}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            ) : (
                // Collapsed View
                <button
                    onClick={() => setIsExpanded(true)}
                    className={`w-16 h-16 bg-gradient-to-r from-teal-400 to-cyan-500 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform origin-bottom-right ${!isExpanded ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                    aria-label="Buka chat WhatsApp"
                    style={{cursor: 'pointer'}}
                >
                    <WhatsAppIcon className="w-8 h-8" />
                </button>
            )}
        </div>
    );
};

export default WhatsAppButton;