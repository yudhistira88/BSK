import React from 'react';
import { CheckCircleIcon } from './icons';

interface RegistrationSuccessProps {
    onClose: () => void;
}

const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({ onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-bsk-dark-gray/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate__animated animate__fadeIn"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md text-center p-8 transform transition-all animate__animated animate__zoomIn">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                    <CheckCircleIcon className="h-12 w-12 text-bsk-dark-green" />
                </div>
                <h3 id="modal-title" className="text-2xl font-bold text-bsk-text-dark">
                    Pendaftaran Berhasil!
                </h3>
                <div className="mt-4">
                    <p className="text-md text-bsk-text-gray">
                        Akun Anda telah berhasil diaktifkan. Selamat datang di BSK!
                    </p>
                </div>
                <div className="mt-8">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-3 bg-bsk-blue text-base font-medium text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bsk-blue sm:text-sm transition-all transform hover:scale-105"
                    >
                        Lanjut ke Beranda
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegistrationSuccess;
