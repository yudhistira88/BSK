

import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { ChevronDownIcon } from './icons';

interface HeaderProps {
    setView: (view: string, options?: { anchor?: string; state?: any; }) => void;
}

const Header: React.FC<HeaderProps> = ({ setView }) => {
    const { data } = useData();
    const { header } = data;
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNavClick = (href: string, isMobile: boolean = false) => {
        if (href.startsWith('#')) {
            setView('site', { anchor: href });
        }
        if (isMobile) {
            setIsOpen(false);
        }
    };
    
    const handleActionClick = (action: string | undefined, href: string | undefined, isMobile: boolean = false) => {
        switch (action) {
            case 'costSimulator':
                setView('costSimulator');
                break;
            case 'admin':
                setView('admin');
                break;
            case 'login':
                setView('login');
                break;
            case 'anchor':
                if (href) setView('site', { anchor: href });
                break;
            default:
                break;
        }
        
        if (isMobile) setIsOpen(false);
        setActiveDropdown(null);
    };

    const renderCTAButtons = (isMobile: boolean = false) => {
        const commonClasses = isMobile 
            ? "block w-full text-center font-bold py-3 px-6 rounded-sm text-sm"
            : "font-bold py-3 px-5 rounded-md text-sm tracking-wider whitespace-nowrap";

        const buttonStyles = {
            primary: `bg-bsk-yellow text-bsk-dark-gray hover:brightness-95 ${commonClasses}`,
            secondary: `bg-bsk-blue text-white hover:bg-opacity-90 ${commonClasses}`,
            'secondary-outline': `bg-transparent border-2 border-bsk-yellow text-bsk-yellow hover:bg-bsk-yellow hover:text-bsk-dark-gray ${commonClasses}`
        };

        return header.ctaButtons.map((button, index) => {
            const btnClass = `${buttonStyles[button.type]} transition-all duration-300`;

            if (button.items) {
                return (
                    <div key={index} className="relative" ref={activeDropdown === index ? dropdownRef : null}>
                        <button onClick={() => setActiveDropdown(activeDropdown === index ? null : index)} className={`${btnClass} flex items-center justify-center gap-2 w-full`}>
                            <span>{button.text}</span>
                            <ChevronDownIcon className={`w-4 h-4 transition-transform ${activeDropdown === index ? 'rotate-180' : ''}`} />
                        </button>
                        {activeDropdown === index && (
                            <div className={`absolute top-full mt-2 w-56 bg-white rounded-md shadow-lg z-10 overflow-hidden ${isMobile ? 'left-0 right-0' : 'right-0'}`}>
                                <ul className="py-1">
                                    {button.items.map((item, itemIndex) => (
                                        <li key={itemIndex}>
                                            {item.action === 'download' ? (
                                                <a 
                                                    href="/BSK-Company-Profile.pdf" 
                                                    download 
                                                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setActiveDropdown(null)}
                                                >
                                                    {item.text}
                                                </a>
                                            ) : (
                                                <button 
                                                    onClick={() => handleActionClick(item.action, item.href, isMobile)}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    {item.text}
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );
            } else {
                return (
                    <button key={index} onClick={() => handleActionClick(button.action, button.href, isMobile)} className={btnClass}>
                        {button.text}
                    </button>
                );
            }
        });
    }

    const NavLinks: React.FC<{isMobile?: boolean}> = ({isMobile = false}) => (
        <>
            {header.navLinks.map((link, index) => (
                <button 
                    key={index} 
                    onClick={() => handleNavClick(link.href, isMobile)} 
                    className={isMobile 
                        ? "block text-white font-semibold py-2 w-full text-left hover:bg-bsk-yellow hover:text-bsk-dark-gray rounded-md px-3" 
                        : "text-white font-semibold tracking-wider px-4 py-3 rounded-md text-base hover:bg-bsk-yellow hover:text-bsk-dark-gray transition-colors duration-300"
                    }
                >
                    {link.text}
                </button>
            ))}
        </>
    );

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-bsk-dark-gray shadow-lg' : 'bg-bsk-dark-gray/80'}`}>
            <div className="container mx-auto px-4 sm:px-6 max-w-full 2xl:max-w-7xl">
                <div className="flex items-center justify-between h-24 text-white">
                    {/* Left Side: Logo */}
                    <div className="flex-shrink-0">
                        <button onClick={() => setView('site')} className="flex items-center">
                             {header.logoImage ? (
                                <img src={header.logoImage} alt={header.logoText} className="h-12 w-auto" />
                            ) : (
                                <span className="text-3xl font-black tracking-wider">{header.logoText}</span>
                            )}
                        </button>
                    </div>

                    {/* Center: Desktop Navigation */}
                    <nav className="hidden lg:flex flex-1 justify-center items-center space-x-4">
                        <NavLinks />
                    </nav>

                    {/* Right Side: CTAs */}
                    <div className="hidden lg:flex items-center flex-shrink-0 space-x-2">
                        {renderCTAButtons()}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none" aria-label="Open menu">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                 <div className="lg:hidden bg-bsk-dark-gray/95 backdrop-blur-sm pb-4">
                    <nav className="flex flex-col items-start px-5 pt-2 pb-3 space-y-1">
                        <NavLinks isMobile={true} />
                    </nav>
                    <div className="px-5"><div className="border-t border-gray-700"></div></div>
                    <div className="mt-4 px-5 space-y-2">
                       {renderCTAButtons(true)}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;