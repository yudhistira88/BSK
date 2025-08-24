
import React from 'react';
import { useData } from '../context/DataContext';

const Clients: React.FC = () => {
    const { data } = useData();
    const { clients } = data;

    // Duplicate logos for seamless scrolling effect
    const duplicatedLogos = [...clients.logos, ...clients.logos];

    return (
        <section id="klien" className="bg-bsk-dark-gray">
            <div className="container mx-auto px-0 sm:px-8 max-w-7xl">
                <div className="flex items-center">
                    <div className="bg-bsk-blue text-white font-bold tracking-wider py-8 px-6 text-center flex-shrink-0">
                        <span className="writing-mode-vertical-rl sm:writing-mode-horizontal-tb">{clients.title}</span>
                    </div>
                    <div className="relative flex-1 overflow-hidden group" aria-label="Our clients logo scroller">
                        <div className="flex animate-scroll group-hover:[animation-play-state:paused]">
                            {duplicatedLogos.map((logo, index) => (
                                <div key={index} className="flex-shrink-0 mx-10 flex items-center justify-center py-4">
                                    <img 
                                        src={logo.src} 
                                        alt={logo.alt} 
                                        className="h-8 md:h-10"
                                        style={{ filter: 'brightness(0) invert(0.8)' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Clients;