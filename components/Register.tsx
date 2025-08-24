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
                    <h2 className="text-2xl font-bold text-center text-bsk-dark-gray mb-1">Pendaftaran Mitra BSK</h2>
                    <p className="text-center text-bsk-text-gray mb-6">Buat akun baru Anda.</p>
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span>{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                           <span>{success}</span>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <InputField name="fullName" label="Nama Lengkap" value={formData.fullName} onChange={handleChange} required />
                        <InputField name="email" label="Alamat Email" type="email" value={formData.email} onChange={handleChange} required />
                        <InputField name="phone" label="Nomor Telepon" type="tel" value={formData.phone} onChange={handleChange} required />
                        <InputField name="company" label="Nama Perusahaan (Opsional)" value={formData.company} onChange={handleChange} />

                        <div>
                             <label htmlFor="type" className="block text-sm font-medium text-gray-700">Jenis Pendaftaran</label>
                             <select id="type" name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bsk-blue focus:border-bsk-blue sm:text-sm">
                                <option>Customer</option>
                                <option>Mitra</option>
                                <option>Distributor</option>
                            </select>
                        </div>
                        
                        <InputField name="password" label="Kata Sandi" type="password" value={formData.password} onChange={handleChange} required />
                        <InputField name="confirmPassword" label="Konfirmasi Kata Sandi" type="password" value={formData.confirmPassword} onChange={handleChange} required />

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 mt-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-bsk-dark-gray bg-bsk-yellow hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bsk-yellow transition-all"
                                disabled={!!success}
                            >
                                Daftar
                            </button>
                        </div>
                    </form>

                     <div className="mt-6 text-center text-sm">
                        <p className="text-gray-600">
                            Sudah punya akun?{' '}
                            <button onClick={() => setView('login')} className="font-medium text-bsk-blue hover:text-bsk-blue/80">
                                Masuk di sini
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


const InputField: React.FC<{ name: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, required?: boolean }> = ({ name, label, value, onChange, type = 'text', required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            id={name}
            name={name}
            type={type}
            required={required}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-bsk-blue focus:border-bsk-blue sm:text-sm"
        />
    </div>
);


export default Register;