import { z } from 'zod';

// ============================================
// Nested Object Schemas
// ============================================

// Trending article schema (articles within a trending item)
export const TrendingArticleSchema = z.object({
  title: z.string(),
  href: z.string(),
  image: z.string().optional().default(''),
  author: z.string().optional().default(''),
  date: z.string().optional().default(''),
  isReview: z.boolean().optional().default(false),
});

// Full trending item schema (used by admin UI and seed)
export const TrendingItemSchema = z.object({
  rank: z.number(),
  title: z.string(),
  href: z.string(),
  image: z.string().optional().default(''),
  description: z.string().optional().default(''),
  date: z.string().optional().default(''),
  articles: z.array(TrendingArticleSchema).optional().default([]),
});

export const BrandLogoSchema = z.object({
  name: z.string(),
  logo: z.string(),
});

// ============================================
// Homepage Settings Schema
// ============================================

export const HomepageSettingsSchema = z.object({
  // Hero Section
  heroTagline: z.string().optional().nullable(),
  heroTitle: z.string().optional().nullable(),
  heroSubtitle: z.string().optional().nullable(),

  // Featured Categories
  featuredCategoryIds: z.array(z.string()).optional().default([]),

  // Trending Section
  trendingItems: z.array(TrendingItemSchema).optional().default([]),

  // Stats Section
  statsListsCount: z.string().optional().nullable(),
  statsHoursCount: z.string().optional().nullable(),
  statsDecisionsCount: z.string().optional().nullable(),

  // Experts Section
  expertIds: z.array(z.string()).optional().default([]),

  // Mission Section
  missionTitle: z.string().optional().nullable(),
  missionContent: z.string().optional().nullable(),

  // Brand Logos
  brandLogos: z.array(BrandLogoSchema).optional().default([]),

  // More Articles
  moreArticleIds: z.array(z.string()).optional().default([]),
});

// ============================================
// Type Exports
// ============================================

export type HomepageSettingsInput = z.infer<typeof HomepageSettingsSchema>;
export type TrendingItem = z.infer<typeof TrendingItemSchema>;
export type TrendingArticle = z.infer<typeof TrendingArticleSchema>;
export type BrandLogo = z.infer<typeof BrandLogoSchema>;
