// prisma/seed.js
// Complete seed script with correct data structure
// Run with: node prisma/seed.js

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// ============================================
// CATEGORY GROUPS (Homepage Display)
// These are the parent groups shown on homepage dropdown
// ============================================
const categoryGroupsData = [
  { slug: 'lifestyle', name: 'Lifestyle', icon: '🎬', order: 1 },
  { slug: 'health-wellness', name: 'Health & Wellness', icon: '❤️', order: 2 },
  { slug: 'home', name: 'Home', icon: '🏠', order: 3 },
  { slug: 'business', name: 'Business', icon: '💼', order: 4 },
  { slug: 'security', name: 'Security', icon: '🔒', order: 5 },
];

// ============================================
// AUTHORS (E-E-A-T)
// ============================================
const authorsData = [
  {
    slug: 'phillip-richardson',
    name: 'Phillip Richardson',
    avatar: 'https://ui-avatars.com/api/?name=Phillip+Richardson&background=FE4A64&color=fff&size=128',
    title: 'Technology Writer',
    bio: 'Phillip Richardson is a technology writer specializing in streaming services, cord-cutting, and home entertainment.',
  },
  {
    slug: 'suzannah-weiss',
    name: 'Suzannah Weiss',
    avatar: 'https://ui-avatars.com/api/?name=Suzannah+Weiss&background=6366F1&color=fff&size=128',
    title: 'Dating Expert',
    bio: 'Suzannah Weiss is a dating and relationship expert with years of experience reviewing dating apps and services.',
  },
  {
    slug: 'sarah-chen',
    name: 'Sarah Chen',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=10B981&color=fff&size=128',
    title: 'Security Analyst',
    bio: 'Sarah Chen is a cybersecurity expert specializing in VPNs, password managers, and online privacy tools.',
  },
];

