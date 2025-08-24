
import React from 'react';
import { useData } from '../context/DataContext';
import { WhatsAppIcon } from './icons';

const WhatsAppButton: React.FC = () => {
    const { data } = useData();
    const phoneNumber = data.footer.phone.replace(/[\s+-]/g, '');

    if (!phoneNumber) return null;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-5 right-5 z-50 flex items-center gap-3 pl-3 pr-6 py-3 bg-gradient-to-r from-teal-400 to-cyan-500 text-white rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 group wow animate__animated animate__fadeInUp"
            data-wow-delay="1s"
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
    );
};

export default WhatsAppButton;
