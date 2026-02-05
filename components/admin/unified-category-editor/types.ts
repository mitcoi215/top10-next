// Category Form Data Types
// Based on Prisma Schema - matching original CategoryEditor
export interface CategoryFormData {
  // ========== BASIC INFO ==========
  name: string;
  slug: string;
  icon: string;
  color: string;
  description?: string;
  featured?: boolean;
  order?: number;
  groupId?: string; // Category Group for Hero Section

  // ========== SEO ==========
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;

  // ========== BANNER & DISPLAY ==========
  authorId?: string;
  heroImage?: string;
  heroTitle?: string;
  introContent?: string; // Rich Text / HTML

  // Product ordering (array of product IDs in rank order)
  productOrder?: string[];

  // ========== DEFINITIONS (Tab 3 in original) ==========
  // Criteria for scoring products in this category
  criteriaDefinitions?: CriteriaDefinition[];
  // Highlight labels for products in this category
  highlightDefinitions?: HighlightDefinition[];

  // ========== REVIEW LIST & METHODOLOGY ==========
  // Review List Page Content
  reviewListIntro?: string;
  reviewListHeroImage?: string;
  tenThingsToKnow?: ThingToKnow[];
  mustReadArticleIds?: string[];

  // Methodology Section
  methodologyIntro?: string;
  methodologyCriteria?: MethodologyCriterion[];
  exploreCards?: ExploreCard[];

  // Bottom Content (above FAQ) - Comparison table, experts section, etc.
  bottomContent?: string;

  // Additional Content (below Bottom Content)
  additionalContent?: string;

  // FAQ (Category-level)
  faqs?: FaqItem[];

  // ========== COMPARISON PAGE ==========
  comparisonRedirectEnabled?: boolean;
  comparisonTitle?: string;
  comparisonSubtitle?: string;
  comparisonHeroImage?: string;
  comparisonProductOrder?: string[];

  // Top 3 Bar
  comparisonTop3Enabled?: boolean;
  comparisonTop3Title?: string;
  comparisonTop3ProductIds?: string[];
  comparisonTop3Ribbon?: string;
  comparisonTop3ProductData?: Top3ProductData[];

  // Right Sidebar (Best Overall)
  comparisonRightSidebarEnabled?: boolean;
  comparisonRightSidebarProductId?: string;

  // Left Sidebar
  comparisonLeftSidebarEnabled?: boolean;
  comparisonSocialProofCount?: string;
  comparisonScoreBreakdown?: ScoreBreakdownItem[];

  // Below FAQ Content (Rich Text)
  comparisonBelowFaqContent?: string;

  // Relations
  products?: any[];
}

// Definition types
export interface CriteriaDefinition {
  key: string;
  label: string;
  maxScore: number;
}

export interface HighlightDefinition {
  key: string;
  label: string;
}

export interface ThingToKnow {
  title: string;
  description: string;
}

export interface MethodologyCriterion {
  title: string;
  description: string;
}