// ============================================
// CATEGORIES (Actual product categories with pages)
// Each category belongs to a CategoryGroup
// ============================================
const categoriesData = [
  {
    slug: 'tv-services',
    name: 'TV Services',
    icon: '📺',
    color: 'bg-blue-500',
    description: 'Compare the best TV streaming services for your entertainment needs.',
    groupSlug: 'lifestyle',
    featured: true,
    order: 1,
    heroImage: '/top10-images/tv-services-hero.jpg',
    heroTitle: 'Best TV Streaming Services of 2026',
    introContent: '<p>Looking for the best streaming service? Our experts have tested and reviewed all major TV streaming platforms to help you find the perfect option.</p>',
    criteriaDefinitions: [
      { key: 'channels', label: 'Channel Selection', maxScore: 10 },
      { key: 'price', label: 'Price & Value', maxScore: 10 },
      { key: 'features', label: 'Features', maxScore: 10 },
      { key: 'quality', label: 'Streaming Quality', maxScore: 10 },
    ],
    highlightDefinitions: [
      { key: 'startingPrice', label: 'Starting Price' },
      { key: 'freeTrialDays', label: 'Free Trial' },
      { key: 'channels', label: 'Channels' },
    ],
    methodologyIntro: 'Our team of experts evaluates each streaming service based on comprehensive testing.',
    methodologyCriteria: [
      { title: 'Channel Selection', description: 'We evaluate the variety and quality of channels available.' },
      { title: 'Price & Value', description: 'We compare pricing and features to determine overall value.' },
      { title: 'Streaming Quality', description: 'We test video quality, reliability, and device compatibility.' },
    ],
    tenThingsToKnow: [
      { title: 'Consider your viewing habits', description: 'Think about what types of content you watch most.' },
      { title: 'Check channel availability', description: 'Make sure your must-have channels are included.' },
      { title: 'Compare free trial periods', description: 'Most services offer 7-day free trials.' },
    ],
    faqs: [
      { question: 'What is the best streaming service?', answer: 'The best service depends on your needs. Sling TV is great for budget-conscious viewers, while YouTube TV offers the most comprehensive channel lineup.' },
      { question: 'Can I cancel anytime?', answer: 'Yes, all major streaming services offer month-to-month plans with no long-term contracts.' },
    ],
    metaTitle: 'Best TV Streaming Services 2026 | Compare Top 10',
    metaDescription: 'Compare the best TV streaming services of 2026. Our experts have tested Sling TV, YouTube TV, Hulu Live and more.',
  },
  {
    slug: 'dating',
    name: 'Dating',
    icon: '💕',
    color: 'bg-pink-500',
    description: 'Find the best dating apps and sites for your relationship goals.',
    groupSlug: 'lifestyle',
    featured: true,
    order: 2,
    heroImage: '/top10-images/dating-hero.jpg',
    heroTitle: 'Best Dating Sites & Apps of 2026',
    introContent: '<p>Finding love online has never been easier. Our dating experts have reviewed the top dating platforms to help you find your perfect match.</p>',
    criteriaDefinitions: [
      { key: 'matching', label: 'Matching Algorithm', maxScore: 10 },
      { key: 'userbase', label: 'User Base', maxScore: 10 },
      { key: 'features', label: 'Features', maxScore: 10 },
      { key: 'safety', label: 'Safety', maxScore: 10 },
    ],
    highlightDefinitions: [
      { key: 'startingPrice', label: 'Starting Price' },
      { key: 'ageRange', label: 'Age Range' },
      { key: 'successRate', label: 'Success Rate' },
    ],
    methodologyIntro: 'Our dating experts personally test each platform and evaluate user experiences.',
    methodologyCriteria: [
      { title: 'Matching Quality', description: 'We evaluate how well the algorithm matches compatible partners.' },
      { title: 'User Experience', description: 'We assess the ease of use and feature set.' },
      { title: 'Safety & Privacy', description: 'We review security measures and privacy policies.' },
    ],
    tenThingsToKnow: [
      { title: 'Define your goals', description: 'Know whether you want casual dating or a serious relationship.' },
      { title: 'Complete your profile', description: 'A complete profile gets 10x more matches.' },
      { title: 'Be patient', description: 'Finding the right match takes time.' },
    ],
    faqs: [
      { question: 'Which dating app is best for serious relationships?', answer: 'eHarmony is widely considered the best for serious relationships due to its compatibility-based matching.' },
      { question: 'Are dating apps safe?', answer: 'Reputable dating apps have safety features, but always meet in public places and trust your instincts.' },
    ],
    metaTitle: 'Best Dating Sites & Apps 2026 | Compare Top 10',
    metaDescription: 'Compare the best dating sites and apps of 2026. Expert reviews of eHarmony, Match, Bumble and more.',
  },
  {
    slug: 'vpn',
    name: 'VPN',
    icon: '🔐',
    color: 'bg-green-500',
    description: 'Protect your online privacy with the best VPN services.',
    groupSlug: 'security',
    featured: true,
    order: 1,
    heroImage: '/top10-images/vpn-hero.jpg',
    heroTitle: 'Best VPN Services of 2026',
    introContent: '<p>A VPN protects your online privacy and security. Our experts have tested the top VPN services to find the best options.</p>',
    criteriaDefinitions: [
      { key: 'speed', label: 'Speed', maxScore: 10 },
      { key: 'security', label: 'Security', maxScore: 10 },
      { key: 'privacy', label: 'Privacy', maxScore: 10 },
      { key: 'servers', label: 'Server Network', maxScore: 10 },
    ],
    highlightDefinitions: [
      { key: 'startingPrice', label: 'Starting Price' },
      { key: 'servers', label: 'Servers' },
      { key: 'devices', label: 'Devices' },
    ],
    methodologyIntro: 'Our security experts rigorously test each VPN for speed, security, and privacy.',
    methodologyCriteria: [
      { title: 'Speed Testing', description: 'We test connection speeds across multiple servers.' },
      { title: 'Security Audit', description: 'We verify encryption standards and security features.' },
      { title: 'Privacy Review', description: 'We examine logging policies and jurisdiction.' },
    ],
    faqs: [
      { question: 'Do I need a VPN?', answer: 'If you value your online privacy or use public WiFi, a VPN is essential.' },
      { question: 'Will a VPN slow down my internet?', answer: 'Premium VPNs like NordVPN have minimal speed impact.' },
    ],
    metaTitle: 'Best VPN Services 2026 | Compare Top 10',
    metaDescription: 'Compare the best VPN services of 2026. Expert reviews of NordVPN, ExpressVPN, Surfshark and more.',
  },
];

