// lib/constants.ts

// Danh sách 5 category chính
export const CATEGORIES = [
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    icon: '/icons/lifestyle.png',
    color: 'bg-red-500',
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: '/icons/technology.png',
    color: 'bg-blue-500',
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    icon: '/icons/health.png',
    color: 'bg-green-500',
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: '/icons/finance.png',
    color: 'bg-yellow-500',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '/icons/entertainment.png',
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
  technology: [
    {
      id: 'hosting',
      title: 'Hosting',
      description: 'Top web hosting services for your website.',
      image: '/top10/1.jpg',
      link: '#',
    },
    {
      id: 'vpn',
      title: 'VPN',
      description: 'Secure and private VPN services for all devices.',
      image: '/top10/2.jpg',
      link: '#',
    },
    {
      id: 'crm',
      title: 'CRM Software',
      description: 'Manage customers efficiently with the best CRM tools.',
      image: '/top10/3.jpg',
      link: '#',
    },
    {
      id: 'online-courses',
      title: 'Online Courses',
      description: 'Learn new skills online with top platforms.',
      image: '/top10/4.jpg',
      link: '#',
    },
    {
      id: 'apps',
      title: 'Apps',
      description: 'Best productivity and lifestyle apps.',
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
  finance: [
    {
      id: 'banking',
      title: 'Banking',
      description: 'Best banking apps and services.',
      image: '/top10/1.jpg',
      link: '#',
    },
    {
      id: 'investment',
      title: 'Investment',
      description: 'Top investment platforms and advisors.',
      image: '/top10/2.jpg',
      link: '#',
    },
    {
      id: 'insurance',
      title: 'Insurance',
      description: 'Compare insurance plans easily.',
      image: '/top10/3.jpg',
      link: '#',
    },
    {
      id: 'tax',
      title: 'Tax Services',
      description: 'Professional tax services for individuals and businesses.',
      image: '/top10/4.jpg',
      link: '#',
    },
    {
      id: 'loans',
      title: 'Loans',
      description: 'Best personal and business loans.',
      image: '/top10/5.jpg',
      link: '#',
    },
  ],
  entertainment: [
    {
      id: 'movies',
      title: 'Movies',
      description: 'Top streaming platforms and movie apps.',
      image: '/top10/1.jpg',
      link: '#',
    },
    {
      id: 'music',
      title: 'Music',
      description: 'Best music streaming apps.',
      image: '/top10/2.jpg',
      link: '#',
    },
    {
      id: 'games',
      title: 'Games',
      description: 'Top online and mobile games.',
      image: '/top10/3.jpg',
      link: '#',
    },
    {
      id: 'live-events',
      title: 'Live Events',
      description: 'Concerts and live entertainment.',
      image: '/top10/4.jpg',
      link: '#',
    },
    {
      id: 'books',
      title: 'Books',
      description: 'Top book platforms and e-readers.',
      image: '/top10/5.jpg',
      link: '#',
    },
  ],
};

// Thông tin cấu hình site
export const SITE_CONFIG = {
  siteName: 'Top10.com',
  siteUrl: 'https://www.top10.com',
  footerLinks: [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};
