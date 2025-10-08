

import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { 
    CogIcon, PhotographIcon, ChartBarIcon, UsersIcon, IdentificationIcon, RssIcon, MailIcon, OfficeBuildingIcon, BudgetIcon, CheckCircleIcon, ArchitectIcon, DownloadIcon, QuestionMarkCircleIcon, KeyIcon, XCircleIcon, TrashIcon
} from './icons';

const SelectField: React.FC<{ label: string; value: string; options: string[]; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; }> = ({ label, value, options, onChange }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
        <select value={value} onChange={onChange} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-bsk-blue/50 focus:border-bsk-blue transition">
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);


const Admin: React.FC<{ setView: (view: string, options?: { anchor?: string; state?: any; }) => void }> = ({ setView }) => {
    const { data, setData } = useData();
    const [localData, setLocalData] = useState(() => JSON.parse(JSON.stringify(data)));
    const [activeSection, setActiveSection] = useState('header');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [isSaving, setIsSaving] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handlePathChange = (path: string, value: any) => {
        setLocalData(prev => {
            const newData = JSON.parse(JSON.stringify(prev));
            const keys = path.split('.');
            let obj = newData;
            for (let i = 0; i < keys.length - 1; i++) {
                obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = value;
            return newData;
        });
    };
    
    const handleAddItem = (updateFn: (data: any) => any) => {
        setLocalData(prevData => {
            let newData = JSON.parse(JSON.stringify(prevData));
            newData = updateFn(newData);
            return newData;
        });
    }

    const handleRemoveItem = (updateFn: (data: any) => any) => {
        setLocalData(prevData => {
            let newData = JSON.parse(JSON.stringify(prevData));
            newData = updateFn(newData);
            return newData;
        });
    }

    const showToastNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const handleSave = async () => {
        setIsSaving(true);
        
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER;
        const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME;
        const GITHUB_REPO_BRANCH = process.env.GITHUB_REPO_BRANCH || 'main';
        const DATA_FILE_PATH = 'data.json';
        const API_URL = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${DATA_FILE_PATH}`;

        // If GitHub env vars aren't set, save to localStorage and context (local dev mode)
        if (!GITHUB_TOKEN || !GITHUB_REPO_OWNER || !GITHUB_REPO_NAME) {
            setData(localData);
            showToastNotification('Changes saved locally to browser storage!');
            setIsSaving(false);
            return;
        }

        try {
            // 1. Get the current file SHA from GitHub
            let currentSha;
            const getResponse = await fetch(`${API_URL}?t=${Date.now()}`, { // cache bust GET request
                headers: { 'Authorization': `token ${GITHUB_TOKEN}` },
            });

            if (getResponse.ok) {
                const fileData = await getResponse.json();
                currentSha = fileData.sha;
            } else if (getResponse.status !== 404) {
                throw new Error(`Failed to get file SHA: ${getResponse.statusText}`);
            }
            // If 404, currentSha is undefined, which is correct for creating a new file.

            // 2. Base64 encode the new content, handling Unicode characters
            const content = btoa(unescape(encodeURIComponent(JSON.stringify(localData, null, 2))));
            
            // 3. Prepare the request body
            const body = {
                message: `feat: update website content via admin panel [${new Date().toISOString()}]`,
                content,
                branch: GITHUB_REPO_BRANCH,
                ...(currentSha && { sha: currentSha }),
            };

            // 4. Send PUT request to update/create the file
            const putResponse = await fetch(API_URL, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (putResponse.ok) {
                setData(localData); // Update local app state
                showToastNotification('Changes saved successfully to the global repository!');
            } else {
                const errorData = await putResponse.json();
                throw new Error(errorData.message || 'Failed to save to GitHub.');
            }

        } catch (error: any) {
            console.error("Error saving to GitHub:", error);
            showToastNotification(`Error: ${error.message}`, 'error');
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleSectionClick = (sectionKey: string) => {
        setActiveSection(sectionKey);
        setSidebarOpen(false); // Close sidebar on mobile after selection
    };

    const sections = {
        header: { name: 'Header & Nav', icon: <CogIcon className="w-5 h-5"/> },
        loginPage: { name: 'Halaman Login', icon: <KeyIcon className="w-5 h-5"/> },
        hero: { name: 'Hero Section', icon: <PhotographIcon className="w-5 h-5"/> },
        stats: { name: 'Stats Section', icon: <ChartBarIcon className="w-5 h-5"/> },
        aboutUs: { name: 'Tentang Kami', icon: <IdentificationIcon className="w-5 h-5"/> },
        whoWeAre: { name: 'Layanan Kami', icon: <IdentificationIcon className="w-5 h-5"/> },
        whyUs: { name: 'Why Us Section', icon: <CheckCircleIcon className="w-5 h-5"/> },
        ctaSlider: { name: 'CTA Banner Slider', icon: <DownloadIcon className="w-5 h-5"/> },
        faq: { name: 'Pertanyaan Umum', icon: <QuestionMarkCircleIcon className="w-5 h-5"/> },
        tipsAndNews: { name: 'Tips & News', icon: <RssIcon className="w-5 h-5"/> },
        clients: { name: 'Clients', icon: <UsersIcon className="w-5 h-5"/> },
        footer: { name: 'Footer', icon: <MailIcon className="w-5 h-5"/> },
        designServicePage: { name: 'Design Service Page', icon: <ArchitectIcon className="w-5 h-5"/> },
        costSimulatorPage: { name: 'Simulasi Biaya', icon: <BudgetIcon className="w-5 h-5"/> }
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'header':
                return (
                    <Card title="Header & Navigation">
                        <ImageField 
                            label="Logo Image (PNG or JPG)" 
                            src={localData.header.logoImage} 
                            onUpdate={value => handlePathChange('header.logoImage', value)} 
                        />
                        <InputField 
                            label="Logo Text (Fallback)" 
                            value={localData.header.logoText} 
                            onChange={e => handlePathChange('header.logoText', e.target.value)} 
                        />
                         <p className="text-xs text-slate-500 -mt-3 mb-4">This text is displayed if no logo image is uploaded.</p>

                        <div className="mt-6 border-t border-slate-200 pt-6">
                            <h3 className="text-lg font-semibold mb-4">CTA Buttons</h3>
                            {localData.header.ctaButtons.map((button, index) => (
                                <SubCard key={index} title={`Button ${index + 1}: ${button.text}`} onRemove={() => handleRemoveItem(d => { d.header.ctaButtons.splice(index, 1); return d; })}>
                                    <InputField label="Text" value={button.text} onChange={e => handlePathChange(`header.ctaButtons.${index}.text`, e.target.value)} />
                                    <SelectField label="Type" value={button.type} options={['primary', 'secondary', 'secondary-outline']} onChange={e => handlePathChange(`header.ctaButtons.${index}.type`, e.target.value)} />
                                    
                                    {!button.items && (
                                        <>
                                            <SelectField label="Action" value={button.action || ''} options={['', 'costSimulator', 'admin', 'anchor', 'download', 'login']} onChange={e => handlePathChange(`header.ctaButtons.${index}.action`, e.target.value)} />
                                            {button.action === 'anchor' && (
                                                <InputField label="Anchor Href (e.g., #kontak)" value={button.href || ''} onChange={e => handlePathChange(`header.ctaButtons.${index}.href`, e.target.value)} />
                                            )}
                                        </>
                                    )}
                                    
                                    {button.items && (
                                        <div className="mt-4 pl-4 border-l-2 border-slate-300">
                                            <h5 className="font-semibold text-sm mb-2">Dropdown Items</h5>
                                            {button.items.map((item, itemIndex) => (
                                                <div key={itemIndex} className="bg-slate-100 p-3 rounded-md mb-2">
                                                    <div className="flex justify-between items-center">
                                                        <h6 className="font-medium text-slate-600">Item {itemIndex + 1}</h6>
                                                        <button onClick={() => handleRemoveItem(d => { d.header.ctaButtons[index].items.splice(itemIndex, 1); return d; })} className="text-red-500 hover:text-red-700 p-1 text-sm">Remove</button>
                                                    </div>
                                                    <InputField label="Text" value={item.text} onChange={e => handlePathChange(`header.ctaButtons.${index}.items.${itemIndex}.text`, e.target.value)} />
                                                    <SelectField label="Action" value={item.action} options={['download', 'anchor']} onChange={e => handlePathChange(`header.ctaButtons.${index}.items.${itemIndex}.action`, e.target.value)} />
                                                    {item.action === 'anchor' && (
                                                        <InputField label="Anchor Href" value={item.href || ''} onChange={e => handlePathChange(`header.ctaButtons.${index}.items.${itemIndex}.href`, e.target.value)} />
                                                    )}
                                                </div>
                                            ))}
                                            <button onClick={() => handleAddItem(d => { d.header.ctaButtons[index].items.push({ text: 'New Dropdown Item', action: 'anchor', href: '#' }); return d; })} className="text-sm bg-blue-100 text-blue-800 font-semibold py-1 px-3 rounded-lg hover:bg-blue-200 transition">Add Dropdown Item</button>
                                        </div>
                                    )}
                                </SubCard>
                            ))}
                            <div className="flex gap-2">
                                <button onClick={() => handleAddItem(d => { d.header.ctaButtons.push({ text: 'New Button', type: 'secondary' }); return d; })} className="mt-2 text-sm bg-bsk-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition">Add Button</button>
                                <button onClick={() => handleAddItem(d => { d.header.ctaButtons.push({ text: 'New Dropdown', type: 'secondary', items: [] }); return d; })} className="mt-2 text-sm bg-bsk-green text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition">Add Dropdown</button>
                            </div>
                        </div>

                        <div className="mt-6 border-t border-slate-200 pt-6">
                            <h3 className="text-lg font-semibold mb-4">Navigation Links</h3>
                            {localData.header.navLinks.map((link, index) => (
                                <SubCard key={index} title={`Link ${index + 1}`} onRemove={() => handleRemoveItem(d => { d.header.navLinks.splice(index, 1); return d; })}>
                                    <InputField label="Text" value={link.text} onChange={e => handlePathChange(`header.navLinks.${index}.text`, e.target.value)} />
                                    <InputField label="URL (href)" value={link.href} onChange={e => handlePathChange(`header.navLinks.${index}.href`, e.target.value)} />
                                </SubCard>
                            ))}
                             <button onClick={() => handleAddItem(d => { d.header.navLinks.push({text: 'New Link', href: '#', submenu: []}); return d;})} className="mt-2 text-sm bg-bsk-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition">Add Navigation Link</button>
                        </div>
                    </Card>
                );
            case 'loginPage':
                return (
                    <Card title="Pengaturan Halaman Login">
                        <ImageField 
                            label="Gambar Latar Belakang" 
                            src={localData.loginPage.backgroundImage} 
                            onUpdate={value => handlePathChange('loginPage.backgroundImage', value)} 
                        />
                        <InputField 
                            label="Judul Utama" 
                            value={localData.loginPage.title} 
                            onChange={e => handlePathChange('loginPage.title', e.target.value)} 
                        />
                        <InputField 
                            label="Subjudul" 
                            value={localData.loginPage.subtitle} 
                            onChange={e => handlePathChange('loginPage.subtitle', e.target.value)} 
                        />
                        <InputField 
                            label="Teks Tombol" 
                            value={localData.loginPage.buttonText} 
                            onChange={e => handlePathChange('loginPage.buttonText', e.target.value)} 
                        />
                    </Card>
                );
            case 'hero':
                return (
                    <Card title="Hero Section Slides">
                        <TabbedContent
                            items={localData.hero.slides}
                            onAddItem={() => handleAddItem(d => {
                                d.hero.slides.push({ title: ['New', 'Slide'], subtitle: '', buttonText: '', backgroundImage: '' });
                                return d;
                            })}
                            onRemoveItem={(index) => handleRemoveItem(d => {
                                d.hero.slides.splice(index, 1);
                                return d;
                            })}
                            getItemTitle={(item, index) => `Slide ${index + 1}`}
                            renderItemContent={(slide, index) => (
                                <>
                                    <ImageField label="Background Image" src={slide.backgroundImage} onUpdate={value => handlePathChange(`hero.slides.${index}.backgroundImage`, value)} />
                                    <TextAreaField label="Title (one line per entry)" value={slide.title.join('\n')} onChange={e => handlePathChange(`hero.slides.${index}.title`, e.target.value.split('\n'))} />
                                    <TextAreaField label="Subtitle" value={slide.subtitle} onChange={e => handlePathChange(`hero.slides.${index}.subtitle`, e.target.value)} />
                                    <InputField label="Button Text" value={slide.buttonText} onChange={e => handlePathChange(`hero.slides.${index}.buttonText`, e.target.value)} />
                                </>
                            )}
                        />
                    </Card>
                );
            case 'stats':
                return (
                    <Card title="Stats Section" onAddItem={() => handleAddItem(d => { d.stats.push({value: '0', label: 'New Stat'}); return d; })}>
                        {localData.stats.map((stat, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-slate-200 pb-4 mb-4 last:border-b-0 relative">
                                <InputField label={`Stat ${index + 1} Value`} value={stat.value} onChange={e => handlePathChange(`stats.${index}.value`, e.target.value)} />
                                <InputField label={`Stat ${index + 1} Label`} value={stat.label} onChange={e => handlePathChange(`stats.${index}.label`, e.target.value)} />
                                <RemoveButton onClick={() => handleRemoveItem(d => { d.stats.splice(index, 1); return d; })} />
                            </div>
                        ))}
                    </Card>
                );
            case 'aboutUs':
                return (
                    <div className="space-y-6">
                        <Card title="Tentang Kami: Bagian Utama">
                            <InputField label="Pre-Title" value={localData.aboutUs.preTitle} onChange={e => handlePathChange('aboutUs.preTitle', e.target.value)} />
                            <InputField label="Judul (e.g., Tentang Kami)" value={localData.aboutUs.title} onChange={e => handlePathChange('aboutUs.title', e.target.value)} />
                            <InputField label="Completed Projects Stat (e.g., 140+)" value={localData.aboutUs.completedProjects} onChange={e => handlePathChange('aboutUs.completedProjects', e.target.value)} />
                            <TextAreaField label="Paragraf Utama" value={localData.aboutUs.mainParagraph} onChange={e => handlePathChange('aboutUs.mainParagraph', e.target.value)} />
                            <InputField label="Tagline" value={localData.aboutUs.tagline} onChange={e => handlePathChange('aboutUs.tagline', e.target.value)} />
                        </Card>
            
                        <Card title="Tentang Kami: Bagian Visi">
                            <InputField label="Judul Visi (e.g., VISI)" value={localData.aboutUs.visionTitle} onChange={e => handlePathChange('aboutUs.visionTitle', e.target.value)} />
                            <TextAreaField label="Paragraf Visi" value={localData.aboutUs.visionParagraph} onChange={e => handlePathChange('aboutUs.visionParagraph', e.target.value)} />
                            <ImageField label="Vision Image 1" src={localData.aboutUs.visionImage1} onUpdate={value => handlePathChange('aboutUs.visionImage1', value)} />
                            <ImageField label="Vision Image 2" src={localData.aboutUs.visionImage2} onUpdate={value => handlePathChange('aboutUs.visionImage2', value)} />
                        </Card>
            
                        <Card title="Tentang Kami: Bagian Misi">
                            <InputField label="Judul Misi (e.g., MISI)" value={localData.aboutUs.missionTitle} onChange={e => handlePathChange('aboutUs.missionTitle', e.target.value)} />
                            <div className="mt-6 border-t border-slate-200 pt-6">
                                <h3 className="text-lg font-semibold mb-4">Poin Misi</h3>
                                {localData.aboutUs.missions.map((mission, index) => (
                                    <SubCard key={mission.id} title={`Misi ${index + 1}`} onRemove={() => handleRemoveItem(d => { d.aboutUs.missions.splice(index, 1); return d; })}>
                                        <InputField label="ID (unique, no spaces)" value={mission.id} onChange={e => handlePathChange(`aboutUs.missions.${index}.id`, e.target.value)} />
                                        <TextAreaField label="Text" value={mission.text} onChange={e => handlePathChange(`aboutUs.missions.${index}.text`, e.target.value)} />
                                    </SubCard>
                                ))}
                                <button onClick={() => handleAddItem(d => {
                                    d.aboutUs.missions.push({ id: `mission-${Date.now()}`, text: 'New mission text.' });
                                    return d;
                                })} className="mt-2 text-sm bg-bsk-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition">
                                    Tambah Misi
                                </button>
                            </div>
                        </Card>
                    </div>
                );
            case 'whoWeAre':
                return (
                    <Card title="Layanan Kami Section">
                        <InputField label="Main Title" value={localData.whoWeAre.mainTitle} onChange={e => handlePathChange('whoWeAre.mainTitle', e.target.value)} />
                        <TextAreaField label="Main Paragraph" value={localData.whoWeAre.mainParagraph} onChange={e => handlePathChange('whoWeAre.mainParagraph', e.target.value)} />
                        <div className="mt-6 border-t border-slate-200 pt-6">
                            <h3 className="text-lg font-semibold mb-4">Tabs Layanan</h3>
                            <TabbedContent
                                items={localData.whoWeAre.tabs}
                                onAddItem={() => handleAddItem(d => {
                                    d.whoWeAre.tabs.push({ id: `new-tab-${Date.now()}`, label: 'New Tab', title: '', description: '', image: '', accordions: [] });
                                    return d;
                                })}
                                onRemoveItem={(index) => handleRemoveItem(d => {
                                    d.whoWeAre.tabs.splice(index, 1);
                                    return d;
                                })}
                                getItemTitle={(item) => item.label}
                                renderItemContent={(tab, tabIndex) => (
                                    <>
                                        <InputField label="Tab ID (unique, no spaces)" value={tab.id} onChange={e => handlePathChange(`whoWeAre.tabs.${tabIndex}.id`, e.target.value)} />
                                        <InputField label="Tab Label" value={tab.label} onChange={e => handlePathChange(`whoWeAre.tabs.${tabIndex}.label`, e.target.value)} />
                                        <InputField label="Content Title" value={tab.title} onChange={e => handlePathChange(`whoWeAre.tabs.${tabIndex}.title`, e.target.value)} />
                                        <TextAreaField label="Content Description" value={tab.description} onChange={e => handlePathChange(`whoWeAre.tabs.${tabIndex}.description`, e.target.value)} />
                                        <ImageField label="Image" src={tab.image} onUpdate={value => handlePathChange(`whoWeAre.tabs.${tabIndex}.image`, value)} />

                                        <div className="mt-4 pl-4 border-l-2 border-slate-300">
                                            <h4 className="font-semibold text-sm mb-2">Accordion Items</h4>
                                            {tab.accordions.map((acc, accIndex) => (
                                                <div key={acc.id} className="bg-slate-100 p-3 rounded-md mb-2">
                                                    <div className="flex justify-between items-center">
                                                        <h5 className="font-medium text-slate-600">Accordion {accIndex + 1}</h5>
                                                        <button onClick={() => handleRemoveItem(d => { d.whoWeAre.tabs[tabIndex].accordions.splice(accIndex, 1); return d; })} className="text-red-500 hover:text-red-700 p-1 text-sm">Remove</button>
                                                    </div>
                                                    <InputField label="Accordion ID" value={acc.id} onChange={e => handlePathChange(`whoWeAre.tabs.${tabIndex}.accordions.${accIndex}.id`, e.target.value)} />
                                                    <InputField label="Accordion Title" value={acc.title} onChange={e => handlePathChange(`whoWeAre.tabs.${tabIndex}.accordions.${accIndex}.title`, e.target.value)} />
                                                    <TextAreaField label="Accordion Content" value={acc.content} onChange={e => handlePathChange(`whoWeAre.tabs.${tabIndex}.accordions.${accIndex}.content`, e.target.value)} />
                                                </div>
                                            ))}
                                            <button onClick={() => handleAddItem(d => { d.whoWeAre.tabs[tabIndex].accordions.push({ id: `new-acc-${Date.now()}`, title: 'New Accordion', content: '' }); return d; })} className="text-sm bg-blue-100 text-blue-800 font-semibold py-1 px-3 rounded-lg hover:bg-blue-200 transition">Add Accordion Item</button>
                                        </div>
                                    </>
                                )}
                            />
                        </div>
                    </Card>
                );
            case 'whyUs':
                return (
                    <Card title="Why Us Section">
                        <InputField label="Section Title" value={localData.whyUs.sectionTitle} onChange={e => handlePathChange('whyUs.sectionTitle', e.target.value)} />
                        <TextAreaField label="Section Subtitle" value={localData.whyUs.sectionSubtitle} onChange={e => handlePathChange('whyUs.sectionSubtitle', e.target.value)} />
                        
                        <div className="mt-6 border-t border-slate-200 pt-6">
                            <h3 className="text-lg font-semibold mb-4">Features</h3>
                            {localData.whyUs.features.map((feature, index) => (
                                <SubCard key={index} title={`Feature: ${feature.title}`} onRemove={() => handleRemoveItem(d => { d.whyUs.features.splice(index, 1); return d; })}>
                                    <InputField label="Title" value={feature.title} onChange={e => handlePathChange(`whyUs.features.${index}.title`, e.target.value)} />
                                    <TextAreaField label="Description" value={feature.description} onChange={e => handlePathChange(`whyUs.features.${index}.description`, e.target.value)} />
                                    <ImageField label="Image" src={feature.image} onUpdate={value => handlePathChange(`whyUs.features.${index}.image`, value)} />
                                </SubCard>
                            ))}
                            <button onClick={() => handleAddItem(d => { 
                                d.whyUs.features.push({ title: 'New Feature', description: '', image: '' }); 
                                return d; 
                            })} className="mt-2 text-sm bg-bsk-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition">
                                Add Feature
                            </button>
                        </div>

                        <div className="mt-6 border-t border-slate-200 pt-6">
                             <h3 className="text-lg font-semibold mb-2">Business Types Section</h3>
                             <InputField label="Title" value={localData.whyUs.businessTypesTitle} onChange={e => handlePathChange('whyUs.businessTypesTitle', e.target.value)} />
                             <div className="mt-4">
                                <h4 className="font-semibold mb-2">Business Type Items</h4>
                                {localData.whyUs.businessTypes.map((biz, index) => (
                                     <SubCard key={index} title={`Business: ${biz.label}`} onRemove={() => handleRemoveItem(d => { d.whyUs.businessTypes.splice(index, 1); return d; })}>
                                        <InputField label="Label" value={biz.label} onChange={e => handlePathChange(`whyUs.businessTypes.${index}.label`, e.target.value)} />
                                        <ImageField label="Icon" src={biz.icon} onUpdate={value => handlePathChange(`whyUs.businessTypes.${index}.icon`, value)} />
                                     </SubCard>
                                ))}
                                <button onClick={() => handleAddItem(d => { 
                                    d.whyUs.businessTypes.push({ label: 'New Business', icon: '' }); 
                                    return d; 
                                })} className="mt-2 text-sm bg-bsk-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition">
                                    Add Business Type
                                </button>
                             </div>
                        </div>
                    </Card>
                );
            case 'ctaSlider':
                return (
                    <Card title="CTA Banner Slider">
                        <TabbedContent
                            items={localData.ctaSlider}
                            onAddItem={() => handleAddItem(d => {
                                d.ctaSlider.push({ type: 'download', title: 'New Slide', paragraph: '', image: '', buttonText: '', fileUrl: '' });
                                return d;
                            })}
                            onRemoveItem={(index) => handleRemoveItem(d => {
                                d.ctaSlider.splice(index, 1);
                                return d;
                            })}
                            getItemTitle={(item, index) => item.title || `Slide ${index + 1}`}
                            renderItemContent={(slide, index) => (
                                <>
                                    <InputField label="Title" value={slide.title} onChange={e => handlePathChange(`ctaSlider.${index}.title`, e.target.value)} />
                                    <TextAreaField label="Paragraph" value={slide.paragraph} onChange={e => handlePathChange(`ctaSlider.${index}.paragraph`, e.target.value)} />
                                    <ImageField label="Image" src={slide.image} onUpdate={value => handlePathChange(`ctaSlider.${index}.image`, value)} />
                                    <InputField label="Button Text" value={slide.buttonText} onChange={e => handlePathChange(`ctaSlider.${index}.buttonText`, e.target.value)} />
                                    <SelectField label="Type" value={slide.type} options={['download', 'partner']} onChange={e => handlePathChange(`ctaSlider.${index}.type`, e.target.value)} />
                                    {slide.type === 'download' &&
                                        <InputField label="File URL (e.g., /file.pdf)" value={slide.fileUrl || ''} onChange={e => handlePathChange(`ctaSlider.${index}.fileUrl`, e.target.value)} />
                                    }
                                    {slide.type === 'partner' &&
                                        <InputField label="CTA URL (e.g., WhatsApp link)" value={slide.ctaUrl || ''} onChange={e => handlePathChange(`ctaSlider.${index}.ctaUrl`, e.target.value)} />
                                    }
                                </>
                            )}
                        />
                    </Card>
                );
            case 'faq':
                return (
                    <Card title="Pertanyaan Umum (FAQ) Section" onAddItem={() => handleAddItem(d => {
                        d.faq.items.push({ id: `faq-${Date.now()}`, question: 'New Question', answer: 'New Answer' });
                        return d;
                    })}>
                        <InputField label="Section Title" value={localData.faq.title} onChange={e => handlePathChange('faq.title', e.target.value)} />
                        <div className="mt-6 border-t border-slate-200 pt-6">
                            <h3 className="text-lg font-semibold mb-4">FAQ Items</h3>
                            {localData.faq.items.map((item, index) => (
                                <SubCard key={item.id} title={`FAQ Item ${index + 1}`} onRemove={() => handleRemoveItem(d => { d.faq.items.splice(index, 1); return d; })}>
                                    <InputField label="ID (unique, no spaces)" value={item.id} onChange={e => handlePathChange(`faq.items.${index}.id`, e.target.value)} />
                                    <InputField label="Question" value={item.question} onChange={e => handlePathChange(`faq.items.${index}.question`, e.target.value)} />
                                    <TextAreaField label="Answer" value={item.answer} onChange={e => handlePathChange(`faq.items.${index}.answer`, e.target.value)} />
                                </SubCard>
                            ))}
                        </div>
                    </Card>
                );
            case 'tipsAndNews':
                return (
                     <Card title="Tips & News Section">
                         <InputField 
                            label="Title" 
                            value={localData.tipsAndNews.title} 
                            onChange={e => handlePathChange('tipsAndNews.title', e.target.value)} 
                        />
                        <div className="mt-6 border-t border-slate-200 pt-6">
                             <h3 className="text-lg font-semibold mb-4">News Posts</h3>
                             <TabbedContent
                                items={localData.tipsAndNews.posts}
                                onAddItem={() => handleAddItem(d => {
                                    d.tipsAndNews.posts.push({ image: '', title: 'New Post', date: 'JANUARY 1, 2025', comments: 0, description: '' });
                                    return d;
                                })}
                                onRemoveItem={(index) => handleRemoveItem(d => {
                                    d.tipsAndNews.posts.splice(index, 1);
                                    return d;
                                })}
                                getItemTitle={(item) => item.title.substring(0, 20) + (item.title.length > 20 ? '...' : '')}
                                renderItemContent={(post, index) => (
                                    <>
                                        <ImageField label="Image" src={post.image} onUpdate={value => handlePathChange(`tipsAndNews.posts.${index}.image`, value)} />
                                        <InputField label="Title" value={post.title} onChange={e => handlePathChange(`tipsAndNews.posts.${index}.title`, e.target.value)} />
                                        <InputField label="Date" value={post.date} onChange={e => handlePathChange(`tipsAndNews.posts.${index}.date`, e.target.value)} />
                                        <InputField type="number" label="Comments Count" value={post.comments} onChange={e => handlePathChange(`tipsAndNews.posts.${index}.comments`, parseInt(e.target.value) || 0)} />
                                        <TextAreaField label="Description" value={post.description} onChange={e => handlePathChange(`tipsAndNews.posts.${index}.description`, e.target.value)} />
                                    </>
                                )}
                            />
                        </div>
                    </Card>
                );
            case 'clients':
                 return (
                     <Card title="Clients Section">
                         <InputField 
                            label="Title" 
                            value={localData.clients.title} 
                            onChange={e => handlePathChange('clients.title', e.target.value)} 
                        />
                        <div className="mt-6 border-t border-slate-200 pt-6">
                            <h3 className="text-lg font-semibold mb-4">Client Logos</h3>
                            {localData.clients.logos.map((logo, index) => (
                                <SubCard key={index} title={`Logo ${index + 1}`} onRemove={() => handleRemoveItem(d => { d.clients.logos.splice(index, 1); return d; })}>
                                    <ImageField label="Logo Image" src={logo.src} onUpdate={value => handlePathChange(`clients.logos.${index}.src`, value)} />
                                    <InputField label="Alt Text" value={logo.alt} onChange={e => handlePathChange(`clients.logos.${index}.alt`, e.target.value)} />
                                </SubCard>
                            ))}
                            <button onClick={() => handleAddItem(d => {
                                d.clients.logos.push({ src: '', alt: 'New Client' });
                                return d;
                            })} className="mt-2 text-sm bg-bsk-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition">
                                Add Client Logo
                            </button>
                        </div>
                     </Card>
                 );
             case 'footer':
                return (
                    <Card title="Footer Section">
                        <InputField label="Company Name" value={localData.footer.companyName} onChange={e => handlePathChange('footer.companyName', e.target.value)} />
                        <TextAreaField label="About Text" value={localData.footer.about} onChange={e => handlePathChange('footer.about', e.target.value)} />
                        <InputField label="Email" value={localData.footer.email} onChange={e => handlePathChange('footer.email', e.target.value)} />
                        <InputField label="Phone" value={localData.footer.phone} onChange={e => handlePathChange('footer.phone', e.target.value)} />
                        <InputField label="Hours" value={localData.footer.hours} onChange={e => handlePathChange('footer.hours', e.target.value)} />
                        <TextAreaField label="Address" value={localData.footer.address} onChange={e => handlePathChange('footer.address', e.target.value)} />

                        <div className="mt-6 border-t border-slate-200 pt-6">
                            <h3 className="text-lg font-semibold mb-4">Services List</h3>
                            {localData.footer.services.map((service, index) => (
                                <div key={index} className="flex items-end gap-2 p-2 border-b border-slate-200">
                                    <InputField containerClassName="flex-grow" label={`Service ${index+1} Text`} value={service.text} onChange={e => handlePathChange(`footer.services.${index}.text`, e.target.value)} />
                                    <InputField containerClassName="flex-grow" label="URL" value={service.href} onChange={e => handlePathChange(`footer.services.${index}.href`, e.target.value)} />
                                    <button onClick={() => handleRemoveItem(d => { d.footer.services.splice(index, 1); return d; })} className="mb-4 text-red-500 hover:text-red-700 p-2">Remove</button>
                                </div>
                            ))}
                            <button onClick={() => handleAddItem(d => { d.footer.services.push({text: 'New Service', href: '#'}); return d; })} className="text-sm bg-blue-100 text-blue-800 font-semibold py-1 px-3 rounded-lg hover:bg-blue-200 transition">
                                Add Service
                            </button>
                        </div>

                        <div className="mt-6 border-t border-slate-200 pt-6">
                            <h3 className="text-lg font-semibold mb-2">Sub-Footer Settings</h3>
                            <InputField 
                                label="Privacy Policy Text" 
                                value={localData.footer.subFooter.privacyPolicy.text} 
                                onChange={e => handlePathChange('footer.subFooter.privacyPolicy.text', e.target.value)} 
                            />
                            <InputField 
                                label="Privacy Policy URL" 
                                value={localData.footer.subFooter.privacyPolicy.href} 
                                onChange={e => handlePathChange('footer.subFooter.privacyPolicy.href', e.target.value)} 
                            />
                            <TextAreaField 
                                label="Copyright Text" 
                                value={localData.footer.subFooter.copyright} 
                                onChange={e => handlePathChange('footer.subFooter.copyright', e.target.value)} 
                            />
                            
                            <div className="mt-4 border-t border-slate-200 pt-4">
                                <h4 className="font-semibold mb-2">Sub-Footer Links</h4>
                                {localData.footer.subFooter.links.map((link, index) => (
                                    <div key={index} className="flex items-end gap-2 p-2 border-b border-slate-200">
                                        <InputField containerClassName="flex-grow" label={`Link ${index+1} Text`} value={link.text} onChange={e => handlePathChange(`footer.subFooter.links.${index}.text`, e.target.value)} />
                                        <InputField containerClassName="flex-grow" label="URL" value={link.href} onChange={e => handlePathChange(`footer.subFooter.links.${index}.href`, e.target.value)} />
                                        <button onClick={() => handleRemoveItem(d => { d.footer.subFooter.links.splice(index, 1); return d; })} className="mb-4 text-red-500 hover:text-red-700 p-2">Remove</button>
                                    </div>
                                ))}
                                <button onClick={() => handleAddItem(d => { d.footer.subFooter.links.push({text: 'New Link', href: '#'}); return d;})} className="mt-2 text-sm bg-blue-100 text-blue-800 font-semibold py-1 px-3 rounded-lg hover:bg-blue-200 transition">Add Sub-Footer Link</button>
                            </div>
                        </div>
                    </Card>
                );
            case 'designServicePage':
                const availableIcons = ['Architect', 'Structure', 'MEP', 'Interior', '3D', 'Budget', 'Identification'];
                return (
                    <div className="space-y-6">
                        <Card title="Design Service Page: Hero">
                            <InputField label="Title" value={localData.designServicePage.hero.title} onChange={e => handlePathChange('designServicePage.hero.title', e.target.value)} />
                            <ImageField label="Background Image" src={localData.designServicePage.hero.backgroundImage} onUpdate={value => handlePathChange('designServicePage.hero.backgroundImage', value)} />
                        </Card>
                        <Card title="Design Service Page: About">
                            <InputField label="Title" value={localData.designServicePage.about.title} onChange={e => handlePathChange('designServicePage.about.title', e.target.value)} />
                            <TextAreaField label="Paragraph 1" value={localData.designServicePage.about.paragraph1} onChange={e => handlePathChange('designServicePage.about.paragraph1', e.target.value)} />
                            <TextAreaField label="Paragraph 2" value={localData.designServicePage.about.paragraph2} onChange={e => handlePathChange('designServicePage.about.paragraph2', e.target.value)} />
                            <ImageField label="Image" src={localData.designServicePage.about.image} onUpdate={value => handlePathChange('designServicePage.about.image', value)} />
                        </Card>
                        <Card title="Design Service Page: Offerings">
                            <InputField label="Title" value={localData.designServicePage.offerings.title} onChange={e => handlePathChange('designServicePage.offerings.title', e.target.value)} />
                            {localData.designServicePage.offerings.items.map((item, index) => (
                                <SubCard key={index} title={`Offering: ${item.title}`} onRemove={() => handleRemoveItem(d => { d.designServicePage.offerings.items.splice(index, 1); return d; })}>
                                    <SelectField label="Icon" value={item.icon} options={availableIcons} onChange={e => handlePathChange(`designServicePage.offerings.items.${index}.icon`, e.target.value)} />
                                    <InputField label="Title" value={item.title} onChange={e => handlePathChange(`designServicePage.offerings.items.${index}.title`, e.target.value)} />
                                    <TextAreaField label="Description" value={item.description} onChange={e => handlePathChange(`designServicePage.offerings.items.${index}.description`, e.target.value)} />
                                </SubCard>
                            ))}
                            <button onClick={() => handleAddItem(d => {
                                d.designServicePage.offerings.items.push({ icon: 'Architect', title: 'New Offering', description: '' });
                                return d;
                            })} className="mt-2 text-sm bg-bsk-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition">
                                Add Offering
                            </button>
                        </Card>
                        <Card title="Design Service Page: Process">
                            <InputField label="Title" value={localData.designServicePage.process.title} onChange={e => handlePathChange('designServicePage.process.title', e.target.value)} />
                            {localData.designServicePage.process.steps.map((step, index) => (
                                <SubCard key={index} title={`Step: ${step.title}`} onRemove={() => handleRemoveItem(d => { d.designServicePage.process.steps.splice(index, 1); return d; })}>
                                    <InputField label="Step Number (e.g., 01)" value={step.step} onChange={e => handlePathChange(`designServicePage.process.steps.${index}.step`, e.target.value)} />
                                    <InputField label="Title" value={step.title} onChange={e => handlePathChange(`designServicePage.process.steps.${index}.title`, e.target.value)} />
                                    <TextAreaField label="Description" value={step.description} onChange={e => handlePathChange(`designServicePage.process.steps.${index}.description`, e.target.value)} />
                                </SubCard>
                            ))}
                            <button onClick={() => handleAddItem(d => {
                                const newStep = (d.designServicePage.process.steps.length + 1).toString().padStart(2, '0');
                                d.designServicePage.process.steps.push({ step: newStep, title: 'New Step', description: '' });
                                return d;
                            })} className="mt-2 text-sm bg-bsk-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition">
                                Add Step
                            </button>
                        </Card>
                        <Card title="Design Service Page: CTA">
                            <InputField label="Title" value={localData.designServicePage.cta.title} onChange={e => handlePathChange('designServicePage.cta.title', e.target.value)} />
                            <InputField label="Button Text" value={localData.designServicePage.cta.buttonText} onChange={e => handlePathChange('designServicePage.cta.buttonText', e.target.value)} />
                        </Card>
                    </div>
                );
            case 'costSimulatorPage':
                return (
                     <div className="space-y-6">
                        <Card title="Cost Simulator Page: Hero">
                            <InputField label="Title" value={localData.costSimulatorPage.hero.title} onChange={e => handlePathChange('costSimulatorPage.hero.title', e.target.value)} />
                            <InputField label="Subtitle" value={localData.costSimulatorPage.hero.subtitle} onChange={e => handlePathChange('costSimulatorPage.hero.subtitle', e.target.value)} />
                            <ImageField label="Background Image" src={localData.costSimulatorPage.hero.backgroundImage} onUpdate={value => handlePathChange('costSimulatorPage.hero.backgroundImage', value)} />
                        </Card>
                         <Card title="Cost Simulator Page: Intro">
                            <InputField label="Title" value={localData.costSimulatorPage.intro.title} onChange={e => handlePathChange('costSimulatorPage.intro.title', e.target.value)} />
                            <TextAreaField label="Paragraph" value={localData.costSimulatorPage.intro.paragraph} onChange={e => handlePathChange('costSimulatorPage.intro.paragraph', e.target.value)} />
                        </Card>
                        <Card title="Cost Simulator Page: Form">
                            <InputField label="Form Title" value={localData.costSimulatorPage.form.title} onChange={e => handlePathChange('costSimulatorPage.form.title', e.target.value)} />
                            <InputField label="Property Type Label" value={localData.costSimulatorPage.form.propertyTypeLabel} onChange={e => handlePathChange('costSimulatorPage.form.propertyTypeLabel', e.target.value)} />
                            <StringArrayEditor label="Property Type Options" array={localData.costSimulatorPage.form.propertyTypeOptions} onUpdate={newArray => handlePathChange('costSimulatorPage.form.propertyTypeOptions', newArray)} />
                            <InputField label="Work Type Label" value={localData.costSimulatorPage.form.workTypeLabel} onChange={e => handlePathChange('costSimulatorPage.form.workTypeLabel', e.target.value)} />
                             <StringArrayEditor label="Work Type Options" array={localData.costSimulatorPage.form.workTypeOptions} onUpdate={newArray => handlePathChange('costSimulatorPage.form.workTypeOptions', newArray)} />
                            <InputField label="Area Label" value={localData.costSimulatorPage.form.areaLabel} onChange={e => handlePathChange('costSimulatorPage.form.areaLabel', e.target.value)} />
                            <InputField label="Area Placeholder" value={localData.costSimulatorPage.form.areaPlaceholder} onChange={e => handlePathChange('costSimulatorPage.form.areaPlaceholder', e.target.value)} />
                            <InputField label="Quality Label" value={localData.costSimulatorPage.form.qualityLabel} onChange={e => handlePathChange('costSimulatorPage.form.qualityLabel', e.target.value)} />
                            <div className="mt-6 border-t border-slate-200 pt-6">
                                <h3 className="text-lg font-semibold mb-4">Quality Options</h3>
                                {localData.costSimulatorPage.form.qualityOptions.map((opt, index) => (
                                    <SubCard key={index} title={`Quality Option ${index+1}`} onRemove={() => handleRemoveItem(d => { d.costSimulatorPage.form.qualityOptions.splice(index, 1); return d; })}>
                                        <InputField label="Title" value={opt.title} onChange={e => handlePathChange(`costSimulatorPage.form.qualityOptions.${index}.title`, e.target.value)} />
                                        <TextAreaField label="Description" value={opt.description} onChange={e => handlePathChange(`costSimulatorPage.form.qualityOptions.${index}.description`, e.target.value)} />
                                    </SubCard>
                                ))}
                                 <button onClick={() => handleAddItem(d => { d.costSimulatorPage.form.qualityOptions.push({ title: 'New Quality', description: '' }); return d; })} className="mt-2 text-sm bg-bsk-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition">Add Quality Option</button>
                            </div>
                             <InputField label="Button Text" value={localData.costSimulatorPage.form.buttonText} onChange={e => handlePathChange('costSimulatorPage.form.buttonText', e.target.value)} />
                        </Card>
                        <Card title="Cost Simulator Page: Results">
                            <InputField label="Title" value={localData.costSimulatorPage.results.title} onChange={e => handlePathChange('costSimulatorPage.results.title', e.target.value)} />
                            <TextAreaField label="Disclaimer" value={localData.costSimulatorPage.results.disclaimer} onChange={e => handlePathChange('costSimulatorPage.results.disclaimer', e.target.value)} />
                            <InputField label="CTA Button Text" value={localData.costSimulatorPage.results.ctaButtonText} onChange={e => handlePathChange('costSimulatorPage.results.ctaButtonText', e.target.value)} />
                        </Card>
                         <Card title="Cost Simulator Page: Calculator Steps">
                            {localData.costSimulatorPage.calculatorSteps.map((step, stepIndex) => (
                                <SubCard key={step.id} title={`Step: ${step.label}`} onRemove={() => handleRemoveItem(d => { d.costSimulatorPage.calculatorSteps.splice(stepIndex, 1); return d; })}>
                                    <InputField label="Step ID" value={step.id} onChange={e => handlePathChange(`costSimulatorPage.calculatorSteps.${stepIndex}.id`, e.target.value)} />
                                    <InputField label="Step Label" value={step.label} onChange={e => handlePathChange(`costSimulatorPage.calculatorSteps.${stepIndex}.label`, e.target.value)} />
                                    
                                    <div className="mt-4 pl-4 border-l-2 border-slate-300">
                                        <h4 className="font-semibold text-sm mb-2">Sub-Services</h4>
                                        {step.subServices.map((sub, subIndex) => (
                                            <div key={sub.id} className="bg-slate-100 p-3 rounded-md mb-2">
                                                <div className="flex justify-between items-center">
                                                    <h5 className="font-medium text-slate-600">{sub.label}</h5>
                                                    <button onClick={() => handleRemoveItem(d => { d.costSimulatorPage.calculatorSteps[stepIndex].subServices.splice(subIndex, 1); return d; })} className="text-red-500 hover:text-red-700 p-1 text-sm">Remove</button>
                                                </div>
                                                <InputField label="Sub-Service ID" value={sub.id} onChange={e => handlePathChange(`costSimulatorPage.calculatorSteps.${stepIndex}.subServices.${subIndex}.id`, e.target.value)} />
                                                <InputField label="Sub-Service Label" value={sub.label} onChange={e => handlePathChange(`costSimulatorPage.calculatorSteps.${stepIndex}.subServices.${subIndex}.label`, e.target.value)} />
                                                <InputField label="Unit (e.g., m²)" value={sub.unit} onChange={e => handlePathChange(`costSimulatorPage.calculatorSteps.${stepIndex}.subServices.${subIndex}.unit`, e.target.value)} />
                                                <InputField type="number" label="Price per unit" value={sub.price} onChange={e => handlePathChange(`costSimulatorPage.calculatorSteps.${stepIndex}.subServices.${subIndex}.price`, parseInt(e.target.value) || 0)} />
                                                
                                                <div className="mt-4 pl-4 border-l-2 border-slate-300">
                                                    <h6 className="font-semibold text-xs mb-2">Input Fields for this Sub-Service</h6>
                                                    {sub.fields?.map((field, fieldIndex) => (
                                                        <div key={field.id} className="bg-slate-200 p-2 rounded-md mb-2">
                                                             <div className="flex justify-between items-center">
                                                                <h6 className="font-medium text-slate-600 text-xs">{field.label}</h6>
                                                                <button onClick={() => handleRemoveItem(d => { d.costSimulatorPage.calculatorSteps[stepIndex].subServices[subIndex].fields.splice(fieldIndex, 1); return d; })} className="text-red-500 hover:text-red-700 p-1 text-xs">Remove</button>
                                                            </div>
                                                            <InputField label="Field ID" value={field.id} onChange={e => handlePathChange(`costSimulatorPage.calculatorSteps.${stepIndex}.subServices.${subIndex}.fields.${fieldIndex}.id`, e.target.value)} />
                                                            <InputField label="Field Label" value={field.label} onChange={e => handlePathChange(`costSimulatorPage.calculatorSteps.${stepIndex}.subServices.${subIndex}.fields.${fieldIndex}.label`, e.target.value)} />
                                                            <SelectField label="Field Type" value={field.type} options={['numeric', 'select']} onChange={e => handlePathChange(`costSimulatorPage.calculatorSteps.${stepIndex}.subServices.${subIndex}.fields.${fieldIndex}.type`, e.target.value)} />
                                                            {field.type === 'numeric' && <InputField label="Placeholder" value={field.placeholder || ''} onChange={e => handlePathChange(`costSimulatorPage.calculatorSteps.${stepIndex}.subServices.${subIndex}.fields.${fieldIndex}.placeholder`, e.target.value)} />}
                                                            {field.type === 'select' && <StringArrayEditor label="Options" array={field.options || []} onUpdate={newArray => handlePathChange(`costSimulatorPage.calculatorSteps.${stepIndex}.subServices.${subIndex}.fields.${fieldIndex}.options`, newArray)} />}
                                                        </div>
                                                    ))}
                                                    <button onClick={() => handleAddItem(d => { 
                                                        const subService = d.costSimulatorPage.calculatorSteps[stepIndex].subServices[subIndex];
                                                        if (!subService.fields) {
                                                            subService.fields = [];
                                                        }
                                                        subService.fields.push({ id: `new-field-${Date.now()}`, label: 'New Field', type: 'numeric' }); 
                                                        return d; 
                                                    })} className="text-xs bg-green-100 text-green-800 font-semibold py-1 px-2 rounded-lg hover:bg-green-200 transition">Add Field</button>
                                                </div>
                                            </div>
                                        ))}
                                         <button onClick={() => handleAddItem(d => { d.costSimulatorPage.calculatorSteps[stepIndex].subServices.push({ id: `new-sub-${Date.now()}`, label: 'New Sub-Service', unit: 'm²', price: 0, fields: [] }); return d; })} className="text-sm bg-blue-100 text-blue-800 font-semibold py-1 px-3 rounded-lg hover:bg-blue-200 transition">Add Sub-Service</button>
                                    </div>
                                </SubCard>
                            ))}
                            <button onClick={() => handleAddItem(d => { d.costSimulatorPage.calculatorSteps.push({ id: `new-step-${Date.now()}`, label: 'New Step', subServices: [] }); return d; })} className="mt-2 text-sm bg-bsk-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition">Add Calculator Step</button>
                        </Card>
                    </div>
                );
            default: return null;
        }
    };
    

    return (
        <div className="flex h-screen bg-slate-50 text-slate-800">
             {/* Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-40 md:hidden" 
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}
            
            {/* Sidebar */}
            <aside className={`w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-20 flex-shrink-0 px-6 flex justify-between items-center border-b border-slate-200">
                    <h1 className="text-2xl font-bold text-bsk-text-dark">Admin<span className="text-bsk-yellow">Panel</span></h1>
                    <button className="md:hidden text-slate-500 hover:text-slate-800" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <nav className="flex-1 overflow-y-auto py-4">
                    {Object.entries(sections).map(([key, { name, icon }]) => (
                        <button
                            key={key}
                            onClick={() => handleSectionClick(key)}
                            className={`w-full text-left flex items-center gap-3 px-6 py-3 transition-colors duration-200 text-sm font-medium relative ${
                                activeSection === key 
                                ? 'bg-blue-50 text-bsk-blue' 
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                             {activeSection === key && <div className="absolute left-0 top-0 h-full w-1 bg-bsk-blue" />}
                            {icon}
                            <span>{name}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                 <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 flex-shrink-0">
                    <div className="mx-auto px-6 h-20 flex justify-between items-center">
                         <div className="flex items-center gap-4">
                            <button className="md:hidden text-slate-600" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </button>
                            <h2 className="text-xl font-semibold text-bsk-text-dark">{sections[activeSection]?.name}</h2>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <button onClick={() => setView('site')} className="font-semibold text-bsk-blue py-2 px-3 sm:px-5 rounded-full hover:bg-blue-50 transition duration-300 text-sm">
                                View Site
                            </button>
                            <button 
                                onClick={handleSave} 
                                disabled={isSaving}
                                className="bg-bsk-yellow text-bsk-text-dark font-bold py-2 px-3 sm:px-5 rounded-full hover:brightness-95 transition duration-300 text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSaving && <svg className="animate-spin h-4 w-4 text-bsk-text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {renderSection()}
                </main>
            </div>
            
            {/* Toast Notification */}
            <div className={`fixed bottom-8 right-8 text-white py-3 px-6 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-3 ${toastType === 'success' ? 'bg-bsk-dark-green' : 'bg-red-600'} ${showToast ? 'transform translate-y-0 opacity-100' : 'transform translate-y-10 opacity-0 pointer-events-none'}`}>
                {toastType === 'success' ? <CheckCircleIcon className="w-6 h-6"/> : <XCircleIcon className="w-6 h-6"/>}
                <span>{toastMessage}</span>
            </div>
        </div>
    );
};


// UI Components
const Card: React.FC<{ title: string; children: React.ReactNode; onAddItem?: () => void; className?: string }> = ({ title, children, onAddItem, className = '' }) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 ${className}`}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-200 pb-4 mb-6 gap-4">
            <h2 className="text-xl font-bold text-bsk-text-dark">{title}</h2>
            {onAddItem && (
                <button onClick={onAddItem} className="bg-bsk-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition text-sm self-start sm:self-auto">
                    + Add New
                </button>
            )}
        </div>
        {children}
    </div>
);

const SubCard: React.FC<{ title: string, children: React.ReactNode, onRemove: () => void }> = ({ title, children, onRemove }) => (
    <div className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-200 relative">
        <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-slate-700">{title}</h4>
            <RemoveButton onClick={onRemove} />
        </div>
        {children}
    </div>
);

const TabbedContent: React.FC<{
    items: any[];
    onAddItem: () => void;
    onRemoveItem: (index: number) => void;
    renderItemContent: (item: any, index: number) => React.ReactNode;
    getItemTitle: (item: any, index: number) => string;
}> = ({ items, onAddItem, onRemoveItem, renderItemContent, getItemTitle }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleRemove = () => {
        if (window.confirm('Are you sure you want to remove this item?')) {
            onRemoveItem(activeIndex);
        }
    };

    const handleAdd = () => {
        onAddItem();
        setActiveIndex(items.length);
    }

    useEffect(() => {
        if (activeIndex >= items.length && items.length > 0) {
            setActiveIndex(items.length - 1);
        }
    }, [items, activeIndex]);


    return (
        <div>
            <div className="border-b border-slate-200 mb-6">
                <div className="flex items-center gap-2 overflow-x-auto pb-px">
                    {items.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`px-4 py-2 text-sm font-semibold rounded-t-md whitespace-nowrap transition-colors ${
                                activeIndex === index
                                    ? 'bg-white border border-slate-200 border-b-white -mb-px text-bsk-blue'
                                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                            }`}
                        >
                            {getItemTitle(item, index)}
                        </button>
                    ))}
                    <button onClick={handleAdd} className="ml-2 text-sm bg-blue-100 text-blue-800 font-semibold py-1.5 px-3 rounded-md hover:bg-blue-200 transition">
                        + Add New
                    </button>
                </div>
            </div>
            {items.length > 0 && items[activeIndex] != null && (
                <div className="relative pt-6">
                    <button onClick={handleRemove} className="absolute top-0 right-0 flex items-center gap-1 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-md text-sm z-10 font-semibold transition">
                        <TrashIcon className="h-4 w-4" />
                        Remove
                    </button>
                    {renderItemContent(items[activeIndex], activeIndex)}
                </div>
            )}
            {items.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                    No items found. Click "+ Add New" to get started.
                </div>
            )}
        </div>
    );
};

const InputField: React.FC<{ label: string; value: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; containerClassName?: string; type?: string; }> = ({ label, value, onChange, containerClassName = '', type = 'text' }) => (
    <div className={`mb-4 ${containerClassName}`}>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
        <input type={type} value={value} onChange={onChange} className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-bsk-blue/50 focus:border-bsk-blue transition" />
    </div>
);

const TextAreaField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; }> = ({ label, value, onChange }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
        <textarea value={value} onChange={onChange} rows={4} className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-bsk-blue/50 focus:border-bsk-blue transition" />
    </div>
);

