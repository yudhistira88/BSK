
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the structure of our data for a single language
interface NavLink {
    text: string;
    href: string;
    submenu?: { text: string; href: string }[];
}

interface CtaDropdownItem {
    text: string;
    action: 'download' | 'anchor';
    href?: string;
}

interface CtaButton {
  text: string;
  type: 'primary' | 'secondary' | 'secondary-outline';
  action?: 'costSimulator' | 'admin' | 'anchor' | 'download' | 'login';
  href?: string;
  items?: CtaDropdownItem[];
}

interface HeroSlide {
    title: string[];
    subtitle:string;
    buttonText: string;
    backgroundImage: string;
}

interface AboutUsData {
    preTitle: string;
    title: string;
    completedProjects: string;
    mainParagraph: string;
    tagline: string;
    visionTitle: string;
    visionParagraph: string;
    visionImage1: string;
    visionImage2: string;
    missionTitle: string;
    missions: {
        id: string;
        text: string;
    }[];
}

interface WhoWeAreAccordion {
    id: string;
    title: string;
    content: string;
}

interface WhoWeAreTab {
    id: string;
    label: string;
    title: string;
    description: string;
    image: string;
    accordions: WhoWeAreAccordion[];
}

export interface NewsPost {
    image: string;
    title: string;
    date: string;
    comments: number;
    description: string;
}

interface AllServicesPageData {
    hero: {
        title: string;
        backgroundImage: string;
    };
    intro: {
        title: string;
        paragraph: string;
    };
    services: {
        id: string;
        title: string;
        description: string;
        image: string;
        offerings: string[];
    }[];
    cta: {
        title: string;
        buttonText: string;
    };
}

interface DesignServicePageData {
    hero: {
        title: string;
        backgroundImage: string;
    };
    about: {
        title: string;
        paragraph1: string;
        paragraph2: string;
        image: string;
    };
    offerings: {
        title: string;
        items: {
            icon: string;
            title: string;
            description: string;
        }[];
    };
    process: {
        title: string;
        steps: {
            step: string;
            title: string;
            description: string;
        }[];
    };
    cta: {
        title: string;
        buttonText: string;
    };
}

interface WhyUsFeature {
  title: string;
  description: string;
  image: string;
}

interface BusinessType {
  icon: string;
  label: string;
}

interface WhyUsData {
  sectionTitle: string;
  sectionSubtitle: string;
  features: WhyUsFeature[];
  businessTypesTitle: string;
  businessTypes: BusinessType[];
}

interface PortfolioProject {
    id: number;
    image: string;
    title: string;
    category: string;
}

interface PortfolioData {
    title: string;
    paragraph: string;
    filters: string[];
    projects: PortfolioProject[];
}

interface FormField {
    id: string;
    label: string;
    type: 'numeric' | 'select';
    placeholder?: string;
    options?: string[];
}

interface SubDetailService {
    id: string;
    label: string;
    unit: string;
    price: number | { [key: string]: number };
    fields: FormField[];
}

interface SubService {
    id: string;
    label: string;
    unit?: string;
    price?: number | { [key: string]: number };
    fields?: FormField[];
    subDetails?: SubDetailService[];
}

interface CalculatorStep {
    id: string;
    label: string;
    icon: 'PencilSquare' | 'BuildingOffice' | 'PaintBrush' | 'WrenchScrewdriver' | 'MEP' | 'Road' | 'CpuChip';
    description: string;
    subServices: SubService[];
}

interface CostSimulatorPageData {
    hero: {
        title: string;
        subtitle: string;
        backgroundImage: string;
    };
    intro: {
        title: string;
        paragraph: string;
    };
    form: {
        title: string;
        propertyTypeLabel: string;
        propertyTypeOptions: string[];
        workTypeLabel: string;
        workTypeOptions: string[];
        areaLabel: string;
        areaPlaceholder: string;
        qualityLabel: string;
        qualityOptions: {
            title: string;
            description: string;
        }[];
        buttonText: string;
    };
    results: {
        title: string;
        disclaimer: string;
        ctaButtonText: string;
    };
    calculatorSteps: CalculatorStep[];
}

interface CtaSlideData {
    type: 'download' | 'partner';
    title: string;
    paragraph: string;
    image: string;
    buttonText: string;
    fileUrl?: string;
    ctaUrl?: string;
}

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

interface FAQData {
    title: string;
    items: FAQItem[];
}

interface LoginPageData {
    backgroundImage: string;
    title: string;
    subtitle: string;
    buttonText: string;
}

interface AppData {
    header: {
        logoText: string;
        logoImage: string;
        navLinks: NavLink[];
        ctaButtons: CtaButton[];
    };
    hero: {
        slides: HeroSlide[];
    };
    stats: { value: string; label: string }[];
    aboutUs: AboutUsData;
    whoWeAre: {
        mainTitle: string;
        mainParagraph: string;
        tabs: WhoWeAreTab[];
    };
    whyUs: WhyUsData;
    portfolio: PortfolioData;
    ctaSlider: CtaSlideData[];
    faq: FAQData;
    tipsAndNews: {
        title: string;
        posts: NewsPost[];
    };
    clients: { 
        title: string;
        logos: { src: string; alt: string }[];
    };
    footer: {
        companyName: string;
        about: string;
        services: { text: string; href: string; }[];
        address: string;
        phone: string;
        email: string;
        hours: string;
        subFooter: {
            privacyPolicy: { text: string; href: string; };
            copyright: string;
            links: { text: string; href: string; }[];
        }
    },
    allServicesPage: AllServicesPageData;
    designServicePage: DesignServicePageData;
    costSimulatorPage: CostSimulatorPageData;
    loginPage: LoginPageData;
}

const LOCAL_STORAGE_KEY = 'bsk-admin-data';

