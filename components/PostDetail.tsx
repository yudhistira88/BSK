

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useData, NewsPost } from '../context/DataContext';
import { CommentIcon, SearchIcon, InstagramIcon, LinkedinIcon, ChevronRightIcon } from './icons';

interface PostDetailProps {
    post: NewsPost;
    setSelectedPost: (post: NewsPost | null) => void;
    setView: (view: string, options?: { anchor?: string; state?: any; }) => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, setSelectedPost, setView }) => {
    const { data } = useData();
    const { tipsAndNews } = data;
    const recentPosts = tipsAndNews.posts.filter(p => p.title !== post.title).slice(0, 3);

    return (
        <div className="bg-white">
            <Header setView={setView} />
            <main>
                {/* Post Hero Banner */}
                <section 
                    className="relative h-96 bg-cover bg-center text-white flex items-center justify-center"
                    style={{ backgroundImage: `url('${post.image}')` }}
                >
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="relative z-10 text-center max-w-4xl px-4">
                        <h1 className="text-4xl md:text-5xl font-black tracking-wider leading-tight animate__animated animate__fadeInDown">
                            {post.title}
                        </h1>
                        <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-200 animate__animated animate__fadeInUp">
                            <span>ON {post.date}</span>
                            <div className="flex items-center">
                                <CommentIcon className="w-4 h-4 mr-1.5 text-bsk-yellow"/>
                                <span>{post.comments} Comments</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Post Content & Sidebar */}
                <section className="py-20">
                    <div className="container mx-auto px-6 sm:px-8 max-w-7xl">
                        <div className="flex flex-col lg:flex-row gap-12">
                            {/* Main Content */}
                            <div className="lg:w-2/3">
                                <article className="prose lg:prose-lg max-w-none text-bsk-text-gray space-y-6">
                                    {post.description.split('\n').map((paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                                </article>
                                
                                {/* Share Section */}
                                <div className="mt-12 pt-8 border-t flex items-center gap-4">
                                    <h3 className="font-bold text-bsk-text-dark">SHARE:</h3>
                                    <div className="flex items-center gap-3">
                                        <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-600 hover:bg-bsk-blue hover:text-white transition-colors rounded-full" aria-label="Share on Instagram"><InstagramIcon className="w-5 h-5" /></a>
                                        <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-600 hover:bg-bsk-blue hover:text-white transition-colors rounded-full" aria-label="Share on LinkedIn"><LinkedinIcon className="w-5 h-5" /></a>
                                    </div>
                                </div>
                                 <button onClick={() => { setSelectedPost(null); setView('site'); }} className="mt-12 inline-block bg-bsk-yellow text-bsk-dark-gray font-bold py-3 px-8 hover:brightness-95 transition-all duration-300 tracking-wider text-sm">
                                    Back to News
                                </button>
                            </div>

                            {/* Sidebar */}
                            <aside className="lg:w-1/3 space-y-8">
                                {/* Search Widget */}
                                <div className="bg-bsk-light-gray/70 p-6">
                                    <h3 className="text-lg font-bold text-bsk-text-dark mb-4">Search</h3>
                                    <div className="relative">
                                        <input type="text" placeholder="Search..." className="w-full py-2 pl-4 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-bsk-yellow/50" />
                                        <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>

                                {/* Recent Posts Widget */}
                                <div className="bg-bsk-light-gray/70 p-6">
                                     <h3 className="text-lg font-bold text-bsk-text-dark mb-4">Recent Posts</h3>
                                     <ul className="space-y-4">
                                        {recentPosts.map(p => (
                                            <li key={p.title} className="border-b pb-4 last:border-b-0 last:pb-0">
                                                <button onClick={() => setSelectedPost(p)} className="text-left">
                                                    <h4 className="font-semibold text-bsk-text-dark hover:text-bsk-yellow transition-colors">{p.title}</h4>
                                                    <span className="text-xs text-bsk-text-gray">{p.date}</span>
                                                </button>
                                            </li>
                                        ))}
                                     </ul>
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>
            </main>
            <Footer setView={setView} />
        </div>
    );
};

export default PostDetail;