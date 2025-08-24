
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { SearchIcon } from './icons';

const Portfolio: React.FC = () => {
    const { data } = useData();
    const { portfolio } = data;
    const [activeFilter, setActiveFilter] = useState(portfolio.filters[0]);

    const filteredProjects = activeFilter === portfolio.filters[0] 
        ? portfolio.projects 
        : portfolio.projects.filter(p => p.category === activeFilter);

    return (
        <section id="proyek" className="bg-white">
            <div className="container mx-auto px-6 sm:px-8 py-20 text-center max-w-7xl">
                <h2 className="text-3xl font-bold text-bsk-text-dark wow animate__animated animate__fadeInUp">{portfolio.title}</h2>
                <div className="w-16 h-1 bg-bsk-blue mx-auto mt-4 mb-6 wow animate__animated animate__fadeInUp" data-wow-delay="0.1s"></div>
                <p className="max-w-3xl mx-auto text-bsk-text-gray wow animate__animated animate__fadeInUp" data-wow-delay="0.2s">
                    {portfolio.paragraph}
                </p>
            </div>

            <div className="bg-bsk-dark-gray" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/blueprint.png')" }}>
                <div className="bg-bsk-dark-gray/90">
                    <div className="container mx-auto px-6 sm:px-8 max-w-7xl">
                        <div className="bg-bsk-yellow py-4">
                            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 px-4">
                                {portfolio.filters.map((filter, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => setActiveFilter(filter)}
                                        className={`font-semibold text-sm tracking-wider transition-colors duration-300 px-3 py-1 ${activeFilter === filter ? 'text-bsk-text-dark border-b-2 border-bsk-text-dark' : 'text-bsk-text-dark/70 hover:text-bsk-text-dark'}`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="container mx-auto px-6 sm:px-8 py-20 max-w-7xl">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProjects.map((project, index) => (
                                <div key={project.id} className="text-white wow animate__animated animate__fadeInUp" data-wow-delay={`${index * 0.1}s`}>
                                    <div className="relative group overflow-hidden">
                                        <img src={project.image} alt={project.title} className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-center">
                                            <div className="w-14 h-14 bg-bsk-yellow flex items-center justify-center cursor-pointer">
                                                <SearchIcon className="w-6 h-6 text-bsk-text-dark" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-5">
                                        <h3 className="text-lg font-bold">{project.title}</h3>
                                        <p className="text-bsk-yellow text-sm font-semibold">in {project.category}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Portfolio;