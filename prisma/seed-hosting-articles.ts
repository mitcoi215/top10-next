// prisma/seed-hosting-articles.ts
// Seed more articles for hosting category to match reference

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const hostingArticles = [
  {
    slug: 'hostgator-alternatives-top-website-hosting-services',
    title: 'HostGator Alternatives: Top 5 Website Hosting Services in 2026',
    excerpt: 'HostGator is an incredible web hosting provider, but it might not be a good fit for people looking for cheaper short-term hosting plans or hands-on...',
    featuredImage: 'https://images.10rating/f_auto,q_auto,t_agg-articles-thumb/v1/production/articles/uploads/photo/shutterstock_22060799331.20251215104059.jpg',
    publishedAt: new Date('2025-12-15'),
  },
  {
    slug: 'ipage-hosting-alternatives-for-great-vps-speed-and-security',
    title: 'iPage Alternatives: Top 5 Hosting Services for Great VPS, Speed &...',
    excerpt: 'There is a reason iPage is among some of the most prominent web hosting companies available. Its easy-to-use interface and affordable plans are ter...',
    featuredImage: 'https://images.10rating/f_auto,q_auto,t_agg-articles-thumb/v1/production/articles/uploads/photo/shutterstock_24899185871.20251215103955.jpg',
    publishedAt: new Date('2025-12-15'),
  },
  {
    slug: 'best-domain-hosting-with-registrars',
    title: 'Top 10 Best Domain Name Registrars Sites & Services',
    excerpt: 'Getting a new website online requires a few different things. At the very least, you need a website design, a web host, and a domain name.',
    featuredImage: 'https://images.10rating/f_auto,q_auto,t_agg-articles-thumb/v1/production/articles/uploads/photo/BestDomainHostingWithRegistrars.20221003124925.jpg',
    publishedAt: new Date('2025-12-12'),
  },
  {
    slug: 'siteground-alternatives',
    title: 'SiteGround Alternatives: Top 5 Web Hosting Services & Companies t...',
    excerpt: 'Recently, I explored web hosting options beyond SiteGround. I discovered a range of dependable solutions that can meet your site\'s needs and ensure...',
    featuredImage: 'https://images.10rating/f_auto,q_auto,t_agg-articles-thumb/v1/production/article/uploads/photo/Hosting_1-1765288589873.20251209135859.jpg',
    publishedAt: new Date('2025-12-09'),
  },
  {
    slug: 'best-cloud-hosting-services',
    title: 'The 10 Best Cloud Web Hosting Services for Your Business in 2026',
    excerpt: 'Slow site speeds and frequent data storage caps can throttle business growth. Explore how cloud web hosting services offer scalable solutions that ...',
    featuredImage: 'https://images.10rating/f_auto,q_auto,t_agg-articles-thumb/v1/production/article/uploads/photo/Hosting_1-1765288589873.20251209135858.jpg',
    publishedAt: new Date('2025-12-09'),
  },
  {
    slug: '10-reasons-you-need-a-custom-business-email-for-your-small-business',
    title: '10 Reasons You Need a Custom Business Email for Your Small Business',
    excerpt: 'Custom business email accounts are just as important to small businesses as larger ones.',
    featuredImage: 'https://images.10rating/f_auto,q_auto,t_agg-articles-thumb/v1/production/article/uploads/photo/Hosting_1-1765288589873.20251209135858.jpg',
    publishedAt: new Date('2025-12-09'),
  },
  {
    slug: 'selecting-the-best-top-level-domain-for-your-business',
    title: 'Selecting the Best Top-Level Domain for Your Business',
    excerpt: 'Choosing the perfect top-level domain (TLD) for your business website is more than just a technical requirement—it\'s a strategic move that can sign...',
    featuredImage: 'https://images.10rating/f_auto,q_auto,t_agg-articles-thumb/v1/production/article/uploads/photo/Hosting_1-1765288589873.20251209135856.jpg',
    publishedAt: new Date('2025-12-09'),
  },
  {
    slug: 'top-10-reasons-to-choose-vps-hosting-for-your-website',
    title: 'Top 10 Reasons to Choose VPS Hosting for Your Website',
    excerpt: 'VPS hosting combines features of shared and dedicated hosting to deliver outstanding site solutions. It\'s the best fit for businesses whose website...',
    featuredImage: 'https://images.10rating/f_auto,q_auto,t_agg-articles-thumb/v1/production/article/uploads/photo/Hosting_1-1765288589873.20251209135855.jpg',
    publishedAt: new Date('2025-12-09'),
  },
  {
    slug: 'best-email-hosting-services',
    title: 'Top 10 Best Email Hosting Services for 2026',
    excerpt: 'Are you drowning in emails, struggling to keep your messages organized and effective?',
    featuredImage: 'https://images.10rating/f_auto,q_auto,t_agg-articles-thumb/v1/production/article/uploads/photo/Hosting_1-1765288589873.20251209135854.jpg',
    publishedAt: new Date('2025-12-09'),
  },
  {
    slug: 'reseller-hosting',
    title: 'Beginner\'s Guide to Reseller Hosting: How to Start and Succeed',
    excerpt: 'Want to build your brand and have a very profitable, low-investment income stream? Reseller hosting may be the solution you\'ve been looking for.',
    featuredImage: 'https://images.10rating/f_auto,q_auto,t_agg-articles-thumb/v1/production/article/uploads/photo/Hosting_1-1765288589873.20251209135853.jpg',
    publishedAt: new Date('2025-12-09'),
  },
  {
    slug: 'which-is-better-managed-or-unmanaged-hosting',
    title: 'Managed vs. Unmanaged Hosting: What\'s Best for Your Business?',
    excerpt: 'A hosting provider—managed or unmanaged—can significantly influence your website\'s performance, affecting everything from SEO rankings to user expe...',
    featuredImage: 'https://images.10rating/f_auto,q_auto,t_agg-articles-thumb/v1/production/article/uploads/photo/Hosting_1-1765288589873.20251209135852.jpg',
    publishedAt: new Date('2025-12-09'),
  },
  {
    slug: 'dream-host-alternatives-for-great-support-uptime-email-hosting',
    title: '5 DreamHost Alternatives for Great Support, Uptime & Email Hosting',
    excerpt: 'DreamHost is a reliable and secure hosting provider that has been around for more than 25 years. The company was founded in 1996 and is still among...',
    featuredImage: 'https://images.10rating/f_auto,q_auto,t_agg-articles-thumb/v1/production/article/uploads/photo/Hosting_1-1765288589873.20251209135851.jpg',
    publishedAt: new Date('2025-12-09'),
  },
  {
    slug: 'cloudways-alternatives-for-fast-cheap-secure-hosting',
    title: '5 Cloudways Alternatives for Fast, Cheap & Secure Hosting (2026)',
    excerpt: 'Couldways offers powerful hosting solutions to larger businesses and enterprise clients, but it might not be a good fit if you\'re a beginner or loo...',
    featuredImage: 'https://images.10rating/f_auto,q_auto,t_agg-articles-thumb/v1/production/article/uploads/photo/Hosting_1-1765288589873.20251209135851.jpg',
    publishedAt: new Date('2025-12-09'),
  },
  {
    slug: 'best-web-hosting-for-small-business',
    title: 'Top 10 Best Web Hosting for Small Businesses',
    excerpt: 'A great website is central to any small business\'s success online. However, finding the right one can be intimidating, especially since so many opt...',
    featuredImage: 'https://images.10rating/f_auto,q_auto,t_agg-articles-thumb/v1/production/articles/uploads/photo/BestWebHostingforaSmallBusiness.20221003070843.jpg',
    publishedAt: new Date('2025-12-01'),
  },
  {
    slug: 'how-to-choose-a-web-hosting-service',
    title: 'How to Choose a Website Host: Key Factors and What to Ask',
    excerpt: 'Your website is the centerpiece of your online presence. It\'s where you interact with your customers the most, explain the benefits of your service...',
    featuredImage: 'https://images.10rating/f_auto,q_auto,t_agg-articles-thumb/v1/production/articles/uploads/photo/Untitleddesign32.20220426140646.jpg',
    publishedAt: new Date('2025-12-01'),
  },
];

