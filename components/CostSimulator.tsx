

import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useData } from '../context/DataContext';
import { PencilSquareIcon, BuildingOfficeIcon, PaintBrushIcon, ArrowLeftIcon, ChevronRightIcon, WrenchScrewdriverIcon, MEPIcon, RoadIcon, CpuChipIcon } from './icons';

// Mapping icon names from data to actual components
const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'PencilSquare': PencilSquareIcon,
    'BuildingOffice': BuildingOfficeIcon,
    'PaintBrush': PaintBrushIcon,
    'WrenchScrewdriver': WrenchScrewdriverIcon,
    'MEP': MEPIcon,
    'Road': RoadIcon,
    'CpuChip': CpuChipIcon,
};

interface CostSimulatorProps {
  setView: (view: string, options?: { anchor?: string; state?: any; }) => void;
  initialState?: { serviceId?: string | null } | null;
}

const CostSimulator: React.FC<CostSimulatorProps> = ({ setView, initialState }) => {
    // Data and state setup
    const { data } = useData();
    const { costSimulatorPage } = data;
    const { calculatorSteps } = costSimulatorPage;

    const [step, setStep] = useState(1);
    const [animationClass, setAnimationClass] = useState('animate__fadeInRight');

    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(initialState?.serviceId || null);
    const [selectedSubServiceId, setSelectedSubServiceId] = useState<string | null>(null);
    const [selectedSubDetailId, setSelectedSubDetailId] = useState<string | null>(null);
    const [selectedQuality, setSelectedQuality] = useState<string | null>(null);
    const [formValues, setFormValues] = useState<{ [key: string]: string }>({});
    const [result, setResult] = useState<string | null>(null);

    const selectedService = calculatorSteps.find(s => s.id === selectedServiceId);
    const selectedSubService = selectedService?.subServices.find(ss => ss.id === selectedSubServiceId);
    const selectedSubDetail = selectedSubService?.subDetails?.find(ssd => ssd.id === selectedSubDetailId);
    
    const finalSelection = selectedSubDetail || selectedSubService;

    const needsQualityStep = (service: typeof finalSelection) => service && typeof service.price === 'object';

    // Effect to handle initial state from other pages
    useEffect(() => {
        if (initialState?.serviceId) {
            setSelectedServiceId(initialState.serviceId);
            setStep(2);
        }
    }, [initialState]);

    const handleNextStep = (nextStep: number) => {
        setAnimationClass('animate__fadeOutLeft');
        setTimeout(() => {
            setStep(nextStep);
            setAnimationClass('animate__fadeInRight');
        }, 300);
    };

    const handlePrevStep = (prevStep: number) => {
        setAnimationClass('animate__fadeOutRight');
        setTimeout(() => {
            setStep(prevStep);
            setAnimationClass('animate__fadeInLeft');
        }, 300);
    };

    const resetCalculator = () => {
        handlePrevStep(1);
        setSelectedServiceId(null);
        setSelectedSubServiceId(null);
        setSelectedSubDetailId(null);
        setSelectedQuality(null);
        setFormValues({});
        setResult(null);
    };

    const handleServiceSelect = (serviceId: string) => {
        setSelectedServiceId(serviceId);
        setSelectedSubServiceId(null);
        setSelectedSubDetailId(null);
        setSelectedQuality(null);
        setFormValues({});
        setResult(null);
        handleNextStep(2);
    };

    const handleSubServiceSelect = (subServiceId: string) => {
        const subService = selectedService?.subServices.find(ss => ss.id === subServiceId);
        setSelectedSubServiceId(subServiceId);
        setSelectedSubDetailId(null);
        setSelectedQuality(null);
        setFormValues({});
        setResult(null);
        
        if (subService?.subDetails && subService.subDetails.length > 0) {
            handleNextStep(3);
        } else if (needsQualityStep(subService)) {
            handleNextStep(4);
        } else {
            handleNextStep(5);
        }
    };
    
    const handleSubDetailSelect = (subDetailId: string) => {
        const subDetail = selectedSubService?.subDetails?.find(ssd => ssd.id === subDetailId);
        setSelectedSubDetailId(subDetailId);
        setSelectedQuality(null);
        setFormValues({});
        setResult(null);
        
        if (needsQualityStep(subDetail)) {
            handleNextStep(4);
        } else {
            handleNextStep(5);
        }
    };
    
    const handleQualitySelect = (quality: string) => {
        setSelectedQuality(quality);
        handleNextStep(5);
    };

    const handleFormValueChange = (fieldId: string, value: string) => {
        setFormValues(prev => ({ ...prev, [fieldId]: value }));
    };
    
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0,
        }).format(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!finalSelection) return;

        const primaryField = finalSelection.fields?.find(f => f.type === 'numeric');
        if (!primaryField) return;
        
        const value = parseFloat(formValues[primaryField.id] || '0');
        if (isNaN(value) || value <= 0) {
            setResult("Input tidak valid.");
            return;
        }

        let price = 0;
        if (typeof finalSelection.price === 'object') {
            if (selectedQuality && finalSelection.price[selectedQuality]) {
                price = finalSelection.price[selectedQuality];
            } else {
                setResult("Kualitas material belum dipilih.");
                return;
            }
        } else {
            price = finalSelection.price || 0;
        }

        const estimatedCost = price * value;
        const lowerBound = estimatedCost;
        const upperBound = estimatedCost * 1.25;

        setResult(`${formatCurrency(lowerBound)} - ${formatCurrency(upperBound)}`);
        handleNextStep(6);
    };
    
    const ProgressIndicator = () => (
        <div className="flex items-center justify-center space-x-2 md:space-x-4 mb-12">
            {[1, 2, 3, 4, 5, 6].map((s) => (
                <React.Fragment key={s}>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${step >= s ? 'bg-bsk-blue border-bsk-blue text-white' : 'bg-white border-gray-300 text-gray-500'}`}>
                        {s < 6 ? s : <span className="font-bold">✓</span>}
                    </div>
                    {s < 6 && <div className={`h-1 w-8 md:w-16 transition-all duration-300 ${step > s ? 'bg-bsk-blue' : 'bg-gray-300'}`}></div>}
                </React.Fragment>
            ))}
        </div>
    );

    const renderStepContent = () => {
        const commonWrapperClass = `w-full animate__animated ${animationClass}`;
        
        switch (step) {
            case 1:
                return (
                    <div className={commonWrapperClass}>
                        <h2 className="text-3xl font-bold text-center text-bsk-text-dark mb-2">Pilih Kategori Layanan</h2>
                        <p className="text-center text-bsk-text-gray mb-10">Mulailah dengan memilih jenis layanan yang Anda butuhkan.</p>
                        <div className="grid md:grid-cols-3 gap-8">
                            {calculatorSteps.map(service => {
                                const IconComponent = iconMap[service.icon];
                                return (
                                    <button key={service.id} onClick={() => handleServiceSelect(service.id)} className="group text-left bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-bsk-blue transition-all duration-300">
                                        {IconComponent && <IconComponent className="w-12 h-12 text-bsk-blue mb-4" />}
                                        <h3 className="text-xl font-bold text-bsk-text-dark mb-2">{service.label}</h3>
                                        <p className="text-bsk-text-gray">{service.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            
            case 2:
                if (!selectedService) return null;
                return (
                     <div className={commonWrapperClass}>
                        <button onClick={() => handlePrevStep(1)} className="flex items-center gap-2 text-bsk-blue font-semibold mb-6 hover:underline"><ArrowLeftIcon className="w-5 h-5"/> Kembali ke Kategori</button>
                        <h2 className="text-3xl font-bold text-center text-bsk-text-dark mb-2">Pilih Detail Layanan</h2>
                        <p className="text-center text-bsk-text-gray mb-10">Pilih layanan spesifik di bawah kategori "{selectedService.label}".</p>
                         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {selectedService.subServices.map(sub => (
                                <button key={sub.id} onClick={() => handleSubServiceSelect(sub.id)} className="group flex items-center justify-between text-left bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:bg-bsk-sky-blue transition-all duration-300">
                                    <span className="font-semibold text-bsk-text-dark">{sub.label}</span>
                                    <ChevronRightIcon className="w-6 h-6 text-gray-400 group-hover:text-bsk-blue transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                );
            
            case 3:
                if (!selectedSubService || !selectedSubService.subDetails) return null;
                return (
                     <div className={commonWrapperClass}>
                        <button onClick={() => handlePrevStep(2)} className="flex items-center gap-2 text-bsk-blue font-semibold mb-6 hover:underline"><ArrowLeftIcon className="w-5 h-5"/> Kembali ke Detail Layanan</button>
                        <h2 className="text-3xl font-bold text-center text-bsk-text-dark mb-2">Pilih Sub-Detail Layanan</h2>
                        <p className="text-center text-bsk-text-gray mb-10">Pilih jenis pekerjaan spesifik untuk "{selectedSubService.label}".</p>
                         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {selectedSubService.subDetails.map(sub => (
                                <button key={sub.id} onClick={() => handleSubDetailSelect(sub.id)} className="group flex items-center justify-between text-left bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:bg-bsk-sky-blue transition-all duration-300">
                                    <span className="font-semibold text-bsk-text-dark">{sub.label}</span>
                                    <ChevronRightIcon className="w-6 h-6 text-gray-400 group-hover:text-bsk-blue transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 4:
                const prevStepForQuality = selectedSubDetailId ? 3 : 2;
                return (
                    <div className={commonWrapperClass}>
                        <button onClick={() => handlePrevStep(prevStepForQuality)} className="flex items-center gap-2 text-bsk-blue font-semibold mb-6 hover:underline"><ArrowLeftIcon className="w-5 h-5"/> Kembali</button>
                        <h2 className="text-3xl font-bold text-center text-bsk-text-dark mb-2">Pilih Kualitas Material</h2>
                        <p className="text-center text-bsk-text-gray mb-10">Kualitas material akan mempengaruhi hasil akhir dan total biaya proyek.</p>
                        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            {costSimulatorPage.form.qualityOptions.map(quality => (
                                <button key={quality.title} onClick={() => handleQualitySelect(quality.title)} className="group text-left bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-bsk-blue transition-all duration-300 flex flex-col h-full">
                                    <h3 className="text-xl font-bold text-bsk-text-dark mb-2">{quality.title}</h3>
                                    <p className="text-bsk-text-gray flex-grow">{quality.description}</p>
                                    <span className="mt-4 font-semibold text-bsk-blue group-hover:underline self-start">Pilih Kualitas Ini &rarr;</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 5:
                if (!finalSelection || !finalSelection.fields) return null;
                let prevStepForForm = 2;
                if (needsQualityStep(finalSelection)) {
                    prevStepForForm = 4;
                } else if (selectedSubDetailId) {
                    prevStepForForm = 3;
                }
                
                return (
                     <div className={`${commonWrapperClass} max-w-lg mx-auto`}>
                        <button onClick={() => handlePrevStep(prevStepForForm)} className="flex items-center gap-2 text-bsk-blue font-semibold mb-6 hover:underline"><ArrowLeftIcon className="w-5 h-5"/> Kembali</button>
                        <div className="bg-white p-8 rounded-lg shadow-2xl">
                             <h2 className="text-2xl font-bold text-center text-bsk-text-dark mb-2">{finalSelection.label}</h2>
                             <p className="text-center text-bsk-text-gray mb-8">Masukkan detail yang diperlukan untuk menghitung estimasi.</p>
                             <form onSubmit={handleSubmit} className="space-y-6">
                                {finalSelection.fields.map(field => (
                                    <div key={field.id}>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">{field.label}</label>
                                        {field.type === 'numeric' && (
                                            <div className="relative">
                                                <input type="number" value={formValues[field.id] || ''} onChange={e => handleFormValueChange(field.id, e.target.value)} placeholder={field.placeholder} className="w-full pl-4 pr-16 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-bsk-blue/50 focus:border-bsk-blue transition" required />
                                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 font-semibold">{finalSelection.unit}</span>
                                            </div>
                                        )}
                                        {field.type === 'select' && field.options && (
                                            <select value={formValues[field.id] || ''} onChange={e => handleFormValueChange(field.id, e.target.value)} className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-bsk-blue/50 focus:border-bsk-blue transition" required>
                                                 <option value="">Pilih Opsi...</option>
                                                 {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                        )}
                                    </div>
                                ))}
                                <button type="submit" className="w-full bg-bsk-yellow text-bsk-dark-gray font-bold py-4 px-8 rounded-lg hover:brightness-95 transition-all duration-300 tracking-wider">
                                    {costSimulatorPage.form.buttonText}
                                </button>
                             </form>
                         </div>
                    </div>
                );

            case 6:
                return (
                     <div className={`${commonWrapperClass} max-w-lg mx-auto text-center`}>
                        <div className="bg-white p-8 rounded-lg shadow-2xl">
                            <h2 className="text-2xl font-bold text-bsk-text-dark mb-4">{costSimulatorPage.results.title}</h2>
                            <p className="text-4xl lg:text-5xl font-black text-bsk-blue my-6">{result}</p>
                            <p className="text-xs text-gray-500 italic mt-4">{costSimulatorPage.results.disclaimer}</p>
                            <a href={`https://wa.me/${data.footer.phone.replace(/[\s+-]/g, '')}`} target="_blank" rel="noopener noreferrer" className="mt-8 mb-4 w-full block text-center bg-bsk-dark-gray text-white font-bold py-4 px-8 rounded-lg hover:bg-black transition-all duration-300 tracking-wider">
                                {costSimulatorPage.results.ctaButtonText}
                            </a>
                            <button onClick={resetCalculator} className="text-bsk-blue font-semibold hover:underline">
                                Buat Estimasi Lain
                            </button>
                        </div>
                    </div>
                );

            default: return null;
        }
    }

    return (
         <div className="bg-white">
            <Header setView={setView} />
            <main>
                <section className="relative h-96 bg-cover bg-center text-white flex items-center justify-center" style={{ backgroundImage: `url('${costSimulatorPage.hero.backgroundImage}')` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />
                    <div className="relative z-10 text-center max-w-4xl px-4">
                        <h1 className="text-4xl md:text-6xl font-black tracking-wider leading-tight animate__animated animate__fadeInDown">{costSimulatorPage.hero.title}</h1>
                        <p className="mt-4 text-white/90 animate__animated animate__fadeInUp">{costSimulatorPage.hero.subtitle}</p>
                    </div>
                </section>
                
                <section className="py-20 bg-bsk-sky-blue/30">
                    <div className="container mx-auto px-6 sm:px-8 max-w-7xl">
                        <ProgressIndicator />
                        <div className="min-h-[450px] flex items-center justify-center">
                            {renderStepContent()}
                        </div>
                    </div>
                </section>
            </main>
            <Footer setView={setView} />
        </div>
    );
};

export default CostSimulator;