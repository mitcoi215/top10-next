// prisma/seed-full.ts
// Complete seed script with all UI data

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ============================================
// AUTHORS DATA
// ============================================
const authorsData = [
  {
    slug: 'phillip-richardson',
    name: 'Phillip Richardson',
    avatar: 'https://ui-avatars.com/api/?name=Phillip+Richardson&background=FE4A64&color=fff&size=128',
    title: 'Technology Writer',
    bio: 'Phillip Richardson is a technology writer specializing in streaming services, cord-cutting, and home entertainment. With over 10 years of experience covering the tech industry, he helps readers find the best streaming solutions for their needs.',
  },
  {
    slug: 'suzannah-weiss',
    name: 'Suzannah Weiss',
    avatar: 'https://ui-avatars.com/api/?name=Suzannah+Weiss&background=6366F1&color=fff&size=128',
    title: 'Dating Coach',
    bio: 'Suzannah Weiss is a certified sex educator and dating coach who has written for publications like Glamour, Marie Claire, and Cosmopolitan.',
  },
  {
    slug: 'luis-santiago-saldivar',
    name: 'Luis-santiago Saldivar',
    avatar: 'https://ui-avatars.com/api/?name=Luis+Saldivar&background=10B981&color=fff&size=128',
    title: 'Tech Expert',
    bio: 'Luis is a tech expert specializing in web hosting and website builders.',
  },
  {
    slug: 'chris-wilson',
    name: 'Chris Wilson',
    avatar: 'https://ui-avatars.com/api/?name=Chris+Wilson&background=F59E0B&color=fff&size=128',
    title: 'Home Security Expert',
    bio: 'Chris Wilson is a home security expert with over 15 years of experience in the industry.',
  },
  {
    slug: 'morgan-mandriota',
    name: 'Morgan Mandriota',
    avatar: 'https://ui-avatars.com/api/?name=Morgan+Mandriota&background=8B5CF6&color=fff&size=128',
    title: 'Dating Expert',
    bio: 'Morgan Mandriota is a freelance writer and dating expert.',
  },
];

// ============================================
// CATEGORY GROUPS DATA (for Homepage hero)
// ============================================
const categoryGroupsData = [
  { slug: 'lifestyle', name: 'Lifestyle', icon: '🌟', order: 1 },
  { slug: 'health-wellness', name: 'Health & Wellness', icon: '💪', order: 2 },
  { slug: 'home', name: 'Home', icon: '🏠', order: 3 },
  { slug: 'business', name: 'Business', icon: '💼', order: 4 },
  { slug: 'security', name: 'Security', icon: '🔒', order: 5 },
];

