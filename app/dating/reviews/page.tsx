'use client';

import '@/styles/category.css';
import '@/styles/review.css';
import Link from 'next/link';
import SetoffBox from '@/components/top10/category/SetoffBox';
import Navbar from '@/components/top10/category/Navbar';
import Footer from '@/components/top10/category/Footer';

interface ReviewItem {
  id: string;
  name: string;
  logo: string;
  date: string;
  summary: string;
  reviewHref: string;
  ctaHref: string;
}

interface Top5Product {
  name: string;
  icon: string;
  ctaHref: string;
}

interface MustReadArticle {
  title: string;
  image: string;
  href: string;
}

// Data array for all review items
const reviewItems: ReviewItem[] = [
  {
    id: 'match',
    name: 'Match',
    logo: '/top10-images/Match.com_logo.202103141253541.20220908065553.png',
    date: 'Jun. 27, 2025',
    summary: 'Match is an extremely popular online dating platform with users of all ages and backgrounds. It offers a variety of features to help you find your perfect match, including advanced search filters, messaging, and video chat.',
    reviewHref: '/dating/reviews/match',
    ctaHref: 'https://www.match.com',
  },
  {
    id: 'eharmony',
    name: 'eharmony',
    logo: '/top10-images/2023_Logo_Eharmony.20231224094829.svg',
    date: 'Jun. 27, 2025',
    summary: 'eharmony is a dating site that uses a unique compatibility matching system to help you find your perfect match. It\'s best suited for those seeking serious, long-term relationships.',
    reviewHref: '/dating/reviews/eharmony',
    ctaHref: 'https://www.eharmony.com',
  },
  {
    id: 'zoosk',
    name: 'Zoosk',
    logo: '/top10-images/Zoosk_icon.20210325051144.20220805071607.png',
    date: 'Jun. 25, 2025',
    summary: 'Zoosk is a popular dating platform known for its behavioral matchmaking technology that learns your preferences over time to deliver better matches.',
    reviewHref: '/dating/reviews/zoosk',
    ctaHref: 'https://www.zoosk.com',
  },
  {
    id: 'ourtime',
    name: 'Ourtime',
    logo: '/top10-images/2023_Logo_ourtime.20230723122111.png',
    date: 'Jun. 24, 2025',
    summary: 'Ourtime is a dating site designed specifically for singles over 50. It offers an easy-to-use platform with features tailored for mature daters looking for meaningful connections.',
    reviewHref: '/dating/reviews/ourtime',
    ctaHref: 'https://www.ourtime.com',
  },
  {
    id: 'datemyage',
    name: 'DateMyAge',
    logo: '/top10-images/DateMyAge_logo.20201218133031.png',
    date: 'Jun. 23, 2025',
    summary: 'DateMyAge is an international dating platform that connects mature singles looking for companionship and romance. It features video chat and translation services.',
    reviewHref: '/dating/reviews/datemyage',
    ctaHref: 'https://www.datemyage.com',
  },
  {
    id: 'tinder',
    name: 'Tinder',
    logo: '/top10-images/logo.20200703051712.png',
    date: 'Jun. 22, 2025',
    summary: 'Tinder is the world\'s most popular dating app, known for its swipe-based matching system. It\'s great for casual dating and meeting new people in your area.',
    reviewHref: '/dating/reviews/tinder',
    ctaHref: 'https://www.tinder.com',
  },
  {
    id: 'bumble',
    name: 'Bumble',
    logo: '/top10-images/bumble.20190304092514.png',
    date: 'Jun. 21, 2025',
    summary: 'Bumble is a dating app where women make the first move. It also offers Bumble BFF for finding friends and Bumble Bizz for professional networking.',
    reviewHref: '/dating/reviews/bumble',
    ctaHref: 'https://www.bumble.com',
  },
  {
    id: 'hinge',
    name: 'Hinge',
    logo: '/top10-images/hinge.20190304085121.png',
    date: 'Jun. 20, 2025',
    summary: 'Hinge is designed to be deleted - it\'s the dating app that focuses on helping you find meaningful relationships rather than endless swiping.',
    reviewHref: '/dating/reviews/hinge',
    ctaHref: 'https://www.hinge.co',
  },
  {
    id: 'christian-mingle',
    name: 'Christian Mingle',
    logo: '/top10-images/ChristianMingle.20190123092342.png',
    date: 'Jun. 19, 2025',
    summary: 'Christian Mingle is a faith-based dating site that helps Christian singles find meaningful relationships with others who share their beliefs and values.',
    reviewHref: '/dating/reviews/christian-mingle',
    ctaHref: 'https://www.christianmingle.com',
  },
  {
    id: 'jdate',
    name: 'Jdate',
    logo: '/top10-images/Jdate_logo.20210325051414.20220715104907.png',
    date: 'Jun. 18, 2025',
    summary: 'Jdate is the leading Jewish dating site, helping Jewish singles find love and build lasting relationships within their community.',
    reviewHref: '/dating/reviews/jdate',
    ctaHref: 'https://www.jdate.com',
  },
  {
    id: 'okcupid',
    name: 'OkCupid',
    logo: '/top10-images/OkCupidLogo.20221031103259.png',
    date: 'Jun. 17, 2025',
    summary: 'OkCupid uses a unique matching algorithm based on your answers to thousands of questions. It\'s known for its inclusive approach to dating.',
    reviewHref: '/dating/reviews/okcupid',
    ctaHref: 'https://www.okcupid.com',
  },
  {
    id: 'coffee-meets-bagel',
    name: 'Coffee Meets Bagel',
    logo: '/top10-images/coffeemeetsbagel-logo.20190822110128.png',
    date: 'Jun. 16, 2025',
    summary: 'Coffee Meets Bagel takes a different approach by sending you a limited number of curated matches (bagels) each day, encouraging quality over quantity.',
    reviewHref: '/dating/reviews/coffee-meets-bagel',
    ctaHref: 'https://www.coffeemeetsbagel.com',
  },
  {
    id: 'hily',
    name: 'Hily',
    logo: '/top10-images/Hily-logo.20190822131108.png',
    date: 'Jun. 15, 2025',
    summary: 'Hily uses AI-powered matching to connect compatible singles. It offers video chat, stories, and various ways to express yourself on your profile.',
    reviewHref: '/dating/reviews/hily',
    ctaHref: 'https://www.hily.com',
  },
  {
    id: 'the-league',
    name: 'The League',
    logo: '/top10-images/TheLeague-logo.20190822131945.png',
    date: 'Jun. 14, 2025',
    summary: 'The League is an exclusive dating app for ambitious professionals. It vets all applicants and connects you with other driven, successful singles.',
    reviewHref: '/dating/reviews/the-league',
    ctaHref: 'https://www.theleague.com',
  },
  {
    id: 'happn',
    name: 'Happn',
    logo: '/top10-images/Happn.20190304091644.png',
    date: 'Jun. 13, 2025',
    summary: 'Happn connects you with people you\'ve crossed paths with in real life. It\'s a unique approach to dating that adds a touch of serendipity.',
    reviewHref: '/dating/reviews/happn',
    ctaHref: 'https://www.happn.com',
  },
  {
    id: 'badoo',
    name: 'Badoo',
    logo: '/top10-images/Badoo_Boost_Logo.20200408103525.png',
    date: 'Jun. 12, 2025',
    summary: 'Badoo is one of the largest dating networks in the world with over 500 million users. It offers various features for making new connections.',
    reviewHref: '/dating/reviews/badoo',
    ctaHref: 'https://www.badoo.com',
  },
  {
    id: 'grindr',
    name: 'Grindr',
    logo: '/top10-images/grindr.20190304090408.png',
    date: 'Jun. 11, 2025',
    summary: 'Grindr is the world\'s largest social networking app for gay, bi, trans, and queer people. It uses location-based matching to connect users nearby.',
    reviewHref: '/dating/reviews/grindr',
    ctaHref: 'https://www.grindr.com',
  },
  {
    id: 'blk',
    name: 'BLK',
    logo: '/top10-images/blk.20211104102818.png',
    date: 'Jun. 10, 2025',
    summary: 'BLK is a dating app designed for Black singles. It offers a welcoming space for the Black community to connect and find meaningful relationships.',
    reviewHref: '/dating/reviews/blk',
    ctaHref: 'https://www.blk-app.com',
  },
  {
    id: 'tawkify',
    name: 'Tawkify',
    logo: '/top10-images/2023_Logo_Tawkify.20231210130835.svg',
    date: 'Jun. 9, 2025',
    summary: 'Tawkify is a premium matchmaking service that pairs you with a personal matchmaker who handpicks compatible matches based on your preferences.',
    reviewHref: '/dating/reviews/tawkify',
    ctaHref: 'https://www.tawkify.com',
  },
  {
    id: 'seniorpeoplemeet',
    name: 'SeniorPeopleMeet',
    logo: '/top10-images/seniorpeoplemeet.20190304080608.png',
    date: 'Jun. 8, 2025',
    summary: 'SeniorPeopleMeet is a dating site for singles over 50, offering a simple and easy-to-use platform for mature daters seeking companionship.',
    reviewHref: '/dating/reviews/seniorpeoplemeet',
    ctaHref: 'https://www.seniorpeoplemeet.com',
  },
];

