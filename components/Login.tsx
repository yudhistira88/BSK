import React, { useState } from 'react';
import { useData } from '../context/DataContext';

interface LoginProps {
    setView: (view: string) => void;
}

const Login: React.FC<LoginProps> = ({ setView }) => {
    const { data } = useData();
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
        <div className="min-h-screen bg-bsk-light-gray flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <button onClick={() => setView('site')} className="inline-block">
                        {data.header.logoImage ? (
                           <img src={data.header.logoImage} alt={data.header.logoText} className="h-16 w-auto mx-auto" />
                        ) : (
                           <span className="text-4xl font-black tracking-wider text-bsk-dark-gray">{data.header.logoText}</span>
                        )}
                    </button>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-center text-bsk-dark-gray mb-1">Selamat Datang</h2>
                    <p className="text-center text-bsk-text-gray mb-6">Silakan masuk ke akun Anda.</p>
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email/Username</label>
                            <input
                                id="email"
                                name="email"
                                type="text"
                                autoComplete="username"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-bsk-blue focus:border-bsk-blue sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="password"  className="block text-sm font-medium text-gray-700">Kata Sandi</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-bsk-blue focus:border-bsk-blue sm:text-sm"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-bsk-dark-gray bg-bsk-yellow hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bsk-yellow transition-all"
                            >
                                Masuk
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <p className="text-gray-600">
                            Belum punya akun?{' '}
                            <button onClick={() => setView('register')} className="font-medium text-bsk-blue hover:text-bsk-blue/80">
                                Daftar sekarang
                            </button>
                        </p>
                    </div>
                </div>
                
                <div className="mt-6 text-center">
                    <button onClick={() => setView('site')} className="font-medium text-bsk-blue hover:text-bsk-blue/80 transition-colors">
                        &larr; Kembali ke Situs
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;