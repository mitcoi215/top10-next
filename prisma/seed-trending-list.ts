import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const trendingItems = [
  {
    rank: 1,
    title: 'Hosting',
    href: '/hosting',
    image: '/top10-images/Hosting.20221025063909.jpg',
    description: 'Top 10 Best Web Hosting Providers & Companies in 2026',
    date: 'Oct, 2024',
    articles: [
      {
        title: 'How Smart WordPress Security Features Can Protect Your Site from Cyber Attacks',
        href: '/hosting/wordpress-security-features',
        image: '/top10-images/shutterstock_21847135611.jpg',
        author: 'Luis-santiago Saldivar',
        date: 'Dec, 2024',
      },
      {
        title: "How Secure Hosting Features Safeguard Your SMB's Data and Why You Should Care",
        href: '/hosting/secure-hosting-features',
        image: '/top10-images/shutterstock_193708215731.jpg',
        author: 'Luis-santiago Saldivar',
        date: 'Dec, 2024',
      },
      {
        title: 'IONOS Review',
        href: '/hosting/reviews/ionos',
        image: '/top10-images/2023_Logo_TV-services.20230330090500.20240718074123.png',
        author: '',
        date: 'Jun, 2023',
        isReview: true,
      },
    ],
  },
  {
    rank: 2,
    title: 'Home Security',
    href: '/home-security',
    image: '/top10-images/Untitleddesign86.20221025070645.jpg',
    description: 'Top 10 Best Home Security Systems & Companies 2026 - Keep Your Home Safe',
    date: 'May, 2024',
    articles: [
      {
        title: '5 Best Video Doorbells of 2026 for a Safer Home',
        href: '/home-security/best-video-doorbells-for-a-safer-home',
        image: '/top10-images/Home_Security-1765286288398.20251209131954.png',
        author: 'Chris Wilson',
        date: 'Dec, 2025',
      },
      {
        title: 'Where to Install Security Cameras In Your Home',
        href: '/home-security/where-to-install-home-security-cameras',
        image: '/top10-images/Home_Security-1765286288398.20251209131947.png',
        author: 'Chris Wilson',
        date: 'Dec, 2025',
      },
      {
        title: 'ADT Review',
        href: '/home-security/reviews/adt',
        image: '/top10-images/ADT_LogoRGB-12.20240523093040.svg',
        author: '',
        date: 'Mar, 2024',
        isReview: true,
      },
    ],
  },
  {
    rank: 3,
    title: 'Project Management',
    href: '/project-management',
    image: '/top10-images/Header1.20191008075541.jpg',
    description: 'Top 10 Best Project Management Software & Tools to Organize Your Team',
    date: 'Dec, 2024',
    articles: [
      {
        title: 'Airtable Alternatives: 5 Similar Project Management Software to Try in 2026',
        href: '/project-management/airtable-alternatives',
        image: '/top10-images/Project_Management_1-1765292911543.20251209151007.png',
        author: 'Michael Klobe',
        date: 'Dec, 2025',
      },
      {
        title: 'Asana Alternatives: 5 Best Project Management Software to Try in 2026',
        href: '/project-management/asana-alternatives',
        image: '/top10-images/shutterstock_26435825691.20251215105814.jpg',
        author: 'Michael Klobe',
        date: 'Dec, 2025',
      },
      {
        title: 'monday.com Review',
        href: '/project-management/reviews/mondaycom',
        image: '/top10-images/large-logo-monday.20200225145423.png',
        author: '',
        date: 'Nov, 2022',
        isReview: true,
      },
    ],
  },
  {
    rank: 4,
    title: 'VoIP',
    href: '/voip',
    image: '/top10-images/Frame19931.20240730092346.png',
    description: 'Top 10 Best VoIP Providers & Phone Services Companies',
    date: 'Jul, 2024',
    articles: [
      {
        title: 'Google Voice Alternatives: 5 Best VoIP Services to Try in 2026',
        href: '/voip/google-voice-alternatives',
        image: '/top10-images/VoIP_1-1765295588175.20251209155441.png',
        author: 'Cameron Coward',
        date: 'Dec, 2025',
      },
      {
        title: 'How AI Is Changing the World of Non-Fixed VoIP and How to Get Ahead',
        href: '/voip/ai-changing-the-world-of-nonfixed-voip',
        image: '/top10-images/shutterstock_26610842451.20251215110448.jpg',
        author: 'Rodney Garner',
        date: 'Dec, 2025',
      },
      {
        title: 'Vonage Review',
        href: '/voip/reviews/vonage',
        image: '/top10-images/VonageLogo.20210211094543.png',
        author: '',
        date: 'Jun, 2024',
        isReview: true,
      },
    ],
  },
  {
    rank: 5,
    title: 'Id Theft',
    href: '/id-theft/comparison',
    image: '/top10-images/Header1.20191017124608.20251119085808.jpg',
    description: 'Best Identity Theft Protection Services 2026',
    date: 'Nov, 2025',
    articles: [
      {
        title: 'How to Check for Identity Theft: A Comprehensive Guide for 2026',
        href: '/id-theft/how-to-check-for-identity-theft-a-comprehensive-guide',
        image: '/top10-images/ID_Theft_1-1765289030199.20251209140504.jpg',
        author: 'Christopher Somerville',
        date: 'Jan, 2026',
      },
      {
        title: 'Nightmarish ID Theft Stories From Real Victims',
        href: '/id-theft/nightmarish-id-theft-stories-from-real-victims',
        image: '/top10-images/ID_Theft_1-1765289030199.20251209140500.jpg',
        author: 'Erin Donaghue',
        date: 'Jan, 2026',
      },
      {
        title: 'Aura Review',
        href: '/id-theft/reviews/aura',
        image: '/top10-images/Aura_Logo_xSite.20210609113526.png',
        author: '',
        date: 'Nov, 2022',
        isReview: true,
      },
    ],
  },
  {
    rank: 6,
    title: 'Website Builders',
    href: '/website-builders/comparison',
    image: '/top10-images/WebsiteBuilders.20251216080336.jpg',
    description: 'Compare the Best Website Builders of 2026',
    date: 'Dec, 2025',
    articles: [
      {
        title: 'How to Grow Your Business Online in 10 Steps',
        href: '/website-builders/how-to-grow-your-business-online',
        image: '/top10-images/shutterstock_23134528751.20251215114007.jpg',
        author: 'Luis-santiago Saldivar',
        date: 'Dec, 2025',
      },
      {
        title: 'WordPress Alternatives: 5 Website Builders to Try in 2026',
        href: '/website-builders/top-wordpress-alternatives-easily-build-and-launch-your-site',
        image: '/top10-images/Website_Builder_1-1765295756624.20251209155752.png',
        author: 'Milena Alexandrova',
        date: 'Dec, 2025',
      },
      {
        title: 'Wix Review',
        href: '/website-builders/reviews/wix',
        image: '/top10-images/Product_WIX_Size_300x100-Light-NoBg.20240327091206.svg',
        author: '',
        date: 'Mar, 2023',
        isReview: true,
      },
    ],
  },
  {
    rank: 7,
    title: 'Dating Sites & Apps',
    href: '/dating',
    image: '/top10-images/dating.20210105130957.jpg',
    description: 'Top 10 Best Free Online Dating Sites and Apps in 2026 - Find Singles Online',
    date: 'Nov, 2024',
    articles: [
      {
        title: 'Top 10 Best Free Gay Dating Sites and Apps in 2026',
        href: '/dating/best-gay-dating-sites',
        image: '/top10-images/Group8251.20240218123834.png',
        author: 'Morgan Mandriota',
        date: 'Dec, 2025',
      },
      {
        title: '40% of People Would Consider Dating an AI Partner, Survey Says',
        href: '/dating/ai-dating-survey',
        image: '/top10-images/dating-an-ai-partner-hero1.jpg',
        author: 'Antonia Greco',
        date: 'Dec, 2025',
      },
      {
        title: 'eharmony Review',
        href: '/dating/reviews/eharmony',
        image: '/top10-images/2023_Logo_Eharmony.20231224094829.svg',
        author: '',
        date: 'Jul, 2025',
        isReview: true,
      },
    ],
  },
  {
    rank: 8,
    title: 'Online Therapy',
    href: '/online-therapy/comparison',
    image: '/top10-images/online-therapy.20210105125951.jpg',
    description: 'Best Online Therapy Services 2026',
    date: 'Dec, 2025',
    articles: [
      {
        title: 'Our Top 10 Best Mental Health Tools and Apps',
        href: '/online-therapy/best-mental-health-tools-and-apps',
        image: '/top10-images/Untitleddesign-2024-07-14T141948.9901.20240714112002.png',
        author: 'Susan Halsey',
        date: 'Jan, 2026',
      },
      {
        title: 'How Much Does Online Therapy Cost?',
        href: '/online-therapy/how-much-does-online-therapy-cost',
        image: '/top10-images/Online Therapy.20200909112943.jpg',
        author: 'Katherine Cullen',
        date: 'Jan, 2026',
      },
      {
        title: 'BetterHelp Review',
        href: '/online-therapy/reviews/betterhelp',
        image: '/top10-images/Product_betterhelp_Size_300x100-Light-NoBg.20240606172311.svg',
        author: '',
        date: 'Apr, 2025',
        isReview: true,
      },
    ],
  },
  {
    rank: 9,
    title: 'Background Check',
    href: '/background-check',
    image: '/top10-images/Untitleddesign68.20220713103907.jpg',
    description: 'Top 10 Best Online Background Check Sites & Companies in 2026',
    date: 'Jan, 2025',
    articles: [
      {
        title: 'How to Catch a Cheater: Top Online Resources for Uncovering Infidelity in 2026',
        href: '/background-check/best-background-checks-to-investigate-suspected-infidelity',
        image: '/top10-images/Group88221.20240304152026.png',
        author: 'Erin Donaghue',
        date: 'Dec, 2025',
      },
      {
        title: 'Top 10 Best Reverse Phone Number Lookup Sites & Services in 2026',
        href: '/background-check/all-you-need-to-know-about-reverse-phone-lookup',
        image: '/top10-images/reversephone.20201106094612.jpg',
        author: 'Phillip Richardson',
        date: 'Jan, 2026',
      },
      {
        title: 'BeenVerified Review',
        href: '/background-check/reviews/beenverified',
        image: '/top10-images/BVLogoGray-Green.20240827061751.png',
        author: '',
        date: 'Apr, 2024',
        isReview: true,
      },
    ],
  },
  {
    rank: 10,
    title: 'Meal Delivery',
    href: '/meal-delivery',
    image: '/top10-images/meal-delivery.20210105125548.jpg',
    description: 'Top 10 Best Meal Delivery Services for 2026 - Save Time and Money',
    date: 'Jun, 2024',
    articles: [
      {
        title: 'Freshly Alternatives: 5 Similar Meal Delivery Services Worth Trying in 2026',
        href: '/meal-delivery/freshly-alternatives-for-quick-healthy-meals',
        image: '/top10-images/shutterstock_23842239991.20251215104804.jpg',
        author: 'Anju Mobin',
        date: 'Dec, 2025',
      },
      {
        title: '10 of Our Favorite Home Chef Recipes: What Meals to Try Next',
        href: '/meal-delivery/our-favorite-home-chef-recipes-to-try',
        image: '/top10-images/Meal_Delivery_1-1765289430855.20251209141235.jpg',
        author: 'Marianne Rocha-taglione',
        date: 'Dec, 2025',
      },
      {
        title: 'HelloFresh Review',
        href: '/meal-delivery/reviews/hellofresh',
        image: '/top10-images/Hello Fresh_logo.20201221084138.png',
        author: '',
        date: 'Aug, 2023',
        isReview: true,
      },
    ],
  },
];

async function main() {
  console.log('🔄 Updating trending list in database...\n');

  const settings = await prisma.homepageSettings.findFirst();

  if (settings) {
    await prisma.homepageSettings.update({
      where: { id: settings.id },
      data: { trendingItems: trendingItems },
    });
    console.log('✅ Updated trendingItems in HomepageSettings');
  } else {
    await prisma.homepageSettings.create({
      data: { trendingItems: trendingItems },
    });
    console.log('✅ Created HomepageSettings with trendingItems');
  }

  console.log('\nTrending items added:');
  trendingItems.forEach((item) => {
    console.log(`  ${item.rank}. ${item.title}`);
    item.articles.forEach((article) => {
      console.log(`     - ${article.title.substring(0, 50)}...`);
    });
  });

  console.log('\n✅ Done! Refresh the homepage to see the updated trending list.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
