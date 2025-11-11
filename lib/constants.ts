// lib/constants.ts

// Danh sách 5 category chính
export const CATEGORIES = [
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    icon: '/icons/lifestyle.svg',
    color: 'bg-red-500',
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    icon: '/icons/health.svg',
    color: 'bg-green-500',
  },
  {
    id: 'home',
    name: 'Home',
    icon: '/icons/home.svg',
    color: 'bg-blue-500',
  },
  {
    id: 'business',
    name: 'Business',
    icon: '/icons/business.svg',
    color: 'bg-yellow-500',
  },
  {
    id: 'security',
    name: 'Security',
    icon: '/icons/security.svg',
    color: 'bg-purple-500',
  },
];

// Nội dung bên dưới mỗi category
export const CATEGORY_CONTENTS: Record<string, Array<{ id: string; title: string; description: string; image: string; link: string }>> = {
  lifestyle: [
    {
      id: 'dating',
      title: 'Dating',
      description: 'Best dating services and apps for finding the right match.',
      image: '/top10/1.jpg',
      link: '#',
    },
    {
      id: 'meal-delivery',
      title: 'Meal Delivery Services',
      description: 'Healthy and convenient meal delivery services for busy people.',
      image: '/top10/2.jpg',
      link: '#',
    },
    {
      id: 'tv-services',
      title: 'TV Services',
      description: 'Top streaming and cable TV services.',
      image: '/top10/3.jpg',
      link: '#',
    },
    {
      id: 'mobile-plans',
      title: 'Mobile Plans',
      description: 'Affordable mobile plans with great coverage and data.',
      image: '/top10/4.jpg',
      link: '#',
    },
    {
      id: 'fitness',
      title: 'Fitness',
      description: 'Best fitness apps and programs to stay healthy.',
      image: '/top10/5.jpg',
      link: '#',
    },
  ],
  home: [
    {
      id: 'home-security',
      title: 'Home Security',
      description: 'Best home security systems and monitoring services.',
      image: '/top10/1.jpg',
      link: '#',
    },
    {
      id: 'smart-home',
      title: 'Smart Home',
      description: 'Smart home devices and automation systems.',
      image: '/top10/2.jpg',
      link: '#',
    },
    {
      id: 'home-warranty',
      title: 'Home Warranty',
      description: 'Top home warranty companies for protection.',
      image: '/top10/3.jpg',
      link: '#',
    },
    {
      id: 'solar-panels',
      title: 'Solar Panels',
      description: 'Best solar panel companies and installation services.',
      image: '/top10/4.jpg',
      link: '#',
    },
    {
      id: 'moving-services',
      title: 'Moving Services',
      description: 'Professional moving companies and storage solutions.',
      image: '/top10/5.jpg',
      link: '#',
    },
  ],
  health: [
    {
      id: 'supplements',
      title: 'Supplements',
      description: 'Top health supplements for daily wellness.',
      image: '/top10/1.jpg',
      link: '#',
    },
    {
      id: 'workouts',
      title: 'Workouts',
      description: 'Best home and gym workouts.',
      image: '/top10/2.jpg',
      link: '#',
    },
    {
      id: 'mental-health',
      title: 'Mental Health',
      description: 'Top apps and services for mental wellness.',
      image: '/top10/3.jpg',
      link: '#',
    },
    {
      id: 'nutrition',
      title: 'Nutrition',
      description: 'Healthy eating guides and services.',
      image: '/top10/4.jpg',
      link: '#',
    },
    {
      id: 'fitness-devices',
      title: 'Fitness Devices',
      description: 'Wearables and tech to track your fitness.',
      image: '/top10/5.jpg',
      link: '#',
    },
  ],
  business: [
    {
      id: 'hosting',
      title: 'Web Hosting',
      description: 'Best web hosting services for your business website.',
      image: '/top10/1.jpg',
      link: '#',
    },
    {
      id: 'crm',
      title: 'CRM Software',
      description: 'Top CRM platforms to manage customer relationships.',
      image: '/top10/2.jpg',
      link: '#',
    },
    {
      id: 'accounting',
      title: 'Accounting Software',
      description: 'Best accounting tools for small businesses.',
      image: '/top10/3.jpg',
      link: '#',
    },
    {
      id: 'email-marketing',
      title: 'Email Marketing',
      description: 'Top email marketing platforms for businesses.',
      image: '/top10/4.jpg',
      link: '#',
    },
    {
      id: 'payroll',
      title: 'Payroll Services',
      description: 'Best payroll software and services for employers.',
      image: '/top10/5.jpg',
      link: '#',
    },
  ],
  security: [
    {
      id: 'vpn',
      title: 'VPN Services',
      description: 'Best VPN services for online privacy and security.',
      image: '/top10/1.jpg',
      link: '#',
    },
    {
      id: 'antivirus',
      title: 'Antivirus Software',
      description: 'Top antivirus and internet security software.',
      image: '/top10/2.jpg',
      link: '#',
    },
    {
      id: 'password-managers',
      title: 'Password Managers',
      description: 'Best password managers to secure your accounts.',
      image: '/top10/3.jpg',
      link: '#',
    },
    {
      id: 'identity-theft',
      title: 'Identity Theft Protection',
      description: 'Top identity theft protection services.',
      image: '/top10/4.jpg',
      link: '#',
    },
    {
      id: 'backup',
      title: 'Cloud Backup',
      description: 'Best online backup services for data protection.',
      image: '/top10/5.jpg',
      link: '#',
    },
  ],
};

// Thông tin cấu hình site
export const SITE_CONFIG = {
  name: 'Top10.com',
  siteName: 'Top10.com',
  url: 'https://www.top10.com',
  siteUrl: 'https://www.top10.com',
  description: 'Compare and shop the Top10 best services & products for you. Expert reviews and ratings.',
  footerLinks: [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};