// Top 5 products data
const top5Products: Top5Product[] = [
  { name: 'Match', icon: '/top10-images/Match.com_icon.202103141254011.20220908065559.png', ctaHref: 'https://www.match.com' },
  { name: 'DateMyAge', icon: '/top10-images/DateMyAge_icon.20201218133034.png', ctaHref: 'https://www.datemyage.com' },
  { name: 'Ourtime', icon: '/top10-images/ourtime.20181008112848.png', ctaHref: 'https://www.ourtime.com' },
  { name: 'eharmony', icon: '/top10-images/2023_Favicon_Eharmony.20231224094837.svg', ctaHref: 'https://www.eharmony.com' },
  { name: 'BestDates', icon: '/top10-images/BestDates-100x100-Favicon2.20240917111026.svg', ctaHref: 'https://www.bestdates.com' },
];

// Must reads data
const mustReads: MustReadArticle[] = [
  {
    title: 'Top 10 Best Free Gay Dating Sites and Apps in 2026',
    image: '/top10-images/Group8251.20240218123834.png',
    href: '/dating/best-gay-dating-sites',
  },
  {
    title: 'Top 10 Best Asian Dating Sites & Apps: Find Asian Singles Online',
    image: '/top10-images/Group82221.20240214101151.png',
    href: '/dating/the-top-10-dating-sites-for-asian-singles',
  },
  {
    title: 'Top 10 Best Senior Dating Sites & Apps For Singles Over 50 (2026)',
    image: '/top10-images/Group8271.20240218124207.png',
    href: '/dating/best-senior-dating-sites',
  },
];

