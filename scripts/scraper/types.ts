// scripts/scraper/types.ts
// Type definitions for scraped data matching Prisma schema

// ============================================
// AUTHOR
// ============================================
export interface ScrapedAuthor {
  slug: string;
  name: string;
  avatar?: string;
  title?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    website?: string;
  };
}

// ============================================
// CATEGORY (from listing page)
// ============================================
export interface ScrapedCategory {
  slug: string;
  name: string;
  heroTitle?: string;
  heroImage?: string;
  introContent?: string;
  sidebarPeopleCount?: string;
  bestOfListTitle?: string;
  compareBoxTitle?: string;
  compareBoxDescription?: string;
  compareBoxStats?: string;
  closerLookTitle?: string;
  methodologyTitle?: string;
  methodologyIntro?: string;
  criteriaTitle?: string;
  methodologyCriteria?: { title: string; description: string }[];
  bottomContent?: string;
  faqs?: { question: string; answer: string }[];
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  // Redirect: listing page auto-redirects to comparison
  redirectToComparison?: boolean;
  // Author found on the page
  author?: ScrapedAuthor;
}

// ============================================
// PRODUCT (merged from listing + review page)
// ============================================
export interface ScrapedProduct {
  // --- Metadata ---
  slug: string;
  name: string;
  logoUrl?: string;
  ctaUrl?: string;
  ctaText?: string;
  status: string;

  // --- Listing data ---
  rank: number;
  ribbon?: string;
  tagline?: string;
  bottomLine?: string;
  bestFor?: string;
  basePrice?: string;
  overallScore?: number;
  scoreLabel?: string;
  scores?: Record<string, number>;
  scoresDetailed?: { name: string; score: number; description?: string }[];
  highlights?: Record<string, string>;
  features?: { text: string; bold: boolean }[];
  quote?: { text: string; source?: string; date?: string };
  reviewCount?: string;

  // --- Review content ---
  reviewTitle?: string;
  reviewSubtitle?: string;
  reviewHeroImage?: string;
  rating?: number;
  readTime?: string;
  summaryTitle?: string;
  heroSummary?: string;
  videoUrl?: string;
  pros?: string[];
  cons?: string[];
  mainContent?: string;
  verdict?: string;
  images?: string[];

  // --- FAQ ---
  faqs?: { question: string; answer: string }[];

  // --- SEO ---
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  canonical?: string;
  publishedAt?: string;

  // --- Author (for linking) ---
  authorName?: string;
}

// ============================================
// JSON-LD structured data from review page
// ============================================
export interface JsonLdReview {
  author?: {
    name?: string;
    image?: string;
    description?: string;
    sameAs?: string[];
  };
  itemReviewed?: {
    name?: string;
    image?: string;
  };
  positiveNotes?: {
    itemListElement?: { name: string; position: number }[];
  };
  negativeNotes?: {
    itemListElement?: { name: string; position: number }[];
  };
  description?: string;
  url?: string;
}

// ============================================
// ARTICLE (from top-reads page)
// ============================================
export interface ScrapedArticle {
  // --- Metadata ---
  slug: string;
  title: string;
  subtitle?: string;
  summary?: string;
  heroImage?: string;
  publishedDate?: string;
  readTime?: string;
  status: string;

  // --- Content ---
  mainContent?: string;

  // --- Author ---
  authorName?: string;
  authorSlug?: string;
  authorAvatar?: string;
  authorBio?: string;

  // --- SEO ---
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  canonical?: string;
  publishedAt?: string;
}

// ============================================
// Article list item (from top-reads listing)
// ============================================
export interface ArticleListItem {
  slug: string;
  title: string;
  summary?: string;
  date?: string;
  imageUrl?: string;
  href: string;
}

// ============================================
// COMPARISON PAGE DATA
// ============================================
export interface ScrapedComparisonProduct {
  position: number;
  name: string;
  slug: string;
  productId?: string;           // data-product-id from card
  logoUrl?: string;
  overallScore?: number;
  scoreLabel?: string;
  bottomLine?: string;
  ribbon?: string;
  features: string[];
  ctaUrl?: string;              // tracking URL from CTA
  ctaText?: string;
  secondaryCtaUrl?: string;
  secondaryCtaText?: string;
  reviewCount?: string;
}

export interface ScrapedMiniReview {
  position: number;
  name: string;
  slug: string;
  productId?: string;
  logoUrl?: string;
  overallScore?: number;
  scoreLabel?: string;
  highlight?: string;           // short highlight text
  bottomLine?: string;
  description?: string;         // long description paragraph
  reviewLink?: string;          // "Read X Review" href
  pros?: string[];
  cons?: string[];
  ctaUrl?: string;
  ctaText?: string;
}

export interface ScrapedComparison {
  heroTitle?: string;
  heroSubtitle?: string;
  lastUpdated?: string;
  products: ScrapedComparisonProduct[];
  // Below-chart content
  wysiwygContent?: string;      // HTML from data-role="chart-wysiwyg-container"
  miniReviews?: ScrapedMiniReview[];  // "Our Top 3 Picks" section
  // Sidebar data
  socialProofCount?: string;
  scoreBreakdown?: { name: string; score: number; description?: string }[];
  // FAQs from comparison page
  faqs?: { question: string; answer: string }[];
}

// ============================================
// Scrape result container
// ============================================
export interface ScrapeResult {
  category: ScrapedCategory;
  products: ScrapedProduct[];
  authors: ScrapedAuthor[];
  articles?: ScrapedArticle[];
  comparison?: ScrapedComparison;
}
