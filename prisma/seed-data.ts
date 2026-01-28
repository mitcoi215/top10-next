// Seed Data Template for Top10 CMS
// Based on Prisma Schema v2.0

// ============================================
// AUTHOR DATA
// ============================================
export const authorsData = [
  {
    slug: 'phillip-richardson',
    name: 'Phillip Richardson',
    avatar: '/top10-images/PhillipRichardson.20220915050425.jpg',
    title: 'Technology Writer',
    bio: 'Phillip Richardson is a technology writer specializing in streaming services, cord-cutting, and home entertainment. With over 10 years of experience covering the tech industry, he helps readers find the best streaming solutions for their needs.',
    socialLinks: {
      twitter: 'https://twitter.com/philliprich',
      linkedin: 'https://linkedin.com/in/philliprichardson',
    },
  },
  {
    slug: 'sarah-johnson',
    name: 'Sarah Johnson',
    avatar: '/top10-images/sarah-johnson.jpg',
    title: 'Dating Expert',
    bio: 'Sarah Johnson is a relationship expert and dating coach with 8 years of experience helping singles find meaningful connections online.',
    socialLinks: {
      twitter: 'https://twitter.com/sarahjohnson',
    },
  },
];

// ============================================
// CATEGORY DATA - TV Services
// ============================================
export const tvServicesCategory = {
  slug: 'tv-services',
  name: 'TV Services',
  icon: '📺',
  color: 'bg-purple-500',
  description: 'Compare the best TV streaming services and find the perfect option for your entertainment needs.',
  featured: true,
  order: 1,

  // Category Listing Page - Header
  heroImage: '/top10-images/tv-services-hero.jpg',
  heroTitle: 'Best TV Streaming Services of 2026',
  lastUpdated: new Date('2026-01-27'),

  // Intro Content
  introContent: `<p>Cutting the cord has never been easier. With dozens of streaming services available, you can watch live TV, sports, news, and on-demand content without a traditional cable subscription.</p>
<p>Our team of experts has tested and reviewed the top TV streaming services to help you find the best option for your viewing habits and budget.</p>`,

  // Criteria Definitions
  criteriaDefinitions: [
    { key: 'value', label: 'Value', maxScore: 10 },
    { key: 'channels', label: 'Channel Selection', maxScore: 10 },
    { key: 'features', label: 'Features', maxScore: 10 },
    { key: 'ease_of_use', label: 'Ease of Use', maxScore: 10 },
    { key: 'support', label: 'Customer Support', maxScore: 10 },
  ],

  // Highlight Definitions
  highlightDefinitions: [
    { key: 'starting_price', label: 'Starting Price' },
    { key: 'free_trial', label: 'Free Trial' },
    { key: 'channels', label: 'Channels' },
  ],

  // Methodology
  methodologyIntro: 'Our team of streaming experts evaluates each service based on comprehensive testing and research.',
  methodologyCriteria: [
    {
      title: 'Channel Selection',
      description: 'We assess the variety and quality of channels available, including local networks, sports, news, and entertainment options.',
    },
    {
      title: 'Value for Money',
      description: 'We compare pricing against features, channel count, and overall value proposition.',
    },
    {
      title: 'Streaming Quality',
      description: 'We test video quality, buffering, and reliability across different devices and network conditions.',
    },
    {
      title: 'User Experience',
      description: 'We evaluate interface design, navigation, DVR functionality, and ease of use.',
    },
  ],

  // Review List Page Content
  reviewListIntro: 'Read our in-depth reviews of the top TV streaming services to find the perfect match for your entertainment needs.',
  reviewListHeroImage: '/top10-images/tv-reviews-hero.jpg',
  tenThingsToKnow: [
    {
      title: 'Compare channel lineups',
      description: 'Make sure the service includes the channels you actually watch before subscribing.',
    },
    {
      title: 'Check for local channels',
      description: 'Not all services offer local ABC, CBS, NBC, and Fox affiliates in every market.',
    },
    {
      title: 'Consider your sports needs',
      description: 'Sports fans should verify regional sports network availability and any add-on costs.',
    },
    {
      title: 'Evaluate DVR features',
      description: 'Cloud DVR storage limits and features vary significantly between services.',
    },
    {
      title: 'Test before committing',
      description: 'Most services offer free trials - use them to test the interface and streaming quality.',
    },
  ],

  // FAQ
  faqs: [
    {
      question: 'What is the cheapest live TV streaming service?',
      answer: 'Sling TV offers the most affordable live TV streaming starting at $40/month for either the Orange or Blue package.',
    },
    {
      question: 'Which streaming service has the most channels?',
      answer: 'YouTube TV and Hulu + Live TV both offer 85+ channels in their base packages, with DirecTV Stream offering even more in its higher tiers.',
    },
    {
      question: 'Can I watch local channels without cable?',
      answer: 'Yes, services like YouTube TV, Hulu + Live TV, and DirecTV Stream include major local networks in most markets.',
    },
  ],

  // SEO
  metaTitle: 'Best TV Streaming Services 2026 - Compare Top 10 Options | Top10',
  metaDescription: 'Compare the best TV streaming services of 2026. Expert reviews of Sling TV, Hulu, YouTube TV, and more. Find the perfect streaming service for your needs.',
  ogImage: '/top10-images/tv-services-og.jpg',
};

