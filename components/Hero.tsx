

import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

const useCountUp = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    let start = 0;
                    const startTime = Date.now();
                    const step = () => {
                        const now = Date.now();
                        const progress = now - startTime;
                        const percentage = Math.min(progress / duration, 1);
                        const current = Math.floor(percentage * (end - start) + start);
                        setCount(current);

                        if (progress < duration) {
                            requestAnimationFrame(step);
                        } else {
                            setCount(end);
                        }
                    };
                    requestAnimationFrame(step);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [end, duration]);

    return { count, ref };
};

const StatItem: React.FC<{ value: string; label: string }> = ({ value, label }) => {
    const numericValue = parseInt(value.replace('+', ''), 10);
    const { count, ref } = useCountUp(isNaN(numericValue) ? 0 : numericValue);
    
    return (
        <div ref={ref}>
            <p className="text-4xl lg:text-5xl font-bold text-white">{count}{value.includes('+') ? '+' : ''}</p>
            <p className="text-gray-200 mt-2">{label}</p>
        </div>
    );
};


const Hero: React.FC<{ setView: (view: string, options?: { anchor?: string; state?: any; }) => void; }> = ({ setView }) => {
  const { data } = useData();
  const { hero, stats, footer } = data;
  const [currentSlide, setCurrentSlide] = useState(0);

  const whatsappNumber = footer.phone.replace(/[\s+-]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Halo, saya tertarik untuk konsultasi gratis.')}`;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === hero.slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? hero.slides.length - 1 : prev - 1));
  };
  
  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 7000); // Change slide every 7 seconds
    return () => clearInterval(slideInterval);
  }, [hero.slides.length]);


  return (
    <section id="home" className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden text-white">
      {/* Background Slides */}
      {hero.slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url('${slide.backgroundImage}')` }}
        />
      ))}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center">
        <div className="container mx-auto px-6 sm:px-8 max-w-7xl">
            <div className="max-w-2xl bg-bsk-dark-gray/60 p-4 md:p-8">
                 <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wider leading-tight animate__animated animate__fadeInLeft">
                    {hero.slides[currentSlide].title.map((line, i) => (
                        <span key={i} className="block">{line}</span>
                    ))}
                 </h1>
                 <p className="mt-4 text-sm md:text-base text-white/90 animate__animated animate__fadeInLeft animate__delay-1s">
                    {hero.slides[currentSlide].subtitle}
                 </p>
                 {currentSlide === 0 ? (
                     <button
                        onClick={() => setView('site', { anchor: '#layanan-unggulan' })}
                        className="mt-8 inline-block bg-bsk-yellow text-bsk-dark-gray font-bold py-3 px-8 hover:brightness-95 transition-all duration-300 animate__animated animate__fadeInUp animate__delay-2s"
                     >
                         {hero.slides[0].buttonText}
                     </button>
                 ) : (
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-8 inline-block bg-bsk-yellow text-bsk-dark-gray font-bold py-3 px-8 hover:brightness-95 transition-all duration-300 animate__animated animate__fadeInUp animate__delay-2s"
                    >
                        {hero.slides[1].buttonText}
                    </a>
                 )}
            </div>
        </div>
      </div>

       {/* Slider Arrows */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 p-2 rounded-full hover:bg-black/50 transition-colors" aria-label="Previous Slide">
            <ChevronLeftIcon className="w-6 h-6 text-white" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 p-2 rounded-full hover:bg-black/50 transition-colors" aria-label="Next Slide">
            <ChevronRightIcon className="w-6 h-6 text-white" />
        </button>


      {/* Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-bsk-blue z-10">
        <div className="container mx-auto px-6 sm:px-8 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center py-6">
                 {stats.map((stat, index) => (
                    <StatItem key={index} value={stat.value} label={stat.label} />
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;