// Initial default data
const initialData: AppData = {
    header: {
        logoText: 'BSK',
        logoImage: 'https://res.cloudinary.com/dnpilqnf7/image/upload/v1756094098/logo_bsk_white_ccbsbg.png?v=2',
        navLinks: [
            { text: 'Beranda', href: '#home' },
            { text: 'Tentang Kami', href: '#about-us' },
            { text: 'Layanan', href: '#layanan-unggulan' },
            { text: 'Klien', href: '#klien' },
            { text: 'Berita', href: '#berita' },
            { text: 'Kontak', href: '#kontak' },
        ],
        ctaButtons: [
            { text: 'Buat Estimasi', type: 'primary', action: 'costSimulator' },
            { text: 'Masuk', type: 'secondary-outline', action: 'login' }
        ],
    },
    hero: {
        slides: [
            {
                title: ['Konstruksi & Renovasi', 'Profesional'],
                subtitle: 'Mewujudkan properti impian Anda, dari hunian pribadi hingga bangunan komersial. Kualitas terjamin, tepat waktu, dan sesuai anggaran.',
                buttonText: 'Lihat Layanan Kami',
                backgroundImage: 'https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            },
            {
                title: ['Solusi Desain, MEP', '& Interior'],
                subtitle: 'Layanan lengkap untuk desain arsitektur, sistem MEP (Mekanikal, Elektrikal, Plumbing), serta pengerjaan interior dan eksterior yang estetis.',
                buttonText: 'Konsultasi Gratis',
                backgroundImage: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            }
        ]
    },
    stats: [
        { value: '140+', label: 'Proyek Selesai' },
        { value: '88+', label: 'Proyek B2B' },
        { value: '58+', label: 'Proyek B2C' },
        { value: '7+', label: 'Tahun Pengalaman' },
    ],
    aboutUs: {
        preTitle: "LANGKAH AWAL MENUJU MISI BESAR",
        title: "Tentang Kami",
        completedProjects: "140+",
        mainParagraph: "Berawal dari usaha berskala kecil di tahun 2018 yang berakar pada pengalaman di bidang konstruksi, PT. Baari Salam Konstruksi kini telah tumbuh dan berkembang menjadi perusahaan jasa konstruksi yang andal dan terpadu. Layanan kami mencakup berbagai lingkup pekerjaan, mulai dari Sipil, Arsitektur (Interior & Eksterior), pembangunan Jalan, Jembatan, dan Drainase, hingga instalasi Fire Protection System (FPS) dan Plumbing. Didukung oleh tim profesional yang berkompeten dan terlatih di bidangnya, kami senantiasa berkomitmen untuk menghadirkan hasil kerja berkualitas tinggi, tepat waktu, dan dengan penawaran harga yang kompetitif demi memastikan kepuasan maksimal setiap klien.",
        tagline: "Build Your Imagination",
        visionTitle: "VISI",
        visionParagraph: "Menjadi perusahaan kontraktor yang profesional dan terpercaya di bidang jasa konstruksi serta penyedia alat-alat konstruksi, dengan mengedepankan standar mutu tinggi, ketepatan waktu, serta solusi yang inovatif, guna memberikan pelayanan terbaik dan bernilai tambah bagi setiap customer dalam mendukung keberhasilan proyek.",
        visionImage1: "https://images.unsplash.com/photo-1516557070043-c04095b75432?q=80&w=2070&auto=format&fit=crop",
        visionImage2: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
        missionTitle: "MISI",
        missions: [
            {
                id: 'mission1',
                text: "Kami berkomitmen untuk menyediakan produk dan jasa alat-alat konstruksi yang tidak hanya bermutu tinggi, tetapi juga memenuhi standar keselamatan, efisiensi, dan ketahanan jangka panjang, guna mendukung kelancaran dan keberhasilan setiap proyek pembangunan yang dipercayakan kepada kami."
            },
            {
                id: 'mission2',
                text: "Kami berusaha memberikan pelayanan terbaik kepada setiap customer melalui respons cepat, solusi yang tepat, serta pendekatan yang mengedepankan kepuasan pelanggan sebagai prioritas utama dalam setiap interaksi bisnis."
            },
            {
                id: 'mission3',
                text: "Dengan menjunjung tinggi nilai kejujuran, tanggung jawab, dan profesionalisme, kami senantiasa menjaga integritas dalam setiap aspek layanan kami di bidang jasa dan konstruksi, sehingga menciptakan kepercayaan jangka panjang dengan seluruh mitra dan klien kami."
            },
            {
                id: 'mission4',
                text: "Kami juga senantiasa berinovasi dalam pengembangan layanan dan teknologi konstruksi untuk menjawab tantangan zaman serta meningkatkan daya saing perusahaan secara berkelanjutan."
            }
        ]
    },
    whoWeAre: {
        mainTitle: "Layanan Kami",
        mainParagraph: "Solusi konstruksi terintegrasi dari perencanaan hingga perawatan untuk wujudkan properti impian Anda.",
        tabs: [
            {
                id: 'konsultasi',
                label: 'Konsultasi / Desain',
                title: 'Dari Konsep Menjadi Cetak Biru',
                description: 'Kami meletakkan fondasi kesuksesan proyek Anda melalui perencanaan strategis, desain inovatif, dan integrasi teknologi modern.',
                image: 'https://images.unsplash.com/photo-1542382257-80ded14b0a39?q=80&w=2070&auto=format&fit=crop',
                accordions: [
                  {
                    id: 'desain-visual',
                    title: 'Desain 2D, Desain 3D & rendering visual (Image / Video)',
                    content: 'Kami menyediakan layanan desain lengkap, mulai dari gambar kerja 2D, model 3D, hingga rendering visual fotorealistik dalam format gambar dan video untuk memberikan gambaran nyata proyek Anda sebelum dibangun.'
                  },
                  {
                    id: 'desain-mep',
                    title: 'Desain MEP (listrik, plumbing, tata udara)',
                    content: 'Merancang sistem Mekanikal, Elektrikal, dan Plumbing (MEP) yang efisien dan terintegrasi, memastikan bangunan Anda berfungsi optimal sesuai standar keamanan dan kenyamanan tertinggi.'
                  },
                  {
                    id: 'desain-struktur',
                    title: 'Perhitungan Struktur & Engineering Design',
                    content: 'Melakukan analisis dan perhitungan struktur yang akurat oleh tim engineer kami untuk menjamin keamanan, kekokohan, dan efisiensi material pada konstruksi bangunan Anda.'
                  },
                  {
                    id: 'rab',
                    title: 'Pembuatan RAB (Rencana Anggaran Biaya)',
                    content: 'Menyusun Rencana Anggaran Biaya (RAB) yang detail dan transparan untuk membantu Anda merencanakan investasi proyek dengan akurat dan menghindari biaya tak terduga.'
                  },
                  {
                    id: 'izin',
                    title: 'Pengurusan Izin: IMB/PBG',
                    content: 'Kami membantu dan mempermudah Anda dalam proses pengurusan Izin Mendirikan Bangunan (IMB) atau Persetujuan Bangunan Gedung (PBG) agar proyek Anda berjalan lancar sesuai regulasi pemerintah.'
                  }
                ]
            },
            {
                id: 'konstruksi',
                label: 'Bangun / Renovasi',
                title: 'Membangun Impian, Mewujudkan Visi',
                description: 'Tim kami yang berpengalaman merealisasikan desain menjadi kenyataan dengan standar kualitas tertinggi, tepat waktu, dan sesuai anggaran.',
                image: 'https://images.unsplash.com/photo-1579969402128-422a8a1639a6?q=80&w=1974&auto=format&fit=crop',
                accordions: [
                  {
                    id: 'pembangunan-beragam',
                    title: 'Pembangunan Rumah Tinggal, Gedung, Ruko, Pabrik',
                    content: 'Kami menangani pembangunan dari awal untuk berbagai jenis properti, termasuk hunian pribadi, bangunan komersial seperti ruko dan gedung perkantoran, hingga fasilitas industri seperti pabrik dan gudang.'
                  },
                  {
                    id: 'renovasi-menyeluruh',
                    title: 'Renovasi Rumah/Gedung (Parsial & Total)',
                    content: 'Layanan renovasi kami mencakup perbaikan sebagian (parsial) untuk menyegarkan ruang tertentu hingga perombakan total (total) untuk mengubah fungsi dan tampilan properti Anda secara menyeluruh.'
                  },
                  {
                    id: 'perluasan-bangunan',
                    title: 'Perluasan Bangunan / Penambahan Lantai',
                    content: 'Membutuhkan ruang lebih? Kami ahli dalam merancang dan mengeksekusi perluasan bangunan secara horizontal maupun vertikal (penambahan lantai), dengan tetap memperhatikan kekuatan struktur yang ada.'
                  },
                  {
                    id: 'fasilitas-umum',
                    title: 'Pembangunan Fasilitas Umum (Sekolah, Rumah Sakit, Tempat Ibadah, dll)',
                    content: 'Kami memiliki pengalaman dalam membangun fasilitas umum yang fungsional dan memenuhi standar, seperti gedung sekolah, fasilitas kesehatan, rumah ibadah, dan infrastruktur publik lainnya.'
                  },
                  {
                    id: 'pembangunan-cluster',
                    title: 'Cluster Perumahan & Hunian Modern',
                    content: 'Mengembangkan cluster perumahan dari tahap perencanaan hingga serah terima kunci. Kami fokus pada desain hunian modern yang nyaman, efisien, dan memiliki nilai investasi tinggi.'
                  }
                ]
            },
            {
                id: 'repair',
                label: 'Repair Maintenance',
                title: 'Menjaga Aset Properti Anda',
                description: 'Kami menyediakan layanan perbaikan responsif dan program pemeliharaan preventif untuk menjaga properti Anda tetap dalam kondisi prima dan mencegah kerusakan.',
                image: 'https://images.unsplash.com/photo-1610123514139-3c7216f9f045?q=80&w=1964&auto=format&fit=crop',
                accordions: [
                  {
                    id: 'perbaikan-kerusakan',
                    title: 'Perbaikan Kerusakan Rumah/Gedung/Apartemen/Pabrik',
                    content: 'Layanan responsif untuk mengatasi berbagai kerusakan, mulai dari masalah struktural, kebocoran, hingga perbaikan sipil lainnya untuk menjaga properti Anda tetap aman dan fungsional.'
                  },
                  {
                    id: 'preventive-maintenance',
                    title: 'Preventive maintenance Rumah/Gedung/Apartemen/Pabrik',
                    content: 'Program pemeliharaan proaktif dan terjadwal untuk memeriksa, membersihkan, dan merawat semua komponen bangunan guna mencegah kerusakan besar dan memperpanjang umur aset.'
                  },
                  {
                    id: 'facility-management',
                    title: 'Fasility Management',
                    content: 'Manajemen fasilitas secara menyeluruh yang mencakup operasional harian, pemeliharaan, dan optimalisasi penggunaan ruang untuk memastikan lingkungan yang efisien dan nyaman.'
                  },
                  {
                    id: 'service-ac',
                    title: 'Service AC, Perlengkapan dan Peralatan Lainnya',
                    content: 'Jasa servis dan perbaikan untuk sistem tata udara (AC), serta berbagai perlengkapan dan peralatan mekanikal lainnya agar berfungsi dengan performa terbaik.'
                  },
                  {
                    id: 'perawatan-listrik-plumbing',
                    title: 'Perawatan dan Pemeliharaan Instalasi Listrik & Plumbing',
                    content: 'Inspeksi dan perawatan rutin pada sistem kelistrikan dan plumbing untuk memastikan keamanan, mencegah korsleting atau kebocoran, dan menjaga efisiensi penggunaan energi dan air.'
                  },
                  {
                    id: 'perawatan-taman',
                    title: 'Perawatan dan Pemeliharaan Taman & Landscape',
                    content: 'Menjaga keindahan dan kesehatan area hijau properti Anda melalui layanan perawatan taman, pemangkasan, pemupukan, dan penataan lanskap secara berkala.'
                  },
                  {
                    id: 'kontrak-service',
                    title: 'Kontrak Service Tahunan Rumah/Gedung/Apartemen/Pabrik',
                    content: 'Solusi praktis dengan kontrak layanan tahunan yang mencakup semua kebutuhan pemeliharaan dan perbaikan properti Anda, memberikan ketenangan pikiran dan anggaran yang terkelola.'
                  }
                ]
            },
            {
                id: 'mep',
                label: 'MEP / Pabrikasi',
                title: 'Sistem Inti Bangunan Modern',
                description: 'Memastikan setiap bangunan berfungsi optimal dengan sistem Mekanikal, Elektrikal, dan Plumbing (MEP) yang andal serta pabrikasi baja kustom.',
                image: 'https://images.unsplash.com/photo-1555963962-9f6831d42858?q=80&w=2070&auto=format&fit=crop',
                accordions: [
                  {
                    id: 'instalasi-listrik',
                    title: 'Instalasi Listrik, Panel Kontrol, UPS',
                    content: 'Kami merancang dan memasang sistem kelistrikan yang andal, termasuk panel kontrol distribusi, dan Uninterruptible Power Supply (UPS) untuk menjamin pasokan listrik yang stabil dan aman bagi seluruh operasional bangunan.'
                  },
                  {
                    id: 'instalasi-plumbing',
                    title: 'Instalasi Plumbing',
                    content: 'Menyediakan layanan instalasi sistem plumbing yang komprehensif, mulai dari jalur air bersih, air kotor, hingga sistem pengolahan air (WTP) untuk memastikan distribusi dan pembuangan air yang efisien dan higienis.'
                  },
                  {
                    id: 'tata-udara',
                    title: 'Tata Udara (HVAC, ducting, chiller, exhaust fan)',
                    content: 'Merancang dan menginstal sistem tata udara (HVAC) yang optimal, mencakup pemasangan ducting, chiller, dan exhaust fan untuk menciptakan sirkulasi udara dan suhu yang nyaman di seluruh ruangan.'
                  },
                  {
                    id: 'fire-protection',
                    title: 'Fire Protection System (hydrant, sprinkler, alarm)',
                    content: 'Mengimplementasikan sistem proteksi kebakaran terintegrasi, termasuk instalasi hydrant, sprinkler, dan sistem alarm kebakaran (fire alarm) sesuai standar keselamatan untuk melindungi aset dan penghuni properti.'
                  },
                  {
                    id: 'pabrikasi-kustom',
                    title: 'Pabrikasi Pagar, Railing, Tangga, Kanopi, dll',
                    content: 'Layanan pabrikasi kustom untuk berbagai elemen arsitektural seperti pagar, railing, tangga besi, kanopi, dan konstruksi baja ringan lainnya dengan presisi tinggi dan hasil akhir yang estetis.'
                  }
                ]
            },
            {
                id: 'infrastruktur',
                label: 'Infrastruktur',
                title: 'Membangun Fondasi Komunitas',
                description: 'Kami mengerjakan proyek infrastruktur pendukung yang esensial untuk kawasan residensial maupun komersial, dengan standar rekayasa yang terjamin.',
                image: 'https://images.unsplash.com/photo-1618044732153-65955653b675?q=80&w=2070&auto=format&fit=crop',
                accordions: [
                  {
                    id: 'jalan-jembatan',
                    title: 'Pembangunan jalan & jembatan',
                    content: 'Konstruksi jalan raya, jalan lingkungan, dan jembatan dengan standar rekayasa yang kuat untuk memastikan konektivitas dan aksesibilitas yang andal.'
                  },
                  {
                    id: 'drainase-saluran',
                    title: 'Drainase, saluran air, box culvert',
                    content: 'Pembangunan sistem drainase terpadu, termasuk saluran air dan pemasangan box culvert, untuk manajemen aliran air yang efektif dan pencegahan banjir.'
                  },
                  {
                    id: 'paving-trotoar',
                    title: 'Paving block, trotoar, pedestrian way',
                    content: 'Pemasangan paving block dan pembangunan trotoar serta jalur pejalan kaki (pedestrian way) yang aman, nyaman, dan estetis untuk area publik dan perumahan.'
                  },
                  {
                    id: 'landscape-kawasan',
                    title: 'Landscape kawasan industri & perumahan',
                    content: 'Penataan lanskap untuk kawasan industri dan perumahan, menciptakan lingkungan yang hijau, teratur, dan meningkatkan kualitas visual serta nilai properti.'
                  },
                  {
                    id: 'sarana-umum',
                    title: 'Sarana umum: pasar, terminal, halte',
                    content: 'Pembangunan berbagai sarana umum seperti pasar tradisional atau modern, terminal transportasi, dan halte bus yang fungsional dan melayani kebutuhan masyarakat.'
                  },
                  {
                    id: 'site-development',
                    title: 'Pembangunan kawasan (site development)',
                    content: 'Pengembangan lahan secara menyeluruh (site development), mencakup pematangan lahan, pembangunan infrastruktur dasar, dan penataan kavling siap bangun.'
                  }
                ]
            },
            {
                id: 'interior',
                label: 'Interior / Eksterior',
                title: 'Sentuhan Akhir yang Sempurna',
                description: 'Menciptakan ruang yang menginspirasi dan fasad yang memukau, kami menggabungkan estetika dan fungsionalitas untuk detail akhir properti Anda.',
                image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=2070&auto=format&fit=crop',
                accordions: [
                  {
                    id: 'desain-build-interior',
                    title: 'Desain & Build Interior (Fit-Out)',
                    content: 'Kami menangani seluruh proses pengerjaan interior, mulai dari desain konsep, pemasangan plafon, partisi, lantai, hingga finishing dinding untuk menciptakan ruang yang fungsional dan estetis sesuai keinginan Anda.'
                  },
                  {
                    id: 'desain-build-eksterior',
                    title: 'Desain & Build Eksterior',
                    content: 'Mencakup pengerjaan fasad bangunan, taman (lansekap), pagar, dan elemen eksterior lainnya untuk memberikan tampilan luar yang menawan dan berkarakter.'
                  },
                  {
                    id: 'furniture',
                    title: 'Furniture',
                    content: 'Menyediakan layanan pembuatan furnitur kustom (custom furniture) seperti lemari, meja, rak, dan perabotan lainnya yang dirancang khusus untuk memaksimalkan fungsi dan estetika ruang Anda.'
                  },
                  {
                    id: 'kitchen-set',
                    title: 'Kitchen Set',
                    content: 'Spesialisasi dalam desain dan pembuatan kitchen set modern dan fungsional, menggunakan material berkualitas tinggi untuk menciptakan dapur impian yang efisien dan tahan lama.'
                  }
                ]
            },
            {
                id: 'smart',
                label: 'Smart Solutions',
                title: 'Hunian Cerdas untuk Masa Depan',
                description: 'Mengintegrasikan teknologi cerdas untuk meningkatkan efisiensi, keamanan, dan kenyamanan properti residensial dan komersial Anda.',
                image: 'https://images.unsplash.com/photo-1563297033-04a080843a41?q=80&w=2069&auto=format&fit=crop',
                accordions: [
                  {
                    id: 'solar-panel',
                    title: 'Solar Panel (on-grid, off-grid, hybrid)',
                    content: 'Kami menyediakan instalasi panel surya untuk berbagai kebutuhan, baik sistem on-grid yang terhubung ke PLN, off-grid untuk kemandirian energi, maupun hybrid yang menggabungkan keduanya untuk efisiensi maksimal dan pasokan listrik yang andal.'
                  },
                  {
                    id: 'ev-charging',
                    title: 'Charging Station EV (Motor & Mobil listrik)',
                    content: 'Mendukung transisi ke kendaraan listrik, kami menawarkan pemasangan stasiun pengisian daya (EV Charging Station) untuk motor dan mobil listrik di properti residensial maupun komersial, dengan berbagai pilihan daya sesuai kebutuhan.'
                  },
                  {
                    id: 'smart-home-automation',
                    title: 'Smart Home (lampu otomatis, CCTV, smart door lock)',
                    content: 'Mengintegrasikan perangkat pintar di rumah Anda, mulai dari sistem pencahayaan dan tirai otomatis, pemantauan CCTV canggih, hingga kunci pintu pintar (smart door lock) yang dapat diakses dari mana saja untuk keamanan dan kenyamanan.'
                  },
                  {
                    id: 'smart-building',
                    title: 'Smart Building System (BMS, IoT monitoring)',
                    content: 'Implementasi Building Management System (BMS) dan monitoring berbasis Internet of Things (IoT) untuk mengelola dan mengoptimalkan fungsi gedung secara terpusat, mulai dari HVAC, kelistrikan, hingga keamanan.'
                  },
                  {
                    id: 'smart-greenhouse',
                    title: 'Smart Greenhouse & Landscape Digital',
                    content: 'Solusi cerdas untuk pertanian modern dan lanskap, termasuk greenhouse otomatis yang mengontrol suhu dan irigasi, serta sistem penyiraman taman digital yang efisien untuk menjaga keindahan area hijau Anda.'
                  },
                  {
                    id: 'energy-efficiency',
                    title: 'Energy Efficiency & Retrofitting Gedung Lama',
                    content: 'Layanan audit energi dan retrofitting untuk bangunan lama, bertujuan meningkatkan efisiensi penggunaan energi melalui pembaruan sistem MEP, pencahayaan, dan insulasi untuk mengurangi biaya operasional dan jejak karbon.'
                  }
                ]
            },
        ]
    },
    whyUs: {
        sectionTitle: "Kenapa Harus BSK?",
        sectionSubtitle: "Temukan keunggulan kami dalam mewujudkan proyek konstruksi impian Anda dengan standar kualitas dan profesionalisme tertinggi.",
        features: [
            {
                title: "Kualitas Terjamin & Profesional",
                description: "Kami menggunakan material terbaik, tenaga kerja terampil, dan manajemen proyek yang profesional untuk memastikan hasil akhir yang superior dan tahan lama.",
                image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop"
            },
            {
                title: "Transparansi Anggaran & Tepat Waktu",
                description: "Dengan Rencana Anggaran Biaya (RAB) yang detail dan transparan, kami berkomitmen untuk menyelesaikan setiap proyek sesuai jadwal dan anggaran yang disepakati.",
                image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2130&auto=format&fit=crop"
            },
            {
                title: "Solusi Konstruksi Terintegrasi",
                description: "Layanan kami mencakup semua tahapan, mulai dari konsultasi desain, konstruksi, MEP, hingga interior, memberikan Anda kemudahan solusi satu atap.",
                image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2070&auto=format&fit=crop"
            }
        ],
        businessTypesTitle: "Didukung oleh Brand dan Distributor Ternama",
        businessTypes: [
            { icon: "https://i.imgur.com/w8qXhP9.png", label: "Holcim" },
            { icon: "https://i.imgur.com/8p5YJ0x.png", label: "TOTO" },
            { icon: "https://i.imgur.com/zVqJT2L.png", label: "Nippon Paint" },
            { icon: "https://i.imgur.com/sSg1g7P.png", label: "Jayamix" },
            { icon: "https://i.imgur.com/Y3WfN07.png", label: "Schneider" },
            { icon: "https://i.imgur.com/o2kZ56A.png", label: "Roman Granit" },
            { icon: "https://i.imgur.com/d9jYj6v.png", label: "Semen Tiga Roda" },
            { icon: "https://i.imgur.com/eK9i9tA.png", label: "Dulux" }
        ]
    },
    portfolio: {
        title: "Portofolio Proyek Kami",
        paragraph: "Jelajahi berbagai proyek yang telah berhasil kami selesaikan, menunjukkan komitmen kami terhadap kualitas, inovasi, dan kepuasan klien di berbagai sektor.",
        filters: ["Semua", "Hunian", "Komersial", "Industri", "Renovasi"],
        projects: [
            { id: 1, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop", title: "Villa Modern di Bali", category: "Hunian" },
            { id: 2, image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop", title: "Gedung Perkantoran Jakarta", category: "Komersial" },
            { id: 3, image: "https://images.unsplash.com/photo-1570129477492-45c003edd2e7?q=80&w=2070&auto=format&fit=crop", title: "Renovasi Rumah Klasik", category: "Renovasi" },
            { id: 4, image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop", title: "Rumah Minimalis Suburban", category: "Hunian" },
            { id: 5, image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=2070&auto=format&fit=crop", title: "Pabrik Manufaktur Cikarang", category: "Industri" },
            { id: 6, image: "https://images.unsplash.com/photo-1556761175-b413da4b248a?q=80&w=1974&auto=format&fit=crop", title: "Ruko Multifungsi", category: "Komersial" }
        ]
    },
    ctaSlider: [
        {
            type: 'download',
            title: "Download Profil Perusahaan BSK",
            paragraph: "Lihat profil perusahaan untuk mendapatkan informasi terbaru dan penawaran dari BSK Konstruksi.",
            image: "https://i.imgur.com/g8f3A8s.png",
            buttonText: "Unduh Proposal",
            fileUrl: "/BSK-Company-Profile.pdf"
        },
        {
            type: 'partner',
            title: "Jadi Mitra Bisnis BSK",
            paragraph: "Bergabunglah dengan jaringan kami dan raih kesuksesan bersama. Kami membuka peluang kemitraan untuk distributor, sub-kontraktor, dan para profesional.",
            image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2130&auto=format&fit=crop",
            buttonText: "Hubungi Kami",
            ctaUrl: `https://wa.me/6282246934495?text=${encodeURIComponent('Halo, saya tertarik untuk menjadi mitra bisnis BSK.')}`
        }
    ],
    faq: {
        title: "Pertanyaan Umum",
        items: [
            {
                id: 'faq1',
                question: 'Berapa biaya yang harus saya keluarkan untuk menggunakan jasa BSK?',
                answer: 'Biaya sangat bervariasi tergantung pada jenis proyek, luas, dan kualitas material. Gunakan Simulasi Biaya kami untuk perkiraan awal atau hubungi kami untuk penawaran detail.'
            },
            {
                id: 'faq2',
                question: 'Apakah BSK melayani proyek di luar Jabodetabek?',
                answer: 'Ya, kami melayani proyek di berbagai lokasi. Silakan hubungi tim kami untuk mendiskusikan detail proyek Anda di luar area Jabodetabek.'
            },
            {
                id: 'faq3',
                question: 'Bagaimana cara memulai proyek dengan BSK?',
                answer: 'Cukup hubungi kami melalui telepon atau email untuk menjadwalkan konsultasi awal gratis. Tim kami akan memandu Anda melalui langkah-langkah selanjutnya.'
            },
            {
                id: 'faq4',
                question: 'Apa yang membedakan BSK dengan kontraktor lain?',
                answer: 'Kami menawarkan solusi terintegrasi, transparansi anggaran, kualitas terjamin, dan komitmen pada ketepatan waktu. Kami adalah partner Anda dari konsep hingga realisasi.'
            },
            {
                id: 'faq5',
                question: 'Di mana saya bisa melihat portofolio proyek BSK?',
                answer: 'Anda dapat melihat portofolio lengkap kami di halaman Portofolio di website ini. Kami menampilkan berbagai proyek hunian, komersial, dan industri yang telah kami selesaikan.'
            },
            {
                id: 'faq6',
                question: 'Apakah BSK memberikan garansi untuk pekerjaannya?',
                answer: 'Tentu. Kami memberikan garansi untuk pekerjaan konstruksi kami. Detail garansi akan dijelaskan dalam kontrak kerja sama untuk menjamin kepuasan Anda.'
            },
            {
                id: 'faq7',
                question: 'Berapa lama waktu yang dibutuhkan untuk sebuah proyek konstruksi?',
                answer: 'Durasi proyek sangat bergantung pada skala dan kompleksitasnya. Setelah konsultasi dan perencanaan, kami akan memberikan estimasi jadwal pengerjaan yang realistis.'
            }
        ]
    },
    tipsAndNews: {
        title: 'Wawasan & Berita',
        posts: [
            {
                image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2070&auto=format&fit=crop',
                title: 'Konstruksi Berkelanjutan: Masa Depan Lebih Hijau',
                date: 'MEI 15, 2024',
                comments: 5,
                description: `Jelajahi tren bangunan ramah lingkungan, mulai dari panel surya hingga material daur ulang, dan bagaimana kami dapat membantu Anda menciptakan hunian hemat energi.
Konstruksi berkelanjutan bukan lagi sekadar pilihan, melainkan sebuah keharusan. Di tengah isu perubahan iklim dan menipisnya sumber daya alam, industri konstruksi dituntut untuk berinovasi menuju praktik yang lebih ramah lingkungan. Konsep ini mencakup seluruh siklus hidup bangunan, mulai dari pemilihan material, proses konstruksi, operasional, hingga dekonstruksi.
Salah satu pilar utama konstruksi hijau adalah efisiensi energi. Pemasangan panel surya menjadi solusi populer untuk mengurangi ketergantungan pada energi fosil. Selain itu, desain bangunan yang memaksimalkan pencahayaan alami dan ventilasi silang dapat secara signifikan menekan biaya listrik. Kami di BSK Construction memiliki keahlian dalam mengintegrasikan sistem panel surya dan desain pasif untuk menciptakan hunian yang tidak hanya nyaman tetapi juga hemat biaya operasional.`
            },
            {
                image: 'https://images.unsplash.com/photo-1606788283756-05b63b213b86?q=80&w=2070&auto=format&fit=crop',
                title: 'Integrasi Smart Home: Wujudkan Hunian Cerdas',
                date: 'APRIL 28, 2024',
                comments: 8,
                description: `Dari pencahayaan otomatis hingga keamanan canggih, pelajari bagaimana teknologi smart home dapat meningkatkan kualitas hidup dalam proyek desain dan bangun kami.
Teknologi rumah pintar (smart home) telah mengubah cara kita berinteraksi dengan tempat tinggal. Integrasi sistem ini memungkinkan kontrol perangkat elektronik, pencahayaan, suhu, hingga sistem keamanan melalui satu perangkat pintar. Bayangkan Anda dapat mematikan semua lampu, mengunci pintu, dan mengatur alarm hanya dengan satu sentuhan di ponsel Anda sebelum tidur.
Kenyamanan bukan satu-satunya keuntungan. Sistem smart home juga berkontribusi pada efisiensi energi. Sensor gerak dapat mematikan lampu di ruangan kosong, dan termostat pintar dapat menyesuaikan suhu secara otomatis sesuai dengan kebiasaan penghuni. Di BSK Construction, kami membantu klien merancang dan mengimplementasikan solusi smart home yang disesuaikan dengan kebutuhan dan gaya hidup mereka.`
            },
            {
                image: 'https://images.unsplash.com/photo-1628177142042-a0dc5c1753c1?q=80&w=1964&auto=format&fit=crop',
                title: 'Pentingnya Sistem WTP untuk Air Bersih',
                date: 'APRIL 10, 2024',
                comments: 3,
                description: `Pahami mengapa Water Treatment Plant (WTP) menjadi investasi krusial untuk properti komersial dan residensial demi menjamin pasokan air bersih dan aman.
Akses terhadap air bersih adalah hak dasar dan komponen vital bagi kesehatan. Sistem Water Treatment Plant (WTP) atau Instalasi Pengolahan Air (IPA) memainkan peran penting dalam memastikan kualitas air yang kita konsumsi. Baik untuk skala besar seperti kompleks perumahan maupun skala kecil untuk satu rumah, WTP berfungsi untuk menyaring dan memurnikan air dari kontaminan berbahaya.
Investasi pada sistem WTP tidak hanya melindungi kesehatan penghuni tetapi juga menjaga umur pakai peralatan rumah tangga seperti pemanas air dan mesin cuci dari kerusakan akibat air sadah atau korosif. Tim ahli kami dapat merancang dan memasang sistem WTP yang efisien dan andal untuk berbagai jenis properti, memastikan pasokan air yang aman dan berkualitas.`
            },
            {
                image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2127&auto=format&fit=crop',
                title: 'Tren Desain Interior 2024: Ruang Multifungsi',
                date: 'MARET 22, 2024',
                comments: 12,
                description: `Dapatkan inspirasi dari tren desain interior terkini. Maksimalkan ruang dengan konsep multifungsi dan sentuhan material alami untuk suasana modern.
Tren desain interior tahun 2024 berfokus pada fleksibilitas dan koneksi dengan alam. Ruang multifungsi menjadi kunci, terutama di hunian perkotaan yang lahannya terbatas. Area kerja yang dapat disembunyikan, perabotan modular, dan partisi fleksibel adalah beberapa contoh penerapan konsep ini. Tujuannya adalah menciptakan ruang yang dapat beradaptasi dengan berbagai aktivitas, dari bekerja hingga bersantai.
Selain itu, penggunaan material alami seperti kayu, batu, dan tanaman hias semakin diminati untuk menciptakan suasana yang tenang dan menyegarkan. Palet warna netral yang hangat dengan aksen warna alam (hijau zaitun, biru laut) juga mendominasi tren. Biarkan tim desainer interior kami membantu Anda menciptakan ruang yang tidak hanya indah tetapi juga fungsional dan sesuai dengan tren terkini.`
            },
             {
                image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop',
                title: 'Panduan Renovasi Sukses: Dari Perencanaan Hingga Hasil',
                date: 'FEBRUARI 19, 2024',
                comments: 7,
                description: `Kami membagikan langkah-langkah kunci untuk memastikan proyek renovasi Anda berjalan lancar, sesuai anggaran, dan selesai tepat waktu dengan hasil memuaskan.
Merencanakan renovasi bisa menjadi proses yang menantang. Kunci kesuksesan terletak pada perencanaan yang matang. Langkah pertama adalah menentukan tujuan dan ruang lingkup renovasi secara jelas. Apakah Anda ingin menambah ruang, memperbarui tampilan, atau meningkatkan fungsionalitas? Setelah itu, tetapkan anggaran yang realistis, dengan menyisihkan dana darurat sekitar 10-15% dari total biaya.
Langkah selanjutnya adalah memilih kontraktor yang tepat. Pastikan Anda bekerja dengan tim profesional yang memiliki rekam jejak terbukti seperti BSK Construction. Komunikasi yang terbuka selama proses renovasi sangat penting untuk menghindari kesalahpahaman. Dengan perencanaan yang baik dan eksekusi yang profesional, Anda dapat mengubah rumah Anda menjadi ruang impian yang memuaskan.`
            },
        ]
    },
    clients: {
        title: 'Klien Kami',
        logos: [
            { src: 'https://i.imgur.com/gO3mH8q.png', alt: 'Klien 1' },
            { src: 'https://i.imgur.com/gO3mH8q.png', alt: 'Klien 2' },
            { src: 'https://i.imgur.com/gO3mH8q.png', alt: 'Klien 3' },
            { src: 'https://i.imgur.com/gO3mH8q.png', alt: 'Klien 4' },
            { src: 'https://i.imgur.com/gO3mH8q.png', alt: 'Klien 5' },
        ]
    },
    footer: {
      companyName: 'PT. Baari Salam Konstruksi',
      about: 'Kami percaya setiap bangunan memiliki cerita. Dengan tim profesional yang berdedikasi, kami hadir untuk membangun cerita Anda melalui layanan dan keahlian konstruksi yang tak tertandingi.',
      services: [
        { text: 'Konsultasi / Desain', href: 'konsultasi' },
        { text: 'Bangun / Renovasi', href: 'konstruksi' },
        { text: 'Repair Maintenance', href: 'repair' },
        { text: 'MEP / Pabrikasi', href: 'mep' },
        { text: 'Infrastruktur', href: 'infrastruktur' },
        { text: 'Interior / Eksterior', href: 'interior' },
        { text: 'Smart Solutions', href: 'smart' }
      ],
      address: 'Perum D\'Nine Residence Blok I No. 15 Desa Kalijaya, Kec. Cikarang Barat Kab. Bekasi, Jawa Barat',
      phone: '+62 822-4693-4495',
      email: 'baarisalam.konstruksi@gmail.com',
      hours: 'Sen - Sab : 08.00 - 17.00',
      subFooter: {
        privacyPolicy: { text: 'Kebijakan Privasi', href: '#' },
        copyright: '© 2025 PT. Baari Salam Konstruksi. Hak Cipta Dilindungi.',
        links: [
            { text: 'Tentang Kami', href: '#' },
            { text: 'Rincian Harga', href: '#' },
            { text: 'Hubungi Kami', href: '#' }
        ]
      }
    },
    allServicesPage: {
        hero: {
            title: 'Layanan Konstruksi Komprehensif',
            backgroundImage: 'https://images.unsplash.com/photo-1533088523199-905d45543336?q=80&w=2070&auto=format&fit=crop',
        },
        intro: {
            title: 'Solusi Terintegrasi untuk Setiap Kebutuhan',
            paragraph: 'Di BSK, kami menawarkan spektrum layanan yang lengkap untuk menangani setiap aspek proyek Anda, dari konsep awal hingga penyelesaian akhir. Tim ahli kami berdedikasi untuk memberikan keunggulan, inovasi, dan kualitas dalam setiap layanan yang kami tawarkan, memastikan visi Anda terwujud dengan sempurna.',
        },
        services: [
             {
                id: 'konsultasi-desain',
                title: 'Konsultasi & Desain',
                description: 'Setiap proyek hebat dimulai dengan rencana yang solid. Layanan konsultasi dan desain kami adalah fondasi Anda untuk sukses, menggabungkan visi kreatif dengan kelayakan teknis untuk menciptakan cetak biru yang fungsional, estetis, dan sesuai anggaran.',
                image: 'https://images.unsplash.com/photo-1542382257-80ded14b0a39?q=80&w=2070&auto=format&fit=crop',
                offerings: [
                    'Desain Arsitektur & Konseptual',
                    'Desain Interior & Visualisasi 3D',
                    'Perancangan Struktur & Engineering',
                    'Desain Mekanikal, Elektrikal, & Plumbing (MEP)',
                    'Perencanaan Anggaran Biaya (RAB) & Pengurusan Izin',
                ],
            },
            {
                id: 'bangun-renovasi',
                title: 'Bangun / Renovasi',
                description: 'Kami mengubah visi Anda menjadi struktur nyata. Dengan fokus pada kualitas, ketepatan waktu, dan manajemen anggaran yang cermat, kami menangani proyek konstruksi baru dan renovasi skala besar dengan keahlian tak tertandingi.',
                image: 'https://images.unsplash.com/photo-1519995451813-39e21b0e56aa?q=80&w=2070&auto=format&fit=crop',
                offerings: [
                    'Pembangunan Rumah Tinggal & Villa',
                    'Konstruksi Gedung Komersial (Ruko, Kantor)',
                    'Pembangunan Fasilitas Industri (Gudang, Pabrik)',
                    'Renovasi Total & Sebagian Properti',
                    'Pekerjaan Struktur & Arsitektural',
                ],
            },
            {
                id: 'repair-maintenance',
                title: 'Repair & Maintenance',
                description: 'Menjaga nilai dan fungsionalitas properti Anda adalah prioritas kami. Layanan perbaikan dan pemeliharaan kami dirancang untuk mengatasi masalah secara proaktif dan efisien, memastikan aset Anda tetap dalam kondisi prima.',
                image: 'https://images.unsplash.com/photo-1581092918056-0c9c7e52a413?q=80&w=2070&auto=format&fit=crop',
                offerings: [
                    'Perbaikan Struktural & Sipil',
                    'Perbaikan Atap & Pencegahan Kebocoran',
                    'Pengecatan Ulang Eksterior & Interior',
                    'Perawatan & Perbaikan Sistem Plumbing',
                    'Layanan Pemeliharaan Properti Berkala',
                ],
            },
            {
                id: 'mep-pabrikasi',
                title: 'MEP & Pabrikasi',
                description: 'Inti dari setiap bangunan modern adalah sistem Mekanikal, Elektrikal, dan Plumbing (MEP) yang andal. Kami merancang, memasang, dan memelihara sistem MEP yang efisien, serta menyediakan layanan pabrikasi khusus untuk memenuhi kebutuhan unik proyek.',
                image: 'https://images.unsplash.com/photo-1555963962-9f6831d42858?q=80&w=2070&auto=format&fit=crop',
                offerings: [
                    'Instalasi Sistem Listrik & Panel',
                    'Sistem Tata Udara (HVAC)',
                    'Instalasi Plumbing & Water Treatment Plant (WTP)',
                    'Sistem Proteksi Kebakaran',
                    'Pabrikasi Baja & Pekerjaan Las Kustom',
                ],
            },
            {
                id: 'infrastruktur',
                title: 'Infrastruktur',
                description: 'Membangun fondasi untuk masa depan, kami menangani proyek infrastruktur yang mendukung pertumbuhan komunitas dan bisnis. Dari pekerjaan jalan hingga sistem drainase, kami menerapkan standar rekayasa tertinggi untuk hasil yang tahan lama.',
                image: 'https://images.unsplash.com/photo-1618044732153-65955653b675?q=80&w=2070&auto=format&fit=crop',
                offerings: [
                    'Pekerjaan Jalan & Pengaspalan',
                    'Konstruksi Saluran Drainase & Gorong-gorong',
                    'Pekerjaan Pematangan Lahan (Cut & Fill)',
                    'Pemasangan Paving Block & Kanstin',
                    'Pembangunan Pagar & Dinding Penahan',
                ],
            },
            {
                id: 'interior-eksterior',
                title: 'Interior & Eksterior',
                description: 'Estetika bertemu fungsionalitas dalam layanan desain dan pengerjaan interior dan eksterior kami. Kami menciptakan ruang yang menginspirasi dan fasad yang memukau, merefleksikan identitas unik Anda atau merek Anda.',
                image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=2070&auto=format&fit=crop',
                offerings: [
                    'Pengerjaan Interior (Fit-Out)',
                    'Desain & Pembuatan Furnitur Kustom',
                    'Pemasangan Plafon & Partisi',
                    'Pekerjaan Fasad & Eksterior',
                    'Desain & Penataan Lansekap',
                ],
            },
            {
                id: 'smart-solutions',
                title: 'Smart Solutions',
                description: 'Integrasikan teknologi cerdas ke dalam properti Anda untuk meningkatkan kenyamanan, keamanan, dan efisiensi. Kami menyediakan solusi otomasi dan sistem keamanan canggih untuk hunian dan bisnis modern.',
                image: 'https://images.unsplash.com/photo-1563297033-04a080843a41?q=80&w=2069&auto=format&fit=crop',
                offerings: [
                    'Instalasi Sistem Smart Home',
                    'Otomasi Pencahayaan, Tirai, & AC',
                    'Instalasi CCTV & Sistem Keamanan',
                    'Sistem Akses Kontrol Pintu',
                    'Integrasi Perangkat Cerdas',
                ],
            }
        ],
        cta: {
            title: 'Punya Proyek dalam Pikiran?',
            buttonText: 'Mulai Percakapan'
        }
    },
    designServicePage: {
        hero: {
            title: 'Layanan Desain Arsitektur',
            backgroundImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2070&auto=format&fit=crop',
        },
        about: {
            title: 'Dari Konsep Menjadi Kenyataan',
            paragraph1: 'Di BSK, kami percaya bahwa desain yang hebat adalah fondasi dari setiap bangunan yang luar biasa. Tim arsitek dan desainer kami berkolaborasi untuk mengubah visi Anda menjadi cetak biru yang fungsional, estetis, dan berkelanjutan.',
            paragraph2: 'Kami menggabungkan kreativitas dengan keahlian teknis untuk menciptakan ruang yang tidak hanya indah secara visual tetapi juga efisien dan sesuai dengan kebutuhan gaya hidup atau bisnis Anda. Proses kami yang terperinci memastikan setiap detail dipertimbangkan dengan cermat.',
            image: 'https://images.unsplash.com/photo-1542382257-80ded14b0a39?q=80&w=2070&auto=format&fit=crop',
        },
        offerings: {
            title: 'Apa yang Kami Tawarkan',
            items: [
                { icon: 'Architect', title: 'Desain Arsitektur', description: 'Perancangan konsep bangunan dari awal hingga detail fasad, memastikan estetika dan fungsionalitas.' },
                { icon: 'Structure', title: 'Desain Struktur', description: 'Perhitungan dan perancangan struktur yang kokoh dan efisien untuk menjamin keamanan bangunan.' },
                { icon: 'MEP', title: 'Desain MEP', description: 'Perancangan sistem Mekanikal, Elektrikal, dan Plumbing yang terintegrasi dan efisien.' },
                { icon: 'Interior', title: 'Desain Interior', description: 'Menciptakan ruang interior yang fungsional, nyaman, dan sesuai dengan identitas Anda.' },
                { icon: '3D', title: 'Visualisasi 3D', description: 'Memberikan gambaran realistis dari desain melalui model dan render 3D berkualitas tinggi.' },
                { icon: 'Budget', title: 'Rencana Anggaran Biaya', description: 'Menyusun estimasi biaya (RAB) yang detail dan transparan untuk perencanaan anggaran yang akurat.' },
                { icon: 'Identification', title: 'Pengurusan Izin (IMB/PBG)', description: 'Membantu proses pengurusan izin konstruksi seperti IMB/PBG untuk memastikan proyek Anda sesuai dengan regulasi yang berlaku.' },
            ]
        },
        process: {
            title: 'Proses Desain Kami',
            steps: [
                { step: '01', title: 'Konsultasi', description: 'Memahami visi, kebutuhan, dan anggaran Anda.' },
                { step: '02', title: 'Konsep', description: 'Mengembangkan ide-ide awal dan sketsa desain.' },
                { step: '03', title: 'Pengembangan', description: 'Detailing desain, pemilihan material, dan gambar kerja.' },
                { step: '04', title: 'Dokumentasi', description: 'Menyiapkan semua dokumen teknis dan perizinan.' },
                { step: '05', title: 'Realisasi', description: 'Mengawasi proses konstruksi sesuai dengan desain.' },
            ]
        },
        cta: {
            title: 'Siap Mewujudkan Visi Anda?',
            buttonText: 'Hubungi Tim Desain Kami',
        }
    },
    costSimulatorPage: {
        hero: {
            title: 'Kalkulator Proyek Impian Anda',
            subtitle: 'Dapatkan estimasi biaya instan untuk proyek konstruksi dan renovasi Anda hanya dalam beberapa langkah.',
            backgroundImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop',
        },
        intro: {
            title: 'Rencanakan Anggaran Anda',
            paragraph: 'Gunakan kalkulator sederhana kami untuk mendapatkan estimasi biaya awal pembangunan atau renovasi properti Anda. Hasil ini merupakan perkiraan dan dapat bervariasi tergantung pada detail spesifik dan material yang digunakan.',
        },
        form: {
            title: 'Detail Proyek Anda',
            propertyTypeLabel: 'Jenis Properti',
            propertyTypeOptions: ['Rumah Tinggal', 'Ruko / Rukan', 'Gedung Kantor', 'Gudang / Pabrik'],
            workTypeLabel: 'Jenis Pekerjaan',
            workTypeOptions: ['Bangun Baru', 'Renovasi Total', 'Renovasi Sebagian'],
            areaLabel: 'Luas Bangunan (m²)',
            areaPlaceholder: 'Contoh: 100',
            qualityLabel: 'Kualitas Material',
            qualityOptions: [
                { title: 'Standar', description: 'Material berkualitas baik, fungsional, dengan harga terjangkau.' },
                { title: 'Menengah', description: 'Kombinasi material premium dan standar untuk hasil dan daya tahan lebih baik.' },
                { title: 'Premium', description: 'Material kelas atas untuk hasil mewah, estetika tinggi, dan daya tahan maksimal.' }
            ],
            buttonText: 'Hitung Estimasi Biaya',
        },
        results: {
            title: 'Estimasi Biaya Proyek Anda',
            disclaimer: '*Perkiraan ini adalah rentang biaya kasar dan tidak termasuk PPN, biaya perizinan, furnitur, dan pekerjaan lansekap. Hubungi kami untuk mendapatkan RAB (Rencana Anggaran Biaya) yang lebih detail dan akurat.',
            ctaButtonText: 'Dapatkan Penawaran Detail',
        },
        calculatorSteps: [
            {
                id: 'konsultasi',
                label: 'Konsultasi / Desain',
                icon: 'PencilSquare',
                description: 'Perencanaan awal, desain arsitektur, visualisasi 3D, hingga pengurusan izin.',
                subServices: [
                    { id: 'desain-2d', label: 'Desain 2D (Denah, Tampak, Potongan)', unit: 'm²', price: 75000, fields: [{ id: 'luas', label: 'Luas Bangunan (m²)', type: 'numeric', placeholder: 'Contoh: 100' }] },
                    { id: 'desain-3d', label: 'Desain 3D Modelling', unit: 'm²', price: 100000, fields: [{ id: 'luas', label: 'Luas Bangunan (m²)', type: 'numeric', placeholder: 'Contoh: 100' }] },
                    { id: 'rendering-3d', label: 'Rendering 3D', unit: 'view', price: 750000, fields: [{ id: 'jumlah', label: 'Jumlah View', type: 'numeric', placeholder: 'Contoh: 5' }] },
                    { id: 'video-rendering', label: 'Video Rendering', unit: 'menit', price: 2000000, fields: [{ id: 'durasi', label: 'Durasi Video (menit)', type: 'numeric', placeholder: 'Contoh: 2' }] },
                    { id: 'perhitungan-struktur', label: 'Perhitungan Struktur', unit: 'm²', price: 50000, fields: [{ id: 'luas', label: 'Luas Bangunan (m²)', type: 'numeric', placeholder: 'Contoh: 100' }] },
                    { id: 'pembuatan-rab', label: 'Pembuatan RAB', unit: 'paket', price: 1500000, fields: [{ id: 'luas', label: 'Luas Bangunan (m²)', type: 'numeric', placeholder: 'Contoh: 100' }] },
                    { id: 'perizinan', label: 'Perizinan (IMB/PBG)', unit: 'paket', price: 7500000, fields: [{ id: 'jenis_izin', label: 'Jenis Izin', type: 'select', options: ['Rumah Tinggal', 'Ruko/Komersial'] }] },
                ]
            },
            {
                id: 'konstruksi',
                label: 'Bangun / Renovasi',
                icon: 'BuildingOffice',
                description: 'Pembangunan baru atau renovasi total/sebagian untuk rumah, ruko, dan properti lainnya.',
                subServices: [
                    { id: 'bangun-rumah', label: 'Bangun Rumah', unit: 'm²', price: { 'Standar': 4000000, 'Menengah': 5000000, 'Premium': 6500000 }, fields: [{ id: 'luas', label: 'Luas Bangunan (m²)', type: 'numeric', placeholder: 'Contoh: 150' }] },
                    { id: 'bangun-ruko', label: 'Bangun Ruko / Komersial', unit: 'm²', price: { 'Standar': 3500000, 'Menengah': 4500000, 'Premium': 5500000 }, fields: [{ id: 'luas', label: 'Luas Bangunan (m²)', type: 'numeric', placeholder: 'Contoh: 200' }] },
                    { id: 'renovasi-total', label: 'Renovasi Total', unit: 'm²', price: { 'Standar': 3000000, 'Menengah': 3800000, 'Premium': 5000000 }, fields: [{ id: 'luas', label: 'Luas Renovasi (m²)', type: 'numeric', placeholder: 'Contoh: 80' }] },
                    { 
                        id: 'renovasi-sebagian', 
                        label: 'Renovasi Sebagian',
                        subDetails: [
                            { id: 'pengecatan-dinding', label: 'Pengecatan Ulang Dinding', unit: 'm²', price: { 'Standar': 65000, 'Menengah': 85000, 'Premium': 110000 }, fields: [{ id: 'luas', label: 'Luas Pengecatan (m²)', type: 'numeric', placeholder: 'Contoh: 100' }] },
                            { id: 'perbaikan-atap-bocor', label: 'Perbaikan Atap Bocor', unit: 'm²', price: { 'Standar': 150000, 'Menengah': 200000, 'Premium': 275000 }, fields: [{ id: 'luas', label: 'Luas Area Perbaikan (m²)', type: 'numeric', placeholder: 'Contoh: 20' }] },
                            { id: 'ganti-keramik', label: 'Ganti Lantai Keramik', unit: 'm²', price: { 'Standar': 250000, 'Menengah': 400000, 'Premium': 650000 }, fields: [{ id: 'luas', label: 'Luas Area Lantai (m²)', type: 'numeric', placeholder: 'Contoh: 30' }] },
                        ]
                    },
                ]
            },
            {
                id: 'repair',
                label: 'Repair & Maintenance',
                icon: 'WrenchScrewdriver',
                description: 'Perbaikan, servis rutin, dan pemeliharaan properti untuk menjaga kondisi prima.',
                subServices: [
                    { id: 'pengecatan', label: 'Pengecatan Ulang', unit: 'm²', price: { 'Standar': 65000, 'Menengah': 85000, 'Premium': 110000 }, fields: [{ id: 'luas', label: 'Luas Pengecatan (m²)', type: 'numeric', placeholder: 'Contoh: 100' }] },
                    { id: 'perbaikan-atap', label: 'Perbaikan Atap Bocor', unit: 'm²', price: { 'Standar': 150000, 'Menengah': 200000, 'Premium': 275000 }, fields: [{ id: 'luas', label: 'Luas Area Perbaikan (m²)', type: 'numeric', placeholder: 'Contoh: 20' }] },
                    { id: 'servis-ac', label: 'Servis AC', unit: 'unit', price: 200000, fields: [{ id: 'jumlah', label: 'Jumlah Unit AC', type: 'numeric', placeholder: 'Contoh: 3' }] },
                    { id: 'kontrak-maintenance', label: 'Kontrak Maintenance Tahunan', unit: 'paket', price: 5000000, fields: [{ id: 'luas', label: 'Luas Bangunan (m²)', type: 'numeric', placeholder: 'Contoh: 200' }] },
                ]
            },
            {
                id: 'mep',
                label: 'MEP & Pabrikasi',
                icon: 'MEP',
                description: 'Instalasi sistem Mekanikal, Elektrikal, Plumbing, dan proteksi kebakaran.',
                subServices: [
                    { id: 'instalasi-listrik', label: 'Instalasi Listrik', unit: 'titik', price: 450000, fields: [{ id: 'jumlah', label: 'Jumlah Titik', type: 'numeric', placeholder: 'Contoh: 25' }] },
                    { id: 'instalasi-plumbing', label: 'Instalasi Plumbing (Air Bersih/Kotor)', unit: 'titik', price: 600000, fields: [{ id: 'jumlah', label: 'Jumlah Titik', type: 'numeric', placeholder: 'Contoh: 10' }] },
                    { id: 'instalasi-ac', label: 'Instalasi AC Split', unit: 'unit', price: 750000, fields: [{ id: 'jumlah', label: 'Jumlah Unit', type: 'numeric', placeholder: 'Contoh: 3' }] },
                    { id: 'instalasi-sprinkler', label: 'Instalasi Fire Sprinkler', unit: 'titik', price: 1200000, fields: [{ id: 'jumlah', label: 'Jumlah Titik Sprinkler', type: 'numeric', placeholder: 'Contoh: 15' }] },
                    { 
                        id: 'pabrikasi-kustom', 
                        label: 'Pabrikasi Pagar, Railing, Tangga, Kanopi, dll',
                        subDetails: [
                            { id: 'pabrikasi-pagar', label: 'Pabrikasi Pagar Besi Hollow', unit: 'm²', price: { 'Standar': 850000, 'Menengah': 1100000, 'Premium': 1500000 }, fields: [{ id: 'luas', label: 'Luas Pagar (m²)', type: 'numeric', placeholder: 'Contoh: 15' }] },
                            { id: 'pabrikasi-railing', label: 'Pabrikasi Railing Tangga', unit: 'm lari', price: { 'Standar': 700000, 'Menengah': 900000, 'Premium': 1200000 }, fields: [{ id: 'panjang', label: 'Panjang Railing (m lari)', type: 'numeric', placeholder: 'Contoh: 10' }] },
                            { id: 'pabrikasi-kanopi', label: 'Pabrikasi Kanopi Baja Ringan', unit: 'm²', price: { 'Standar': 900000, 'Menengah': 1200000, 'Premium': 1600000 }, fields: [{ id: 'luas', label: 'Luas Kanopi (m²)', type: 'numeric', placeholder: 'Contoh: 20' }] },
                        ]
                    },
                ]
            },
            {
                id: 'infrastruktur',
                label: 'Infrastruktur',
                icon: 'Road',
                description: 'Pembangunan akses jalan, sistem drainase, dan penataan kawasan.',
                subServices: [
                    { id: 'jalan-aspal', label: 'Pembangunan Jalan Aspal', unit: 'm²', price: { 'Standar': 250000, 'Menengah': 325000, 'Premium': 400000 }, fields: [{ id: 'luas', label: 'Luas Jalan (m²)', type: 'numeric', placeholder: 'Contoh: 500' }] },
                    { id: 'paving-block', label: 'Pemasangan Paving Block', unit: 'm²', price: { 'Standar': 180000, 'Menengah': 220000, 'Premium': 270000 }, fields: [{ id: 'luas', label: 'Luas Area (m²)', type: 'numeric', placeholder: 'Contoh: 300' }] },
                    { id: 'drainase', label: 'Saluran Drainase (U-Ditch)', unit: 'meter', price: 500000, fields: [{ id: 'panjang', label: 'Panjang Saluran (meter)', type: 'numeric', placeholder: 'Contoh: 100' }] },
                ]
            },
            {
                id: 'interior',
                label: 'Interior / Eksterior',
                icon: 'PaintBrush',
                description: 'Pengerjaan interior fit-out, pembuatan kitchen set, hingga pengerjaan fasad eksterior.',
                subServices: [
                    { 
                        id: 'fit-out', 
                        label: 'Interior Fit-Out',
                        subDetails: [
                            { id: 'plafon-gypsum', label: 'Pekerjaan Plafon Gypsum', unit: 'm²', price: { 'Standar': 200000, 'Menengah': 250000, 'Premium': 320000 }, fields: [{ id: 'luas', label: 'Luas Plafon (m²)', type: 'numeric', placeholder: 'Contoh: 50' }] },
                            { id: 'partisi-gypsum', label: 'Pekerjaan Partisi Gypsum', unit: 'm²', price: { 'Standar': 250000, 'Menengah': 300000, 'Premium': 380000 }, fields: [{ id: 'luas', label: 'Luas Partisi (m²)', type: 'numeric', placeholder: 'Contoh: 30' }] },
                            { id: 'lantai-vinyl', label: 'Pemasangan Lantai Vinyl', unit: 'm²', price: { 'Standar': 180000, 'Menengah': 250000, 'Premium': 350000 }, fields: [{ id: 'luas', label: 'Luas Lantai (m²)', type: 'numeric', placeholder: 'Contoh: 50' }] },
                        ]
                    },
                    { id: 'kitchen-set', label: 'Pembuatan Kitchen Set', unit: 'meter_lari', price: { 'Standar': 2000000, 'Menengah': 2800000, 'Premium': 3800000 }, fields: [{ id: 'panjang', label: 'Panjang (meter lari)', type: 'numeric', placeholder: 'Contoh: 4' }] },
                    { id: 'fasad', label: 'Pekerjaan Fasad', unit: 'm²', price: { 'Standar': 800000, 'Menengah': 1200000, 'Premium': 1800000 }, fields: [{ id: 'luas', label: 'Luas Fasad (m²)', type: 'numeric', placeholder: 'Contoh: 60' }] },
                ]
            },
            {
                id: 'smart',
                label: 'Smart Solutions',
                icon: 'CpuChip',
                description: 'Integrasi teknologi cerdas untuk hunian modern, efisien, dan aman.',
                subServices: [
                    { id: 'panel-surya', label: 'Instalasi Panel Surya (On-Grid)', unit: 'watt-peak', price: 15000, fields: [{ id: 'kapasitas', label: 'Kapasitas (Watt-peak)', type: 'numeric', placeholder: 'Contoh: 3000' }] },
                    { id: 'ev-charging', label: 'Instalasi EV Charging Station', unit: 'unit', price: 10000000, fields: [{ id: 'jumlah', label: 'Jumlah Unit', type: 'numeric', placeholder: 'Contoh: 1' }] },
                    { id: 'smart-lock', label: 'Instalasi Smart Door Lock', unit: 'unit', price: 3000000, fields: [{ id: 'jumlah', label: 'Jumlah Unit', type: 'numeric', placeholder: 'Contoh: 2' }] },
                    { id: 'cctv', label: 'Instalasi Kamera CCTV', unit: 'titik', price: 1500000, fields: [{ id: 'jumlah', label: 'Jumlah Titik Kamera', type: 'numeric', placeholder: 'Contoh: 4' }] },
                ]
            }
        ]
    },
    loginPage: {
        backgroundImage: 'https://images.unsplash.com/photo-1522075782449-e8782522075b?q=80&w=2070&auto=format&fit=crop',
        title: 'Selamat Datang Kembali',
        subtitle: 'Silakan masuk untuk mengakses akun Anda.',
        buttonText: 'Masuk'
    }
};


// Define the context structure
interface DataContextValue {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

// Create the context
const DataContext = createContext<DataContextValue | undefined>(undefined);

// Create the provider component
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(() => {
    try {
        const storedData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
            return JSON.parse(storedData);
        }
    } catch (error) {
        console.error("Failed to parse data from localStorage", error);
    }
    return initialData;
  });

  useEffect(() => {
    try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        if (error instanceof DOMException && (
            error.name === 'QuotaExceededError' ||
            error.name === 'NS_ERROR_DOM_QUOTA_REACHED' // Firefox
        )) {
            alert('Error: Could not save changes. The application storage is full. Please reduce the size of images or remove some content.');
        } else {
            console.error("Failed to save data to localStorage", error);
        }
    }
  }, [data]);


  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};

// Create a custom hook for using the context
export const useData = (): DataContextValue => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};