// ============================================
// PRODUCT DATA - Sling TV
// ============================================
export const slingTvProduct = {
  // Nhóm 1: Metadata
  slug: 'sling-tv',
  name: 'Sling TV',
  logoUrl: '/top10-images/2023_Logo_Sling.20230504145133.png',
  ctaUrl: 'https://www.sling.com/',
  ctaText: 'Try Sling TV',
  reviewHref: '/tv-services/reviews/sling-tv',
  status: 'published',

  // Nhóm 2: Category Listing
  rank: 1,
  ribbon: 'Best Value',
  tagline: 'Affordable live TV streaming with flexible packages',
  bottomLine: 'Sling TV is the most budget-friendly live TV streaming service, offering customizable channel packages starting at just $40/month. Perfect for cord-cutters who want live TV without the high cable bill.',
  bestFor: 'Budget-conscious cord cutters',
  basePrice: '$40/month',
  overallScore: 9.2,
  scoreLabel: 'Excellent',
  scores: {
    value: 9.5,
    channels: 8.5,
    features: 9.0,
    ease_of_use: 9.0,
    support: 8.8,
  },
  highlights: {
    starting_price: '$40/month',
    free_trial: '7 days',
    channels: '30-50+',
  },
  features: [
    { text: 'Most affordable live TV streaming', bold: true },
    { text: 'Customizable Orange + Blue packages', bold: false },
    { text: 'Sports Extra add-on available', bold: false },
    { text: '50 hours cloud DVR included', bold: false },
    { text: 'Stream on up to 3 devices', bold: false },
  ],
  quote: {
    text: 'Finally cut the cord and saving $80/month compared to cable!',
    source: 'Michael T.',
    date: 'January 2026',
  },

  // Nhóm 3: Review Content
  reviewTitle: 'Sling TV Review 2026: Is It Still the Best Budget Option?',
  reviewSubtitle: 'Our experts test Sling TV to see if it lives up to its reputation as the most affordable live TV streaming service',
  reviewHeroImage: '/top10-images/sling-tv-review-hero.jpg',
  rating: 4.2,
  reviewCount: '12,458 Reviews',
  heroSummary: 'Sling TV continues to offer the most affordable entry point into live TV streaming. With packages starting at $40/month, it\'s nearly half the price of competitors while still delivering essential channels including ESPN, CNN, and local networks in select markets.',
  pros: [
    'Most affordable live TV streaming option',
    'Flexible package customization',
    'No contracts or hidden fees',
    'Good sports coverage with add-ons',
    'Works on all major streaming devices',
  ],
  cons: [
    'Limited local channel availability',
    'Only 50 hours of DVR storage',
    'Interface can feel dated',
    'No unlimited simultaneous streams',
  ],
  mainContent: `
<h2>What is Sling TV?</h2>
<p>Sling TV was the first major live TV streaming service to launch in 2015, and it remains one of the most popular options for cord-cutters. The service offers two base packages - Orange and Blue - that can be combined or supplemented with add-on packages.</p>

<h2>Sling TV Packages Explained</h2>
<h3>Sling Orange ($40/month)</h3>
<p>Best for sports fans with ESPN, ESPN2, and ESPN3. Includes 30+ channels and allows streaming on 1 device at a time.</p>

<h3>Sling Blue ($40/month)</h3>
<p>Better for news and entertainment with Fox News, MSNBC, and more local channels. Includes 40+ channels and allows streaming on 3 devices simultaneously.</p>

<h3>Sling Orange + Blue ($55/month)</h3>
<p>Combines both packages for the complete channel lineup and 4 simultaneous streams.</p>

<h2>Channel Lineup</h2>
<p>Sling TV offers a solid lineup of popular channels including ESPN, CNN, HGTV, Food Network, TNT, TBS, and more. However, it notably lacks some channels available on competitors, such as CBS and its family of networks.</p>

<h2>Streaming Quality & Performance</h2>
<p>In our testing, Sling TV delivered reliable 1080p streaming with minimal buffering. The service performs well across all major platforms including Roku, Fire TV, Apple TV, and mobile devices.</p>
`,
  verdict: 'Sling TV remains the best choice for budget-conscious cord-cutters who want live TV without breaking the bank. While it lacks some premium features and channels found in more expensive services, the value proposition is hard to beat at $40/month.',
  images: [
    '/top10-images/sling-tv-interface.jpg',
    '/top10-images/sling-tv-channels.jpg',
  ],

  // Nhóm 4: FAQ & Extras
  faqs: [
    {
      question: 'Does Sling TV have local channels?',
      answer: 'Sling TV offers ABC, NBC, and Fox in select markets through Sling Blue. Local channel availability varies by location.',
    },
    {
      question: 'Can I record shows on Sling TV?',
      answer: 'Yes, Sling TV includes 50 hours of cloud DVR storage. You can upgrade to 200 hours for an additional $5/month.',
    },
    {
      question: 'Is Sling TV good for sports?',
      answer: 'Sling Orange includes ESPN networks, making it great for sports. You can add Sports Extra for additional channels like NFL RedZone.',
    },
  ],
  userRatings: {
    overall: 4.2,
    value: 4.5,
    features: 4.0,
    ease_of_use: 4.1,
    support: 3.9,
  },

  // Nhóm 5: SEO
  metaTitle: 'Sling TV Review 2026: Pricing, Channels & Is It Worth It? | Top10',
  metaDescription: 'Read our in-depth Sling TV review. Compare packages, channels, pricing, and features to decide if Sling TV is the right streaming service for you.',
  ogImage: '/top10-images/sling-tv-og.jpg',
  canonical: '',
};

