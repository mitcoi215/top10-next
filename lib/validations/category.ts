import { z } from 'zod';

// ============================================
// Nested Object Schemas
// ============================================

export const CriteriaDefinitionSchema = z.object({
  key: z.string().min(1, 'Key is required').regex(/^[a-z0-9_]+$/, 'Key must be lowercase with underscores'),
  label: z.string().min(1, 'Label is required'),
  maxScore: z.number().min(1).max(100).default(10),
});

export const HighlightDefinitionSchema = z.object({
  key: z.string().min(1, 'Key is required').regex(/^[a-z0-9_]+$/, 'Key must be lowercase with underscores'),
  label: z.string().min(1, 'Label is required'),
});

export const ThingToKnowSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

export const MethodologyCriterionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

export const ExploreCardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  href: z.string().min(1, 'Link is required'),
  image: z.string().optional(),
});

export const FaqItemSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
});

export const ScoreBreakdownItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().default(''),
  score: z.number().min(0).max(10),
});

// ============================================
// Category Create Schema
// ============================================

export const CategoryCreateSchema = z.object({
  // Basic Info
  slug: z.string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  name: z.string().min(1, 'Name is required'),
  icon: z.string().min(1, 'Icon is required').default('📺'),
  color: z.string().default('bg-blue-500'),
  description: z.string().optional().nullable(),

  // Display settings
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),

  // Author
  authorId: z.string().optional().nullable(),

  // Hero & Intro
  heroImage: z.string().optional().nullable(),
  heroTitle: z.string().optional().nullable(),
  introContent: z.string().optional().nullable(),

  // Definitions
  criteriaDefinitions: z.array(CriteriaDefinitionSchema).optional().default([]),
  highlightDefinitions: z.array(HighlightDefinitionSchema).optional().default([]),

  // Methodology
  methodologyIntro: z.string().optional().nullable(),
  methodologyCriteria: z.array(MethodologyCriterionSchema).optional().default([]),
  exploreCards: z.array(ExploreCardSchema).optional().default([]),

  // Bottom Content (above FAQ)
  bottomContent: z.string().optional().nullable(),

  // Additional Content (below Bottom Content)
  additionalContent: z.string().optional().nullable(),

  // Review List Page
  reviewListIntro: z.string().optional().nullable(),
  reviewListHeroImage: z.string().optional().nullable(),
  tenThingsToKnow: z.array(ThingToKnowSchema).optional().default([]),
  mustReadArticleIds: z.array(z.string()).optional().default([]),

  // FAQs
  faqs: z.array(FaqItemSchema).optional().default([]),

  // Comparison Page - Hero
  comparisonTitle: z.string().optional().nullable(),
  comparisonSubtitle: z.string().optional().nullable(),
  comparisonHeroImage: z.string().optional().nullable(),

  // Comparison Page - Top 3 Bar
  comparisonTop3Enabled: z.boolean().optional().default(false),
  comparisonTop3Title: z.string().optional().nullable(),
  comparisonTop3ProductIds: z.array(z.string()).optional().default([]),
  comparisonTop3Ribbon: z.string().optional().nullable(),

  // Comparison Page - Right Sidebar
  comparisonRightSidebarEnabled: z.boolean().optional().default(false),
  comparisonRightSidebarProductId: z.string().optional().nullable(),

  // Comparison Page - Left Sidebar
  comparisonLeftSidebarEnabled: z.boolean().optional().default(true),
  comparisonSocialProofCount: z.string().optional().nullable(),
  comparisonScoreBreakdown: z.array(ScoreBreakdownItemSchema).optional().default([]),

  // Comparison Page - Below FAQ Content
  comparisonBelowFaqContent: z.string().optional().nullable(),

  // SEO
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
});

// ============================================
// Category Update Schema (same as create but all optional for PATCH)
// ============================================

export const CategoryUpdateSchema = CategoryCreateSchema.partial();

// ============================================
// Type Exports
// ============================================

export type CategoryCreateInput = z.infer<typeof CategoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof CategoryUpdateSchema>;
export type CriteriaDefinition = z.infer<typeof CriteriaDefinitionSchema>;
export type HighlightDefinition = z.infer<typeof HighlightDefinitionSchema>;
export type ThingToKnow = z.infer<typeof ThingToKnowSchema>;
export type MethodologyCriterion = z.infer<typeof MethodologyCriterionSchema>;
export type ExploreCard = z.infer<typeof ExploreCardSchema>;
export type FaqItem = z.infer<typeof FaqItemSchema>;
export type ScoreBreakdownItem = z.infer<typeof ScoreBreakdownItemSchema>;
