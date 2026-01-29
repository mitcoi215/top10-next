// prisma/seed-trending-articles.ts
// Seed script to create Articles and Authors for Trending List items

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Authors data from trending items
const authorsData = [
  { slug: 'luis-santiago-saldivar', name: 'Luis-santiago Saldivar', title: 'Technology Writer' },
  { slug: 'chris-wilson', name: 'Chris Wilson', title: 'Home Security Expert' },
  { slug: 'michael-klobe', name: 'Michael Klobe', title: 'Project Management Writer' },
  { slug: 'cameron-coward', name: 'Cameron Coward', title: 'Technology Writer' },
  { slug: 'rodney-garner', name: 'Rodney Garner', title: 'VoIP Specialist' },
  { slug: 'christopher-somerville', name: 'Christopher Somerville', title: 'Security Writer' },
  { slug: 'erin-donaghue', name: 'Erin Donaghue', title: 'Investigative Writer' },
  { slug: 'milena-alexandrova', name: 'Milena Alexandrova', title: 'Web Technology Writer' },
  { slug: 'morgan-mandriota', name: 'Morgan Mandriota', title: 'Dating & Relationships Writer' },
  { slug: 'antonia-greco', name: 'Antonia Greco', title: 'Technology Writer' },
  { slug: 'susan-halsey', name: 'Susan Halsey', title: 'Mental Health Writer' },
  { slug: 'katherine-cullen', name: 'Katherine Cullen', title: 'Health Writer' },
  { slug: 'phillip-richardson', name: 'Phillip Richardson', title: 'Security Writer' },
  { slug: 'anju-mobin', name: 'Anju Mobin', title: 'Food & Nutrition Writer' },
  { slug: 'marianne-rocha-taglione', name: 'Marianne Rocha-taglione', title: 'Food Writer' },
];

// Category slug mapping (trending title -> category slug)
const categorySlugMap: Record<string, string> = {
  'Hosting': 'hosting',
  'Home Security': 'home-security',
  'Project Management': 'project-management',
  'VoIP': 'voip',
  'Id Theft': 'id-theft',
  'Website Builders': 'website-builders',
  'Dating Sites & Apps': 'dating',
  'Online Therapy': 'online-therapy',
  'Background Check': 'background-check',
  'Meal Delivery': 'meal-delivery',
};