// ============================================
// PRODUCT DATA - Hulu + Live TV
// ============================================
export const huluLiveTvProduct = {
  // Nhóm 1: Metadata
  slug: 'hulu-live-tv',
  name: 'Hulu + Live TV',
  logoUrl: '/top10-images/2023_Logo_TVservices-HULUlive.20230209102529.png',
  ctaUrl: 'https://www.hulu.com/live-tv',
  ctaText: 'Try Hulu Live',
  reviewHref: '/tv-services/reviews/hulu-live-tv',
  status: 'published',

  // Nhóm 2: Category Listing
  rank: 2,
  ribbon: 'Best Overall',
  tagline: 'Live TV plus the best streaming library',
  bottomLine: 'Hulu + Live TV combines 90+ live channels with Hulu\'s massive on-demand library, Disney+, and ESPN+. It\'s the most complete entertainment package available.',
  bestFor: 'Families who want it all',
  basePrice: '$76.99/month',
  overallScore: 9.0,
  scoreLabel: 'Excellent',
  scores: {
    value: 8.5,
    channels: 9.5,
    features: 9.5,
    ease_of_use: 9.0,
    support: 8.5,
  },
  highlights: {
    starting_price: '$76.99/month',
    free_trial: '3 days',
    channels: '90+',
  },
  features: [
    { text: 'Includes Disney+ and ESPN+', bold: true },
    { text: '90+ live TV channels', bold: false },
    { text: 'Unlimited cloud DVR', bold: true },
    { text: 'Hulu on-demand library included', bold: false },
    { text: 'Watch on unlimited devices at home', bold: false },
  ],
  quote: {
    text: 'The Disney+ bundle makes this an incredible value for families.',
    source: 'Jennifer K.',
    date: 'January 2026',
  },

  // Nhóm 3: Review Content
  reviewTitle: 'Hulu + Live TV Review 2026: The Complete Entertainment Package',
  reviewSubtitle: 'Is Hulu Live worth the premium price? We break down everything you need to know',
  reviewHeroImage: '/top10-images/hulu-live-review-hero.jpg',
  rating: 4.4,
  reviewCount: '28,934 Reviews',
  heroSummary: 'Hulu + Live TV has evolved into the most comprehensive streaming package available. With 90+ live channels, unlimited DVR, the entire Hulu on-demand library, plus Disney+ and ESPN+ included, it offers unmatched value for families and entertainment enthusiasts.',
  pros: [
    'Includes Disney+ and ESPN+ at no extra cost',
    'Unlimited cloud DVR storage',
    'Excellent on-demand content library',
    '90+ live channels including local networks',
    'Great interface and recommendations',
  ],
  cons: [
    'Higher price point than competitors',
    'Base plan includes ads on Hulu content',
    'Only 2 simultaneous streams on base plan',
    'Some regional sports networks unavailable',
  ],
  mainContent: `
<h2>What is Hulu + Live TV?</h2>
<p>Hulu + Live TV combines live television streaming with Hulu's popular on-demand service. In 2024, the service was enhanced to include Disney+ and ESPN+ in all plans, making it an all-in-one entertainment solution.</p>

<h2>Channel Lineup</h2>
<p>Hulu + Live TV offers 90+ channels including all major broadcast networks (ABC, CBS, NBC, Fox), popular cable channels, and news networks. The lineup competes favorably with more expensive competitors.</p>

<h2>The Disney Bundle Advantage</h2>
<p>Every Hulu + Live TV subscription now includes Disney+ and ESPN+ at no additional cost. This adds thousands of movies, shows, and sporting events to your subscription value.</p>

<h2>DVR & On-Demand</h2>
<p>The unlimited cloud DVR is a major selling point, allowing you to record as much content as you want with 9-month storage. Combined with Hulu's extensive on-demand library, you'll never run out of content to watch.</p>
`,
  verdict: 'Hulu + Live TV offers the most complete entertainment package available. While the price is higher than some competitors, the inclusion of Disney+, ESPN+, unlimited DVR, and Hulu\'s on-demand library makes it exceptional value for families and entertainment enthusiasts.',
  images: [
    '/top10-images/hulu-live-interface.jpg',
    '/top10-images/hulu-live-sports.jpg',
  ],

  // Nhóm 4: FAQ & Extras
  faqs: [
    {
      question: 'Does Hulu + Live TV include regular Hulu?',
      answer: 'Yes, every Hulu + Live TV subscription includes the complete Hulu on-demand streaming library.',
    },
    {
      question: 'Is Disney+ really included free?',
      answer: 'Yes, all Hulu + Live TV plans now include Disney+ and ESPN+ at no additional charge.',
    },
    {
      question: 'How many devices can stream at once?',
      answer: 'The base plan allows 2 simultaneous streams. You can upgrade to unlimited streams at home for an additional fee.',
    },
  ],
  userRatings: {
    overall: 4.4,
    value: 4.2,
    features: 4.6,
    ease_of_use: 4.5,
    support: 4.0,
  },

  // Nhóm 5: SEO
  metaTitle: 'Hulu + Live TV Review 2026: Channels, Price & Disney Bundle | Top10',
  metaDescription: 'Complete Hulu + Live TV review with channel lineup, pricing, and features. Includes Disney+ and ESPN+. Find out if Hulu Live is right for you.',
  ogImage: '/top10-images/hulu-live-og.jpg',
  canonical: '',
};

// ============================================
// HOMEPAGE SETTINGS
// ============================================
export const homepageSettings = {
  heroTitle: 'Find the Best Products & Services',
  heroSubtitle: 'Expert reviews and comparisons to help you make informed decisions',

  statsListsCount: '500+',
  statsHoursCount: '5,000+',
  statsDecisionsCount: '16M+',

  missionTitle: 'Our Mission',
  missionContent: 'We help millions of consumers make better purchasing decisions by providing expert reviews, detailed comparisons, and unbiased recommendations.',

  brandLogos: [
    { name: 'Forbes', logo: '/top10-images/forbes-logo.png' },
    { name: 'New York Times', logo: '/top10-images/nyt-logo.png' },
    { name: 'Wall Street Journal', logo: '/top10-images/wsj-logo.png' },
    { name: 'TechCrunch', logo: '/top10-images/techcrunch-logo.png' },
  ],
};

// ============================================
// EXPORT ALL DATA
// ============================================
export const seedData = {
  authors: authorsData,
  categories: [tvServicesCategory],
  products: [slingTvProduct, huluLiveTvProduct],
  homepageSettings,
};

export default seedData;
