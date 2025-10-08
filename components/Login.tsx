import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface LoginProps {
    setView: (view: string) => void;
}

const Login: React.FC<LoginProps> = ({ setView }) => {
    const { data } = useData();
    const { loginPage } = data;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!isSupabaseConfigured) {
            setError('Fitur masuk saat ini tidak aktif. Harap hubungi administrator situs.');
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            if (error.message.includes("Invalid login credentials")) {
                setError('Email atau kata sandi salah. Silakan coba lagi.');
            } else {
                setError(error.message);
            }
        } else {
            setView('admin');
        }
        
        setLoading(false);
    };

    return (
        <div 
            className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center p-4 relative"
            style={{ backgroundImage: `url('${loginPage.backgroundImage}')` }}
        >
            <div className="absolute inset-0 bg-bsk-dark-gray/80 backdrop-blur-sm"></div>
            <div className="relative w-full max-w-md z-10">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-lg text-white">
                    <h2 className="text-3xl font-bold text-center mb-1">{loginPage.title}</h2>
                    <p className="text-center text-gray-300 mb-8">{loginPage.subtitle}</p>
                    
                    {error && (
                        <div className="bg-red-500/30 border border-red-500 text-red-200 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 bg-white/10 border-2 border-transparent focus:border-bsk-yellow rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm transition-all"
                                placeholder="Masukkan email Anda"
                            />
                        </div>

                        <div>
                            <label htmlFor="password"  className="block text-sm font-medium text-gray-300">Kata Sandi</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 bg-white/10 border-2 border-transparent focus:border-bsk-yellow rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm transition-all"
                                placeholder="********"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-bsk-dark-gray bg-bsk-yellow hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-bsk-yellow transition-all tracking-wider transform hover:scale-105 disabled:opacity-75"
                            >
                                {loading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-bsk-dark-gray" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                                {loading ? 'Masuk...' : loginPage.buttonText}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <p className="text-gray-300">
                            Belum punya akun?{' '}
                            <button onClick={() => setView('register')} className="font-bold text-bsk-yellow hover:text-white">
                                Daftar sekarang
                            </button>
                        </p>
                    </div>
                </div>
                
                <div className="mt-8 text-center">
                    <button onClick={() => setView('site')} className="font-medium text-white hover:text-gray-200 transition-colors bg-black/20 px-4 py-2 rounded-full">
                        &larr; Kembali ke Situs
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;