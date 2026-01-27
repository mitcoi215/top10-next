import '@/styles/category.css';
import { Top10Header, Top10Footer } from '@/components/top10/layout';
import {
  CategoryHeader,
  ProductList,
  BestOfList,
  CategoryContent,
  FAQSection,
  RelatedArticles,
} from '@/components/top10/category';

export const metadata = {
  title: 'Top 10 Best TV Streaming Services 2026 - Reviews & Comparison',
  description:
    'We compare the top 10 TV streaming services of 2026 and explain how to choose the best TV streaming service for your entertainment.',
};

// Static data from template
const categoryData = {
  title: 'Top 10 Best TV Streaming Services',
  author: {
    name: 'Richard Sutherland',
    image: '/top10-images/Richard Sutherland.20211014161615.jpg',
    credentials: 'Entertainment Writer',
  },
  lastUpdated: 'Aug 04, 2024',
  heroImage: '/top10-images/Charticle-header-new.20220302075703.jpg',
  breadcrumb: [
    { label: 'Home', href: '/' },
    { label: 'TV Services', href: '/tv-services' },
  ],
};

const bestOfItems = [
  { name: 'Sling TV - Best for Budget Cord-Cutters', url: '#' },
  { name: 'Hulu + Live TV - Best for On-Demand Content', url: '#' },
  { name: 'DIRECTV STREAM - Best for Sports Fans', url: '#' },
  { name: 'FuboTV - Best for International Sports', url: '#' },
  { name: 'YouTube TV - Best for Unlimited DVR', url: '#' },
  { name: 'Philo - Best for Entertainment Channels', url: '#' },
  { name: 'Paramount+ - Best for CBS Content', url: '#' },
  { name: 'ESPN+ - Best for Sports Streaming', url: '#' },
  { name: 'Starz - Best for Premium Movies', url: '#' },
  { name: 'DAZN - Best for Combat Sports', url: '#' },
];

const products = [
  {
    rank: 1,
    name: 'Sling TV',
    tagline: 'Best for Budget Cord-Cutters',
    logo: '/top10-images/2023_Logo_Sling.20230504145133.png',
    score: 9.5,
    scoreLabel: 'Excellent',
    highlights: [
      'Affordable plans starting at $40/mo',
      '50+ channels including ESPN, CNN, and more',
      'No contracts or hidden fees',
      'Cloud DVR with 50 hours included',
    ],
    ctaUrl: '#',
    ctaText: 'Visit Site',
    ribbon: "Editor's Choice",
    bestFor: 'Best for Budget Cord-Cutters',
    reviewUrl: '/tv-services/reviews/sling-tv',
  },
  {
    rank: 2,
    name: 'Hulu + Live TV',
    tagline: 'Best for On-Demand Content',
    logo: '/top10-images/2023_Logo_TVservices-HULUlive.20230209102529.png',
    score: 9.3,
    scoreLabel: 'Excellent',
    highlights: [
      '90+ live TV channels',
      'Includes Disney+ and ESPN+ bundle',
      'Unlimited DVR storage',
      'Vast on-demand library',
    ],
    ctaUrl: '#',
    ctaText: 'Visit Site',
    bestFor: 'Best for On-Demand Content',
    reviewUrl: '/tv-services/reviews/hulu-live-tv',
  },
  {
    rank: 3,
    name: 'DIRECTV STREAM',
    tagline: 'Best for Sports Fans',
    logo: '/top10-images/ProductDirecTVSize300x100-Light-NoBg.20250421065525.png',
    score: 9.1,
    scoreLabel: 'Excellent',
    highlights: [
      '75+ channels in base package',
      'Regional sports networks available',
      'Unlimited cloud DVR storage',
      'Stream on unlimited devices at home',
    ],
    ctaUrl: '#',
    ctaText: 'Visit Site',
    bestFor: 'Best for Sports Fans',
    reviewUrl: '/tv-services/reviews/directv-stream',
  },
  {
    rank: 4,
    name: 'FuboTV',
    tagline: 'Best for International Sports',
    logo: '/top10-images/fubotv-logo.20200423094848.png',
    score: 9.0,
    scoreLabel: 'Excellent',
    highlights: [
      '100+ channels with sports focus',
      '4K streaming available',
      'Unlimited cloud DVR',
      'International sports coverage',
    ],
    ctaUrl: '#',
    ctaText: 'Visit Site',
    bestFor: 'Best for International Sports',
    reviewUrl: '/tv-services/reviews/fubotv',
  },
  {
    rank: 5,
    name: 'YouTube TV',
    tagline: 'Best for Unlimited DVR',
    logo: '/top10-images/logo.20230326195623.20230518090244.20230706064308.20240214085553.svg',
    score: 8.9,
    scoreLabel: 'Very Good',
    highlights: [
      '100+ channels',
      'Unlimited DVR storage',
      '6 accounts per household',
      '3 simultaneous streams',
    ],
    ctaUrl: '#',
    ctaText: 'Visit Site',
    bestFor: 'Best for Unlimited DVR',
    reviewUrl: '/tv-services/reviews/youtube-tv',
  },
  {
    rank: 6,
    name: 'Philo',
    tagline: 'Best for Entertainment Channels',
    logo: '/top10-images/ProductphiloSize300x100-Light-NoBg.20250928120051.svg',
    score: 8.7,
    scoreLabel: 'Very Good',
    highlights: [
      'Only $28/month',
      '70+ entertainment channels',
      'Unlimited DVR',
      'No sports or news channels',
    ],
    ctaUrl: '#',
    ctaText: 'Visit Site',
    bestFor: 'Best for Entertainment Channels',
    reviewUrl: '/tv-services/reviews/philo',
  },
  {
    rank: 7,
    name: 'Paramount+',
    tagline: 'Best for CBS Content',
    logo: '/top10-images/Paramount_Plus-logo.20220113120217.png',
    score: 8.5,
    scoreLabel: 'Very Good',
    highlights: [
      'CBS originals and live TV',
      'NFL on CBS',
      'Champions League soccer',
      'Affordable starting price',
    ],
    ctaUrl: '#',
    ctaText: 'Visit Site',
    bestFor: 'Best for CBS Content',
    reviewUrl: '/tv-services/reviews/paramount-plus',
  },
  {
    rank: 8,
    name: 'ESPN+',
    tagline: 'Best for Sports Streaming',
    logo: '/top10-images/ESPN_Plus__Favicon.20220217113147.png',
    score: 8.3,
    scoreLabel: 'Very Good',
    highlights: [
      'Exclusive UFC PPV events',
      'NHL and MLB games',
      'Original sports documentaries',
      'Budget-friendly price',
    ],
    ctaUrl: '#',
    ctaText: 'Visit Site',
    bestFor: 'Best for Sports Streaming',
    reviewUrl: '/tv-services/reviews/espn-plus',
  },
  {
    rank: 9,
    name: 'Starz',
    tagline: 'Best for Premium Movies',
    logo: '/top10-images/2023_Logo_starz.20230912122409.png',
    score: 8.1,
    scoreLabel: 'Very Good',
    highlights: [
      'Original series and movies',
      'Download for offline viewing',
      'Multiple user profiles',
      'Ad-free streaming',
    ],
    ctaUrl: '#',
    ctaText: 'Visit Site',
    bestFor: 'Best for Premium Movies',
    reviewUrl: '/tv-services/reviews/starz',
  },
  {
    rank: 10,
    name: 'DAZN',
    tagline: 'Best for Combat Sports',
    logo: '/top10-images/Logo260x100-daznone.20220816113238.png',
    score: 8.0,
    scoreLabel: 'Very Good',
    highlights: [
      'Boxing and MMA events',
      'Global sports coverage',
      'Live and on-demand content',
      'Multi-device streaming',
    ],
    ctaUrl: '#',
    ctaText: 'Visit Site',
    bestFor: 'Best for Combat Sports',
    reviewUrl: '/tv-services/reviews/dazn',
  },
];

