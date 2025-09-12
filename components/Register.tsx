import React, { useState } from 'react';
import { useData } from '../context/DataContext';

interface RegisterProps {
    setView: (view: string) => void;
}

const Register: React.FC<RegisterProps> = ({ setView }) => {
    const { data } = useData();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        type: 'Customer',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Kata sandi tidak cocok.');
            return;
        }

        if (formData.password.length < 6) {
            setError('Kata sandi minimal harus 6 karakter.');
            return;
        }

        // Simulate successful registration
        setSuccess('Pendaftaran berhasil! Anda akan diarahkan ke halaman login.');
        setTimeout(() => {
            setView('login');
        }, 2000);
    };

    return (
        <div 
            className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center p-4 relative"
            style={{ backgroundImage: `url('${data.loginPage.backgroundImage}')` }}
        >
            <div className="absolute inset-0 bg-bsk-dark-gray/80 backdrop-blur-sm"></div>
            <div className="relative w-full max-w-md z-10">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-lg text-white">
                    <h2 className="text-3xl font-bold text-center mb-1">Pendaftaran Mitra BSK</h2>
                    <p className="text-center text-gray-300 mb-6">Buat akun baru Anda.</p>
                    
                    {error && (
                        <div className="bg-red-500/30 border border-red-500 text-red-200 px-4 py-3 rounded relative mb-4" role="alert">
                            <span>{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-500/30 border border-green-500 text-green-200 px-4 py-3 rounded relative mb-4" role="alert">
                           <span>{success}</span>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <InputField name="fullName" label="Nama Lengkap" value={formData.fullName} onChange={handleChange} required />
                        <InputField name="email" label="Alamat Email" type="email" value={formData.email} onChange={handleChange} required />
                        <InputField name="phone" label="Nomor Telepon" type="tel" value={formData.phone} onChange={handleChange} required />
                        <InputField name="company" label="Nama Perusahaan (Opsional)" value={formData.company} onChange={handleChange} />

                        <div>
                             <label htmlFor="type" className="block text-sm font-medium text-gray-300">Jenis Pendaftaran</label>
                             <select id="type" name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full px-4 py-3 bg-white/10 text-white border-2 border-transparent focus:border-bsk-yellow rounded-md shadow-sm focus:outline-none focus:ring-0 sm:text-sm transition-all appearance-none">
                                <option className="bg-bsk-dark-gray">Customer</option>
                                <option className="bg-bsk-dark-gray">Mitra</option>
                                <option className="bg-bsk-dark-gray">Distributor</option>
                            </select>
                        </div>
                        
                        <InputField name="password" label="Kata Sandi" type="password" value={formData.password} onChange={handleChange} required />
                        <InputField name="confirmPassword" label="Konfirmasi Kata Sandi" type="password" value={formData.confirmPassword} onChange={handleChange} required />

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 mt-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-bsk-dark-gray bg-bsk-yellow hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-bsk-yellow transition-all tracking-wider transform hover:scale-105"
                                disabled={!!success}
                            >
                                Daftar
                            </button>
                        </div>
                    </form>

                     <div className="mt-8 text-center text-sm">
                        <p className="text-gray-300">
                            Sudah punya akun?{' '}
                            <button onClick={() => setView('login')} className="font-bold text-bsk-yellow hover:text-white">
                                Masuk di sini
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


const InputField: React.FC<{ name: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, required?: boolean }> = ({ name, label, value, onChange, type = 'text', required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
        <input
            id={name}
            name={name}
            type={type}
            required={required}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full px-4 py-3 bg-white/10 border-2 border-transparent focus:border-bsk-yellow rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm transition-all text-white"
        />
    </div>
);


export default Register;