
import React, { useState, useEffect } from 'react';
import { ChevronUpIcon, ChevronDownIcon, ChevronRightIcon } from './icons';
import { useData } from '../context/DataContext';

interface AccordionItemProps {
  id: string;
  title: string;
  content: string;
  isOpen: boolean;
  onClick: (id: string) => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ id, title, content, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-300/80">
      <button 
        onClick={() => onClick(id)} 
        className="w-full text-left py-5 flex justify-between items-center transition-colors duration-300 focus:outline-none"
        aria-expanded={isOpen}
      >
        <h3 className={`text-base md:text-lg font-semibold ${isOpen ? 'text-bsk-blue' : 'text-bsk-text-dark'}`}>{title}</h3>
        {isOpen ? <ChevronUpIcon className="w-6 h-6 text-bsk-blue flex-shrink-0" /> : <ChevronDownIcon className="w-6 h-6 text-gray-400 flex-shrink-0" />}
      </button>
      <div
        className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
            <p className="pb-5 text-bsk-text-gray pr-6">{content}</p>
        </div>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
    const { data } = useData();
    const { faq } = data;
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    useEffect(() => {
        if (faq.items.length > 0) {
            setOpenAccordion(faq.items[0].id);
        }
    }, [faq.items]);

    const whatsappNumber = data.footer.phone.replace(/[\s+-]/g, '');

    const handleAccordionClick = (accordionId: string) => {
        setOpenAccordion(openAccordion === accordionId ? null : accordionId);
    };

    return (
        <section className="bg-bsk-sky-blue py-20">
            <div className="container mx-auto px-6 sm:px-8 max-w-5xl">
                <div className="text-center mb-12 wow animate__animated animate__fadeInUp">
                    <h2 className="text-4xl font-bold text-bsk-blue">{faq.title}</h2>
                </div>
                <div className="max-w-3xl mx-auto bg-white p-4 sm:p-8 rounded-lg shadow-sm wow animate__animated animate__fadeInUp" data-wow-delay="0.2s">
                    {faq.items.map(item => (
                        <AccordionItem
                            key={item.id}
                            id={item.id}
                            title={item.question}
                            content={item.answer}
                            isOpen={openAccordion === item.id}
                            onClick={handleAccordionClick}
                        />
                    ))}
                </div>
                <div className="text-center mt-12 wow animate__animated animate__fadeInUp" data-wow-delay="0.4s">
                    <a
                        href={`https://wa.me/${whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 border-2 border-bsk-blue text-bsk-blue font-bold py-3 px-8 rounded-full hover:bg-bsk-blue hover:text-white transition-all duration-300 transform hover:scale-105"
                    >
                        <span>Tanyakan Pertanyaan Lainnya</span>
                        <ChevronRightIcon className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