// ============================================
// CATEGORIES DATA (actual product categories)
// ============================================
const categoriesData = [
  {
    slug: 'tv-services',
    name: 'TV Services',
    icon: '📺',
    color: 'bg-blue-100',
    description: 'Compare the best TV streaming services',
    groupSlug: 'lifestyle',
    featured: true,
    order: 1,
    exploreHref: '/tv-services',
    compareHref: '/tv-services/compare',
    heroImage: '/top10-images/tv-services-hero.jpg',
    heroTitle: 'Top 10 Best TV Streaming Services & Companies in 2026',
    introContent: '<p>Finding the right TV streaming service can be overwhelming with so many options available. Our team of experts has tested and reviewed the top streaming platforms to help you make an informed decision.</p>',
    sidebarPeopleCount: '167,536',
    bestOfListTitle: 'Our Top 10 Best TV Streaming Services:',
    compareBoxTitle: 'Compare With 10rating, Choose the Best for You',
    compareBoxDescription: 'At 10rating, we believe that the best decisions are made when you have all the information at your fingertips. That\'s why we provide clear, unbiased comparisons of the top products.',
    compareBoxStats: '15 TV Streaming Services Evaluated | 8 Criteria | 10 Best',
    closerLookTitle: 'A Closer Look at the Top 10 TV Streaming Services',
    methodologyTitle: 'Our Methodology: How Did We Rate the Best TV Services?',
    methodologyIntro: 'Our team of experts evaluated each streaming service based on several key criteria to ensure we provide accurate and helpful recommendations.',
    criteriaTitle: 'Here are some of the criteria we evaluated:',
    methodologyCriteria: [
      { title: 'Channel Selection', description: 'We assessed the variety and quality of channels available, including major networks and specialty channels.' },
      { title: 'Price and Value', description: 'We compared pricing across services, considering what you get for your money.' },
      { title: 'Streaming Quality', description: 'We tested video quality, including availability of HD and 4K content.' },
      { title: 'User Experience', description: 'We assessed interface design, ease of navigation, and features.' },
    ],
    exploreTitle: 'Explore More TV Streaming Services:',
    exploreCards: [
      { title: 'Best VPN Services', href: '/vpn', image: '/top10-images/vpn-card.jpg' },
      { title: 'Best Dating Sites', href: '/dating', image: '/top10-images/dating-card.jpg' },
    ],
    reviewListTitle: 'In-Depth TV Streaming Services Reviews',
    reviewListSubtitle: 'Our TV streaming reviews, researched and written by industry experts, give you all the information you need.',
    tenThingsToKnow: [
      { title: 'Hope, dream, think', description: 'What need will the purchase solve?' },
      { title: 'Determine', description: 'What aspects of the product can be compared?' },
      { title: 'Research', description: 'Who are the leading brands? What do they offer?' },
      { title: 'Consider', description: 'Which features are most important to you?' },
      { title: 'Read, watch, consult', description: 'What do the reviews say? What do experts recommend?' },
      { title: 'Compare', description: 'How do the brands on your shortlist stack up head-to-head?' },
      { title: 'Check prices', description: 'What special deals can you take advantage of?' },
      { title: 'Read the fine print', description: 'Are you comfortable with the terms and conditions offered?' },
      { title: 'Choose confidently', description: 'Once you\'ve followed these steps - you should be ready to buy.' },
      { title: 'Trust', description: 'You have made an educated decision that responds to your needs.' },
    ],
    faqs: [
      { question: 'What is the best TV streaming service?', answer: 'The best TV streaming service depends on your needs. For live TV, YouTube TV and Hulu + Live TV are top choices. For on-demand content, Netflix and Disney+ are excellent options.' },
      { question: 'How much do streaming services cost?', answer: 'Streaming services range from $7.99/month for basic plans to $75+/month for live TV services with all channels.' },
    ],
  },
  {
    slug: 'dating',
    name: 'Dating',
    icon: '❤️',
    color: 'bg-pink-100',
    description: 'Find the best online dating sites and apps',
    groupSlug: 'lifestyle',
    featured: true,
    order: 2,
    exploreHref: '/dating',
    compareHref: '/dating/compare',
    heroImage: '/top10-images/dating.20210105130957.jpg',
    heroTitle: 'Top 10 Best Free Online Dating Sites and Apps in 2026',
    introContent: '<p>Online dating has become the most popular way to meet new people. Our experts have tested the top dating sites to help you find your perfect match.</p>',
    sidebarPeopleCount: '234,891',
    bestOfListTitle: 'Our Top 10 Best Dating Sites & Apps:',
    compareBoxTitle: 'Compare With 10rating, Choose the Best for You',
    compareBoxDescription: 'Finding love online starts with choosing the right platform. We\'ve done the research so you don\'t have to.',
    compareBoxStats: '20 Dating Sites Evaluated | 10 Criteria | 10 Best',
    closerLookTitle: 'A Closer Look at the Top 10 Dating Sites',
    methodologyTitle: 'Our Methodology: How Did We Rate the Best Dating Sites?',
    methodologyIntro: 'Our dating experts spent months testing each platform, creating profiles, and evaluating the overall experience.',
    criteriaTitle: 'Here are some of the criteria we evaluated:',
    methodologyCriteria: [
      { title: 'User Base', description: 'We evaluated the size and quality of the user base.' },
      { title: 'Matching Algorithm', description: 'We tested how well the matching system works.' },
      { title: 'Features', description: 'We assessed communication tools and unique features.' },
      { title: 'Safety', description: 'We reviewed safety measures and verification processes.' },
    ],
    exploreTitle: 'Explore More Categories:',
    exploreCards: [
      { title: 'Best VPN Services', href: '/vpn', image: '/top10-images/vpn-card.jpg' },
      { title: 'Best TV Services', href: '/tv-services', image: '/top10-images/tv-card.jpg' },
    ],
    reviewListTitle: 'In-Depth Online Dating Sites and Apps Reviews',
    reviewListSubtitle: 'Our dating sites reviews, researched and written by industry experts, give you all the information you need about price, number of members and age range to make an informed decision.',
    tenThingsToKnow: [
      { title: 'Know yourself', description: 'What are you looking for in a relationship?' },
      { title: 'Set your budget', description: 'How much are you willing to spend on finding love?' },
      { title: 'Research platforms', description: 'Which sites cater to your demographic?' },
      { title: 'Read reviews', description: 'What do other users say about their experiences?' },
      { title: 'Try free trials', description: 'Test the waters before committing.' },
      { title: 'Create a great profile', description: 'First impressions matter online too.' },
      { title: 'Be patient', description: 'Finding the right person takes time.' },
      { title: 'Stay safe', description: 'Never share personal information too quickly.' },
      { title: 'Meet in public', description: 'Always meet first dates in safe, public places.' },
      { title: 'Trust your instincts', description: 'If something feels off, it probably is.' },
    ],
    faqs: [
      { question: 'What is the best dating site?', answer: 'The best dating site depends on what you\'re looking for. eHarmony is best for serious relationships, while Tinder is popular for casual dating.' },
      { question: 'Are dating sites safe?', answer: 'Reputable dating sites have safety measures in place, but always exercise caution and never share personal information too quickly.' },
    ],
  },
  {
    slug: 'vpn',
    name: 'VPN',
    icon: '🔐',
    color: 'bg-green-100',
    description: 'Compare the best VPN services for privacy',
    groupSlug: 'security',
    featured: true,
    order: 3,
    exploreHref: '/vpn',
    compareHref: '/vpn/compare',
    heroImage: '/top10-images/vpn-hero.jpg',
    heroTitle: 'Top 10 Best VPN Services in 2026',
    introContent: '<p>A VPN protects your online privacy and security. Our experts have tested the top VPN services to help you choose the right one.</p>',
    sidebarPeopleCount: '189,234',
    bestOfListTitle: 'Our Top 10 Best VPN Services:',
    compareBoxTitle: 'Compare With 10rating, Choose the Best VPN',
    compareBoxDescription: 'Online privacy is more important than ever. We\'ve tested the top VPNs to help you stay safe online.',
    compareBoxStats: '25 VPN Services Evaluated | 12 Criteria | 10 Best',
    closerLookTitle: 'A Closer Look at the Top 10 VPN Services',
    methodologyTitle: 'Our Methodology: How Did We Rate the Best VPNs?',
    methodologyIntro: 'Our security experts rigorously tested each VPN for speed, security, and reliability.',
    criteriaTitle: 'Here are some of the criteria we evaluated:',
    methodologyCriteria: [
      { title: 'Speed', description: 'We tested connection speeds across multiple servers.' },
      { title: 'Security', description: 'We evaluated encryption protocols and security features.' },
      { title: 'Privacy', description: 'We reviewed logging policies and jurisdiction.' },
      { title: 'Server Network', description: 'We assessed the number and location of servers.' },
    ],
    exploreTitle: 'Explore More Categories:',
    exploreCards: [
      { title: 'Best Antivirus', href: '/antivirus', image: '/top10-images/antivirus-card.jpg' },
      { title: 'Best Password Managers', href: '/password-managers', image: '/top10-images/password-card.jpg' },
    ],
    reviewListTitle: 'In-Depth VPN Service Reviews',
    reviewListSubtitle: 'Our VPN reviews help you choose the right service for your security needs.',
    tenThingsToKnow: [
      { title: 'Understand your needs', description: 'Why do you need a VPN?' },
      { title: 'Check compatibility', description: 'Does the VPN work on all your devices?' },
      { title: 'Review the privacy policy', description: 'Does the VPN keep logs?' },
      { title: 'Test the speed', description: 'Is the VPN fast enough for your needs?' },
      { title: 'Check server locations', description: 'Are servers available where you need them?' },
      { title: 'Look for a kill switch', description: 'This feature protects you if the VPN disconnects.' },
      { title: 'Consider the price', description: 'Longer subscriptions usually offer better value.' },
      { title: 'Try before you buy', description: 'Look for money-back guarantees.' },
      { title: 'Check customer support', description: 'Is help available when you need it?' },
      { title: 'Read user reviews', description: 'What do real users say about the service?' },
    ],
    faqs: [
      { question: 'What is a VPN?', answer: 'A VPN (Virtual Private Network) encrypts your internet connection and hides your IP address, protecting your online privacy and security.' },
      { question: 'Are VPNs legal?', answer: 'VPNs are legal in most countries, but some countries restrict or ban their use. Always check local laws before using a VPN.' },
    ],
  },
];

