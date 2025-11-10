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
// 💻 TECHNOLOGY CATEGORY
// ========================

export const technologyTop10: Top10Item[] = [
  {
    id: 1,
    rank: 1,
    title: 'Bluehost - Best Web Hosting',
    description: 'Reliable web hosting with 24/7 support.',
    image: '/top10/1.jpg',
    rating: 4.5,
    price: '$2.95/month',
    features: [
      'Free domain for 1 year',
      'Free SSL certificate',
      '24/7 support',
      'WordPress optimized'
    ],
    pros: [
      'Easy to use',
      'Affordable pricing',
      'Great uptime'
    ],
    cons: [
      'Renewal rates higher',
      'Upsells during checkout'
    ],
    category: 'technology',
    affiliateLink: 'https://www.bluehost.com',
    featured: true
  }
];

// ========================
// 💰 FINANCE CATEGORY
// ========================

export const financeTop10: Top10Item[] = [
  {
    id: 1,
    rank: 1,
    title: 'Mint - Best Budgeting App',
    description: 'Free budgeting and finance tracking.',
    image: '/top10/1.jpg',
    rating: 4.4,
    price: 'Free',
    features: [
      'Budget tracking',
      'Bill reminders',
      'Credit score monitoring',
      'Investment tracking'
    ],
    pros: [
      'Completely free',
      'Easy to use',
      'Comprehensive features'
    ],
    cons: [
      'Ads present',
      'US only'
    ],
    category: 'finance',
    affiliateLink: 'https://www.mint.com',
    featured: true
  }
];

// ========================
// 🎬 ENTERTAINMENT CATEGORY
// ========================

export const entertainmentTop10: Top10Item[] = [
  {
    id: 1,
    rank: 1,
    title: 'Netflix - Best Streaming Service',
    description: 'Unlimited movies and TV shows.',
    image: '/top10/1.jpg',
    rating: 4.9,
    price: '$15.49/month',
    features: [
      'Ad-free experience',
      'Original content',
      'Multiple profiles',
      'Download offline'
    ],
    pros: [
      'Huge content library',
      'High-quality originals',
      'User-friendly interface'
    ],
    cons: [
      'Price increases',
      'Content rotation'
    ],
    category: 'entertainment',
    affiliateLink: 'https://www.netflix.com',
    featured: true
  }
];

// ========================
// 📦 EXPORT DATA
// ========================

export const TOP10_DATA = {
  lifestyle: lifestyleTop10,
  technology: technologyTop10,
  health: healthTop10,
  finance: financeTop10,
  entertainment: entertainmentTop10
};