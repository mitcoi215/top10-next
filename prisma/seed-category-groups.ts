// prisma/seed-category-groups.ts
// Seed script to populate CategoryGroups and Categories for homepage hero dropdown

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Category Groups with their categories - matching original top10.com structure
const categoryGroupsData = [
  {
    slug: 'lifestyle',
    name: 'Lifestyle',
    icon: '/top10-images/lifestyle.20240115133645.svg',
    order: 1,
    categories: [
      { slug: 'dating', name: 'Dating', exploreHref: '/dating', compareHref: '/dating/comparison' },
      { slug: 'meal-delivery', name: 'Meal Delivery Services', exploreHref: '/meal-delivery', compareHref: '/meal-delivery/comparison' },
      { slug: 'tv-services', name: 'TV Services', exploreHref: '/tv-services', compareHref: '/tv-services/live-tv-comparison' },
      { slug: 'mobile-plans', name: 'Mobile Plans', exploreHref: '/mobile-plans', compareHref: '/mobile-plans/comparison' },
      { slug: 'language-learning', name: 'Language Learning', exploreHref: '/language-learning', compareHref: '/language-learning/comparison' },
    ],
  },
  {
    slug: 'health-wellness',
    name: 'Health & Wellness',
    icon: '/top10-images/health.20240115133541.svg',
    order: 2,
    categories: [
      { slug: 'online-therapy', name: 'Online Therapy', exploreHref: '/online-therapy', compareHref: '/online-therapy/comparison' },
      { slug: 'medical-alerts', name: 'Medical alerts', exploreHref: '/medical-alerts', compareHref: '/medical-alerts/comparison' },
      { slug: 'hearing-aid', name: 'Hearing Aids', exploreHref: '/hearing-aid', compareHref: '/hearing-aid/comparison' },
      { slug: 'dna-testing', name: 'DNA Testing', exploreHref: '/dna-testing', compareHref: '/dna-testing/comparison' },
    ],
  },
  {
    slug: 'home',
    name: 'Home',
    icon: '/top10-images/home.20240115133606.svg',
    order: 3,
    categories: [
      { slug: 'moving-companies', name: 'Moving', exploreHref: '/moving-companies', compareHref: '/moving-companies/longdistance-comparison' },
      { slug: 'home-warranty', name: 'Home Warranty', exploreHref: '/home-warranty', compareHref: '/home-warranty/comparison' },
      { slug: 'home-security', name: 'Home security', exploreHref: '/home-security', compareHref: '/home-security/comparison' },
      { slug: 'internet-providers', name: 'Internet Service Providers', exploreHref: '/internet-providers', compareHref: '/internet-providers/comparison' },
    ],
  },
  {
    slug: 'business',
    name: 'Business',
    icon: '/top10-images/business.20240115133519.svg',
    order: 4,
    categories: [
      { slug: 'crm', name: 'CRM', exploreHref: '/crm', compareHref: '/crm/comparison' },
      { slug: 'website-builders', name: 'Website Builders', exploreHref: '/website-builders', compareHref: '/website-builders/comparison' },
      { slug: 'hosting', name: 'Hosting Services', exploreHref: '/hosting', compareHref: '/hosting/comparison' },
      { slug: 'legal-services', name: 'Legal Services & LLC Registration', exploreHref: '/legal-services', compareHref: '/legal-services/llc-registration-comparison' },
      { slug: 'project-management', name: 'Project Management Software', exploreHref: '/project-management', compareHref: '/project-management/comparison' },
      { slug: 'voip', name: 'VoIP', exploreHref: '/voip', compareHref: '/voip/comparison' },
      { slug: 'pos', name: 'POS', exploreHref: '/pos', compareHref: '/pos/comparison' },
      { slug: 'payroll', name: 'Payroll', exploreHref: '/payroll', compareHref: '/payroll/comparison' },
      { slug: 'merchant-services', name: 'Merchant Services', exploreHref: '/merchant-services', compareHref: '/merchant-services/comparison' },
      { slug: 'accounting-software', name: 'Accounting Software', exploreHref: '/accounting-software', compareHref: '/accounting-software/comparison' },
    ],
  },
  {
    slug: 'security',
    name: 'Security',
    icon: '/top10-images/security.20240115133625.svg',
    order: 5,
    categories: [
      { slug: 'background-check', name: 'Background Check', exploreHref: '/background-check', compareHref: '/background-check/comparison' },
      { slug: 'id-theft', name: 'ID Theft', exploreHref: '/id-theft', compareHref: '/id-theft/comparison' },
      { slug: 'cyber-security', name: 'Cyber security', exploreHref: '/cyber-security', compareHref: '/cyber-security/comparison' },
    ],
  },
];

async function main() {
  console.log('🌱 Starting category groups seed...');

  for (const groupData of categoryGroupsData) {
    const { categories, ...groupInfo } = groupData;

    // Upsert CategoryGroup
    const group = await prisma.categoryGroup.upsert({
      where: { slug: groupInfo.slug },
      update: {
        name: groupInfo.name,
        icon: groupInfo.icon,
        order: groupInfo.order,
      },
      create: groupInfo,
    });

    console.log(`✓ Upserted group: ${group.name}`);

    // Upsert Categories for this group
    let catOrder = 1;
    for (const catData of categories) {
      const category = await prisma.category.upsert({
        where: { slug: catData.slug },
        update: {
          name: catData.name,
          exploreHref: catData.exploreHref,
          compareHref: catData.compareHref,
          groupId: group.id,
          order: catOrder,
        },
        create: {
          slug: catData.slug,
          name: catData.name,
          icon: '/icons/default.svg',
          exploreHref: catData.exploreHref,
          compareHref: catData.compareHref,
          groupId: group.id,
          order: catOrder,
        },
      });

      console.log(`  ✓ Upserted category: ${category.name}`);
      catOrder++;
    }
  }

  console.log('✅ Category groups seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
