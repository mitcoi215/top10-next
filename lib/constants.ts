// lib/constants.ts

// Danh sách 5 category chính
export const CATEGORIES = [
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    icon: '/icons/lifestyle.svg',
    color: 'bg-white',
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    icon: '/icons/health.svg',
    color: 'bg-white',
  },
  {
    id: 'home',
    name: 'Home',
    icon: '/icons/home.svg',
    color: 'bg-white',
  },
  {
    id: 'business',
    name: 'Business',
    icon: '/icons/business.svg',
    color: 'bg-white',
  },
  {
    id: 'security',
    name: 'Security',
    icon: '/icons/security.svg',
    color: 'bg-white',
  },
];

// Nội dung bên dưới mỗi category
export const CATEGORY_CONTENTS: Record<string, Array<{ id: string; title: string; description: string; image: string; link: string }>> = {
  lifestyle: [
    {
      id: 'dating',
      title: 'Dating',
      description: 'Best dating services and apps for finding the right match.',
      image: '/10rating/1.jpg',
      link: '#',
    },
    {
      id: 'meal-delivery',
      title: 'Meal Delivery Services',
      description: 'Healthy and convenient meal delivery services for busy people.',
      image: '/10rating/2.jpg',
      link: '#',
    },
    {
      id: 'tv-services',
      title: 'TV Services',
      description: 'Top streaming and cable TV services.',
      image: '/10rating/3.jpg',
      link: '#',
    },
    {
      id: 'mobile-plans',
      title: 'Mobile Plans',
      description: 'Affordable mobile plans with great coverage and data.',
      image: '/10rating/4.jpg',
      link: '#',
    },
    {
      id: 'fitness',
      title: 'Fitness',
      description: 'Best fitness apps and programs to stay healthy.',
      image: '/10rating/5.jpg',
      link: '#',
    },
  ],
  home: [
    {
      id: 'home-security',
      title: 'Home Security',
      description: 'Best home security systems and monitoring services.',
      image: '/10rating/1.jpg',
      link: '#',
    },
    {
      id: 'smart-home',
      title: 'Smart Home',
      description: 'Smart home devices and automation systems.',
      image: '/10rating/2.jpg',
      link: '#',
    },
    {
      id: 'home-warranty',
      title: 'Home Warranty',
      description: 'Top home warranty companies for protection.',
      image: '/10rating/3.jpg',
      link: '#',
    },
    {
      id: 'solar-panels',
      title: 'Solar Panels',
      description: 'Best solar panel companies and installation services.',
      image: '/10rating/4.jpg',
      link: '#',
    },
    {
      id: 'moving-services',
      title: 'Moving Services',
      description: 'Professional moving companies and storage solutions.',
      image: '/10rating/5.jpg',
      link: '#',
    },
  ],
  health: [
    {
      id: 'supplements',
      title: 'Supplements',
      description: 'Top health supplements for daily wellness.',
      image: '/10rating/1.jpg',
      link: '#',
    },
    {
      id: 'workouts',
      title: 'Workouts',
      description: 'Best home and gym workouts.',
      image: '/10rating/2.jpg',
      link: '#',
    },
    {
      id: 'mental-health',
      title: 'Mental Health',
      description: 'Top apps and services for mental wellness.',
      image: '/10rating/3.jpg',
      link: '#',
    },
    {
      id: 'nutrition',
      title: 'Nutrition',
      description: 'Healthy eating guides and services.',
      image: '/10rating/4.jpg',
      link: '#',
    },
    {
      id: 'fitness-devices',
      title: 'Fitness Devices',
      description: 'Wearables and tech to track your fitness.',
      image: '/10rating/5.jpg',
      link: '#',
    },
  ],
  business: [
    {
      id: 'hosting',
      title: 'Web Hosting',
      description: 'Best web hosting services for your business website.',
      image: '/10rating/1.jpg',
      link: '#',
    },
    {
      id: 'crm',
      title: 'CRM Software',
      description: 'Top CRM platforms to manage customer relationships.',
      image: '/10rating/2.jpg',
      link: '#',
    },
    {
      id: 'accounting',
      title: 'Accounting Software',
      description: 'Best accounting tools for small businesses.',
      image: '/10rating/3.jpg',
      link: '#',
    },
    {
      id: 'email-marketing',
      title: 'Email Marketing',
      description: 'Top email marketing platforms for businesses.',
      image: '/10rating/4.jpg',
      link: '#',
    },
    {
      id: 'payroll',
      title: 'Payroll Services',
      description: 'Best payroll software and services for employers.',
      image: '/10rating/5.jpg',
      link: '#',
    },
  ],
  security: [
    {
      id: 'vpn',
      title: 'VPN Services',
      description: 'Best VPN services for online privacy and security.',
      image: '/10rating/1.jpg',
      link: '#',
    },
    {
      id: 'antivirus',
      title: 'Antivirus Software',
      description: 'Top antivirus and internet security software.',
      image: '/10rating/2.jpg',
      link: '#',
    },
    {
      id: 'password-managers',
      title: 'Password Managers',
      description: 'Best password managers to secure your accounts.',
      image: '/10rating/3.jpg',
      link: '#',
    },
    {
      id: 'identity-theft',
      title: 'Identity Theft Protection',
      description: 'Top identity theft protection services.',
      image: '/10rating/4.jpg',
      link: '#',
    },
    {
      id: 'backup',
      title: 'Cloud Backup',
      description: 'Best online backup services for data protection.',
      image: '/10rating/5.jpg',
      link: '#',
    },
  ],
};

// Thông tin cấu hình site
export const SITE_CONFIG = {
  name: '10 Rating',
  siteName: '10rating.com',
  url: 'https://www.10rating.com',
  siteUrl: 'https://www.10rating.com',
  description: 'Compare and shop the 10rating best services & products for you. Expert reviews and ratings.',
  footerLinks: [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};
