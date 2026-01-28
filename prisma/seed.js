// prisma/seed.js
// Simple JavaScript seed script - run with: node prisma/seed.js

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Categories data
const categoriesData = [
  { slug: 'lifestyle', name: 'Lifestyle', icon: '/icons/lifestyle.svg', color: 'bg-white', featured: true, order: 1 },
  { slug: 'health', name: 'Health & Wellness', icon: '/icons/health.svg', color: 'bg-white', featured: true, order: 2 },
  { slug: 'home', name: 'Home', icon: '/icons/home.svg', color: 'bg-white', featured: true, order: 3 },
  { slug: 'business', name: 'Business', icon: '/icons/business.svg', color: 'bg-white', featured: true, order: 4 },
  { slug: 'security', name: 'Security', icon: '/icons/security.svg', color: 'bg-white', featured: false, order: 5 },
];

// Sample products data
const productsData = {
  lifestyle: [
    {
      rank: 1,
      slug: 'eharmony',
      name: 'eHarmony',
      ribbon: 'Best Overall',
      tagline: 'Best Overall Dating Service',
      bottomLine: 'eHarmony uses a scientific approach to match singles based on compatibility.',
      logoUrl: '/top10/1.jpg',
      overallScore: 9.6,
      scoreLabel: 'Excellent',
      basePrice: '$35.90/month',
      features: [
        { text: 'Compatibility matching system', bold: true },
        { text: 'Video dating feature', bold: false },
        { text: 'Identity verification', bold: false }
      ],
      pros: ['Highest success rate', 'Quality matches', 'Large user base'],
      cons: ['More expensive', 'Time-consuming sign-up'],
      ctaUrl: 'https://www.eharmony.com',
      status: 'published',
    },
    {
      rank: 2,
      slug: 'match-com',
      name: 'Match.com',
      tagline: 'Best for Serious Relationships',
      bottomLine: 'Match.com has been connecting singles since 1995 with proven success.',
      logoUrl: '/top10/2.jpg',
      overallScore: 9.2,
      scoreLabel: 'Very Good',
      basePrice: '$24.99/month',
      features: [
        { text: 'Advanced search filters', bold: true },
        { text: 'Daily matches', bold: false },
        { text: 'Match Events', bold: false }
      ],
      pros: ['Large user base', 'Affordable pricing'],
      cons: ['Some inactive profiles'],
      ctaUrl: 'https://www.match.com',
      status: 'published',
    },
  ],
  health: [
    {
      rank: 1,
      slug: 'betterhelp',
      name: 'BetterHelp',
      ribbon: 'Best Overall',
      tagline: 'Best Online Therapy Platform',
      bottomLine: 'BetterHelp provides convenient and affordable online counseling.',
      logoUrl: '/top10/1.jpg',
      overallScore: 9.4,
      scoreLabel: 'Excellent',
      basePrice: '$60-90/week',
      features: [
        { text: 'Licensed therapists', bold: true },
        { text: 'Multiple communication options', bold: false },
        { text: 'Flexible scheduling', bold: false }
      ],
      pros: ['Convenient', 'Affordable', 'Wide therapist network'],
      cons: ['No insurance accepted', 'Not for emergencies'],
      ctaUrl: 'https://www.betterhelp.com',
      status: 'published',
    },
  ],
  home: [
    {
      rank: 1,
      slug: 'adt',
      name: 'ADT',
      ribbon: 'Best Overall',
      tagline: 'Best Home Security System',
      bottomLine: 'ADT provides comprehensive home security with 24/7 monitoring.',
      logoUrl: '/top10/1.jpg',
      overallScore: 9.0,
      scoreLabel: 'Excellent',
      basePrice: '$28.99/month',
      features: [
        { text: '24/7 monitoring', bold: true },
        { text: 'Smart home integration', bold: false },
        { text: 'Professional installation', bold: false }
      ],
      pros: ['Reliable service', 'Wide coverage'],
      cons: ['Long contracts', 'Higher cost'],
      ctaUrl: 'https://www.adt.com',
      status: 'published',
    },
  ],
  business: [
    {
      rank: 1,
      slug: 'salesforce',
      name: 'Salesforce',
      ribbon: 'Best Overall',
      tagline: 'Best CRM Software',
      bottomLine: 'Salesforce is the world leading CRM platform for businesses.',
      logoUrl: '/top10/1.jpg',
      overallScore: 9.2,
      scoreLabel: 'Excellent',
      basePrice: '$25/user/month',
      features: [
        { text: 'Sales automation', bold: true },
        { text: 'Analytics', bold: false },
        { text: 'AppExchange', bold: false }
      ],
      pros: ['Comprehensive features', 'Scalable'],
      cons: ['Steep learning curve', 'Expensive'],
      ctaUrl: 'https://www.salesforce.com',
      status: 'published',
    },
  ],
  security: [
    {
      rank: 1,
      slug: 'nordvpn',
      name: 'NordVPN',
      ribbon: 'Best Overall',
      tagline: 'Best Overall VPN Service',
      bottomLine: 'NordVPN offers fast, secure VPN service with global coverage.',
      logoUrl: '/top10/1.jpg',
      overallScore: 9.6,
      scoreLabel: 'Excellent',
      basePrice: '$3.99/month',
      features: [
        { text: '5500+ servers', bold: true },
        { text: 'No-logs policy', bold: false },
        { text: 'Double VPN', bold: false }
      ],
      pros: ['Fast speeds', 'Strong security', 'User-friendly'],
      cons: ['Occasional connection drops'],
      ctaUrl: 'https://www.nordvpn.com',
      status: 'published',
    },
  ],
};

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  console.log('👤 Creating admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const existingAdmin = await prisma.admin.findUnique({
    where: { username: 'admin' }
  });

  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
      },
    });
    console.log('  ✓ Admin user created');
  } else {
    console.log('  ⏭️ Admin user already exists');
  }

  // Create categories
  console.log('📁 Creating categories...');
  const createdCategories = {};

  for (const cat of categoriesData) {
    const existing = await prisma.category.findUnique({
      where: { slug: cat.slug }
    });

    if (!existing) {
      const created = await prisma.category.create({
        data: cat,
      });
      createdCategories[cat.slug] = created.id;
      console.log(`  ✓ Created category: ${cat.name}`);
    } else {
      createdCategories[cat.slug] = existing.id;
      console.log(`  ⏭️ Category exists: ${cat.name}`);
    }
  }

  // Create products
  console.log('📦 Creating products...');
  for (const [categorySlug, products] of Object.entries(productsData)) {
    const categoryId = createdCategories[categorySlug];
    if (!categoryId) continue;

    for (const product of products) {
      const existing = await prisma.product.findFirst({
        where: {
          slug: product.slug,
          categoryId: categoryId
        }
      });

      if (!existing) {
        await prisma.product.create({
          data: {
            slug: product.slug,
            name: product.name,
            tagline: product.tagline,
            bottomLine: product.bottomLine,
            logoUrl: product.logoUrl,
            overallScore: product.overallScore,
            scoreLabel: product.scoreLabel,
            basePrice: product.basePrice,
            features: product.features,
            pros: product.pros,
            cons: product.cons,
            ctaUrl: product.ctaUrl,
            ribbon: product.ribbon,
            rank: product.rank,
            status: product.status,
            categoryId,
          },
        });
        console.log(`  ✓ Created product: ${product.name}`);
      } else {
        console.log(`  ⏭️ Product exists: ${product.name}`);
      }
    }
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
