// lib/validations/article.ts
// Zod validation schemas for Article

import { z } from 'zod';

// Breadcrumb item schema
export const BreadcrumbItemSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  href: z.string().min(1, 'Href is required'),
});

// Article Create Schema
export const ArticleCreateSchema = z.object({
  // Basic Info
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional().nullable(),
  articleType: z.enum(['charticle', 'blog', 'guide']).default('charticle'),

  // Status
  status: z.enum(['draft', 'published']).default('draft'),

  // Relations
  categoryId: z.string().optional().nullable(),
  authorId: z.string().optional().nullable(),

  // Header
  featuredImage: z.string().optional().nullable(),
  featuredImageAlt: z.string().optional().nullable(),

  // Content
  content: z.string().optional().nullable(), // Rich Text / HTML
  excerpt: z.string().optional().nullable(), // Short excerpt for listings

  // Products mentioned in article
  productIds: z.array(z.string()).optional().default([]),

  // Breadcrumbs
  breadcrumbs: z.array(BreadcrumbItemSchema).optional().nullable(),

  // SEO
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  canonical: z.string().optional().nullable(),
});

// Article Update Schema (all fields optional)
export const ArticleUpdateSchema = z.object({
  // Basic Info
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only')
    .optional(),
  title: z.string().min(1, 'Title is required').optional(),
  subtitle: z.string().optional().nullable(),
  articleType: z.enum(['charticle', 'blog', 'guide']).optional(),

  // Status
  status: z.enum(['draft', 'published']).optional(),

  // Relations
  categoryId: z.string().optional().nullable(),
  authorId: z.string().optional().nullable(),

  // Header
  featuredImage: z.string().optional().nullable(),
  featuredImageAlt: z.string().optional().nullable(),

  // Content
  content: z.string().optional().nullable(),
  excerpt: z.string().optional().nullable(),

  // Products mentioned in article
  productIds: z.array(z.string()).optional(),

  // Breadcrumbs
  breadcrumbs: z.array(BreadcrumbItemSchema).optional().nullable(),

  // SEO
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  canonical: z.string().optional().nullable(),
});

// Types
export type ArticleCreateInput = z.infer<typeof ArticleCreateSchema>;
export type ArticleUpdateInput = z.infer<typeof ArticleUpdateSchema>;
export type BreadcrumbItem = z.infer<typeof BreadcrumbItemSchema>;