// ============================================
// PRODUCTS DATA (TV Services)
// ============================================
const tvServicesProducts = [
  {
    rank: 1,
    slug: 'sling-tv',
    name: 'Sling TV',
    ribbon: 'Best Value',
    tagline: 'Best budget-friendly option for sports fans',
    bottomLine: 'Sling TV stands out as one of the most affordable live TV streaming options with packages starting at just $40 per month.',
    logoUrl: '/top10-images/2023_Logo_Sling.20230504145133.png',
    overallScore: 9.5,
    scoreLabel: 'Excellent',
    basePrice: '$40/month',
    bestFor: 'Budget-conscious cord-cutters',
    reviewTitle: 'Sling TV Review (2026)',
    reviewSubtitle: 'The Most Affordable Live TV Streaming Service',
    readTime: '8 min',
    rating: 4.2,
    reviewCount: '2,847 Reviews',
    heroSummary: 'Sling TV offers an affordable entry point to live TV streaming with flexible package options.',
    features: [
      { text: 'Starting at $40/month', bold: true },
      { text: '30+ channels in base package', bold: false },
      { text: 'Sports Extra add-on available', bold: false },
      { text: 'Cloud DVR included', bold: false },
    ],
    highlights: {
      startingPrice: '$40/month',
      freeTrialDays: '3 days',
      channels: '30+',
      dvr: '50 hours',
    },
    scores: {
      channelSelection: 8.5,
      streamingQuality: 9.0,
      userExperience: 8.8,
      value: 9.5,
    },
    pros: ['Most affordable live TV option', 'Flexible package choices', 'Good sports coverage', 'No contract required'],
    cons: ['Limited local channels', 'Only 1-3 simultaneous streams', 'DVR storage costs extra'],
    ctaUrl: 'https://www.sling.com',
    ctaText: 'Try Sling TV',
    status: 'published',
    faqs: [
      { question: 'How much does Sling TV cost?', answer: 'Sling TV starts at $40/month for the Orange or Blue package. The combined Orange + Blue package is $55/month.' },
      { question: 'Does Sling TV have local channels?', answer: 'Sling TV offers local channels in select markets. You can also use an antenna for local channels.' },
    ],
  },
  {
    rank: 2,
    slug: 'youtube-tv',
    name: 'YouTube TV',
    tagline: 'Best for unlimited DVR storage',
    bottomLine: 'YouTube TV offers one of the most comprehensive channel lineups with unlimited cloud DVR storage.',
    logoUrl: '/top10-images/youtube-tv.png',
    overallScore: 9.3,
    scoreLabel: 'Excellent',
    basePrice: '$72.99/month',
    bestFor: 'Sports fans and families',
    reviewTitle: 'YouTube TV Review (2026)',
    reviewSubtitle: 'The Best Overall Live TV Streaming Service',
    readTime: '7 min',
    rating: 4.5,
    reviewCount: '4,123 Reviews',
    heroSummary: 'YouTube TV provides an excellent all-around streaming experience with unlimited DVR.',
    features: [
      { text: 'Unlimited cloud DVR', bold: true },
      { text: '100+ channels', bold: false },
      { text: 'NFL Sunday Ticket available', bold: false },
      { text: '6 accounts per household', bold: false },
    ],
    highlights: {
      startingPrice: '$72.99/month',
      freeTrialDays: '7 days',
      channels: '100+',
      dvr: 'Unlimited',
    },
    scores: {
      channelSelection: 9.5,
      streamingQuality: 9.2,
      userExperience: 9.3,
      value: 8.5,
    },
    pros: ['Unlimited DVR storage', 'Excellent channel lineup', 'Easy to use interface', 'Multiple user accounts'],
    cons: ['Higher price point', 'No A&E networks', 'Limited 4K content'],
    ctaUrl: 'https://tv.youtube.com',
    ctaText: 'Try YouTube TV',
    status: 'published',
    faqs: [
      { question: 'How much is YouTube TV?', answer: 'YouTube TV costs $72.99/month for the base package with 100+ channels and unlimited DVR.' },
      { question: 'Can I share YouTube TV with family?', answer: 'Yes, YouTube TV allows up to 6 user accounts per household with individual DVR libraries.' },
    ],
  },
  {
    rank: 3,
    slug: 'hulu-live-tv',
    name: 'Hulu + Live TV',
    tagline: 'Best all-in-one streaming bundle',
    bottomLine: 'Hulu + Live TV combines live TV with Hulu\'s on-demand library plus Disney+ and ESPN+.',
    logoUrl: '/top10-images/2023_Logo_TVservices-HULUlive.20230209102529.png',
    overallScore: 9.1,
    scoreLabel: 'Excellent',
    basePrice: '$76.99/month',
    bestFor: 'Entertainment enthusiasts',
    reviewTitle: 'Hulu + Live TV Review (2026)',
    reviewSubtitle: 'The Ultimate Entertainment Bundle',
    readTime: '6 min',
    rating: 4.3,
    reviewCount: '3,567 Reviews',
    heroSummary: 'Get the best of both worlds with live TV and Hulu\'s massive on-demand library.',
    features: [
      { text: 'Includes Disney+ and ESPN+', bold: true },
      { text: '90+ live channels', bold: false },
      { text: 'Unlimited DVR storage', bold: false },
      { text: 'Hulu originals included', bold: false },
    ],
    highlights: {
      startingPrice: '$76.99/month',
      freeTrialDays: '3 days',
      channels: '90+',
      dvr: 'Unlimited',
    },
    scores: {
      channelSelection: 9.0,
      streamingQuality: 9.0,
      userExperience: 8.8,
      value: 8.5,
    },
    pros: ['Disney+ and ESPN+ included', 'Great on-demand library', 'Unlimited DVR', 'Original content'],
    cons: ['Higher price', 'Ads in some content', 'Interface can be cluttered'],
    ctaUrl: 'https://www.hulu.com/live-tv',
    ctaText: 'Try Hulu + Live TV',
    status: 'published',
    faqs: [
      { question: 'What\'s included with Hulu + Live TV?', answer: 'Hulu + Live TV includes 90+ live channels, Hulu\'s on-demand library, Disney+, and ESPN+ all in one bundle.' },
    ],
  },
];

