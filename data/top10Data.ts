// 📍 File: D:\top10-next\data\top10Data.ts
// 🎯 Mục đích: Mock data cho Top10 items

import { Top10Item } from '@/types';

// ========================
// 🎭 LIFESTYLE CATEGORY
// ========================

export const lifestyleTop10: Top10Item[] = [
  {
    id: 1,
    rank: 1,
    title: 'eHarmony - Best Overall Dating Service',
    description: 'eHarmony uses a scientific approach to match singles based on compatibility. Perfect for those seeking serious relationships.',
    image: '/top10/1.jpg',
    rating: 4.8,
    price: '$35.90/month',
    features: [
      'Compatibility matching system',
      'Video dating feature',
      'Secure call feature',
      'Identity verification'
    ],
    pros: [
      'High success rate for long-term relationships',
      'Detailed personality assessment',
      'Large user base'
    ],
    cons: [
      'More expensive than competitors',
      'Time-consuming sign-up process'
    ],
    category: 'lifestyle',
    affiliateLink: 'https://www.eharmony.com',
    featured: true
  },
  {
    id: 2,
    rank: 2,
    title: 'Match.com - Best for Serious Relationships',
    description: 'Match.com has been connecting singles since 1995. Proven track record with millions of success stories.',
    image: '/top10/2.jpg',
    rating: 4.6,
    price: '$24.99/month',
    features: [
      'Advanced search filters',
      'Daily matches',
      'Profile boost feature',
      'Mobile app available'
    ],
    pros: [
      'Large and diverse user base',
      'Affordable pricing',
      'Strong mobile experience'
    ],
    cons: [
      'Some fake profiles',
      'Limited free features'
    ],
    category: 'lifestyle',
    affiliateLink: 'https://www.match.com',
    featured: false
  },
  {
    id: 3,
    rank: 3,
    title: 'HelloFresh - Top Meal Kit Delivery',
    description: 'Fresh ingredients and easy-to-follow recipes delivered to your door.',
    image: '/top10/3.jpg',
    rating: 4.7,
    price: '$8.99/serving',
    features: [
      '35+ recipes weekly',
      'Flexible meal plans',
      'Pre-portioned ingredients',
      'No commitment required'
    ],
    pros: [
      'Time-saving',
      'Reduces food waste',
      'Variety of dietary options'
    ],
    cons: [
      'More expensive than grocery shopping',
      'Packaging waste'
    ],
    category: 'lifestyle',
    affiliateLink: 'https://www.hellofresh.com',
    featured: false
  }
];

// ========================
// 🏥 HEALTH CATEGORY
// ========================

export const healthTop10: Top10Item[] = [
  {
    id: 1,
    rank: 1,
    title: 'BetterHelp - Best Online Therapy Platform',
    description: 'Professional, affordable counseling when you need it.',
    image: '/top10/1.jpg',
    rating: 4.7,
    price: '$60-90/week',
    features: [
      'Licensed therapists',
      'Unlimited messaging',
      'Live sessions',
      'Mobile app'
    ],
    pros: [
      'Convenient and flexible',
      'Affordable',
      'Large network'
    ],
    cons: [
      'Not covered by insurance',
      'Not for severe cases'
    ],
    category: 'health',
    affiliateLink: 'https://www.betterhelp.com',
    featured: true
  }
];

// ========================
// 🏠 HOME CATEGORY
// ========================

export const homeTop10: Top10Item[] = [
  {
    id: 1,
    rank: 1,
    title: 'ADT - Best Home Security System',
    description: 'Trusted home security with 24/7 monitoring.',
    image: '/top10/1.jpg',
    rating: 4.5,
    price: '$45.99/month',
    features: [
      'Professional installation',
      '24/7 monitoring',
      'Smart home integration',
      'Mobile app'
    ],
    pros: [
      'Established brand',
      'Comprehensive coverage',
      'Fast response'
    ],
    cons: [
      'Contract required',
      'Higher costs'
    ],
    category: 'home',
    affiliateLink: 'https://www.adt.com',
    featured: true
  }
];

// ========================
// 🏢 BUSINESS CATEGORY
// ========================

export const businessTop10: Top10Item[] = [
  {
    id: 1,
    rank: 1,
    title: 'Salesforce - Best CRM Platform',
    description: 'World\'s #1 CRM platform.',
    image: '/top10/1.jpg',
    rating: 4.4,
    price: '$25/user/month',
    features: [
      'Contact management',
      'Sales forecasting',
      'Custom dashboards',
      'Mobile app'
    ],
    pros: [
      'Highly customizable',
      'Extensive integrations',
      'Scalable'
    ],
    cons: [
      'Steep learning curve',
      'Expensive for small biz'
    ],
    category: 'business',
    affiliateLink: 'https://www.salesforce.com',
    featured: true
  }
];

// ========================
// 🔒 SECURITY CATEGORY
// ========================

export const securityTop10: Top10Item[] = [
  {
    id: 1,
    rank: 1,
    title: 'NordVPN - Best VPN Service Overall',
    description: 'Secure your internet with military-grade encryption.',
    image: '/top10/1.jpg',
    rating: 4.9,
    price: '$3.99/month',
    features: [
      '5,500+ servers',
      'No-logs policy',
      'Kill switch',
      'Double VPN'
    ],
    pros: [
      'Excellent speed',
      'Strong security',
      'User-friendly'
    ],
    cons: [
      'Slow to connect',
      'No dedicated IP on basic'
    ],
    category: 'security',
    affiliateLink: 'https://www.nordvpn.com',
    featured: true
  }
];

// ========================
// 📦 EXPORT DATA
// ========================

export const TOP10_DATA = {
  lifestyle: lifestyleTop10,
  health: healthTop10,
  home: homeTop10,
  business: businessTop10,
  security: securityTop10
};