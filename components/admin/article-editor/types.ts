// Article Editor Types
// Based on Prisma Schema v2.0

export interface ArticleFormData {
  // Basic Info
  slug: string;
  title: string;
  subtitle: string;
  articleType: 'charticle' | 'blog' | 'guide';

  // Status
  status: 'draft' | 'published';

  // Relations
  categoryId: string | null;
  authorId: string | null;

  // Header
  featuredImage: string;
  featuredImageAlt: string;

  // Content
  content: string; // Rich Text / HTML
  excerpt: string; // Short excerpt for listings

  // Products mentioned
  productIds: string[];

  // Breadcrumbs
  breadcrumbs: BreadcrumbItem[];

  // SEO
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  canonical: string;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface AuthorOption {
  id: string;
  name: string;
  avatar?: string;
  title?: string;
}

export interface ProductOption {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

// Article type labels
export const ARTICLE_TYPES = [
  { value: 'charticle', label: 'Charticle', description: 'Comparison article with product cards' },
  { value: 'blog', label: 'Blog Post', description: 'General blog content' },
  { value: 'guide', label: 'Guide', description: 'In-depth how-to guide' },
] as const;

// Status labels
export const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'published', label: 'Published', color: 'bg-green-100 text-green-800' },
] as const;

// Default empty article form data
export const defaultArticleFormData: ArticleFormData = {
  slug: '',
  title: '',
  subtitle: '',
  articleType: 'charticle',
  status: 'draft',
  categoryId: null,
  authorId: null,
  featuredImage: '',
  featuredImageAlt: '',
  content: '',
  excerpt: '',
  productIds: [],
  breadcrumbs: [],
  metaTitle: '',
  metaDescription: '',
  ogImage: '',
  canonical: '',
};

// Helper to extract TOC from HTML content
export function extractTocFromHtml(html: string): TocItem[] {
  const toc: TocItem[] = [];
  const parser = typeof window !== 'undefined' ? new DOMParser() : null;

  if (!parser || !html) return toc;

  const doc = parser.parseFromString(html, 'text/html');
  const headings = doc.querySelectorAll('h2, h3');

  headings.forEach((heading, index) => {
    const id = heading.id || `heading-${index}`;
    const text = heading.textContent || '';
    const level = parseInt(heading.tagName.charAt(1));

    toc.push({ id, text, level });
  });

  return toc;
}

// Helper to add IDs to headings in HTML
export function addHeadingIds(html: string): string {
  if (typeof window === 'undefined' || !html) return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const headings = doc.querySelectorAll('h2, h3');

  headings.forEach((heading, index) => {
    if (!heading.id) {
      const slug = (heading.textContent || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      heading.id = slug || `heading-${index}`;
    }
  });

  return doc.body.innerHTML;
}