const StringArrayEditor: React.FC<{ label: string; array: string[]; onUpdate: (newArray: string[]) => void }> = ({ label, array, onUpdate }) => {
    const handleChange = (index: number, value: string) => {
        const newArray = [...array];
        newArray[index] = value;
        onUpdate(newArray);
    };
    const handleAdd = () => {
        onUpdate([...array, 'New Item']);
    };
    const handleRemove = (index: number) => {
        const newArray = [...array];
        newArray.splice(index, 1);
        onUpdate(newArray);
    };

    return (
        <div className="mt-6 border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold mb-4">{label}</h3>
            <div className="space-y-2">
                {array.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <InputField containerClassName="flex-grow mb-0" label={`Item ${index + 1}`} value={item} onChange={e => handleChange(index, e.target.value)} />
                        <button onClick={() => handleRemove(index)} className="mt-7 text-red-500 hover:text-red-700 p-2">Remove</button>
                    </div>
                ))}
            </div>
            <button onClick={handleAdd} className="mt-4 text-sm bg-blue-100 text-blue-800 font-semibold py-1 px-3 rounded-lg hover:bg-blue-200 transition">
                Add Item
            </button>
        </div>
    );
};

const ImageField: React.FC<{ label: string; src: string; onUpdate: (value: string) => void; }> = ({ label, src, onUpdate }) => {
    const [uploadType, setUploadType] = useState<'file' | 'link'>('file');
    const [inputValue, setInputValue] = useState(src || '');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
       setInputValue(src || '');
    }, [src]);

    useEffect(() => {
        if (status === 'success' || status === 'error') {
            const timer = setTimeout(() => {
                setStatus('idle');
                setMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [status]);
    
    const applyCacheBuster = (url: string): string => {
        if (!url) return '';
        
        // Handle potential fragments by splitting them off first
        const [mainUrl, hash] = url.split('#');
        const hashPart = hash ? `#${hash}` : '';

        // Now handle query parameters
        const [path, queryString] = mainUrl.split('?');
        const params = new URLSearchParams(queryString || '');
        
        // Set/update the cache-busting parameter
        params.set('t', Date.now().toString());
        
        const newQueryString = params.toString();

        return `${path}?${newQueryString}${hashPart}`;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            setStatus('error');
            setMessage('Tipe file tidak valid. Gunakan PNG, JPG, WEBP, atau SVG.');
            return;
        }
        const maxSizeInMB = 5;
        if (file.size > maxSizeInMB * 1024 * 1024) {
            setStatus('error');
            setMessage(`Ukuran file terlalu besar. Ukuran maksimal adalah ${maxSizeInMB}MB.`);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = async (event) => {
            const content = event.target?.result;
            if (typeof content !== 'string') {
                setStatus('error');
                setMessage('Gagal membaca file.');
                return;
            }

            const base64Content = content.split(',')[1];

            // These environment variables must be configured in the deployment environment.
            // Example: GITHUB_TOKEN='ghp_...', GITHUB_REPO_OWNER='your-gh-username', GITHUB_REPO_NAME='your-assets-repo'
            const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
            const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER;
            const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME;
            const GITHUB_REPO_BRANCH = process.env.GITHUB_REPO_BRANCH || 'main';

            if (!GITHUB_TOKEN || !GITHUB_REPO_OWNER || !GITHUB_REPO_NAME) {
                setStatus('error');
                setMessage('Konfigurasi GitHub tidak ditemukan di environment variables.');
                console.error('Missing required GitHub environment variables: GITHUB_TOKEN, GITHUB_REPO_OWNER, GITHUB_REPO_NAME');
                return;
            }

            const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            const path = `uploads/${fileName}`;
            const url = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${path}`;

            setStatus('loading');
            setMessage('Mengunggah ke repositori GitHub...');

            try {
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: `feat: upload image ${fileName} via admin panel`,
                        content: base64Content,
                        branch: GITHUB_REPO_BRANCH,
                    }),
                });

                const result = await response.json();

                if (response.ok) {
                    onUpdate(applyCacheBuster(result.content.download_url));
                    setStatus('success');
                    setMessage('Gambar berhasil diunggah ke GitHub!');
                } else {
                    throw new Error(result.message || 'Unknown error from GitHub API');
                }
            } catch (error: any) {
                console.error('GitHub upload failed:', error);
                setStatus('error');
                setMessage(`Unggah ke GitHub gagal: ${error.message}.`);
            }
        };

        reader.onerror = (error) => {
            console.error('File reading error:', error);
            setStatus('error');
            setMessage('Gagal membaca file.');
        };
        
        reader.readAsDataURL(file);
    };


    const handleLinkVerification = () => {
        if (!inputValue.trim() || !inputValue.startsWith('http')) {
            setStatus('error');
            setMessage('Masukkan URL yang valid (dimulai dengan http/https).');
            return;
        }

        setStatus('loading');
        setMessage('Memverifikasi tautan gambar...');

        const img = new Image();
        img.onload = () => {
            onUpdate(applyCacheBuster(inputValue));
            setStatus('success');
            setMessage('Tautan valid dan berhasil diperbarui!');
        };
        img.onerror = () => {
            setStatus('error');
            setMessage('Tidak dapat memuat gambar dari URL.');
        };
        img.src = inputValue;
    };

    const statusIndicator = {
        loading: <div className="flex items-center gap-2 text-sm text-blue-600"><svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>{message}</span></div>,
        success: <div className="flex items-center gap-2 text-sm text-green-600 font-semibold"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg><span>{message}</span></div>,
        error: <div className="flex items-center gap-2 text-sm text-red-600 font-semibold"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg><span>{message}</span></div>,
        idle: null,
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
            <div className="bg-slate-100 rounded-lg p-1 flex w-fit mb-2">
                 <button 
                    onClick={() => setUploadType('file')} 
                    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${uploadType === 'file' ? 'bg-white text-bsk-blue shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                    Unggah File ke GitHub
                </button>
                 <button 
                    onClick={() => setUploadType('link')} 
                    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${uploadType === 'link' ? 'bg-white text-bsk-blue shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                    Gunakan Tautan Eksternal
                </button>
            </div>
            <div className="mt-2 p-4 border border-dashed border-slate-300 rounded-lg">
                {src ? (
                    <img src={src} alt="Current" className="w-40 h-auto object-cover rounded-md mb-4 border border-slate-200" />
                ) : (
                    <div className="w-40 h-24 bg-slate-100 rounded-md mb-4 flex items-center justify-center text-slate-400 text-sm">No Image</div>
                )}
                
                {uploadType === 'file' && (
                    <>
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="image/jpeg, image/png, image/webp, image/svg+xml" 
                            onChange={handleFileChange} 
                            className="text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-bsk-blue hover:file:bg-blue-100 transition cursor-pointer w-full" 
                        />
                    </>
                )}
                
                {uploadType === 'link' && (
                    <div className="flex items-center gap-2">
                        <input 
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="https://example.com/image.png" 
                            className="flex-grow w-full px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-bsk-blue/50 focus:border-bsk-blue transition" 
                        />
                        <button 
                            onClick={handleLinkVerification}
                            className="flex-shrink-0 bg-bsk-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition"
                        >
                            Verify
                        </button>
                    </div>
                )}
                 <div className="mt-3 h-5">
                    {statusIndicator[status]}
                </div>
            </div>
        </div>
    );
};

const RemoveButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50" aria-label="Remove item">
        <TrashIcon className="h-5 w-5" />
    </button>
);


export default Admin;