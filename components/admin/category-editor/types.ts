// Category Editor Types
// Based on Prisma Schema v2.0

export interface CategoryFormData {
  // ========== TAB 1: GENERAL INFO ==========
  slug: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  featured: boolean;
  order: number;

  // Parent group for homepage organization
  groupId: string; // Links to CategoryGroup

  // SEO
  metaTitle: string;
  metaDescription: string;
  ogImage: string;

  // ========== TAB 2: RANKING & DISPLAY ==========
  heroImage: string;
  heroTitle: string;
  introContent: string; // Rich Text / HTML

  // Product ordering (array of product IDs in rank order)
  productOrder: string[];

  // ========== TAB 3: DEFINITIONS ==========
  // Criteria for scoring products in this category
  criteriaDefinitions: CriteriaDefinition[];

  // Highlight labels for products in this category
  highlightDefinitions: HighlightDefinition[];

  // ========== TAB 4: REVIEW LIST & METHODOLOGY ==========
  // Review List Page Content
  reviewListIntro: string;
  reviewListHeroImage: string;
  tenThingsToKnow: ThingToKnow[];
  mustReadArticleIds: string[];

  // Methodology Section
  methodologyIntro: string;
  methodologyCriteria: MethodologyCriterion[];
  exploreCards: ExploreCard[];

  // FAQ (Category-level)
  faqs: FaqItem[];
}

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
  image: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProductOption {
  id: string;
  name: string;
  rank: number;
  logoUrl?: string;
}

export interface ArticleOption {
  id: string;
  title: string;
  slug: string;
}

export interface CategoryGroupOption {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

// Color presets for category
export const COLOR_PRESETS = [
  { value: 'bg-red-500', label: 'Red', hex: '#ef4444' },
  { value: 'bg-orange-500', label: 'Orange', hex: '#f97316' },
  { value: 'bg-amber-500', label: 'Amber', hex: '#f59e0b' },
  { value: 'bg-yellow-500', label: 'Yellow', hex: '#eab308' },
  { value: 'bg-lime-500', label: 'Lime', hex: '#84cc16' },
  { value: 'bg-green-500', label: 'Green', hex: '#22c55e' },
  { value: 'bg-emerald-500', label: 'Emerald', hex: '#10b981' },
  { value: 'bg-teal-500', label: 'Teal', hex: '#14b8a6' },
  { value: 'bg-cyan-500', label: 'Cyan', hex: '#06b6d4' },
  { value: 'bg-sky-500', label: 'Sky', hex: '#0ea5e9' },
  { value: 'bg-blue-500', label: 'Blue', hex: '#3b82f6' },
  { value: 'bg-indigo-500', label: 'Indigo', hex: '#6366f1' },
  { value: 'bg-violet-500', label: 'Violet', hex: '#8b5cf6' },
  { value: 'bg-purple-500', label: 'Purple', hex: '#a855f7' },
  { value: 'bg-fuchsia-500', label: 'Fuchsia', hex: '#d946ef' },
  { value: 'bg-pink-500', label: 'Pink', hex: '#ec4899' },
  { value: 'bg-rose-500', label: 'Rose', hex: '#f43f5e' },
];

// Icon presets
export const ICON_PRESETS = [
  '📺', '💕', '🔒', '💼', '🏠', '❤️', '💪', '🎮', '📱', '💰',
  '🚗', '✈️', '🍔', '📚', '🎵', '🛒', '⚡', '🌐', '📧', '☁️',
];

// Default empty category form data
export const defaultCategoryFormData: CategoryFormData = {
  // Tab 1
  slug: '',
  name: '',
  icon: '📺',
  color: 'bg-blue-500',
  description: '',
  featured: false,
  order: 0,
  groupId: '', // Parent group for homepage
  metaTitle: '',
  metaDescription: '',
  ogImage: '',

  // Tab 2
  heroImage: '',
  heroTitle: '',
  introContent: '',
  productOrder: [],

  // Tab 3
  criteriaDefinitions: [
    { key: 'value', label: 'Value', maxScore: 10 },
    { key: 'features', label: 'Features', maxScore: 10 },
    { key: 'ease_of_use', label: 'Ease of Use', maxScore: 10 },
  ],
  highlightDefinitions: [
    { key: 'starting_price', label: 'Starting Price' },
    { key: 'free_trial', label: 'Free Trial' },
  ],

  // Tab 4
  reviewListIntro: '',
  reviewListHeroImage: '',
  tenThingsToKnow: [],
  mustReadArticleIds: [],
  methodologyIntro: '',
  methodologyCriteria: [],
  exploreCards: [],
  faqs: [],
};
