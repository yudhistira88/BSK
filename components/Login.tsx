import React, { useState } from 'react';
import { useData } from '../context/DataContext';

interface LoginProps {
    setView: (view: string) => void;
}

const Login: React.FC<LoginProps> = ({ setView }) => {
    const { data } = useData();
    const { header, loginPage } = data;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Simple hardcoded credentials for demonstration
        if (email === 'bsk/admin' && password === 'Yamakasi88!') {
            setView('admin');
        } else {
            setError('Email/Username atau kata sandi salah.');
        }
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
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email/Username</label>
                            <input
                                id="email"
                                name="email"
                                type="text"
                                autoComplete="username"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 bg-white/10 border-2 border-transparent focus:border-bsk-yellow rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm transition-all"
                                placeholder="Masukkan username Anda"
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
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-bsk-dark-gray bg-bsk-yellow hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-bsk-yellow transition-all tracking-wider transform hover:scale-105"
                            >
                                {loginPage.buttonText}
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