// 10 Steps data
const tenSteps = [
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
];

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M9.405 6.613l-4.022 3.89a.718.718 0 000 1.039.779.779 0 001.074 0l5.32-5.144a.718.718 0 000-1.039L6.458.215A.771.771 0 005.92 0a.771.771 0 00-.537.215.718.718 0 000 1.04l4.022 3.889H.76c-.42 0-.76.329-.76.734 0 .406.34.735.76.735h8.645z" fill="currentColor" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="top5-prods__item__link__arrow" viewBox="0 0 7 10" xmlns="http://www.w3.org/2000/svg">
      <path d="m18.9166667 10.9166667-3.8333334 3.8333333-3.8333333-3.8333333-1.1666667 1.1666666 5 5 5-5z" fill="#fff" fillRule="evenodd" transform="matrix(0 1 1 0 -10.916667 -10.083333)"></path>
    </svg>
  );
}

function Breadcrumb() {
  return (
    <div className="page-header">
      <div className="page-header__container">
        <div className="page-header__left">
          <div className="page-header__breadcrumb-offset">
            <ul className="breadcrumb">
              <li title="Home">
                <Link href="/" data-role="breadcrumb-link">Home</Link>
              </li>
              <li title="Dating">
                <Link href="/dating" data-role="breadcrumb-link">Dating</Link>
              </li>
              <li title="Reviews">
                <span data-role="breadcrumb-link">Reviews</span>
              </li>
            </ul>
          </div>
          {/* <Link href="/dating" className="back-to-list">
            <span className="back-to-list__icon"></span>
            <span className="back-to-list__text">Back To List</span>
          </Link> */}
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ item }: { item: ReviewItem }) {
  return (
    <div className="review-row" data-row-index={item.id}>
      {/* Mobile Logo */}
      <div className="review-row__mobile">
        <a href={item.ctaHref} target="_blank" rel="noopener noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img loading="lazy" className="review-row__logo" src={item.logo} alt={item.name} />
        </a>
      </div>

      {/* Left Content */}
      <div className="review-row__left">
        <Link href={item.reviewHref} className="review-row__title">
          <h2>{item.name}</h2>
        </Link>
        <div className="review-row__date">{item.date}</div>
        <div className="review-row__summary">{item.summary}</div>

        {/* Footer Buttons */}
        <div className="review-row__footer-section">
          <Link href={item.reviewHref} className="review-row__more">
            Read Review
          </Link>
          <a href={item.ctaHref} target="_blank" rel="noopener noreferrer" className="review-row__visit">
            Visit Site
            <ArrowIcon />
          </a>
        </div>
      </div>

      {/* Right - Desktop Logo */}
      <div className="review-row__right">
        <a href={item.ctaHref} target="_blank" rel="noopener noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img loading="lazy" className="review-row__logo" src={item.logo} alt={item.name} />
        </a>
      </div>
    </div>
  );
}

