import React from 'react';
import { LocationPinIcon, PhoneIcon, MailIcon, ClockIcon, InstagramIcon, LinkedinIcon } from './icons';
import { useData } from '../context/DataContext';

const Footer: React.FC<{ setView: (view: string, options?: { anchor?: string; state?: any; }) => void }> = ({ setView }) => {
    const { data } = useData();
    const { header, footer } = data;

    const handleServiceLinkClick = (tabId: string) => {
        if (tabId) {
            setView('site', { anchor: '#layanan-unggulan', state: { activeServiceTab: tabId } });
        }
    };
    
    const handleQuickLinkClick = (view: string, anchor?: string) => {
        setView(view, anchor ? { anchor } : undefined);
    };

    return (
        <footer id="kontak" className="bg-bsk-dark-gray text-gray-400 relative">
            <div className="container mx-auto px-6 sm:px-8 py-20 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                    {/* About & Social */}
                    <div className="space-y-4">
                        {header.logoImage ? (
                            <img src={header.logoImage} alt={header.logoText} className="h-10 w-auto" />
                        ) : (
                            <h3 className="text-2xl font-bold text-white tracking-wider">{header.logoText}</h3>
                        )}
                        <p className="text-sm leading-relaxed">{footer.about}</p>
                        <div className="flex space-x-4 pt-2">
                            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors"><InstagramIcon className="w-6 h-6" /></a>
                            <a href="https://www.linkedin.com/company/103727497/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors"><LinkedinIcon className="w-6 h-6" /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-base font-bold text-white mb-6 tracking-wider">Tautan Cepat</h3>
                        <ul className="space-y-3 text-sm">
                            <li><button onClick={() => handleQuickLinkClick('site')} className="hover:text-white transition-colors">Beranda</button></li>
                            <li><button onClick={() => handleQuickLinkClick('site', '#layanan-unggulan')} className="hover:text-white transition-colors">Layanan Kami</button></li>
                            <li><button onClick={() => handleQuickLinkClick('costSimulator')} className="hover:text-white transition-colors">Estimasi</button></li>
                        </ul>
                    </div>
                    
                    {/* Services */}
                    <div>
                        <h3 className="text-base font-bold text-white mb-6 tracking-wider">Layanan Kami</h3>
                        <ul className="space-y-3 text-sm">
                            {footer.services.map((service, index) => {
                                return (
                                    <li key={index}>
                                        <button 
                                            onClick={() => handleServiceLinkClick(service.href)} 
                                            className="hover:text-white transition-colors text-left"
                                        >
                                            {service.text}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    
                    {/* Contact */}
                    <div>
                         <h3 className="text-base font-bold text-white mb-6 tracking-wider">Kontak Kami</h3>
                         <ul className="space-y-4 text-sm">
                            <li className="flex items-start">
                                <PhoneIcon className="w-5 h-5 mr-4 text-bsk-yellow flex-shrink-0 mt-1" />
                                <span>{footer.phone}</span>
                            </li>
                            <li className="flex items-start">
                                <MailIcon className="w-5 h-5 mr-4 text-bsk-yellow flex-shrink-0 mt-1" />
                                <span>{footer.email}</span>
                            </li>
                            <li className="flex items-start">
                                <ClockIcon className="w-5 h-5 mr-4 text-bsk-yellow flex-shrink-0 mt-1" />
                                <span>{footer.hours}</span>
                            </li>
                            <li className="flex items-start">
                                <LocationPinIcon className="w-5 h-5 mr-4 text-bsk-yellow flex-shrink-0 mt-1" />
                                <span>{footer.address}</span>
                            </li>
                         </ul>
                    </div>
                </div>
            </div>
            
            {/* Sub-Footer */}
            <div className="border-t border-gray-700">
                <div className="container mx-auto px-6 sm:px-8 py-6 flex justify-center items-center text-sm max-w-7xl">
                    <p className="text-gray-500 text-center">{footer.subFooter.copyright}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;