const introContent = `
<p>Choosing a TV streaming service can be an exciting decision that opens up a new world of movies, TV shows, and live events. Streaming platforms allow you to watch TV over any device connected to the internet at any time, while being able to choose and customize the content you want.</p>
<p>Whether you're a fan of drama, sports, award-winning documentaries, or reality TV, you'll want to find the right streaming service for your and your family's needs. This means choosing a service that not only offers your favorite TV shows but one also that meets your technical requirements and budget.</p>
<p>But with so many to choose from, deciding what service or which services you want can be confusing. To help give you a clearer idea of what's on offer, we've rounded up 10 of the best streaming services on the market.</p>
`;

const faqItems = [
  {
    question: 'What is the best TV streaming service?',
    answer: 'The best TV streaming service depends on your needs. Sling TV is great for budget-conscious viewers, while Hulu + Live TV offers the best on-demand content. For sports fans, DIRECTV STREAM and FuboTV are excellent choices.',
  },
  {
    question: 'How much do TV streaming services cost?',
    answer: 'TV streaming services range from about $7/month for basic services like Paramount+ to over $70/month for premium packages with live TV. Most services offer multiple tiers to fit different budgets.',
  },
  {
    question: 'Can I watch local channels on streaming services?',
    answer: 'Yes, many live TV streaming services include local channels like ABC, CBS, NBC, and FOX. Services like YouTube TV, Hulu + Live TV, and DIRECTV STREAM offer comprehensive local channel coverage.',
  },
  {
    question: 'Do streaming services require a contract?',
    answer: 'Most streaming services are contract-free and allow you to cancel anytime. This flexibility is one of the main advantages over traditional cable TV.',
  },
];

const relatedArticles = [
  {
    title: '10 Reasons TV Streaming is the Future of TV',
    image: '/top10-images/10ReasonsTVStreamingistheFutureofTV.20220518122008.jpg',
    url: '#',
    category: 'TV Services',
  },
  {
    title: 'These Streaming Services Still Offer Free Trials',
    image: '/top10-images/TheseStreamingServicesStillOfferFreeTrials-1704703695879.20240125095401.jpg',
    url: '#',
    category: 'TV Services',
  },
  {
    title: '10 Reasons TV Streaming is Worth it',
    image: '/top10-images/10ReasonsTVStreamingisWorthit.20220518121928.jpg',
    url: '#',
    category: 'TV Services',
  },
];

export default function TVServicesPage() {
  return (
    <div className="category-page">
      <Top10Header />

      <main>
        <CategoryHeader {...categoryData} />

        <div className="charticle">
          <section className="charticle__top">
            <aside className="charticle__left">
              <ul className="social-share">
                <li className="btn-facebook social-share__button">
                  <svg className="social-share__icon" width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </li>
                <li className="btn-twitter social-share__button">
                  <svg className="social-share__icon" width="24" height="24" viewBox="0 0 24 24" fill="#1DA1F2">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </li>
              </ul>
            </aside>

            <section className="charticle__center charticle__center--show-more-container">
              <CategoryContent content={introContent} />

              <BestOfList
                title="Our Top 10 Best TV Streaming Services:"
                items={bestOfItems}
              />

              <div className="charticle-chart">
                <ProductList products={products} />
              </div>

              <FAQSection items={faqItems} />
            </section>

            <aside className="charticle__right">
              {/* Table of Contents - can be added later */}
            </aside>
          </section>

          <RelatedArticles articles={relatedArticles} />
        </div>
      </main>

      <Top10Footer />
    </div>
  );
}
