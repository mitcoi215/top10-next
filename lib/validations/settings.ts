import { z } from 'zod';

// ============================================
// Nested Object Schemas
// ============================================

export const TrendingItemSchema = z.object({
  categoryId: z.string().min(1, 'Category ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  articleIds: z.array(z.string()).optional().default([]),
});

export const BrandLogoSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  logo: z.string().min(1, 'Logo URL is required'),
});

// ============================================
// Homepage Settings Schema
// ============================================

export const HomepageSettingsSchema = z.object({
  // Hero Section
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
export type BrandLogo = z.infer<typeof BrandLogoSchema>;
