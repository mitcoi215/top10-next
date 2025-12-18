// prisma/seed.ts
// Seed script to import initial data into MongoDB

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
const productsData: Record<string, Array<{
  rank: number;
  title: string;
  description: string;
  detailedDescription?: string;
  image: string;
  rating?: number;
  price?: string;
  features: string[];
  pros: string[];
  cons: string[];
  affiliateLink: string;
  featured: boolean;
}>> = {
  lifestyle: [
    {
      rank: 1,
      title: 'eHarmony - Best Overall Dating Service',
      description: 'eHarmony uses a scientific approach to match singles based on compatibility.',
      detailedDescription: 'eHarmony stands out as the premier dating platform for individuals serious about finding long-term love.',
      image: '/top10/1.jpg',
      rating: 4.8,
      price: '$35.90/month',
      features: ['Compatibility matching system', 'Video dating feature', 'Identity verification'],
      pros: ['Highest success rate', 'Quality matches', 'Large user base'],
      cons: ['More expensive', 'Time-consuming sign-up'],
      affiliateLink: 'https://www.eharmony.com',
      featured: true,
    },
    {
      rank: 2,
      title: 'Match.com - Best for Serious Relationships',
      description: 'Match.com has been connecting singles since 1995.',
      image: '/top10/2.jpg',
      rating: 4.6,
      price: '$24.99/month',
      features: ['Advanced search filters', 'Daily matches', 'Match Events'],
      pros: ['Large user base', 'Affordable pricing'],
      cons: ['Some inactive profiles'],
      affiliateLink: 'https://www.match.com',
      featured: false,
    },
  ],
  health: [
    {
      rank: 1,
      title: 'BetterHelp - Best Online Therapy',
      description: 'BetterHelp provides convenient and affordable online counseling.',
      image: '/top10/1.jpg',
      rating: 4.7,
      price: '$60-90/week',
      features: ['Licensed therapists', 'Multiple communication options', 'Flexible scheduling'],
      pros: ['Convenient', 'Affordable', 'Wide therapist network'],
      cons: ['No insurance accepted', 'Not for emergencies'],
      affiliateLink: 'https://www.betterhelp.com',
      featured: true,
    },
  ],
  home: [
    {
      rank: 1,
      title: 'ADT - Best Home Security System',
      description: 'ADT provides comprehensive home security with 24/7 monitoring.',
      image: '/top10/1.jpg',
      rating: 4.5,
      price: '$28.99/month',
      features: ['24/7 monitoring', 'Smart home integration', 'Professional installation'],
      pros: ['Reliable service', 'Wide coverage'],
      cons: ['Long contracts', 'Higher cost'],
      affiliateLink: 'https://www.adt.com',
      featured: true,
    },
  ],
  business: [
    {
      rank: 1,
      title: 'Salesforce - Best CRM Software',
      description: 'Salesforce is the world leading CRM platform for businesses.',
      image: '/top10/1.jpg',
      rating: 4.6,
      price: '$25/user/month',
      features: ['Sales automation', 'Analytics', 'AppExchange'],
      pros: ['Comprehensive features', 'Scalable'],
      cons: ['Steep learning curve', 'Expensive'],
      affiliateLink: 'https://www.salesforce.com',
      featured: true,
    },
  ],
  security: [
    {
      rank: 1,
      title: 'NordVPN - Best Overall VPN',
      description: 'NordVPN offers fast, secure VPN service with global coverage.',
      image: '/top10/1.jpg',
      rating: 4.8,
      price: '$3.99/month',
      features: ['5500+ servers', 'No-logs policy', 'Double VPN'],
      pros: ['Fast speeds', 'Strong security', 'User-friendly'],
      cons: ['Occasional connection drops'],
      affiliateLink: 'https://www.nordvpn.com',
      featured: true,
    },
  ],
};

async function main() {
  console.log('🌱 Starting seed...');

  // Skip clearing data to avoid replica set requirement
  // For fresh database, this is fine
  console.log('📝 Note: Skipping data clear (use MongoDB Compass to clear manually if needed)');

  // Create admin user (upsert to avoid duplicates)
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
    console.log('  ⏭️ Admin user already exists, skipping');
  }

  // Create categories (check if exists first)
  console.log('📁 Creating categories...');
  const createdCategories: Record<string, string> = {};

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

  // Create products (check by title to avoid duplicates)
  console.log('📦 Creating products...');
  for (const [categorySlug, products] of Object.entries(productsData)) {
    const categoryId = createdCategories[categorySlug];
    if (!categoryId) continue;

    for (const product of products) {
      const existing = await prisma.product.findFirst({
        where: {
          title: product.title,
          categoryId: categoryId
        }
      });

      if (!existing) {
        await prisma.product.create({
          data: {
            ...product,
            categoryId,
          },
        });
        console.log(`  ✓ Created product: ${product.title}`);
      } else {
        console.log(`  ⏭️ Product exists: ${product.title}`);
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
