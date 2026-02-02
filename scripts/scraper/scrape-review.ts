// scripts/scraper/scrape-review.ts
// =====================================================================
// CÀO TRANG REVIEW PRODUCT (e.g. /hosting/reviews/ionos)
// Áp dụng Công Thức Vàng 8 Lớp
// =====================================================================

import { Page } from 'playwright';
import type { ScrapedProduct, ScrapedAuthor, JsonLdReview } from './types';
import {
  layer1_parseJsonLD,
  layer2_byTestId,
  layer2_byTestIdAttr,
  layer3_innerHTML,
  layer3_evaluate,
  layer5_combined,
  layer5_combinedAll,
  layer6_siblingAfterText,
  getMetaContent,
  getCanonical,
} from './layers';
import { toCamelCase, slugify, cleanText, log } from './utils';

/**
 * Cào toàn bộ data từ một trang review product
 * URL pattern: https://www.10rating/{category}/reviews/{slug}
 */
export async function scrapeReviewPage(
  page: Page,
  url: string,
): Promise<{ product: Partial<ScrapedProduct>; author: ScrapedAuthor | null }> {
  log(`[Review] Navigating to: ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000); // Đợi hydration

  const product: Partial<ScrapedProduct> = {};
  let author: ScrapedAuthor | null = null;

  // Parse slug from URL
  const urlParts = url.replace(/\/$/, '').split('/');
  product.slug = urlParts[urlParts.length - 1];
  product.status = 'published';

  // ===========================================================
  // LỚP 1: JSON-LD (#id) - Nguồn sạch nhất
  // ===========================================================
  log('[Review] Lớp 1: Parsing JSON-LD...');
  const jsonLD = await layer1_parseJsonLD(page, 'ldjson_unified_review') as JsonLdReview | null;

  if (jsonLD) {
    // Product name
    if (jsonLD.itemReviewed?.name) {
      product.name = jsonLD.itemReviewed.name;
    }

    // Pros from JSON-LD
    if (jsonLD.positiveNotes?.itemListElement) {
      product.pros = jsonLD.positiveNotes.itemListElement.map(item => item.name);
    }

    // Cons from JSON-LD
    if (jsonLD.negativeNotes?.itemListElement) {
      product.cons = jsonLD.negativeNotes.itemListElement.map(item => item.name);
    }

    // Author
    if (jsonLD.author) {
      author = {
        name: jsonLD.author.name || 'Unknown',
        slug: slugify(jsonLD.author.name || 'unknown'),
        avatar: jsonLD.author.image,
        bio: jsonLD.author.description,
        socialLinks: {},
      };
      if (jsonLD.author.sameAs) {
        for (const url of jsonLD.author.sameAs) {
          if (url.includes('twitter.com') || url.includes('x.com')) {
            author.socialLinks!.twitter = url;
          } else if (url.includes('facebook.com')) {
            author.socialLinks!.facebook = url;
          } else if (url.includes('linkedin.com')) {
            author.socialLinks!.linkedin = url;
          } else {
            author.socialLinks!.website = url;
          }
        }
      }
      product.authorName = author.name;
    }

    // Logo from JSON-LD
    if (jsonLD.itemReviewed?.image) {
      product.logoUrl = jsonLD.itemReviewed.image;
    }

    log(`  → name: ${product.name}, pros: ${product.pros?.length}, cons: ${product.cons?.length}, author: ${author?.name}`);
  } else {
    log('  → JSON-LD not found, falling back to DOM');
  }

  // ===========================================================
  // LỚP 2: data-testid selectors - Stable attributes
  // ===========================================================
  log('[Review] Lớp 2: data-testid selectors...');

  // Review title (h1)
  if (!product.reviewTitle) {
    product.reviewTitle = await layer5_combined(page, '[data-testid="titles-container"] h1');
  }

  // Tagline / subtitle (h3)
  if (!product.reviewSubtitle) {
    product.reviewSubtitle = await layer5_combined(page, '[data-testid="titles-container"] h3');
    product.tagline = product.reviewSubtitle || undefined;
  }

  // Review count
  if (!product.reviewCount) {
    const reviewCountRaw = await layer3_evaluate(page, () => {
      const el = document.querySelector('[data-testid="titles-container"]');
      if (!el) return null;
      const span = el.closest('[data-testid="hero-container"]')?.querySelector('.eywaehk1, [class*="eywaehk"]');
      if (span) return span.textContent?.trim() || null;
      // Fallback: find span with "Reviews" text
      const allSpans = el.querySelectorAll('span');
      for (const s of allSpans) {
        if (s.textContent?.includes('Reviews')) return s.textContent.trim();
      }
      return null;
    });
    product.reviewCount = reviewCountRaw || undefined;
  }

  // Last updated date
  const lastUpdated = await layer2_byTestId(page, 'last-updated');

  // Read time
  product.readTime = (await layer2_byTestId(page, 'min-read')) || undefined;

  // Overall score
  const scoreText = await layer2_byTestId(page, 'score');
  if (scoreText) {
    product.overallScore = parseFloat(scoreText);
  }

  // Score table rows
  const scoreRows = await layer3_evaluate(page, () => {
    const rows = document.querySelectorAll('[data-testid="score-table-row"]');
    return Array.from(rows).map(row => {
      const name = row.querySelector('h3')?.textContent?.trim() || '';
      const desc = row.querySelector('div:nth-child(1) > div:nth-child(2)')?.textContent?.trim() || '';
      // Score value is in the last div child
      const allDivs = row.querySelectorAll(':scope > div');
      const scoreDivEl = allDivs[allDivs.length - 1];
      const score = parseFloat(scoreDivEl?.textContent?.trim() || '0');
      return { name, description: desc, score };
    });
  });

  if (scoreRows && scoreRows.length > 0) {
    product.scoresDetailed = scoreRows;
    const scores: Record<string, number> = {};
    for (const row of scoreRows) {
      scores[toCamelCase(row.name)] = row.score;
    }
    product.scores = scores;
    log(`  → scores: ${JSON.stringify(scores)}`);
  }

  // Score label ("Editorial Score")
  const scoreLabelEl = await layer3_evaluate(page, () => {
    const el = document.querySelector('[data-testid="score-table"] [data-testid="score"]');
    if (!el) return null;
    const parent = el.closest('[class]');
    const siblings = parent?.parentElement?.querySelectorAll('span');
    if (siblings) {
      for (const s of siblings) {
        if (s.textContent && !s.textContent.match(/^\d/)) {
          return s.textContent.trim();
        }
      }
    }
    return null;
  });
  product.scoreLabel = scoreLabelEl || undefined;

  // CTA URL & product info
  const ctaInfo = await layer3_evaluate(page, () => {
    const ctaEl = document.querySelector('a[data-role="product-cta"]');
    if (!ctaEl) return null;
    return {
      href: ctaEl.getAttribute('href') || '',
      productId: ctaEl.getAttribute('data-product-id') || '',
      productName: ctaEl.getAttribute('data-product-name') || '',
    };
  });

  if (ctaInfo) {
    product.ctaUrl = ctaInfo.href;
    product.ctaText = 'Visit Site';
    if (!product.name && ctaInfo.productName) {
      product.name = ctaInfo.productName;
    }
  }

  // Logo URL (from logo-and-ctas)
  if (!product.logoUrl) {
    product.logoUrl = (await layer5_combinedAttr(page, '[data-testid="logo-and-ctas"] img', 'src')) || undefined;
  }

  // Bottom line (fallback only - listing page has the correct short values)
  const bottomLineText = await layer2_byTestId(page, 'bottom-line-text');
  if (bottomLineText) {
    const firstSentence = bottomLineText.match(/^[^.!?]+[.!?]/);
    product.bottomLine = firstSentence ? firstSentence[0].trim() : bottomLineText.slice(0, 120).trim();
  }

  log(`  → title: ${product.reviewTitle}, score: ${product.overallScore}, readTime: ${product.readTime}`);

  // ===========================================================
  // LỚP 3: page.evaluate() - innerHTML, rating, highlights
  // ===========================================================
  log('[Review] Lớp 3: page.evaluate()...');

  // Rating (đếm sao)
  product.rating = await layer3_evaluate(page, () => {
    const heroContainer = document.querySelector('[data-testid="hero-container"]');
    if (!heroContainer) return null;
    const fullStars = heroContainer.querySelectorAll('[data-testid="full-star"]').length;
    const halfStars = heroContainer.querySelectorAll('[data-testid="half-star"]').length;
    return fullStars > 0 ? fullStars + (halfStars * 0.5) : null;
  }) || undefined;

  // Highlights (key-value pairs in sidebar)
  const highlightsRaw = await layer3_evaluate(page, () => {
    // Try review page format first (e1mlpi7i* classes)
    const items = document.querySelectorAll('[class*="e1mlpi7i7"]');
    if (items.length > 0) {
      const result: Record<string, string> = {};
      items.forEach(item => {
        const label = item.querySelector('[class*="e1mlpi7i5"]')?.textContent?.trim();
        const value = item.querySelector('[class*="e1mlpi7i4"]')?.textContent?.trim();
        if (label && value) result[label] = value;
      });
      return Object.keys(result).length > 0 ? result : null;
    }
    return null;
  });

  if (highlightsRaw) {
    const highlights: Record<string, string> = {};
    for (const [key, value] of Object.entries(highlightsRaw)) {
      highlights[toCamelCase(key)] = value;
    }
    product.highlights = highlights;
    log(`  → highlights: ${JSON.stringify(highlights)}`);
  }

  // Summary section
  const summaryData = await layer3_evaluate(page, () => {
    // Find the summary section (h2 + content)
    const summaryH2 = document.querySelector('[class*="e10rx6fo1"]');
    const summaryContent = document.querySelector('[class*="e10rx6fo0"]');
    return {
      title: summaryH2?.textContent?.trim() || null,
      content: summaryContent?.textContent?.trim() || null,
    };
  });
  product.summaryTitle = summaryData?.title || undefined;
  product.heroSummary = summaryData?.content || undefined;

  // Main content (preserve HTML)
  product.mainContent = (await layer3_innerHTML(page, 'section[data-role="wysiwyg"] > div')) || undefined;

  // Video URL
  product.videoUrl = await layer3_evaluate(page, () => {
    const youtubeEl = document.querySelector('[data-testid="youtube"] img');
    if (youtubeEl) {
      const src = youtubeEl.getAttribute('src') || '';
      const match = src.match(/\/vi\/([^/]+)\//);
      if (match) return `https://www.youtube.com/watch?v=${match[1]}`;
    }
    const iframe = document.querySelector('iframe[src*="youtube"]');
    if (iframe) {
      const src = iframe.getAttribute('src') || '';
      const match = src.match(/embed\/([^?]+)/);
      if (match) return `https://www.youtube.com/watch?v=${match[1]}`;
    }
    return null;
  }) || undefined;

  // Pros & Cons (fallback if JSON-LD didn't have them)
  if (!product.pros || product.pros.length === 0) {
    product.pros = await layer3_evaluate(page, () => {
      const prosSection = document.querySelector('[data-testid="pros-and-cons"] .pros');
      if (!prosSection) return [];
      const bullets = prosSection.querySelectorAll('[data-role="bullet"]');
      return Array.from(bullets).map(b => {
        const textEl = b.querySelector('div:last-child div');
        return textEl?.textContent?.trim() || '';
      }).filter(Boolean);
    }) || [];
  }

  if (!product.cons || product.cons.length === 0) {
    product.cons = await layer3_evaluate(page, () => {
      const consSection = document.querySelector('[data-testid="pros-and-cons"] .cons');
      if (!consSection) return [];
      const bullets = consSection.querySelectorAll('[data-role="bullet"]');
      return Array.from(bullets).map(b => {
        const textEl = b.querySelector('div:last-child div');
        return textEl?.textContent?.trim() || '';
      }).filter(Boolean);
    }) || [];
  }

  log(`  → rating: ${product.rating}, summary: ${product.summaryTitle ? 'yes' : 'no'}, mainContent: ${product.mainContent ? 'yes' : 'no'}`);

  // ===========================================================
  // LỚP 6: Playwright locator - Verdict (Bottom Line)
  // ===========================================================
  log('[Review] Lớp 6: Playwright locator...');

  // Verdict = text after "Bottom Line" heading in mainContent
  product.verdict = await layer6_siblingAfterText(page, 'h2', 'Bottom Line') || undefined;

  if (!product.verdict) {
    // Fallback: try with layer3
    product.verdict = await layer3_evaluate(page, () => {
      const headings = document.querySelectorAll('section[data-role="wysiwyg"] h2');
      for (const h of headings) {
        if (h.textContent?.includes('Bottom Line')) {
          let sibling = h.nextElementSibling;
          while (sibling) {
            if (sibling.tagName === 'P' && sibling.textContent?.trim()) {
              return sibling.textContent.trim();
            }
            sibling = sibling.nextElementSibling;
          }
        }
      }
      return null;
    }) || undefined;
  }

  log(`  → verdict: ${product.verdict ? 'yes' : 'no'}`);

  // ===========================================================
  // SEO: Meta tags
  // ===========================================================
  log('[Review] SEO meta tags...');
  product.metaTitle = (await getMetaContent(page, 'title')) || undefined;
  product.metaDescription = (await getMetaContent(page, 'description')) || undefined;
  product.ogImage = (await getMetaContent(page, 'og:image')) || undefined;
  product.canonical = (await getCanonical(page)) || undefined;
  product.publishedAt = (await getMetaContent(page, 'article:published_time')) || undefined;

  // Price from highlights
  if (product.highlights) {
    const priceKey = Object.keys(product.highlights).find(k =>
      k.toLowerCase().includes('price')
    );
    if (priceKey) {
      product.basePrice = product.highlights[priceKey];
    }
  }

  log(`[Review] Done: ${product.name} (${product.slug})`);
  return { product, author };
}

// Helper: get attribute from combined selector
async function layer5_combinedAttr(page: Page, selector: string, attr: string): Promise<string | null> {
  try {
    const el = page.locator(selector).first();
    if (await el.count() === 0) return null;
    return await el.getAttribute(attr);
  } catch {
    return null;
  }
}
