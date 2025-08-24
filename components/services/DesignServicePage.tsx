


import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { useData } from '../../context/DataContext';
import { ArchitectIcon, StructureIcon, MEPIcon, InteriorIcon, ThreeDIcon, BudgetIcon, IdentificationIcon } from '../icons';

interface DesignServicePageProps {
  setView: (view: string, options?: { anchor?: string; state?: any; }) => void;
}

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Architect': ArchitectIcon,
    'Structure': StructureIcon,
    'MEP': MEPIcon,
    'Interior': InteriorIcon,
    '3D': ThreeDIcon,
    'Budget': BudgetIcon,
    'Identification': IdentificationIcon,
};

const DesignServicePage: React.FC<DesignServicePageProps> = ({ setView }) => {
    const { data } = useData();
    const { designServicePage } = data;

    return (
        <div className="bg-white">
            <Header setView={setView} />
            <main>
                {/* Hero Banner */}
                <section 
                    className="relative h-96 bg-cover bg-center text-white flex items-center justify-center"
                    style={{ backgroundImage: `url('${designServicePage.hero.backgroundImage}')` }}
                >
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="relative z-10 text-center max-w-4xl px-4">
                        <h1 className="text-4xl md:text-6xl font-black tracking-wider leading-tight animate__animated animate__fadeInDown">
                            {designServicePage.hero.title}
                        </h1>
                    </div>
                </section>
                
                {/* About the Service */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6 sm:px-8 max-w-7xl">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="wow animate__animated animate__fadeInLeft">
                                <h2 className="text-3xl font-bold text-bsk-text-dark">{designServicePage.about.title}</h2>
                                <div className="w-16 h-1 bg-bsk-blue mt-4 mb-6"></div>
                                <p className="text-bsk-text-gray mb-4">{designServicePage.about.paragraph1}</p>
                                <p className="text-bsk-text-gray">{designServicePage.about.paragraph2}</p>
                            </div>
                            <div className="wow animate__animated animate__fadeInRight">
                                <img src={designServicePage.about.image} alt="Architectural planning" className="shadow-2xl w-full h-auto object-cover" />
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* What We Offer */}
                <section className="py-20 bg-bsk-light-gray/50">
                    <div className="container mx-auto px-6 sm:px-8 max-w-7xl text-center">
                        <h2 className="text-3xl font-bold text-bsk-text-dark wow animate__animated animate__fadeInUp">{designServicePage.offerings.title}</h2>
                        <div className="w-16 h-1 bg-bsk-blue mx-auto mt-4 mb-6 wow animate__animated animate__fadeInUp" data-wow-delay="0.1s"></div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                            {designServicePage.offerings.items.map((item, index) => {
                                const IconComponent = iconMap[item.icon];
                                return (
                                    <div key={index} className="bg-white p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 wow animate__animated animate__fadeInUp" data-wow-delay={`${index * 0.1}s`}>
                                        <div className="inline-block p-4 bg-bsk-yellow text-bsk-dark-gray mb-4">
                                            {IconComponent && <IconComponent className="w-10 h-10" />}
                                        </div>
                                        <h3 className="text-xl font-bold text-bsk-text-dark mb-2">{item.title}</h3>
                                        <p className="text-bsk-text-gray text-sm">{item.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
                
                {/* Our Process */}
                 <section className="py-20 bg-bsk-dark-gray text-white" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/az-subtle.png')" }}>
                    <div className="bg-bsk-dark-gray/95">
                        <div className="container mx-auto px-6 sm:px-8 max-w-7xl text-center">
                            <h2 className="text-3xl font-bold wow animate__animated animate__fadeInUp">{designServicePage.process.title}</h2>
                            <div className="w-16 h-1 bg-bsk-yellow mx-auto mt-4 mb-6 wow animate__animated animate__fadeInUp" data-wow-delay="0.1s"></div>
                            <div className="relative mt-16">
                                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-600"></div>
                                <div className="grid md:grid-cols-5 gap-8">
                                    {designServicePage.process.steps.map((step, index) => (
                                        <div key={index} className="relative z-10 wow animate__animated animate__fadeInUp" data-wow-delay={`${index * 0.15}s`}>
                                            <div className="flex flex-col items-center">
                                                 <div className="w-20 h-20 flex items-center justify-center border-2 border-bsk-yellow bg-bsk-dark-gray rounded-full text-2xl font-bold text-bsk-yellow mb-4">
                                                    {step.step}
                                                </div>
                                                <h3 className="text-lg font-bold tracking-wider mb-2">{step.title}</h3>
                                                <p className="text-sm text-gray-400">{step.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* CTA */}
                <section className="bg-bsk-yellow">
                    <div className="container mx-auto px-6 sm:px-8 max-w-7xl">
                        <div className="py-16 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
                            <h2 className="text-3xl font-black text-bsk-text-dark">{designServicePage.cta.title}</h2>
                            <a href="#" className="bg-bsk-dark-gray text-white font-bold py-4 px-10 hover:bg-black transition-all duration-300 tracking-wider text-sm flex-shrink-0">
                                {designServicePage.cta.buttonText}
                            </a>
                        </div>
                    </div>
                </section>

            </main>
            <Footer setView={setView} />
        </div>
    );
};

export default DesignServicePage;