// ============================================
// PRODUCTS DATA (Dating)
// ============================================
const datingProducts = [
  {
    rank: 1,
    slug: 'eharmony',
    name: 'eharmony',
    ribbon: 'Best Overall',
    tagline: 'Best for serious relationships',
    bottomLine: 'eharmony uses a scientific approach to match singles based on compatibility, making it the premier choice for those seeking long-term relationships.',
    logoUrl: '/top10-images/2023_Logo_Eharmony.20231224094829.svg',
    overallScore: 9.6,
    scoreLabel: 'Excellent',
    basePrice: '$35.90/month',
    bestFor: 'Singles seeking serious relationships',
    reviewTitle: 'eharmony Dating Site Review (2026)',
    reviewSubtitle: 'Trusted Dating App for Serious Relationships',
    readTime: '5 min',
    rating: 3.0,
    reviewCount: '3,598 Reviews',
    heroSummary: 'eharmony stands out as the premier dating platform for individuals serious about finding long-term love.',
    features: [
      { text: 'Compatibility matching system', bold: true },
      { text: 'Video dating feature', bold: false },
      { text: 'Identity verification', bold: false },
      { text: 'Detailed personality profiles', bold: false },
    ],
    highlights: {
      startingPrice: '$35.90/month',
      memberCount: '16M+',
      ageRange: '30-50',
      matchRate: '71%',
    },
    scores: {
      matchQuality: 9.5,
      userExperience: 9.0,
      features: 9.2,
      value: 8.8,
    },
    pros: ['Highest success rate for marriages', 'Quality over quantity approach', 'Thorough compatibility matching', 'Large user base'],
    cons: ['More expensive than competitors', 'Time-consuming sign-up process', 'Limited free features'],
    ctaUrl: 'https://www.eharmony.com',
    ctaText: 'Try eharmony',
    status: 'published',
    faqs: [
      { question: 'Is eharmony worth it?', answer: 'Yes, eharmony is worth it if you\'re looking for a serious, long-term relationship. The compatibility matching system has a proven track record.' },
      { question: 'How much does eharmony cost?', answer: 'eharmony plans start at $35.90/month for a 12-month subscription. Shorter plans cost more per month.' },
    ],
  },
  {
    rank: 2,
    slug: 'match-com',
    name: 'Match.com',
    tagline: 'Best for all ages',
    bottomLine: 'Match.com has been connecting singles since 1995 and remains one of the most trusted dating platforms.',
    logoUrl: '/top10-images/Match.com_logo.202103141253541.20220908065553.png',
    overallScore: 9.2,
    scoreLabel: 'Excellent',
    basePrice: '$24.99/month',
    bestFor: 'Singles of all ages',
    reviewTitle: 'Match.com Review (2026)',
    reviewSubtitle: 'The Original Online Dating Site',
    readTime: '6 min',
    rating: 4.0,
    reviewCount: '4,234 Reviews',
    heroSummary: 'Match.com pioneered online dating and continues to be a top choice for singles of all ages.',
    features: [
      { text: 'Advanced search filters', bold: true },
      { text: 'Daily matches', bold: false },
      { text: 'Match Events', bold: false },
      { text: 'Video chat', bold: false },
    ],
    highlights: {
      startingPrice: '$24.99/month',
      memberCount: '21M+',
      ageRange: '25-55',
      matchRate: '48%',
    },
    scores: {
      matchQuality: 8.8,
      userExperience: 9.0,
      features: 9.2,
      value: 9.0,
    },
    pros: ['Large user base', 'Events and activities', 'Affordable pricing', 'Great for all ages'],
    cons: ['Some inactive profiles', 'Fake profiles exist', 'Can be overwhelming'],
    ctaUrl: 'https://www.match.com',
    ctaText: 'Try Match.com',
    status: 'published',
    faqs: [
      { question: 'Is Match.com free?', answer: 'Match.com offers a free version with limited features. To message other users, you need a paid subscription.' },
    ],
  },
];

