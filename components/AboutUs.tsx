
import React from 'react';
import { useData } from '../context/DataContext';

const AboutUs: React.FC = () => {
    const { data } = useData();
    const { aboutUs } = data;

    return (
        <>
            <section id="about-us" className="bg-white pt-20 pb-20">
                <div className="container mx-auto px-6 sm:px-8 max-w-7xl">
                    {/* About Us Section */}
                    <div className="flex flex-col lg:flex-row items-stretch">
                        <div className="lg:w-2/3 pr-0 lg:pr-12">
                            <div className="h-full flex flex-col justify-center">
                                <span className="inline-block text-xs font-bold tracking-[0.2em] text-bsk-dark-gray bg-gray-100 px-3 py-2 mb-4 self-start wow animate__animated animate__fadeInUp">{aboutUs.preTitle}</span>
                                <h2 className="text-5xl md:text-6xl font-bold text-bsk-dark-gray wow animate__animated animate__fadeInUp" data-wow-delay="0.1s">{aboutUs.title}</h2>
                                <div className="w-20 h-1 bg-bsk-blue my-6 wow animate__animated animate__fadeInUp" data-wow-delay="0.2s"></div>
                                <p className="text-bsk-text-gray leading-relaxed wow animate__animated animate__fadeInUp" data-wow-delay="0.3s">{aboutUs.mainParagraph}</p>
                                <p className="mt-8 font-semibold text-bsk-dark-gray italic wow animate__animated animate__fadeInUp" data-wow-delay="0.4s">"{aboutUs.tagline}"</p>
                            </div>
                        </div>
                        <div className="lg:w-1/3 bg-bsk-blue text-white p-8 md:p-12 text-center flex flex-col justify-center min-h-[300px] mt-8 lg:mt-0 wow animate__animated animate__fadeInRight">
                            <h3 className="text-6xl md:text-7xl font-bold">{aboutUs.completedProjects.replace('+', '')}<span className="text-bsk-yellow">+</span></h3>
                            <p className="mt-2 text-lg tracking-wider">Completed Project</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="bg-gradient-to-r from-gray-50 via-white to-gray-50 py-20">
                <div className="container mx-auto px-6 sm:px-8 max-w-7xl">
                    {/* Vision */}
                    <div className="text-center mb-16 wow animate__animated animate__fadeInUp">
                        <h2 className="text-5xl md:text-6xl font-bold text-bsk-blue tracking-wider">{aboutUs.visionTitle}</h2>
                        <p className="mt-6 max-w-3xl mx-auto text-bsk-text-gray leading-relaxed">{aboutUs.visionParagraph}</p>
                    </div>

                    {/* Mission */}
                    <div className="text-center mb-12 wow animate__animated animate__fadeInUp">
                        <h2 className="text-5xl md:text-6xl font-bold text-bsk-blue tracking-wider">{aboutUs.missionTitle}</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 max-w-5xl mx-auto wow animate__animated animate__fadeInUp" data-wow-delay="0.2s">
                        {aboutUs.missions.map((mission, index) => (
                             <div key={mission.id} className="flex items-start gap-5">
                                <div className="flex-shrink-0 w-12 h-12 bg-bsk-blue text-white flex items-center justify-center font-bold text-xl mt-1">
                                    {String(index + 1).padStart(2, '0')}
                                </div>
                                <p className="text-bsk-text-gray">{mission.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default AboutUs;