// Articles data - 2 articles + 1 review for each trending category
const articlesData = [
  // 1. Hosting
  {
    categorySlug: 'hosting',
    articles: [
      {
        slug: 'wordpress-security-features',
        title: 'How Smart WordPress Security Features Can Protect Your Site from Cyber Attacks',
        articleType: 'blog',
        authorSlug: 'luis-santiago-saldivar',
        featuredImage: '/top10-images/shutterstock_21847135611.jpg',
        excerpt: 'Learn how WordPress security features help protect your website from cyber attacks and keep your data safe.',
        publishedAt: new Date('2024-12-15'),
      },
      {
        slug: 'secure-hosting-features',
        title: "How Secure Hosting Features Safeguard Your SMB's Data and Why You Should Care",
        articleType: 'blog',
        authorSlug: 'luis-santiago-saldivar',
        featuredImage: '/top10-images/shutterstock_193708215731.jpg',
        excerpt: "Discover how secure hosting features protect your small business data from threats.",
        publishedAt: new Date('2024-12-10'),
      },
      {
        slug: 'ionos-review',
        title: 'IONOS Review',
        articleType: 'charticle',
        authorSlug: null,
        featuredImage: '/top10-images/2023_Logo_TV-services.20230330090500.20240718074123.png',
        excerpt: 'A comprehensive review of IONOS hosting services.',
        isReview: true,
        publishedAt: new Date('2023-06-15'),
      },
    ],
  },
  // 2. Home Security
  {
    categorySlug: 'home-security',
    articles: [
      {
        slug: 'best-video-doorbells-for-a-safer-home',
        title: '5 Best Video Doorbells of 2026 for a Safer Home',
        articleType: 'blog',
        authorSlug: 'chris-wilson',
        featuredImage: '/top10-images/Home_Security-1765286288398.20251209131954.png',
        excerpt: 'Compare the top video doorbells to find the best one for your home security needs.',
        publishedAt: new Date('2025-12-09'),
      },
      {
        slug: 'where-to-install-home-security-cameras',
        title: 'Where to Install Security Cameras In Your Home',
        articleType: 'guide',
        authorSlug: 'chris-wilson',
        featuredImage: '/top10-images/Home_Security-1765286288398.20251209131947.png',
        excerpt: 'Expert tips on the best locations to install security cameras for maximum coverage.',
        publishedAt: new Date('2025-12-09'),
      },
      {
        slug: 'adt-review',
        title: 'ADT Review',
        articleType: 'charticle',
        authorSlug: null,
        featuredImage: '/top10-images/ADT_LogoRGB-12.20240523093040.svg',
        excerpt: 'In-depth review of ADT home security systems and monitoring services.',
        isReview: true,
        publishedAt: new Date('2024-03-15'),
      },
    ],
  },
  // 3. Project Management
  {
    categorySlug: 'project-management',
    articles: [
      {
        slug: 'airtable-alternatives',
        title: 'Airtable Alternatives: 5 Similar Project Management Software to Try in 2026',
        articleType: 'blog',
        authorSlug: 'michael-klobe',
        featuredImage: '/top10-images/Project_Management_1-1765292911543.20251209151007.png',
        excerpt: 'Looking for Airtable alternatives? Compare similar project management tools.',
        publishedAt: new Date('2025-12-09'),
      },
      {
        slug: 'asana-alternatives',
        title: 'Asana Alternatives: 5 Best Project Management Software to Try in 2026',
        articleType: 'blog',
        authorSlug: 'michael-klobe',
        featuredImage: '/top10-images/shutterstock_26435825691.20251215105814.jpg',
        excerpt: 'Explore the best Asana alternatives for your team project management needs.',
        publishedAt: new Date('2025-12-15'),
      },
      {
        slug: 'mondaycom-review',
        title: 'monday.com Review',
        articleType: 'charticle',
        authorSlug: null,
        featuredImage: '/top10-images/large-logo-monday.20200225145423.png',
        excerpt: 'Comprehensive review of monday.com project management software.',
        isReview: true,
        publishedAt: new Date('2022-11-15'),
      },
    ],
  },
  // 4. VoIP
  {
    categorySlug: 'voip',
    articles: [
      {
        slug: 'google-voice-alternatives',
        title: 'Google Voice Alternatives: 5 Best VoIP Services to Try in 2026',
        articleType: 'blog',
        authorSlug: 'cameron-coward',
        featuredImage: '/top10-images/VoIP_1-1765295588175.20251209155441.png',
        excerpt: 'Find the best Google Voice alternatives for personal and business use.',
        publishedAt: new Date('2025-12-09'),
      },
      {
        slug: 'ai-changing-the-world-of-nonfixed-voip',
        title: 'How AI Is Changing the World of Non-Fixed VoIP and How to Get Ahead',
        articleType: 'blog',
        authorSlug: 'rodney-garner',
        featuredImage: '/top10-images/shutterstock_26610842451.20251215110448.jpg',
        excerpt: 'Discover how AI is transforming VoIP technology and what it means for businesses.',
        publishedAt: new Date('2025-12-15'),
      },
      {
        slug: 'vonage-review',
        title: 'Vonage Review',
        articleType: 'charticle',
        authorSlug: null,
        featuredImage: '/top10-images/VonageLogo.20210211094543.png',
        excerpt: 'Detailed review of Vonage VoIP services for home and business.',
        isReview: true,
        publishedAt: new Date('2024-06-15'),
      },
    ],
  },
  // 5. Id Theft
  {
    categorySlug: 'id-theft',
    articles: [
      {
        slug: 'how-to-check-for-identity-theft-a-comprehensive-guide',
        title: 'How to Check for Identity Theft: A Comprehensive Guide for 2026',
        articleType: 'guide',
        authorSlug: 'christopher-somerville',
        featuredImage: '/top10-images/ID_Theft_1-1765289030199.20251209140504.jpg',
        excerpt: 'Learn how to detect identity theft early and protect your personal information.',
        publishedAt: new Date('2026-01-10'),
      },
      {
        slug: 'nightmarish-id-theft-stories-from-real-victims',
        title: 'Nightmarish ID Theft Stories From Real Victims',
        articleType: 'blog',
        authorSlug: 'erin-donaghue',
        featuredImage: '/top10-images/ID_Theft_1-1765289030199.20251209140500.jpg',
        excerpt: 'Real stories from identity theft victims and lessons learned.',
        publishedAt: new Date('2026-01-05'),
      },
      {
        slug: 'aura-review',
        title: 'Aura Review',
        articleType: 'charticle',
        authorSlug: null,
        featuredImage: '/top10-images/Aura_Logo_xSite.20210609113526.png',
        excerpt: 'Complete review of Aura identity theft protection service.',
        isReview: true,
        publishedAt: new Date('2022-11-15'),
      },
    ],
  },
  // 6. Website Builders
  {
    categorySlug: 'website-builders',
    articles: [
      {
        slug: 'how-to-grow-your-business-online',
        title: 'How to Grow Your Business Online in 10 Steps',
        articleType: 'guide',
        authorSlug: 'luis-santiago-saldivar',
        featuredImage: '/top10-images/shutterstock_23134528751.20251215114007.jpg',
        excerpt: 'A step-by-step guide to growing your business online effectively.',
        publishedAt: new Date('2025-12-15'),
      },
      {
        slug: 'top-wordpress-alternatives-easily-build-and-launch-your-site',
        title: 'WordPress Alternatives: 5 Website Builders to Try in 2026',
        articleType: 'blog',
        authorSlug: 'milena-alexandrova',
        featuredImage: '/top10-images/Website_Builder_1-1765295756624.20251209155752.png',
        excerpt: 'Explore the best WordPress alternatives for building your website.',
        publishedAt: new Date('2025-12-09'),
      },
      {
        slug: 'wix-review',
        title: 'Wix Review',
        articleType: 'charticle',
        authorSlug: null,
        featuredImage: '/top10-images/Product_WIX_Size_300x100-Light-NoBg.20240327091206.svg',
        excerpt: 'In-depth review of Wix website builder features and pricing.',
        isReview: true,
        publishedAt: new Date('2023-03-15'),
      },
    ],
  },
  // 7. Dating
  {
    categorySlug: 'dating',
    articles: [
      {
        slug: 'best-gay-dating-sites',
        title: 'Top 10 Best Free Gay Dating Sites and Apps in 2026',
        articleType: 'blog',
        authorSlug: 'morgan-mandriota',
        featuredImage: '/top10-images/Group8251.20240218123834.png',
        excerpt: 'Find the best gay dating sites and apps for meaningful connections.',
        publishedAt: new Date('2025-12-15'),
      },
      {
        slug: 'ai-dating-survey',
        title: '40% of People Would Consider Dating an AI Partner, Survey Says',
        articleType: 'blog',
        authorSlug: 'antonia-greco',
        featuredImage: '/top10-images/dating-an-ai-partner-hero1.jpg',
        excerpt: 'New survey reveals surprising attitudes about AI relationships.',
        publishedAt: new Date('2025-12-10'),
      },
      {
        slug: 'eharmony-review',
        title: 'eharmony Review',
        articleType: 'charticle',
        authorSlug: null,
        featuredImage: '/top10-images/2023_Logo_Eharmony.20231224094829.svg',
        excerpt: 'Comprehensive review of eharmony dating site features and success rate.',
        isReview: true,
        publishedAt: new Date('2025-07-15'),
      },
    ],
  },
  // 8. Online Therapy
  {
    categorySlug: 'online-therapy',
    articles: [
      {
        slug: 'best-mental-health-tools-and-apps',
        title: 'Our Top 10 Best Mental Health Tools and Apps',
        articleType: 'blog',
        authorSlug: 'susan-halsey',
        featuredImage: '/top10-images/Untitleddesign-2024-07-14T141948.9901.20240714112002.png',
        excerpt: 'Discover the best mental health apps to support your wellbeing.',
        publishedAt: new Date('2026-01-10'),
      },
      {
        slug: 'how-much-does-online-therapy-cost',
        title: 'How Much Does Online Therapy Cost?',
        articleType: 'guide',
        authorSlug: 'katherine-cullen',
        featuredImage: '/top10-images/Online Therapy.20200909112943.jpg',
        excerpt: 'Compare online therapy costs and find affordable options.',
        publishedAt: new Date('2026-01-08'),
      },
      {
        slug: 'betterhelp-review',
        title: 'BetterHelp Review',
        articleType: 'charticle',
        authorSlug: null,
        featuredImage: '/top10-images/Product_betterhelp_Size_300x100-Light-NoBg.20240606172311.svg',
        excerpt: 'Detailed review of BetterHelp online therapy platform.',
        isReview: true,
        publishedAt: new Date('2025-04-15'),
      },
    ],
  },
  // 9. Background Check
  {
    categorySlug: 'background-check',
    articles: [
      {
        slug: 'best-background-checks-to-investigate-suspected-infidelity',
        title: 'How to Catch a Cheater: Top Online Resources for Uncovering Infidelity in 2026',
        articleType: 'blog',
        authorSlug: 'erin-donaghue',
        featuredImage: '/top10-images/Group88221.20240304152026.png',
        excerpt: 'Learn how to use background check services to investigate suspected infidelity.',
        publishedAt: new Date('2025-12-15'),
      },
      {
        slug: 'all-you-need-to-know-about-reverse-phone-lookup',
        title: 'Top 10 Best Reverse Phone Number Lookup Sites & Services in 2026',
        articleType: 'blog',
        authorSlug: 'phillip-richardson',
        featuredImage: '/top10-images/reversephone.20201106094612.jpg',
        excerpt: 'Find out who called you with the best reverse phone lookup services.',
        publishedAt: new Date('2026-01-10'),
      },
      {
        slug: 'beenverified-review',
        title: 'BeenVerified Review',
        articleType: 'charticle',
        authorSlug: null,
        featuredImage: '/top10-images/BVLogoGray-Green.20240827061751.png',
        excerpt: 'Complete review of BeenVerified background check service.',
        isReview: true,
        publishedAt: new Date('2024-04-15'),
      },
    ],
  },
  // 10. Meal Delivery
  {
    categorySlug: 'meal-delivery',
    articles: [
      {
        slug: 'freshly-alternatives-for-quick-healthy-meals',
        title: 'Freshly Alternatives: 5 Similar Meal Delivery Services Worth Trying in 2026',
        articleType: 'blog',
        authorSlug: 'anju-mobin',
        featuredImage: '/top10-images/shutterstock_23842239991.20251215104804.jpg',
        excerpt: 'Looking for Freshly alternatives? Compare similar meal delivery services.',
        publishedAt: new Date('2025-12-15'),
      },
      {
        slug: 'our-favorite-home-chef-recipes-to-try',
        title: '10 of Our Favorite Home Chef Recipes: What Meals to Try Next',
        articleType: 'blog',
        authorSlug: 'marianne-rocha-taglione',
        featuredImage: '/top10-images/Meal_Delivery_1-1765289430855.20251209141235.jpg',
        excerpt: 'Discover our favorite Home Chef recipes and why we love them.',
        publishedAt: new Date('2025-12-09'),
      },
      {
        slug: 'hellofresh-review',
        title: 'HelloFresh Review',
        articleType: 'charticle',
        authorSlug: null,
        featuredImage: '/top10-images/Hello Fresh_logo.20201221084138.png',
        excerpt: 'Detailed review of HelloFresh meal delivery service.',
        isReview: true,
        publishedAt: new Date('2023-08-15'),
      },
    ],
  },
];

