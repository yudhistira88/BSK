
import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import WhoWeAre from './components/WhoWeAre';
import TipsAndNews from './components/TipsAndNews';
import Clients from './components/Clients';
import Footer from './components/Footer';
import Admin from './components/Admin';
import PostDetail from './components/PostDetail';
import AllServicesPage from './components/services/AllServicesPage';
import DesignServicePage from './components/services/DesignServicePage';
import CostSimulator from './components/CostSimulator';
import WhyUs from './components/WhyUs';
import Portfolio from './components/Portfolio';
import { DataProvider } from './context/DataContext';
import { NewsPost } from './context/DataContext';
import DownloadProposal from './components/DownloadProposal';
import FAQ from './components/FAQ';
import WhatsAppButton from './components/WhatsAppButton';
import AboutUs from './components/AboutUs';
import Login from './components/Login';
import Register from './components/Register';

const Site: React.FC<{ 
  setView: (view: string, options?: { anchor?: string; state?: any; }) => void;
  setSelectedPost: (post: NewsPost) => void;
  initialState?: { activeServiceTab?: string } | null;
}> = ({ setView, setSelectedPost, initialState }) => {
  return (
    <div className="bg-white">
      <Header setView={setView} />
      <main>
        <Hero setView={setView} />
        <AboutUs />
        <WhoWeAre setView={setView} activeTabId={initialState?.activeServiceTab} />
        <WhyUs />
        <Portfolio />
        <DownloadProposal />
        <FAQ />
        <TipsAndNews setSelectedPost={setSelectedPost} />
        <Clients />
      </main>
      <Footer setView={setView} />
    </div>
  );
};


const App: React.FC = () => {
  const [view, setView] = useState('site');
  const [costSimulatorInitialState, setCostSimulatorInitialState] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
  const [siteInitialState, setSiteInitialState] = useState<any>(null);

  const handleSetView = (newView: string, options?: { anchor?: string; state?: any; }) => {
    if (newView === 'costSimulator') {
        setCostSimulatorInitialState(options?.state || null);
    }
    
    if (newView === 'site') {
      setSiteInitialState(options?.state || null);
    } else {
      setSiteInitialState(null); // Clear state when not on site view
    }
    
    setView(newView);

    if (options?.anchor) {
        setTimeout(() => {
            const element = document.querySelector(options.anchor as string);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100); // Delay to allow the new view to render
    } else {
      window.scrollTo(0, 0);
    }
  }

  const handleSetSelectedPost = (post: NewsPost) => {
    setSelectedPost(post);
    handleSetView('postDetail');
  };
  
  const renderView = () => {
    switch(view) {
      case 'admin':
        return <Admin setView={handleSetView} />;
      case 'login':
        return <Login setView={handleSetView} />;
      case 'register':
        return <Register setView={handleSetView} />;
      case 'postDetail':
        return <PostDetail post={selectedPost!} setSelectedPost={setSelectedPost} setView={handleSetView} />;
      case 'allServices':
        return <AllServicesPage setView={handleSetView} />;
      case 'designService':
        return <DesignServicePage setView={handleSetView} />;
      case 'costSimulator':
        return <CostSimulator setView={handleSetView} initialState={costSimulatorInitialState} />;
      case 'site':
      default:
        return <Site setView={handleSetView} setSelectedPost={handleSetSelectedPost} initialState={siteInitialState} />;
    }
  }

  return (
    <DataProvider>
      {renderView()}
      <WhatsAppButton />
    </DataProvider>
  );
};

export default App;
