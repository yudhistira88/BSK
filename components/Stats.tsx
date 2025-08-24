import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';

const useCountUp = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
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
                    observer.disconnect(); // Animate only once
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

const StatItem: React.FC<{ value: string; label: string, delay: string }> = ({ value, label, delay }) => {
    const numericValue = parseInt(value.replace('+', ''), 10);
    const { count, ref } = useCountUp(isNaN(numericValue) ? 0 : numericValue);
    
    return (
        <div ref={ref} className="wow animate__animated animate__fadeInUp" data-wow-delay={delay}>
            <p className="text-4xl lg:text-5xl font-bold text-bsk-blue">{count}{value.includes('+') ? '+' : ''}</p>
            <p className="text-bsk-text-gray mt-2">{label}</p>
        </div>
    );
};

const Stats: React.FC = () => {
    const { data } = useData();
    const { stats } = data;

    return (
        <section className="bg-bsk-light-gray">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <StatItem key={index} value={stat.value} label={stat.label} delay={`${index * 0.1}s`} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