// ============================================
// PRODUCTS (Under categories)
// ============================================
const productsData = {
  'tv-services': [
    {
      slug: 'sling-tv',
      name: 'Sling TV',
      logoUrl: '/top10-images/2023_Logo_Sling.20230504145133.png',
      rank: 1,
      ribbon: 'Best Value',
      tagline: 'Best budget-friendly streaming option',
      bottomLine: 'Sling TV offers affordable live TV streaming with flexible package options starting at just $40/month.',
      bestFor: 'Budget-conscious cord cutters',
      basePrice: '$40/month',
      overallScore: 9.2,
      scoreLabel: 'Excellent',
      scores: { channels: 8.5, price: 9.5, features: 8.8, quality: 9.0 },
      highlights: { startingPrice: '$40/month', freeTrialDays: '3 days', channels: '30+' },
      features: [
        { text: 'Orange + Blue packages', bold: true },
        { text: 'Sports Extra add-on', bold: false },
        { text: 'Cloud DVR included', bold: false },
      ],
      pros: ['Most affordable option', 'Flexible packages', 'No contract required'],
      cons: ['Limited local channels', 'Some features cost extra'],
      ctaUrl: 'https://www.sling.com',
      ctaText: 'Try Sling TV',
      reviewHref: '/tv-services/reviews/sling-tv',
      status: 'published',
    },
    {
      slug: 'youtube-tv',
      name: 'YouTube TV',
      logoUrl: '/top10-images/youtube-tv.png',
      rank: 2,
      ribbon: 'Most Channels',
      tagline: 'Comprehensive live TV streaming',
      bottomLine: 'YouTube TV offers 100+ channels with unlimited DVR storage for a premium price.',
      bestFor: 'Viewers who want everything',
      basePrice: '$72.99/month',
      overallScore: 9.0,
      scoreLabel: 'Excellent',
      scores: { channels: 9.5, price: 7.5, features: 9.2, quality: 9.5 },
      highlights: { startingPrice: '$72.99/month', freeTrialDays: '7 days', channels: '100+' },
      features: [
        { text: 'Unlimited DVR storage', bold: true },
        { text: '100+ channels', bold: false },
        { text: '6 accounts per household', bold: false },
      ],
      pros: ['Most channels', 'Unlimited DVR', 'Great interface'],
      cons: ['Higher price', 'Price increases'],
      ctaUrl: 'https://tv.youtube.com',
      ctaText: 'Try YouTube TV',
      reviewHref: '/tv-services/reviews/youtube-tv',
      status: 'published',
    },
    {
      slug: 'hulu-live-tv',
      name: 'Hulu + Live TV',
      logoUrl: '/top10-images/2023_Logo_TVservices-HULUlive.20230209102529.png',
      rank: 3,
      tagline: 'Live TV plus on-demand library',
      bottomLine: 'Hulu + Live TV combines live TV with Hulu\'s extensive on-demand content library.',
      bestFor: 'Viewers who want live TV and on-demand',
      basePrice: '$76.99/month',
      overallScore: 8.8,
      scoreLabel: 'Very Good',
      scores: { channels: 9.0, price: 7.0, features: 9.0, quality: 9.0 },
      highlights: { startingPrice: '$76.99/month', freeTrialDays: '3 days', channels: '90+' },
      features: [
        { text: 'Disney+ and ESPN+ included', bold: true },
        { text: 'Hulu on-demand library', bold: false },
        { text: 'Unlimited DVR', bold: false },
      ],
      pros: ['Includes Disney+ bundle', 'Great on-demand content', '90+ channels'],
      cons: ['Expensive', 'Ads on basic plan'],
      ctaUrl: 'https://www.hulu.com/live-tv',
      ctaText: 'Try Hulu Live',
      reviewHref: '/tv-services/reviews/hulu-live-tv',
      status: 'published',
    },
  ],
  'dating': [
    {
      slug: 'eharmony',
      name: 'eHarmony',
      logoUrl: '/top10-images/eharmony-logo.png',
      rank: 1,
      ribbon: 'Best Overall',
      tagline: 'Best for serious relationships',
      bottomLine: 'eHarmony uses a scientific compatibility matching system to help singles find lasting love.',
      bestFor: 'Singles seeking serious relationships',
      basePrice: '$35.90/month',
      overallScore: 9.5,
      scoreLabel: 'Excellent',
      scores: { matching: 9.8, userbase: 9.0, features: 9.2, safety: 9.5 },
      highlights: { startingPrice: '$35.90/month', ageRange: '25-55', successRate: 'Highest' },
      features: [
        { text: 'Compatibility matching', bold: true },
        { text: 'Video dating', bold: false },
        { text: 'Guided communication', bold: false },
      ],
      pros: ['Best matching algorithm', 'High success rate', 'Quality members'],
      cons: ['Expensive', 'Longer signup process'],
      ctaUrl: 'https://www.eharmony.com',
      ctaText: 'Try eHarmony',
      reviewHref: '/dating/reviews/eharmony',
      reviewTitle: 'eHarmony Dating Site Review (2026)',
      reviewSubtitle: 'The Best Dating App for Finding True Love',
      rating: 4.5,
      reviewCount: '3,598 Reviews',
      heroSummary: 'eHarmony stands out as the premier dating platform for individuals serious about finding long-term love.',
      mainContent: '<h2>Our eHarmony Review</h2><p>eHarmony has been matching singles since 2000...</p>',
      verdict: 'eHarmony is our top pick for serious relationship seekers.',
      status: 'published',
    },
    {
      slug: 'match-com',
      name: 'Match.com',
      logoUrl: '/top10-images/match-logo.png',
      rank: 2,
      tagline: 'The original dating site',
      bottomLine: 'Match.com has been connecting singles since 1995 with a large, active user base.',
      bestFor: 'Singles of all ages',
      basePrice: '$24.99/month',
      overallScore: 9.0,
      scoreLabel: 'Excellent',
      scores: { matching: 8.8, userbase: 9.5, features: 9.0, safety: 9.0 },
      highlights: { startingPrice: '$24.99/month', ageRange: '18-65+', successRate: 'High' },
      features: [
        { text: 'Largest user base', bold: true },
        { text: 'Match Events', bold: false },
        { text: 'Daily matches', bold: false },
      ],
      pros: ['Huge user base', 'All age groups', 'Match Events'],
      cons: ['Some inactive profiles', 'Can be overwhelming'],
      ctaUrl: 'https://www.match.com',
      ctaText: 'Try Match',
      reviewHref: '/dating/reviews/match-com',
      status: 'published',
    },
  ],
  'vpn': [
    {
      slug: 'nordvpn',
      name: 'NordVPN',
      logoUrl: '/top10-images/nordvpn-logo.png',
      rank: 1,
      ribbon: 'Best Overall',
      tagline: 'Best overall VPN service',
      bottomLine: 'NordVPN offers the best combination of speed, security, and features.',
      bestFor: 'All-around protection',
      basePrice: '$3.99/month',
      overallScore: 9.6,
      scoreLabel: 'Excellent',
      scores: { speed: 9.5, security: 9.8, privacy: 9.5, servers: 9.5 },
      highlights: { startingPrice: '$3.99/month', servers: '5,500+', devices: '6' },
      features: [
        { text: 'Double VPN', bold: true },
        { text: 'No-logs policy', bold: false },
        { text: 'Threat Protection', bold: false },
      ],
      pros: ['Fast speeds', 'Strong security', 'Great apps'],
      cons: ['Expensive monthly plan', 'Occasional connection drops'],
      ctaUrl: 'https://www.nordvpn.com',
      ctaText: 'Try NordVPN',
      reviewHref: '/vpn/reviews/nordvpn',
      status: 'published',
    },
    {
      slug: 'expressvpn',
      name: 'ExpressVPN',
      logoUrl: '/top10-images/expressvpn-logo.png',
      rank: 2,
      tagline: 'Fastest VPN service',
      bottomLine: 'ExpressVPN is the fastest VPN with excellent apps and customer support.',
      bestFor: 'Speed enthusiasts',
      basePrice: '$8.32/month',
      overallScore: 9.4,
      scoreLabel: 'Excellent',
      scores: { speed: 9.8, security: 9.5, privacy: 9.5, servers: 9.0 },
      highlights: { startingPrice: '$8.32/month', servers: '3,000+', devices: '5' },
      features: [
        { text: 'Fastest speeds', bold: true },
        { text: 'TrustedServer technology', bold: false },
        { text: '24/7 support', bold: false },
      ],
      pros: ['Fastest speeds', 'Excellent support', 'Easy to use'],
      cons: ['Most expensive', 'Only 5 devices'],
      ctaUrl: 'https://www.expressvpn.com',
      ctaText: 'Try ExpressVPN',
      reviewHref: '/vpn/reviews/expressvpn',
      status: 'published',
    },
  ],
};

