

import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { useData } from '../../context/DataContext';
import { CheckIcon } from '../icons';

interface AllServicesPageProps {
  setView: (view: string, options?: { anchor?: string; state?: any; }) => void;
}

const AllServicesPage: React.FC<AllServicesPageProps> = ({ setView }) => {
    const { data } = useData();
    const { allServicesPage } = data;

    return (
        <div className="bg-white">
            <Header setView={setView} />
            <main>
                {/* Hero Banner */}
                <section 
                    className="relative h-96 bg-cover bg-center text-white flex items-center justify-center"
                    style={{ backgroundImage: `url('${allServicesPage.hero.backgroundImage}')` }}
                >
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="relative z-10 text-center max-w-4xl px-4">
                        <h1 className="text-4xl md:text-6xl font-black tracking-wider leading-tight animate__animated animate__fadeInDown">
                            {allServicesPage.hero.title}
                        </h1>
                    </div>
                </section>
                
                {/* Intro Section */}
                <section className="py-20 bg-white text-center">
                    <div className="container mx-auto px-6 sm:px-8 max-w-7xl">
                        <h2 className="text-3xl font-bold text-bsk-text-dark wow animate__animated animate__fadeInUp">{allServicesPage.intro.title}</h2>
                        <div className="w-16 h-1 bg-bsk-blue mx-auto mt-4 mb-6 wow animate__animated animate__fadeInUp" data-wow-delay="0.1s"></div>
                        <p className="max-w-3xl mx-auto text-bsk-text-gray wow animate__animated animate__fadeInUp" data-wow-delay="0.2s">
                          {allServicesPage.intro.paragraph}
                        </p>
                    </div>
                </section>

                {/* Services List */}
                {allServicesPage.services.map((service, index) => {
                    const isDesignService = service.id === 'konsultasi-desain';
                    return (
                        <section 
                            key={service.id}
                            id={service.id} 
                            className={`py-20 overflow-hidden ${index % 2 === 0 ? 'bg-bsk-light-gray/50' : 'bg-white'}`}
                        >
                            <div className="container mx-auto px-6 sm:px-8 max-w-7xl">
                                <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 0 ? '' : 'lg:grid-flow-col-dense'}`}>
                                    <div className={`wow animate__animated ${index % 2 === 0 ? 'animate__fadeInLeft' : 'animate__fadeInRight'}`}>
                                        <img src={service.image} alt={service.title} className="shadow-2xl w-full h-auto object-cover aspect-[4/3]" />
                                    </div>
                                    <div className={`wow animate__animated ${index % 2 === 0 ? 'animate__fadeInRight' : 'animate__fadeInLeft'} ${index % 2 !== 0 ? 'lg:col-start-1' : ''}`}>
                                        <h2 className="text-3xl font-bold text-bsk-text-dark">{service.title}</h2>
                                        <div className="w-16 h-1 bg-bsk-blue mt-4 mb-6"></div>
                                        <p className="text-bsk-text-gray mb-6">{service.description}</p>
                                        <ul className="space-y-3 mb-8">
                                            {service.offerings.map((offering, oIndex) => (
                                                 <li key={oIndex} className="flex items-start">
                                                    <CheckIcon className="w-5 h-5 mr-3 text-bsk-yellow flex-shrink-0 mt-1" />
                                                    <span className="text-bsk-text-gray">{offering}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        { isDesignService ? (
                                            <button onClick={() => setView('designService')} className="bg-bsk-blue text-white font-bold py-3 px-8 hover:bg-opacity-90 transition-all duration-300 tracking-wider text-sm">
                                                Pelajari Lebih Lanjut
                                            </button>
                                        ) : (
                                             <a href="#" className="bg-bsk-blue text-white font-bold py-3 px-8 hover:bg-opacity-90 transition-all duration-300 tracking-wider text-sm">
                                                Hubungi Kami
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )
                })}
                
                {/* CTA */}
                <section className="bg-bsk-yellow">
                    <div className="container mx-auto px-6 sm:px-8 max-w-7xl">
                        <div className="py-16 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
                            <h2 className="text-3xl font-black text-bsk-text-dark">{allServicesPage.cta.title}</h2>
                            <a href="#" className="bg-bsk-dark-gray text-white font-bold py-4 px-10 hover:bg-black transition-all duration-300 tracking-wider text-sm flex-shrink-0">
                                {allServicesPage.cta.buttonText}
                            </a>
                        </div>
                    </div>
                </section>

            </main>
            <Footer setView={setView} />
        </div>
    );
};

export default AllServicesPage;