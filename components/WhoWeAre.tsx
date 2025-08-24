




import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { ChevronUpIcon, ChevronDownIcon } from './icons';

interface AccordionItemProps {
  id: string;
  title: string;
  content: string;
  isOpen: boolean;
  onClick: (id: string) => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ id, title, content, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200">
      <button 
        onClick={() => onClick(id)} 
        className="w-full text-left py-5 flex justify-between items-center transition-colors duration-300 focus:outline-none"
        aria-expanded={isOpen}
      >
        <h3 className={`text-lg font-semibold ${isOpen ? 'text-bsk-blue' : 'text-gray-800'}`}>{title}</h3>
        {isOpen ? <ChevronUpIcon className="w-6 h-6 text-bsk-blue" /> : <ChevronDownIcon className="w-6 h-6 text-gray-400" />}
      </button>
      <div
        className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
            <p className="pb-5 text-gray-600 pr-6">{content}</p>
        </div>
      </div>
    </div>
  );
};


const WhoWeAre: React.FC<{ 
  setView: (view: string, options?: { anchor?: string; state?: any; }) => void;
  activeTabId?: string;
}> = ({ setView, activeTabId }) => {
  const { data } = useData();
  const { whoWeAre } = data;
  
  const [activeTab, setActiveTab] = useState(whoWeAre.tabs[0]?.id || '');
  const [openAccordion, setOpenAccordion] = useState<string | null>(whoWeAre.tabs[0]?.accordions[0]?.id || null);

  useEffect(() => {
    if (activeTabId && whoWeAre.tabs.some(tab => tab.id === activeTabId)) {
      setActiveTab(activeTabId);
      const newTabData = whoWeAre.tabs.find(tab => tab.id === activeTabId);
      setOpenAccordion(newTabData?.accordions[0]?.id || null);
    }
  }, [activeTabId, whoWeAre.tabs]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    const newTabData = whoWeAre.tabs.find(tab => tab.id === tabId);
    setOpenAccordion(newTabData?.accordions[0]?.id || null);
  };

  const handleAccordionClick = (accordionId: string) => {
    setOpenAccordion(openAccordion === accordionId ? null : accordionId);
  };
  
  const currentTabData = whoWeAre.tabs.find(tab => tab.id === activeTab);

  if (!currentTabData) {
    return null; // or a loading/error state
  }
  
  const handleEstimateClick = () => {
      setView('costSimulator', { state: { serviceId: activeTab } });
  };
  
  const whatsappNumber = data.footer.phone.replace(/[\s+-]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Halo,%20saya%20tertarik%20dengan%20layanan%20${encodeURIComponent(currentTabData.label)}%20dan%20ingin%20meminta%20penawaran%20proyek.`;


  return (
    <section id="layanan-unggulan" className="bg-white py-20">
      <div className="container mx-auto px-6 sm:px-8 max-w-7xl text-center">
        <h2 className="text-4xl font-bold text-bsk-blue">{whoWeAre.mainTitle}</h2>
        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
          {whoWeAre.mainParagraph}
        </p>

        <div className="my-10 p-2 bg-gray-100 rounded-xl shadow-inner inline-block">
          <div className="flex flex-wrap justify-center gap-2">
            {whoWeAre.tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bsk-blue ${
                  activeTab === tab.id
                    ? 'bg-bsk-blue text-white shadow-md'
                    : 'bg-white sm:bg-transparent text-gray-700 hover:bg-white/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 sm:px-8 max-w-7xl mt-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left animate__animated animate__fadeInLeft" key={activeTab}>
              <span className="inline-block bg-blue-100 text-bsk-blue text-sm font-semibold px-4 py-1 rounded-full mb-4">
                {currentTabData.label}
              </span>
              <h2 className="text-3xl font-bold text-bsk-dark-gray mb-4">
                {currentTabData.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {currentTabData.description}
              </p>
              <div>
                {currentTabData.accordions.map((item) => (
                  <AccordionItem 
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    content={item.content}
                    isOpen={openAccordion === item.id}
                    onClick={handleAccordionClick}
                  />
                ))}
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button
                      onClick={handleEstimateClick}
                      className="bg-bsk-blue text-white font-bold py-3 px-8 hover:bg-opacity-90 transition-all duration-300 tracking-wider text-sm rounded-md w-full sm:w-auto"
                  >
                      Buat Estimasi
                  </button>
                  <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-transparent border-2 border-bsk-blue text-bsk-blue font-bold py-3 px-8 hover:bg-bsk-blue hover:text-white transition-all duration-300 tracking-wider text-sm rounded-md w-full sm:w-auto text-center"
                  >
                      Request Project
                  </a>
              </div>
            </div>
            
            <div className="flex items-center justify-center animate__animated animate__fadeInRight" key={activeTab + '-img'}>
              <img src={currentTabData.image} alt="Service Image" className="w-full h-auto object-cover aspect-[4/3] rounded-2xl shadow-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;