async function main() {
  console.log('🌱 Starting hosting articles seed...\n');

  // Get hosting category
  const hostingCategory = await prisma.category.findUnique({
    where: { slug: 'hosting' },
  });

  if (!hostingCategory) {
    console.error('❌ Hosting category not found. Please run the main seed first.');
    process.exit(1);
  }

  console.log(`📁 Found hosting category: ${hostingCategory.name}\n`);

  // Create articles
  console.log('📰 Creating hosting articles...');
  let created = 0;
  let updated = 0;

  for (const articleData of hostingArticles) {
    const existing = await prisma.article.findUnique({
      where: { slug: articleData.slug },
    });

    await prisma.article.upsert({
      where: { slug: articleData.slug },
      update: {
        title: articleData.title,
        excerpt: articleData.excerpt,
        featuredImage: articleData.featuredImage,
        status: 'published',
        categoryId: hostingCategory.id,
        publishedAt: articleData.publishedAt,
      },
      create: {
        slug: articleData.slug,
        title: articleData.title,
        excerpt: articleData.excerpt,
        featuredImage: articleData.featuredImage,
        status: 'published',
        categoryId: hostingCategory.id,
        publishedAt: articleData.publishedAt,
        content: `<p>Full article content for ${articleData.title}.</p>`,
      },
    });

    if (existing) {
      updated++;
      console.log(`  ✓ Updated: ${articleData.title.slice(0, 60)}...`);
    } else {
      created++;
      console.log(`  ✓ Created: ${articleData.title.slice(0, 60)}...`);
    }
  }

  console.log(`\n✅ Hosting articles seed completed!`);
  console.log(`   Created: ${created}`);
  console.log(`   Updated: ${updated}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