// ============================================
// MAIN SEED FUNCTION
// ============================================
async function main() {
  console.log('🌱 Starting seed...\n');

  // ========== STEP 1: Clear existing data ==========
  console.log('🗑️  Clearing existing data...');
  await prisma.product.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.categoryGroup.deleteMany({});
  await prisma.author.deleteMany({});
  // Keep admin user
  console.log('  ✓ Cleared all content data\n');

  // ========== STEP 2: Create admin user ==========
  console.log('👤 Creating admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const existingAdmin = await prisma.admin.findUnique({ where: { username: 'admin' } });

  if (!existingAdmin) {
    await prisma.admin.create({
      data: { username: 'admin', password: hashedPassword },
    });
    console.log('  ✓ Admin user created\n');
  } else {
    console.log('  ⏭️ Admin user already exists\n');
  }

  // ========== STEP 3: Create Category Groups ==========
  console.log('📁 Creating category groups...');
  const createdGroups = {};

  for (const group of categoryGroupsData) {
    const created = await prisma.categoryGroup.create({
      data: {
        slug: group.slug,
        name: group.name,
        icon: group.icon,
        order: group.order,
      },
    });
    createdGroups[group.slug] = created.id;
    console.log(`  ✓ Created group: ${group.name}`);
  }
  console.log('');

  // ========== STEP 4: Create Authors ==========
  console.log('✍️  Creating authors...');
  const createdAuthors = {};

  for (const author of authorsData) {
    const created = await prisma.author.create({
      data: {
        slug: author.slug,
        name: author.name,
        avatar: author.avatar,
        title: author.title,
        bio: author.bio,
      },
    });
    createdAuthors[author.slug] = created.id;
    console.log(`  ✓ Created author: ${author.name}`);
  }
  console.log('');

  // ========== STEP 5: Create Categories ==========
  console.log('📂 Creating categories...');
  const createdCategories = {};

  for (const category of categoriesData) {
    const groupId = createdGroups[category.groupSlug];

    const created = await prisma.category.create({
      data: {
        slug: category.slug,
        name: category.name,
        icon: category.icon,
        color: category.color,
        description: category.description,
        groupId: groupId,
        featured: category.featured,
        order: category.order,
        heroImage: category.heroImage,
        heroTitle: category.heroTitle,
        introContent: category.introContent,
        criteriaDefinitions: category.criteriaDefinitions,
        highlightDefinitions: category.highlightDefinitions,
        methodologyIntro: category.methodologyIntro,
        methodologyCriteria: category.methodologyCriteria,
        tenThingsToKnow: category.tenThingsToKnow,
        faqs: category.faqs,
        metaTitle: category.metaTitle,
        metaDescription: category.metaDescription,
      },
    });
    createdCategories[category.slug] = created.id;
    console.log(`  ✓ Created category: ${category.name} (under ${category.groupSlug})`);
  }
  console.log('');

  // ========== STEP 6: Create Products ==========
  console.log('📦 Creating products...');

  for (const [categorySlug, products] of Object.entries(productsData)) {
    const categoryId = createdCategories[categorySlug];
    if (!categoryId) continue;

    for (const product of products) {
      await prisma.product.create({
        data: {
          slug: product.slug,
          name: product.name,
          logoUrl: product.logoUrl,
          rank: product.rank,
          ribbon: product.ribbon,
          tagline: product.tagline,
          bottomLine: product.bottomLine,
          bestFor: product.bestFor,
          basePrice: product.basePrice,
          overallScore: product.overallScore,
          scoreLabel: product.scoreLabel,
          scores: product.scores,
          highlights: product.highlights,
          features: product.features,
          pros: product.pros,
          cons: product.cons,
          ctaUrl: product.ctaUrl,
          ctaText: product.ctaText,
          reviewHref: product.reviewHref,
          reviewTitle: product.reviewTitle,
          reviewSubtitle: product.reviewSubtitle,
          rating: product.rating,
          reviewCount: product.reviewCount,
          heroSummary: product.heroSummary,
          mainContent: product.mainContent,
          verdict: product.verdict,
          status: product.status,
          categoryId: categoryId,
        },
      });
      console.log(`  ✓ Created product: ${product.name} (${categorySlug})`);
    }
  }
  console.log('');

  // ========== SUMMARY ==========
  console.log('✅ Seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   - Category Groups: ${Object.keys(createdGroups).length}`);
  console.log(`   - Authors: ${Object.keys(createdAuthors).length}`);
  console.log(`   - Categories: ${Object.keys(createdCategories).length}`);

  let totalProducts = 0;
  for (const products of Object.values(productsData)) {
    totalProducts += products.length;
  }
  console.log(`   - Products: ${totalProducts}`);

  console.log('\n🔑 Admin credentials:');
  console.log('   Username: admin');
  console.log('   Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