// ============================================
// HOMEPAGE SETTINGS DATA
// ============================================
const homepageSettingsData = {
  heroTitle: 'Shopping with Confidence',
  heroSubtitle: 'We compare so you don\'t have to',

  // Stats
  statsListsCount: '500+',
  statsHoursCount: '5,000+',
  statsDecisionsCount: '16M+',

  // Mission Section
  missionTitle: 'Our Mission',
  missionContent: 'At 10rating, our mission is to save you time and money by empowering you to make informed decisions. As a comparison site, we provide all the tools you need to compare options effectively. We are dedicated to thorough research, transparency, and user-focused design, ensuring complex choices are straightforward.',
  missionImage: '/top10-images/ourmissionTransparentOnMagenta.20240702082951.png',
  missionCta: '/about-us',

  // Method Section
  methodTitle: 'Our Method',
  methodContent: 'At 10rating, our methodology is rigorous and transparent. We combine in-depth research with meticulous testing to ensure our product scores and rankings are both reliable and relevant. Each category is evaluated based on criteria tailored to the specific needs and interests of consumers.',
  methodImage: '/top10-images/HowWeScore-TransparentOnMagenta.20240702081503.png',
  methodCta: '/how-we-score',

  // Brand Logos
  brandLogos: [
    { name: 'Forbes', logo: '/top10-images/forbes.svg' },
    { name: 'Business Insider', logo: '/top10-images/business-insider.svg' },
    { name: 'Yahoo Finance', logo: '/top10-images/yahoo-finance.svg' },
    { name: 'USA Today', logo: '/top10-images/usa-today.svg' },
  ],

  // Trending Items
  trendingItems: [
    {
      rank: 1,
      title: 'Hosting',
      href: '/hosting',
      image: '/top10-images/Hosting.20221025063909.jpg',
      description: 'Top 10 Best Web Hosting Providers & Companies in 2026',
      date: 'Oct, 2024',
      articles: [
        { title: 'How Smart WordPress Security Features Can Protect Your Site', href: '/hosting/wordpress-security-features', image: '/top10-images/shutterstock_21847135611.jpg', author: 'Luis-santiago Saldivar', date: 'Dec, 2024' },
        { title: 'IONOS Review', href: '/hosting/reviews/ionos', image: '/top10-images/2023_Logo_TV-services.20230330090500.20240718074123.png', author: '', date: 'Jun, 2023', isReview: true },
      ],
    },
    {
      rank: 2,
      title: 'Home Security',
      href: '/home-security',
      image: '/top10-images/Untitleddesign86.20221025070645.jpg',
      description: 'Top 10 Best Home Security Systems & Companies 2026',
      date: 'May, 2024',
      articles: [
        { title: '5 Best Video Doorbells of 2026 for a Safer Home', href: '/home-security/best-video-doorbells', image: '/top10-images/Home_Security-1765286288398.20251209131954.png', author: 'Chris Wilson', date: 'Dec, 2025' },
        { title: 'ADT Review', href: '/home-security/reviews/adt', image: '/top10-images/ADT_LogoRGB-12.20240523093040.svg', author: '', date: 'Mar, 2024', isReview: true },
      ],
    },
    {
      rank: 3,
      title: 'Dating Sites & Apps',
      href: '/dating',
      image: '/top10-images/dating.20210105130957.jpg',
      description: 'Top 10 Best Free Online Dating Sites and Apps in 2026',
      date: 'Nov, 2024',
      articles: [
        { title: 'Top 10 Best Free Gay Dating Sites and Apps in 2026', href: '/dating/best-gay-dating-sites', image: '/top10-images/Group8251.20240218123834.png', author: 'Morgan Mandriota', date: 'Dec, 2025' },
        { title: 'eharmony Review', href: '/dating/reviews/eharmony', image: '/top10-images/2023_Logo_Eharmony.20231224094829.svg', author: '', date: 'Jul, 2025', isReview: true },
      ],
    },
  ],

  // Explore Categories
  exploreCategories: [
    {
      groupSlug: 'all',
      groupName: 'All',
      icon: null,
      links: [
        { title: 'Medical Alerts Match', href: '/medical-alerts-match' },
        { title: 'Accounting Software', href: '/accounting-software' },
        { title: 'Ad Blockers', href: '/ad-blockers' },
        { title: 'Antivirus', href: '/antivirus' },
        { title: 'Dating Sites', href: '/dating' },
      ],
    },
    {
      groupSlug: 'lifestyle',
      groupName: 'Lifestyle',
      icon: 'LifestyleIcon',
      links: [
        { title: 'Dating Sites', href: '/dating' },
        { title: 'Meal Delivery', href: '/meal-delivery' },
        { title: 'Online Therapy', href: '/online-therapy' },
      ],
    },
    {
      groupSlug: 'business',
      groupName: 'Business',
      icon: 'BusinessIcon',
      links: [
        { title: 'Project Management', href: '/project-management' },
        { title: 'VoIP', href: '/voip' },
        { title: 'CRM Software', href: '/crm' },
      ],
    },
  ],
};

