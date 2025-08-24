
import React, { useState, useRef, useEffect } from 'react';
import { CommentIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import { useData } from '../context/DataContext';
import { NewsPost } from '../context/DataContext';

interface TipsAndNewsProps {
    setSelectedPost: (post: NewsPost) => void;
}

const getPostsToShow = () => {
    if (typeof window !== 'undefined') {
        if (window.innerWidth >= 1024) return 4;
        if (window.innerWidth >= 640) return 2;
    }
    return 1;
};


const TipsAndNews: React.FC<TipsAndNewsProps> = ({ setSelectedPost }) => {
    const { data } = useData();
    const { tipsAndNews } = data;
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [postsToShow, setPostsToShow] = useState(getPostsToShow());
    
    const totalPosts = tipsAndNews.posts.length;
    const maxIndex = totalPosts > postsToShow ? totalPosts - postsToShow : 0;

    useEffect(() => {
        const handleResize = () => {
            const newPostsToShow = getPostsToShow();
            setPostsToShow(newPostsToShow);
            
            const newMaxIndex = totalPosts > newPostsToShow ? totalPosts - newPostsToShow : 0;
            if (currentIndex > newMaxIndex) {
                setCurrentIndex(newMaxIndex);
            }
        };

        window.addEventListener('resize', handleResize);
        
        // Initial call to set correct state
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [totalPosts, currentIndex]);

    const nextSlide = () => {
        setCurrentIndex(prevIndex => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
    };

    const prevSlide = () => {
        setCurrentIndex(prevIndex => (prevIndex <= 0 ? maxIndex : prevIndex - 1));
    };
    
    useEffect(() => {
        if (sliderRef.current) {
            const cardElement = sliderRef.current.children[0] as HTMLElement;
            if (cardElement) {
                const cardWidth = cardElement.offsetWidth;
                const gap = 32; // Corresponds to gap-8
                const offset = (cardWidth + gap) * currentIndex;
                sliderRef.current.style.transform = `translateX(-${offset}px)`;
            }
        }
    }, [currentIndex, postsToShow]); // Rerun effect when postsToShow changes


    return (
        <section id="berita" className="py-20 bg-bsk-light-gray/50">
            <div className="container mx-auto px-6 sm:px-8 max-w-7xl">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-12 wow animate__animated animate__fadeInUp">
                    <h2 className="text-3xl font-bold text-bsk-text-dark mb-4 sm:mb-0">{tipsAndNews.title}</h2>
                     <div className="flex space-x-2 self-end sm:self-auto">
                        <button onClick={prevSlide} className="w-10 h-10 flex items-center justify-center bg-white shadow-sm hover:bg-gray-100 transition-colors rounded-sm" aria-label="Previous Post">
                           <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                        </button>
                         <button onClick={nextSlide} className="w-10 h-10 flex items-center justify-center bg-white shadow-sm hover:bg-gray-100 transition-colors rounded-sm" aria-label="Next Post">
                           <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>
                <div className="overflow-hidden wow animate__animated animate__fadeInUp" data-wow-delay="0.2s">
                    <div ref={sliderRef} className="flex gap-8 transition-transform duration-500 ease-in-out">
                         {tipsAndNews.posts.map((post, index) => (
                            <div key={index} className="flex-shrink-0 w-full sm:w-[calc(50%-16px)] lg:w-[calc(25%-24px)]">
                                <div className="group bg-white shadow-md overflow-hidden flex flex-col h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2">
                                    <div className="overflow-hidden">
                                        <img src={post.image} alt={post.title} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-md font-bold text-bsk-text-dark mb-3 h-12 leading-tight">{post.title}</h3>
                                        <div className="flex items-center text-xs text-bsk-text-gray mb-4 pb-4 border-b">
                                            <span>ON {post.date}</span>
                                            <div className="flex items-center ml-auto">
                                                <CommentIcon className="w-4 h-4 mr-1.5 text-bsk-yellow"/>
                                                <span>{post.comments}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-bsk-text-gray mb-4 flex-grow">{post.description.split('\n')[0]}</p>
                                        <button onClick={() => setSelectedPost(post)} className="text-xs font-bold text-bsk-text-dark tracking-wider hover:text-bsk-yellow transition-colors mt-auto self-start">Read More</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TipsAndNews;