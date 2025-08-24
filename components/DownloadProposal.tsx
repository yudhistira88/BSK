import React, { useState, useEffect, useRef } from 'react';
import { DownloadIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import { useData } from '../context/DataContext';

const DownloadProposal: React.FC = () => {
    const { data } = useData();
    const { ctaSlider } = data;
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef<number | null>(null);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = window.setTimeout(
            () =>
                setCurrentIndex((prevIndex) =>
                    prevIndex === ctaSlider.length - 1 ? 0 : prevIndex + 1
                ),
            7000 // Change slide every 7 seconds
        );

        return () => {
            resetTimeout();
        };
    }, [currentIndex, ctaSlider.length]);

    const prevSlide = () => {
        const newIndex = currentIndex === 0 ? ctaSlider.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const newIndex = currentIndex === ctaSlider.length - 1 ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    return (
        <section className="py-20 bg-white wow animate__animated animate__fadeInUp">
            <div className="container mx-auto px-6 sm:px-8 max-w-7xl">
                <div className="relative overflow-hidden rounded-2xl shadow-lg">
                    {/* Slider container */}
                    <div
                        className="whitespace-nowrap transition-transform duration-700 ease-in-out"
                        style={{ transform: `translateX(${-currentIndex * 100}%)` }}
                    >
                        {ctaSlider.map((slide, index) => (
                            <div className="inline-block w-full align-top whitespace-normal" key={index}>
                                <div className="relative text-white h-[450px] flex items-center">
                                    {/* Background Image */}
                                    <img 
                                        src={slide.image} 
                                        alt={slide.title} 
                                        className="absolute inset-0 w-full h-full object-cover" 
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-bsk-dark-gray/80 via-bsk-dark-gray/60 to-transparent"></div>
                                    
                                    {/* Content */}
                                    <div className="relative z-10 p-8 md:p-16 max-w-2xl">
                                        <h2 className="text-4xl md:text-5xl font-bold">
                                            {slide.title}
                                        </h2>
                                        <p className="mt-4 text-white/90 text-lg">
                                            {slide.paragraph}
                                        </p>
                                         {slide.type === 'download' ? (
                                            <a 
                                                href={slide.fileUrl}
                                                download
                                                className="mt-8 inline-flex items-center justify-center gap-2 bg-bsk-yellow text-bsk-dark-gray font-bold py-3 px-8 hover:brightness-95 transition-all duration-300"
                                            >
                                                <DownloadIcon className="w-5 h-5" />
                                                <span>{slide.buttonText}</span>
                                            </a>
                                        ) : (
                                            <a 
                                                href={slide.ctaUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-8 inline-block bg-bsk-yellow text-bsk-dark-gray font-bold py-3 px-8 hover:brightness-95 transition-all duration-300"
                                            >
                                                <span>{slide.buttonText}</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Arrows */}
                    <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 p-2 rounded-full hover:bg-black/50 transition-colors z-20" aria-label="Previous Slide">
                        <ChevronLeftIcon className="w-6 h-6 text-white" />
                    </button>
                    <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 p-2 rounded-full hover:bg-black/50 transition-colors z-20" aria-label="Next Slide">
                        <ChevronRightIcon className="w-6 h-6 text-white" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                         {ctaSlider.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DownloadProposal;