// ============================================
// ARTICLES DATA
// ============================================
const articlesData = [
  {
    slug: 'best-sports-streaming-services',
    title: 'Top 10 Best Sports Streaming Services & Websites in 2026',
    subtitle: 'Find the best way to watch live sports online',
    articleType: 'charticle',
    categorySlug: 'tv-services',
    authorSlug: 'phillip-richardson',
    featuredImage: '/top10-images/big-httpswww.instagram.comall_na.tural14.20230124091945.jpg',
    featuredImageAlt: 'Best Sports Streaming Services',
    excerpt: 'Discover the top sports streaming services for watching live games, from NFL to soccer.',
    content: '<h2>Our Top 10 Best Sports Streaming Services in 2026</h2><p>Finding the right streaming service for sports can be challenging...</p>',
    sidebarTitle: 'Best TV Streaming Services',
    sidebarSeeAllHref: '/tv-services',
    sidebarSeeAllText: 'See All TV Services',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'TV Services', href: '/tv-services' },
      { label: 'Best Sports Streaming Services' },
    ],
    status: 'published',
  },
  {
    slug: 'best-gay-dating-sites',
    title: 'Top 10 Best Free Gay Dating Sites and Apps in 2026',
    subtitle: 'Find love with the best LGBTQ+ dating platforms',
    articleType: 'charticle',
    categorySlug: 'dating',
    authorSlug: 'morgan-mandriota',
    featuredImage: '/top10-images/Group8251.20240218123834.png',
    featuredImageAlt: 'Best Gay Dating Sites',
    excerpt: 'Discover the best gay dating sites and apps for finding meaningful connections.',
    content: '<h2>Best Gay Dating Sites in 2026</h2><p>Finding the right dating platform for LGBTQ+ singles...</p>',
    sidebarTitle: 'Best Dating Sites',
    sidebarSeeAllHref: '/dating',
    sidebarSeeAllText: 'See All Dating Sites',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Dating', href: '/dating' },
      { label: 'Best Gay Dating Sites' },
    ],
    status: 'published',
  },
];

