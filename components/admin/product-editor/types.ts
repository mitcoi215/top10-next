// Product Editor Types
// Based on Prisma Schema v2.0

export interface ProductFormData {
  // ========== NHÓM 1: METADATA & BASIC INFO ==========
  slug: string;
  name: string;
  logoUrl: string;
  ctaUrl: string;
  ctaText: string;
  reviewHref: string;
  status: 'draft' | 'published';
  categoryId: string;
  authorId: string;

  // ========== NHÓM 2: CATEGORY LISTING DATA ==========
  rank: number;
  ribbon: string;
  tagline: string;
  bottomLine: string;
  bestFor: string;
  basePrice: string;
  overallScore: number | null;
  scoreLabel: string;
  scores: Record<string, number>;
  highlights: Record<string, string>;
  features: FeatureItem[];
  quote: QuoteData | null;

  // ========== NHÓM 3: REVIEW CONTENT ==========
  reviewTitle: string;
  reviewSubtitle: string;
  reviewHeroImage: string;
  rating: number | null;
  reviewCount: string;
  heroSummary: string;
  pros: string[];
  cons: string[];
  mainContent: string;
  verdict: string;
  images: string[];

  // ========== NHÓM 4: FAQ & EXTRAS ==========
  faqs: FaqItem[];
  userRatings: Record<string, number>;
  relatedProductIds: string[];

  // ========== NHÓM 5: SEO ==========
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  canonical: string;
}

export interface FeatureItem {
  text: string;
  bold: boolean;
}

export interface QuoteData {
  text: string;
  source: string;
  date: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

export interface AuthorOption {
  id: string;
  name: string;
}

export interface ScoreDefinition {
  key: string;
  label: string;
  maxScore: number;
}

export interface HighlightDefinition {
  key: string;
  label: string;
}

// Default empty product form data
export const defaultProductFormData: ProductFormData = {
  // Nhóm 1
  slug: '',
  name: '',
  logoUrl: '',
  ctaUrl: '',
  ctaText: 'Visit Site',
  reviewHref: '',
  status: 'draft',
  categoryId: '',
  authorId: '',

  // Nhóm 2
  rank: 1,
  ribbon: '',
  tagline: '',
  bottomLine: '',
  bestFor: '',
  basePrice: '',
  overallScore: null,
  scoreLabel: '',
  scores: {},
  highlights: {},
  features: [],
  quote: null,

  // Nhóm 3
  reviewTitle: '',
  reviewSubtitle: '',
  reviewHeroImage: '',
  rating: null,
  reviewCount: '',
  heroSummary: '',
  pros: [],
  cons: [],
  mainContent: '',
  verdict: '',
  images: [],

  // Nhóm 4
  faqs: [],
  userRatings: {},
  relatedProductIds: [],

  // Nhóm 5
  metaTitle: '',
  metaDescription: '',
  ogImage: '',
  canonical: '',
};