async function main() {
  console.log('🌱 Starting trending articles seed...\n');

  // Step 1: Create Authors
  console.log('📝 Creating Authors...');
  const authorMap: Record<string, string> = {};

  for (const authorData of authorsData) {
    const author = await prisma.author.upsert({
      where: { slug: authorData.slug },
      update: {
        name: authorData.name,
        title: authorData.title,
      },
      create: {
        slug: authorData.slug,
        name: authorData.name,
        title: authorData.title,
      },
    });
    authorMap[authorData.slug] = author.id;
    console.log(`  ✓ Author: ${author.name}`);
  }

  // Step 2: Get Category IDs
  console.log('\n📁 Fetching Categories...');
  const categoryMap: Record<string, string> = {};

  for (const [title, slug] of Object.entries(categorySlugMap)) {
    const category = await prisma.category.findUnique({
      where: { slug },
    });

    if (category) {
      categoryMap[slug] = category.id;
      console.log(`  ✓ Found category: ${category.name} (${slug})`);
    } else {
      console.log(`  ⚠ Category not found: ${slug} - will create`);
      // Create the category if it doesn't exist
      const newCategory = await prisma.category.create({
        data: {
          slug,
          name: title,
          icon: '/icons/default.svg',
          exploreHref: `/${slug}`,
          compareHref: `/${slug}/comparison`,
        },
      });
      categoryMap[slug] = newCategory.id;
      console.log(`  ✓ Created category: ${newCategory.name}`);
    }
  }

  // Step 3: Create Articles
  console.log('\n📰 Creating Articles...');
  let totalArticles = 0;

  for (const categoryArticles of articlesData) {
    const categoryId = categoryMap[categoryArticles.categorySlug];
    console.log(`\n  Category: ${categoryArticles.categorySlug}`);

    for (const articleData of categoryArticles.articles) {
      const authorId = articleData.authorSlug ? authorMap[articleData.authorSlug] : null;

      const article = await prisma.article.upsert({
        where: { slug: articleData.slug },
        update: {
          title: articleData.title,
          articleType: articleData.articleType,
          featuredImage: articleData.featuredImage,
          excerpt: articleData.excerpt,
          status: 'published',
          categoryId,
          authorId,
          publishedAt: articleData.publishedAt,
        },
        create: {
          slug: articleData.slug,
          title: articleData.title,
          articleType: articleData.articleType,
          featuredImage: articleData.featuredImage,
          excerpt: articleData.excerpt,
          status: 'published',
          categoryId,
          authorId,
          publishedAt: articleData.publishedAt,
          content: `<p>This is the content for ${articleData.title}.</p>`,
        },
      });

      const typeLabel = (articleData as any).isReview ? '(Review)' : '';
      console.log(`    ✓ ${article.title} ${typeLabel}`);
      totalArticles++;
    }
  }

  console.log(`\n✅ Trending articles seed completed!`);
  console.log(`   Authors created: ${authorsData.length}`);
  console.log(`   Articles created: ${totalArticles}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