function Top5Products({ products, categoryHref }: { products: Top5Product[]; categoryHref: string }) {
  return (
    <div className="top5-prods">
      <div className="top5-prods__title">
        <Link href={categoryHref} className="top5-prods__title__text">Best Dating Sites</Link>
        <Link href={categoryHref} className="top5-prods__title__button" target="_blank" rel="noopener noreferrer">Compare All</Link>
      </div>
      <div className="top5-prods__items">
        {products.map((product, index) => (
          <a
            key={index}
            href={product.ctaHref}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="top5-prods__item nilink"
            data-product-name={product.name.toLowerCase()}
          >
            <div className="top5-prods__item__icon-container" style={{ backgroundImage: `url(${product.icon})` }}>
              <div className="top5-prods__item__icon" style={{ backgroundImage: `url(${product.icon})` }}></div>
            </div>
            <div className="top5-prods__item__name">{product.name}</div>
            <span className="top5-prods__item__link">
              <ChevronRightIcon />
            </span>
          </a>
        ))}
      </div>
      <div className="top5-prods__button-container">
        <Link href={categoryHref} className="top5-prods__button">Compare All</Link>
      </div>
    </div>
  );
}

function MustReadsSection({ articles }: { articles: MustReadArticle[] }) {
  return (
    <div className="page__sidebar__related-articles">
      <div className="related-articles sidebar-related" data-testid="related-articles">
        <div className="css-ay73wp">Must Reads</div>
        <div className="css-uh9nop">
          {articles.map((article, index) => (
            <Link key={index} href={article.href} className="related-articles__item css-6k4edl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.image} alt={article.title} className="css-h6pnhp" loading="lazy" />
              <div className="css-3xzcx7">
                <div className="css-6ub3mr">{article.title}</div>
                <span className="related-articles__item__link css-f4u9ac">Read more</span>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/dating/top-reads" className="related-articles__read-all">See all articles</Link>
      </div>
    </div>
  );
}

function WhyTop10Section() {
  return (
    <div className="why-top10">
      <div className="why-top10__title">
        Why <span className="why-top10__marked">Top10</span> your decisions
      </div>
      <div className="why-top10-stage">
        <div className="why-top10-stage-container">
          <div className="why-top10-stage-container__title">Compare.</div>
          <div className="why-top10-stage-container__text">We find the 10 best options.</div>
        </div>
      </div>
      <div className="why-top10-stage">
        <div className="why-top10-stage-container">
          <div className="why-top10-stage-container__title">Choose.</div>
          <div className="why-top10-stage-container__text">So you make decisions with ease.</div>
        </div>
      </div>
      <div className="why-top10-stage">
        <div className="why-top10-stage-container">
          <div className="why-top10-stage-container__title">Celebrate.</div>
          <div className="why-top10-stage-container__text">Simple, right?</div>
        </div>
        <div className="why-top10-stage__character">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/top10-images/stages-character.svg" alt="Why Top10" />
        </div>
      </div>
    </div>
  );
}

function TenStepsSection({ steps }: { steps: typeof tenSteps }) {
  return (
    <div className="ten-steps">
      <h3 className="ten-steps__header">10 Steps for Shopping with Confidence</h3>
      <div className="ten-steps__items">
        {steps.map((step, index) => (
          <div key={index} className="ten-steps__item">
            <div className="ten-steps__item__index">{String(index + 1).padStart(2, '0')}</div>
            <div className="ten-steps__item__content">
              <div className="ten-steps__item__header">{step.title}</div>
              {step.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DatingReviewsPage() {
  return (
    <div className="review-list-page">
      {/* SetoffBox */}
      <SetoffBox />

      {/* Navbar */}
      <Navbar categorySlug="dating" />

      {/* Breadcrumb & Back to List */}
      <Breadcrumb />

      {/* Page Header */}
      <div className="agg-reviews__header">
        <h1 className="page-title">In-Depth Online Dating Sites and Apps Reviews</h1>
        <span className="page-subtitle">
          Our dating sites reviews, researched and written by industry experts, give you all the information you need about price, number of members and age range to make an informed decision.
        </span>
      </div>

      {/* Horizontal Separator */}
      <div className="horiz-sep"></div>

      {/* Main Content with Sidebar */}
      <div className="page-with-sidebar">
        {/* Left - Main Content */}
        <div className="page">
          <section className="page__center">
            <div className="agg-reviews__items">
              {reviewItems.map((item) => (
                <ReviewRow key={item.id} item={item} />
              ))}
            </div>
          </section>
        </div>

        {/* Right - Sidebar */}
        <aside className="page__right-sidebar">
          <Top5Products products={top5Products} categoryHref="/dating" />
          <MustReadsSection articles={mustReads} />
          <WhyTop10Section />
          <TenStepsSection steps={tenSteps} />
        </aside>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
