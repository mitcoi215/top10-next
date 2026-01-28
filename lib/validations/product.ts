import { z } from 'zod';
import { FaqItemSchema } from './category';

// ============================================
// Nested Object Schemas
// ============================================

export const FeatureItemSchema = z.object({
  text: z.string().min(1, 'Feature text is required'),
  bold: z.boolean().default(false),
});

export const QuoteSchema = z.object({
  text: z.string().min(1, 'Quote text is required'),
  source: z.string().optional(),
  date: z.string().optional(),
});

// ============================================
// Product Create Schema
// ============================================

export const ProductCreateSchema = z.object({
  // ========== NHÓM 1: METADATA & BASIC INFO ==========
  slug: z.string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  name: z.string().min(1, 'Name is required'),
  logoUrl: z.string().optional().nullable(),
  ctaUrl: z.string().url('Must be a valid URL').optional().nullable(),
  ctaText: z.string().default('Visit Site'),
  reviewHref: z.string().optional().nullable(),
  status: z.enum(['draft', 'published']).default('draft'),
  categoryId: z.string().min(1, 'Category is required'),
  authorId: z.string().optional().nullable(),

  // ========== NHÓM 2: CATEGORY LISTING DATA ==========
  rank: z.number().int().min(0).default(0),
  ribbon: z.string().optional().nullable(),
  tagline: z.string().optional().nullable(),
  bottomLine: z.string().optional().nullable(),
  bestFor: z.string().optional().nullable(),
  basePrice: z.string().optional().nullable(),

  // Scores
  overallScore: z.number().min(0).max(10).optional().nullable(),
  scoreLabel: z.string().optional().nullable(),
  scores: z.record(z.string(), z.number()).optional().default({}),

  // Highlights (dynamic key-value)
  highlights: z.record(z.string(), z.string()).optional().default({}),

  // Features
  features: z.array(FeatureItemSchema).optional().default([]),

  // Quote
  quote: QuoteSchema.optional().nullable(),

  // ========== NHÓM 3: REVIEW CONTENT ==========
  reviewTitle: z.string().optional().nullable(),
  reviewSubtitle: z.string().optional().nullable(),
  reviewHeroImage: z.string().optional().nullable(),
  rating: z.number().min(0).max(5).optional().nullable(),
  reviewCount: z.string().optional().nullable(),
  heroSummary: z.string().optional().nullable(),
  pros: z.array(z.string()).optional().default([]),
  cons: z.array(z.string()).optional().default([]),
  mainContent: z.string().optional().nullable(),
  verdict: z.string().optional().nullable(),
  images: z.array(z.string()).optional().default([]),

  // ========== NHÓM 4: FAQ & EXTRAS ==========
  faqs: z.array(FaqItemSchema).optional().default([]),
  userRatings: z.record(z.string(), z.number()).optional().default({}),
  relatedProductIds: z.array(z.string()).optional().default([]),

  // ========== NHÓM 5: SEO ==========
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  canonical: z.string().optional().nullable(),
});

// ============================================
// Product Update Schema
// ============================================

export const ProductUpdateSchema = ProductCreateSchema.partial();

// ============================================
// Type Exports
// ============================================

export type ProductCreateInput = z.infer<typeof ProductCreateSchema>;
export type ProductUpdateInput = z.infer<typeof ProductUpdateSchema>;
export type FeatureItem = z.infer<typeof FeatureItemSchema>;
export type Quote = z.infer<typeof QuoteSchema>;