export interface ExploreCard {
  title: string;
  href: string;
  image?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ScoreBreakdownItem {
  name: string;
  description: string;
  score: number;
}

export interface Top3ProductData {
  id: string;
  overallScore?: number | null;
  scoreLabel?: string;
  bottomLine?: string;
  ribbon?: string;
  ctaUrl?: string;
  ctaText?: string;
  features?: string[];
}

// Default values
export const defaultCategoryFormData: CategoryFormData = {
  // Basic Info
  name: '',
  slug: '',
  icon: '📁',
  color: 'bg-blue-500',
  description: '',
  featured: false,
  order: 0,
  groupId: '',

  // SEO
  metaTitle: '',
  metaDescription: '',
  ogImage: '',

  // Banner & Display
  authorId: '',
  heroImage: '',
  heroTitle: '',
  introContent: '',
  productOrder: [],

  // Definitions
  criteriaDefinitions: [
    { key: 'value', label: 'Value', maxScore: 10 },
    { key: 'features', label: 'Features', maxScore: 10 },
    { key: 'ease_of_use', label: 'Ease of Use', maxScore: 10 },
  ],
  highlightDefinitions: [
    { key: 'starting_price', label: 'Starting Price' },
    { key: 'free_trial', label: 'Free Trial' },
  ],

  // Review List
  reviewListIntro: '',
  reviewListHeroImage: '',
  tenThingsToKnow: [],
  mustReadArticleIds: [],

  // Methodology & Content
  methodologyIntro: '',
  methodologyCriteria: [],
  exploreCards: [],
  bottomContent: '',
  additionalContent: '',
  faqs: [],

  // Comparison Page
  comparisonRedirectEnabled: false,
  comparisonTitle: '',
  comparisonSubtitle: '',
  comparisonHeroImage: '',
  comparisonProductOrder: [],

  // Top 3 Bar
  comparisonTop3Enabled: false,
  comparisonTop3Title: '',
  comparisonTop3ProductIds: [],
  comparisonTop3Ribbon: '',
  comparisonTop3ProductData: [],

  // Right Sidebar
  comparisonRightSidebarEnabled: false,
  comparisonRightSidebarProductId: '',

  // Left Sidebar
  comparisonLeftSidebarEnabled: true,
  comparisonSocialProofCount: '',
  comparisonScoreBreakdown: [
    { name: 'Popularity', description: 'Based on visits in the past 7 days', score: 9.0 },
    { name: 'Brand Reputation', description: 'Based on web trends', score: 9.0 },
    { name: 'Features & Benefits', description: 'Based on our editorial reviews', score: 9.0 },
  ],

  // Below FAQ
  comparisonBelowFaqContent: '',

  // Relations
  products: [],
};

// Product types for the panel
export interface ProductFormData {
  name: string;
  slug: string;
  logoUrl?: string;
  categoryId: string;
  authorId?: string;
  status: 'draft' | 'published';
  rank?: number;
  ribbon?: string;
  tagline?: string;
  bottomLine?: string;
  bestFor?: string;
  basePrice?: string;
  overallScore?: number | null;
  scoreLabel?: string;
  scores?: Record<string, number>;
  highlights?: Record<string, string>;
  features?: FeatureItem[];
  quote?: QuoteData | null;
  reviewTitle?: string;
  reviewSubtitle?: string;
  reviewHeroImage?: string;
  rating?: number | null;
  reviewCount?: string;
  heroSummary?: string;
  videoUrl?: string;
  pros?: string[];
  cons?: string[];
  mainContent?: string;
  faqs?: FaqItem[];
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  canonical?: string;
  ctaUrl?: string;
  ctaText?: string;
  reviewHref?: string;
  relatedProductIds?: string[];
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

export const defaultProductFormData: ProductFormData = {
  name: '',
  slug: '',
  logoUrl: '',
  categoryId: '',
  authorId: '',
  status: 'draft',
  rank: 0,
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
  reviewTitle: '',
  reviewSubtitle: '',
  reviewHeroImage: '',
  rating: null,
  reviewCount: '',
  heroSummary: '',
  videoUrl: '',
  pros: [],
  cons: [],
  mainContent: '',
  faqs: [],
  metaTitle: '',
  metaDescription: '',
  ogImage: '',
  canonical: '',
  ctaUrl: '',
  ctaText: 'Xem trang web',
  reviewHref: '',
  relatedProductIds: [],
};

// Icon and Color presets
export const ICON_PRESETS = [
  '📺', '💕', '🔒', '💼', '🏠', '❤️', '💪', '🎮',
  '📱', '💰', '🚗', '✈️', '🍔', '📚', '🎵', '🛒',
  '⚡', '🌐', '📧', '☁️'
];

export const COLOR_PRESETS = [
  { value: 'bg-red-500', label: 'Đỏ', hex: '#ef4444' },
  { value: 'bg-orange-500', label: 'Cam', hex: '#f97316' },
  { value: 'bg-amber-500', label: 'Hổ phách', hex: '#f59e0b' },
  { value: 'bg-yellow-500', label: 'Vàng', hex: '#eab308' },
  { value: 'bg-lime-500', label: 'Chanh', hex: '#84cc16' },
  { value: 'bg-green-500', label: 'Xanh lá', hex: '#22c55e' },
  { value: 'bg-emerald-500', label: 'Ngọc lục', hex: '#10b981' },
  { value: 'bg-teal-500', label: 'Mòng két', hex: '#14b8a6' },
  { value: 'bg-cyan-500', label: 'Lam', hex: '#06b6d4' },
  { value: 'bg-sky-500', label: 'Da trời', hex: '#0ea5e9' },
  { value: 'bg-blue-500', label: 'Xanh dương', hex: '#3b82f6' },
  { value: 'bg-indigo-500', label: 'Chàm', hex: '#6366f1' },
  { value: 'bg-violet-500', label: 'Tím', hex: '#8b5cf6' },
  { value: 'bg-purple-500', label: 'Tím đậm', hex: '#a855f7' },
  { value: 'bg-fuchsia-500', label: 'Hồng tím', hex: '#d946ef' },
  { value: 'bg-pink-500', label: 'Hồng', hex: '#ec4899' },
  { value: 'bg-rose-500', label: 'Hồng đào', hex: '#f43f5e' },
];