// ============================================
// MAIN SEED FUNCTION
// ============================================
async function main() {
  console.log('🌱 Starting full seed...');

  // 1. Create admin user
  console.log('\n👤 Creating admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: hashedPassword },
  });
  console.log('  ✓ Admin user ready');

  // 2. Create Authors
  console.log('\n✍️ Creating authors...');
  const createdAuthors: Record<string, string> = {};
  for (const author of authorsData) {
    const result = await prisma.author.upsert({
      where: { slug: author.slug },
      update: author,
      create: author,
    });
    createdAuthors[author.slug] = result.id;
    console.log(`  ✓ Author: ${author.name}`);
  }

  // 3. Create Category Groups
  console.log('\n📂 Creating category groups...');
  const createdGroups: Record<string, string> = {};
  for (const group of categoryGroupsData) {
    const result = await prisma.categoryGroup.upsert({
      where: { slug: group.slug },
      update: group,
      create: group,
    });
    createdGroups[group.slug] = result.id;
    console.log(`  ✓ Group: ${group.name}`);
  }

  // 4. Create Categories
  console.log('\n📁 Creating categories...');
  const createdCategories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const { groupSlug, ...catData } = cat;
    const groupId = createdGroups[groupSlug];

    const result = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { ...catData, groupId },
      create: { ...catData, groupId },
    });
    createdCategories[cat.slug] = result.id;
    console.log(`  ✓ Category: ${cat.name}`);
  }

  // 5. Create Products - TV Services
  console.log('\n📦 Creating TV Services products...');
  const tvCategoryId = createdCategories['tv-services'];
  for (const product of tvServicesProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { ...product, categoryId: tvCategoryId },
      create: { ...product, categoryId: tvCategoryId },
    });
    console.log(`  ✓ Product: ${product.name}`);
  }

  // 6. Create Products - Dating
  console.log('\n📦 Creating Dating products...');
  const datingCategoryId = createdCategories['dating'];
  for (const product of datingProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { ...product, categoryId: datingCategoryId },
      create: { ...product, categoryId: datingCategoryId },
    });
    console.log(`  ✓ Product: ${product.name}`);
  }

  // 7. Create Articles
  console.log('\n📰 Creating articles...');
  for (const article of articlesData) {
    const { categorySlug, authorSlug, ...articleData } = article;
    const categoryId = createdCategories[categorySlug];
    const authorId = createdAuthors[authorSlug];

    await prisma.article.upsert({
      where: { slug: article.slug },
      update: { ...articleData, categoryId, authorId },
      create: { ...articleData, categoryId, authorId },
    });
    console.log(`  ✓ Article: ${article.title.substring(0, 50)}...`);
  }

  // 8. Create Homepage Settings
  console.log('\n🏠 Creating homepage settings...');
  const existingHomepage = await prisma.homepageSettings.findFirst();
  if (existingHomepage) {
    await prisma.homepageSettings.update({
      where: { id: existingHomepage.id },
      data: {
        ...homepageSettingsData,
        expertIds: Object.values(createdAuthors).slice(0, 3),
      },
    });
  } else {
    await prisma.homepageSettings.create({
      data: {
        ...homepageSettingsData,
        expertIds: Object.values(createdAuthors).slice(0, 3),
      },
    });
  }
  console.log('  ✓ Homepage settings created');

  console.log('\n✅ Full seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
