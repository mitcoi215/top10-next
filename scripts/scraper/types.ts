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
// Scrape result container
// ============================================
export interface ScrapeResult {
  category: ScrapedCategory;
  products: ScrapedProduct[];
  authors: ScrapedAuthor[];
  articles?: ScrapedArticle[];
}
