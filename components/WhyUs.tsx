

import React from 'react';
import { useData } from '../context/DataContext';

const WhyUs: React.FC = () => {
    const { data } = useData();
    const { whyUs } = data;

    return (
        <>
            <section className="bg-bsk-blue text-white py-20 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-96 h-96 bg-bsk-yellow rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white rounded-full translate-x-1/2 translate-y-1/2 opacity-10"></div>

                <div className="container mx-auto px-6 sm:px-8 max-w-7xl relative z-10">
                    <div className="text-center mb-16 wow animate__animated animate__fadeInUp">
                        <h2 className="text-4xl md:text-5xl font-bold">{whyUs.sectionTitle}</h2>
                        <p className="mt-4 text-white/90 max-w-2xl mx-auto">{whyUs.sectionSubtitle}</p>
                    </div>

                    <div className="space-y-16 md:space-y-24">
                        {whyUs.features.map((feature, index) => {
                            const isImageLeft = index % 2 === 0;
                            return (
                                <div key={index} className="relative w-full max-w-5xl mx-auto">
                                    {/* Image Wrapper */}
                                    <div className={`md:w-[60%] wow animate__animated ${isImageLeft ? 'animate__fadeInLeft' : 'animate__fadeInRight'} ${isImageLeft ? 'md:mr-auto' : 'md:ml-auto'}`} data-wow-delay="0.1s">
                                        <img 
                                            src={feature.image} 
                                            alt={feature.title} 
                                            className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
                                        />
                                    </div>
                                    
                                    {/* Text Wrapper */}
                                    <div className={`w-full md:w-[55%] md:absolute md:top-1/2 md:-translate-y-1/2 ${isImageLeft ? 'md:right-0' : 'md:left-0'} wow animate__animated ${isImageLeft ? 'animate__fadeInRight' : 'animate__fadeInLeft'}`} data-wow-delay="0.3s">
                                        <div className="bg-white text-bsk-text-dark p-8 md:p-10 rounded-2xl shadow-2xl mt-[-40px] md:mt-0">
                                            <h3 className="text-2xl font-bold text-bsk-blue mb-3">{feature.title}</h3>
                                            <p className="text-bsk-text-gray leading-relaxed">{feature.description}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-6 sm:px-8 max-w-7xl text-center">
                    <h2 className="text-4xl font-bold text-bsk-text-dark wow animate__animated animate__fadeInUp">{whyUs.businessTypesTitle}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-8 mt-12">
                        {whyUs.businessTypes.map((biz, index) => (
                            <div key={index} className="flex flex-col items-center justify-start text-center wow animate__animated animate__fadeInUp" data-wow-delay={`${index * 0.05}s`}>
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-md mb-4 p-2">
                                    <img src={biz.icon} alt={biz.label} className="w-14 h-14 object-contain" />
                                </div>
                                <p className="font-semibold text-bsk-text-gray text-sm">{biz.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default WhyUs;