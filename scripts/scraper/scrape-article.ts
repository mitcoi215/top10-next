// scripts/scraper/scrape-article.ts
// =====================================================================
// CÀO TRANG ARTICLE (bài viết chi tiết) - e.g. /home-security/where-to-install-home-security-cameras
// =====================================================================

import { Page } from 'playwright';
import type { ScrapedArticle, ScrapedAuthor } from './types';
import {
  layer3_evaluate,
  layer3_innerHTML,
  layer5_combined,
  getMetaContent,
  getCanonical,
} from './layers';
import { slugify, log } from './utils';

/**
 * Cào toàn bộ data từ một trang article
 * URL pattern: https://www.top10.com/{category}/{article-slug}
 */
export async function scrapeArticlePage(
  page: Page,
  url: string,
): Promise<{ article: Partial<ScrapedArticle>; author: ScrapedAuthor | null }> {
  log(`[Article] Navigating to: ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  const article: Partial<ScrapedArticle> = {};
  let author: ScrapedAuthor | null = null;

  // Parse slug from URL
  const urlParts = url.replace(/\/$/, '').split('/');
  article.slug = urlParts[urlParts.length - 1];
  article.status = 'published';

  // ===========================================================
  // SEO: Meta tags
  // ===========================================================
  log('[Article] Cào SEO meta tags...');
  article.metaTitle = (await getMetaContent(page, 'title')) || undefined;
  article.metaDescription = (await getMetaContent(page, 'description')) || undefined;
  article.ogImage = (await getMetaContent(page, 'og:image')) || undefined;
  article.canonical = (await getCanonical(page)) || undefined;
  article.publishedAt = (await getMetaContent(page, 'article:published_time')) || undefined;

  // ===========================================================
  // Hero section: Title, Subtitle
  // ===========================================================
  log('[Article] Cào Hero section...');

  // Title (h1)
  article.title = await layer5_combined(page, '[data-testid="titles-container"] h1, h1.ni-9nynr3, h1') || '';

  // Subtitle (p after h1 in hero)
  article.subtitle = await layer3_evaluate(page, () => {
    // Try data-testid container first
    const container = document.querySelector('[data-testid="titles-container"], [data-testid="hero-article-titles-container"]');
    if (container) {
      const p = container.querySelector('p');
      if (p) return p.textContent?.trim() || null;
    }
    // Fallback: look for specific class
    const subtitleEl = document.querySelector('.ni-f9ekeq, [data-testid="hero-article-container"] p');
    return subtitleEl?.textContent?.trim() || null;
  }) || undefined;

  // Summary (intro paragraph - usually first wysiwyg text or a specific summary div)
  article.summary = await layer3_evaluate(page, () => {
    // Try to get summary from a dedicated summary element
    const summaryEl = document.querySelector('[class*="summary"], .ni-zqj6bk');
    if (summaryEl) return summaryEl.textContent?.trim() || null;
    return null;
  }) || undefined;

  // Hero image
  article.heroImage = await layer3_evaluate(page, () => {
    // Try background-image from right-side-image
    const rightSideEl = document.querySelector('[data-testid="right-side-image"]');
    if (rightSideEl) {
      const src = rightSideEl.getAttribute('src');
      if (src) return src;
    }
    // Try og:image meta
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) return ogImage.getAttribute('content') || null;
    return null;
  }) || undefined;

  // ===========================================================
  // Author information
  // ===========================================================
  log('[Article] Cào Author info...');

  const authorData = await layer3_evaluate(page, () => {
    // Try author-item first
    const authorItem = document.querySelector('[data-testid="author-item"]');
    if (authorItem) {
      const nameEl = authorItem.querySelector('a[href*="/authors/"], .ni-1cilpw2');
      const name = nameEl?.textContent?.trim() || '';
      const href = nameEl?.getAttribute('href') || '';
      const slugParts = href.split('/');
      const slug = slugParts[slugParts.length - 1] || '';

      // Avatar
      const avatarEl = authorItem.querySelector('[data-testid="background-image"]');
      const avatar = avatarEl?.getAttribute('src') || '';

      return { name, slug, avatar, bio: '' };
    }

    // Try author-biography section
    const authorBio = document.querySelector('[data-testid="author-biography"]');
    if (authorBio) {
      const nameEl = authorBio.querySelector('.ni-15awb0i, [class*="emkxu611"]');
      const name = nameEl?.textContent?.trim() || '';

      const avatarEl = authorBio.querySelector('[data-testid="background-image"]');
      const avatar = avatarEl?.getAttribute('src') || '';

      const bioEl = authorBio.querySelector('p.ni-jnx0cw, [class*="emkxu610"]');
      const bio = bioEl?.textContent?.trim() || '';

      return { name, slug: '', avatar, bio };
    }

    return null;
  });

  if (authorData) {
    article.authorName = authorData.name;
    article.authorSlug = authorData.slug || slugify(authorData.name);
    article.authorAvatar = authorData.avatar || undefined;
    article.authorBio = authorData.bio || undefined;

    author = {
      name: authorData.name,
      slug: authorData.slug || slugify(authorData.name),
      avatar: authorData.avatar || undefined,
      bio: authorData.bio || undefined,
      socialLinks: {},
    };
  }

  // ===========================================================
  // Date information
  // ===========================================================
  log('[Article] Cào Date info...');

  article.publishedDate = await layer3_evaluate(page, () => {
    // Try data-testid
    const lastUpdated = document.querySelector('[data-testid="last-updated"]');
    if (lastUpdated) return lastUpdated.textContent?.trim() || null;

    // Try meta tag
    const publishedMeta = document.querySelector('meta[property="article:published_time"]');
    if (publishedMeta) {
      const dateStr = publishedMeta.getAttribute('content');
      if (dateStr) {
        try {
          return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          });
        } catch {
          return dateStr;
        }
      }
    }

    return null;
  }) || undefined;

  // Read time
  article.readTime = await layer3_evaluate(page, () => {
    const readTimeEl = document.querySelector('[data-testid="min-read"]');
    return readTimeEl?.textContent?.trim() || null;
  }) || undefined;

  // ===========================================================
  // Main content
  // ===========================================================
  log('[Article] Cào Main content...');

  article.mainContent = (await layer3_innerHTML(page, 'section[data-role="wysiwyg"] > div')) || undefined;

  // If no content found, try alternative selectors
  if (!article.mainContent) {
    article.mainContent = (await layer3_innerHTML(page, 'section[data-role="wysiwyg"]')) || undefined;
  }

  log(`[Article] Done: ${article.title} (${article.slug})`);
  log(`  → author: ${author?.name || 'N/A'}, content: ${article.mainContent ? 'yes' : 'no'}`);

  return { article, author };
}
