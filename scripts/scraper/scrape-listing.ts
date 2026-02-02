// scripts/scraper/scrape-listing.ts
// =====================================================================
// CÀO TRANG CATEGORY LISTING (e.g. /hosting)
// Áp dụng Công Thức Vàng 8 Lớp
// =====================================================================

import { Page } from 'playwright';
import type { ScrapedCategory, ScrapedProduct } from './types';
import {
  layer2_byTestId,
  layer3_evaluate,
  layer3_innerHTML,
  layer4_byClass,
  layer4_allByClass,
  layer5_combined,
  layer5_combinedAll,
  layer6_siblingAfterText,
  layer7_xpath,
  layer7_xpathAll,
  getMetaContent,
  getCanonical,
} from './layers';
import { toCamelCase, slugify, cleanText, log } from './utils';

/**
 * Cào toàn bộ data từ trang category listing
 * URL pattern: https://www.10rating/{category}
 */
export async function scrapeListingPage(
  page: Page,
  url: string,
  skipNavigation = false,
): Promise<{ category: Partial<ScrapedCategory>; products: Partial<ScrapedProduct>[] }> {
  if (!skipNavigation) {
    log(`[Listing] Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);
  } else {
    log(`[Listing] Page already loaded, skipping navigation`);
  }

  const category: Partial<ScrapedCategory> = {};
  const products: Partial<ScrapedProduct>[] = [];

  // Parse slug from URL
  const urlParts = url.replace(/\/$/, '').split('/');
  category.slug = urlParts[urlParts.length - 1];

  // ===========================================================
  // CATEGORY DATA
  // ===========================================================

  // --- LỚP 2: data-testid / meta ---
  log('[Listing] Cào Category data...');

  // SEO
  category.metaTitle = (await getMetaContent(page, 'title')) || undefined;
  category.metaDescription = (await getMetaContent(page, 'description')) || undefined;
  category.ogImage = (await getMetaContent(page, 'og:image')) || undefined;

  // --- LỚP 4: CSS Class ---
  // Hero title
  category.heroTitle = (await layer4_byClass(page, 'title')) || undefined;
  if (!category.heroTitle) {
    category.heroTitle = await layer5_combined(page, 'h1.title') || undefined;
  }
  if (!category.heroTitle) {
    category.heroTitle = await layer3_evaluate(page, () => {
      return document.querySelector('h1')?.textContent?.trim() || null;
    }) || undefined;
  }

  // Category name from heroTitle (parse: "Top 10 Best Web Hosting..." → "Hosting")
  category.name = category.slug
    ? category.slug.charAt(0).toUpperCase() + category.slug.slice(1)
    : undefined;

  // --- LỚP 3: page.evaluate() ---
  // Intro content
  category.introContent = await layer3_evaluate(page, () => {
    const wysiwyg = document.querySelector('.show-more__content section[data-role="wysiwyg"] .charticle__wysiwyg');
    if (wysiwyg) return wysiwyg.innerHTML.trim();
    // Fallback: first wysiwyg section
    const first = document.querySelector('section[data-role="wysiwyg"]');
    return first?.innerHTML.trim() || null;
  }) || undefined;

  // People count sidebar
  category.sidebarPeopleCount = await layer3_evaluate(page, () => {
    const els = document.querySelectorAll('[class*="people"], [class*="shopper"]');
    for (const el of els) {
      const match = el.textContent?.match(/([\d,]+)\s*(people|shoppers)/i);
      if (match) return match[1];
    }
    return null;
  }) || undefined;

  // --- LỚP 6: Playwright locator (has-text) ---
  // Methodology section
  category.methodologyTitle = await layer3_evaluate(page, () => {
    const headings = document.querySelectorAll('h2');
    for (const h of headings) {
      if (h.textContent?.includes('Methodology') || h.textContent?.includes('How Did We')) {
        return h.textContent.trim();
      }
    }
    return null;
  }) || undefined;

  category.methodologyIntro = await layer6_siblingAfterText(page, 'h2', 'Methodology') || undefined;

  // Methodology criteria
  category.methodologyCriteria = await layer3_evaluate(page, () => {
    const result: { title: string; description: string }[] = [];
    // Look for criteria items (usually h3 + p pattern after methodology heading)
    const headings = document.querySelectorAll('h2');
    for (const h of headings) {
      if (h.textContent?.includes('criteria') || h.textContent?.includes('Criteria')) {
        let sibling = h.nextElementSibling;
        while (sibling) {
          if (sibling.tagName === 'H3') {
            const title = sibling.textContent?.trim() || '';
            const desc = sibling.nextElementSibling?.textContent?.trim() || '';
            if (title) result.push({ title, description: desc });
          }
          sibling = sibling.nextElementSibling;
          // Stop at next h2
          if (sibling?.tagName === 'H2') break;
        }
        break;
      }
    }
    return result.length > 0 ? result : null;
  }) || undefined;

  // FAQ section
  category.faqs = await layer3_evaluate(page, () => {
    const faqs: { question: string; answer: string }[] = [];
    // FAQ accordion items
    const faqItems = document.querySelectorAll('[data-testid="faq-item"], .faq-item, [class*="faq"] [class*="item"]');
    faqItems.forEach(item => {
      const q = item.querySelector('[data-testid="faq-question"], .faq-question, button, h3, h4')?.textContent?.trim();
      const a = item.querySelector('[data-testid="faq-answer"], .faq-answer, [class*="answer"], p')?.textContent?.trim();
      if (q && a) faqs.push({ question: q, answer: a });
    });

    // Fallback: schema.org FAQ
    if (faqs.length === 0) {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      for (const s of scripts) {
        try {
          const data = JSON.parse(s.textContent || '');
          if (data['@type'] === 'FAQPage' && data.mainEntity) {
            for (const entity of data.mainEntity) {
              faqs.push({
                question: entity.name || '',
                answer: entity.acceptedAnswer?.text || '',
              });
            }
          }
        } catch { /* skip */ }
      }
    }

    return faqs.length > 0 ? faqs : null;
  }) || undefined;

  // --- Best of products list (title + bestFor labels) ---
  const bestOfData = await layer3_evaluate(page, () => {
    const container = document.querySelector('[data-testid="best-of-products"]');
    if (!container) return null;
    const title = container.querySelector('h2')?.textContent?.trim() || '';
    const items: { name: string; bestFor: string }[] = [];
    container.querySelectorAll('li').forEach(li => {
      const link = li.querySelector('a[data-product-name]');
      const name = link?.getAttribute('data-product-name')?.trim() || link?.textContent?.trim() || '';
      // Text after " - " is the bestFor label
      const fullText = li.textContent?.trim() || '';
      const dashIndex = fullText.indexOf(' - ');
      const bestFor = dashIndex >= 0 ? fullText.slice(dashIndex + 3).trim() : '';
      items.push({ name, bestFor });
    });
    return { title, items };
  });
  if (bestOfData) {
    category.bestOfListTitle = bestOfData.title || undefined;
    // Store for later mapping to products
    (category as any)._bestOfItems = bestOfData.items;
  }

  // Bottom content
  category.bottomContent = await layer3_evaluate(page, () => {
    const bottomSection = document.querySelector('.charticle__bottom, .charticle__article');
    if (bottomSection) return bottomSection.innerHTML.trim();
    return null;
  }) || undefined;

  log(`  → Category: ${category.name} (${category.slug}), heroTitle: ${category.heroTitle}`);

  // ===========================================================
  // PRODUCT CARDS DATA
  // ===========================================================
  log('[Listing] Cào Product cards...');

  // --- LỚP 3 + 4: page.evaluate() with BEM classes ---
  const productCards = await layer3_evaluate(page, () => {
    const cards: any[] = [];

    // Strategy A: mini-reviews (detailed review cards)
    const miniReviews = document.querySelectorAll('.mini-reviews__item, li.mini-reviews__item');
    if (miniReviews.length > 0) {
      miniReviews.forEach((card, index) => {
        const data: any = { rank: index + 1 };

        // Product name (h2)
        const nameEl = card.querySelector('.mini-reviews__product-name, h2[data-toc-anchor]');
        data.name = nameEl?.textContent?.trim() || '';

        // Slug from review link
        const reviewLink = card.querySelector('a[data-role="read-review"], a.mini-reviews__review-link');
        if (reviewLink) {
          const href = reviewLink.getAttribute('href') || '';
          const parts = href.split('/');
          data.slug = parts[parts.length - 1] || parts[parts.length - 2] || '';
          data.reviewHref = href;
        }

        // Logo
        const logoImg = card.querySelector('.mini-reviews__logo-image, img[class*="logo"]');
        data.logoUrl = logoImg?.getAttribute('src') || '';

        // Tagline
        const taglineEl = card.querySelector('.mini-reviews__product-highlight span, .mini-reviews__product-highlight');
        data.tagline = taglineEl?.textContent?.trim() || '';

        // Product description HTML (rich content from listing page)
        const descEl = card.querySelector('.mini-reviews__product-description');
        data.heroSummary = descEl?.innerHTML?.trim() || '';

        // CTA
        const ctaEl = card.querySelector('a.cta-button, a[data-role="product-cta"], a.mini-reviews__cta-button');
        data.ctaUrl = ctaEl?.getAttribute('href') || '';
        data.ctaText = ctaEl?.querySelector('span')?.textContent?.trim() || 'Visit Site';
        data.productId = ctaEl?.getAttribute('data-product-id') || '';

        // Highlights (bullet points)
        const highlights: Record<string, string> = {};
        const bulletItems = card.querySelectorAll('.mini-reviews__bullet-points__item, [class*="bullet-points__item"]');
        bulletItems.forEach(item => {
          const key = item.querySelector('.mini-reviews__bullet-points__display-name, [class*="display-name"]')?.textContent?.trim();
          const value = item.querySelector('.mini-reviews__bullet-points__value, [class*="__value"]')?.textContent?.trim();
          if (key && value) highlights[key] = value;
        });
        data.highlights = Object.keys(highlights).length > 0 ? highlights : null;

        // Extract basePrice from highlights
        const priceKey = Object.keys(highlights).find(k => k.toLowerCase().includes('price'));
        data.basePrice = priceKey ? highlights[priceKey] : '';

        // Features (product attributes)
        const features: { text: string; bold: boolean }[] = [];
        const featureItems = card.querySelectorAll('[data-testid="product-attribute"], li[data-testid="product-attribute"]');
        featureItems.forEach(item => {
          const text = item.textContent?.trim();
          if (text) features.push({ text, bold: false });
        });
        data.features = features.length > 0 ? features : null;

        // Pros & Cons
        const pros: string[] = [];
        const cons: string[] = [];
        const prosSection = card.querySelector('.pros-and-cons__section:first-child, .pros');
        const consSection = card.querySelector('.pros-and-cons__section:last-child, .cons');

        prosSection?.querySelectorAll('.pros-and-cons__text, [class*="pros-and-cons__text"]').forEach(el => {
          const t = el.textContent?.trim();
          if (t) pros.push(t);
        });
        consSection?.querySelectorAll('.pros-and-cons__text, [class*="pros-and-cons__text"]').forEach(el => {
          const t = el.textContent?.trim();
          if (t) cons.push(t);
        });

        // Fallback: pros-and-cons with pro/con icons
        if (pros.length === 0 && cons.length === 0) {
          card.querySelectorAll('.pros-and-cons__pro, [class*="pro-icon"]').forEach(el => {
            const parent = el.closest('[class*="pros-and-cons"]');
            const text = parent?.querySelector('.pros-and-cons__text')?.textContent?.trim();
            if (text) pros.push(text);
          });
          card.querySelectorAll('.pros-and-cons__con, [class*="con-icon"]').forEach(el => {
            const parent = el.closest('[class*="pros-and-cons"]');
            const text = parent?.querySelector('.pros-and-cons__text')?.textContent?.trim();
            if (text) cons.push(text);
          });
        }

        data.pros = pros;
        data.cons = cons;

        // Bottom line (short summary from listing page)
        const bottomLineEl = card.querySelector('[data-testid="bottom-line-text"]');
        data.bottomLine = bottomLineEl?.textContent?.trim() || '';

        // Ribbon / Badge
        const ribbonEl = card.querySelector('[class*="ribbon"], [class*="badge"], [data-testid="ribbon"]');
        data.ribbon = ribbonEl?.textContent?.trim() || '';

        cards.push(data);
      });
    }

    // Strategy B: chart-product-card (compact list view)
    if (cards.length === 0) {
      const chartProducts = document.querySelectorAll('div[data-role="chart-product-card"]');
      chartProducts.forEach((card, index) => {
        const data: any = {
          rank: parseInt(card.getAttribute('data-product-position') || `${index + 1}`),
          name: card.getAttribute('data-product-name') || '',
          productId: card.getAttribute('data-product-id') || '',
        };

        // Review link
        const reviewLink = card.querySelector('a[data-role="read-review"]');
        if (reviewLink) {
          const href = reviewLink.getAttribute('href') || '';
          const parts = href.split('/');
          data.slug = parts[parts.length - 1] || '';
          data.reviewHref = href;
        }

        // CTA
        const ctaEl = card.querySelector('a.cta-button, a[data-role="product-cta"]');
        data.ctaUrl = ctaEl?.getAttribute('href') || '';

        // Logo
        const logoImg = card.querySelector('img[class*="logo"]');
        data.logoUrl = logoImg?.getAttribute('src') || '';

        // Bottom line
        const bottomLineEl = card.querySelector('[data-testid="bottom-line-text"]');
        data.bottomLine = bottomLineEl?.textContent?.trim() || '';

        cards.push(data);
      });
    }

    return cards;
  });

  if (productCards) {
    for (const card of productCards) {
      const product: Partial<ScrapedProduct> = {
        slug: card.slug || slugify(card.name),
        name: card.name,
        rank: card.rank || 0,
        logoUrl: card.logoUrl || undefined,
        tagline: card.tagline || undefined,
        bottomLine: card.bottomLine || undefined,
        heroSummary: card.heroSummary || undefined,
        basePrice: card.basePrice || undefined,
        ctaUrl: card.ctaUrl || undefined,
        ctaText: card.ctaText || 'Visit Site',
        ribbon: card.ribbon || undefined,
        pros: card.pros?.length > 0 ? card.pros : undefined,
        cons: card.cons?.length > 0 ? card.cons : undefined,
        features: card.features || undefined,
        status: 'published',
      };

      // Convert highlights keys to camelCase
      if (card.highlights) {
        const highlights: Record<string, string> = {};
        for (const [key, value] of Object.entries(card.highlights)) {
          highlights[toCamelCase(key)] = value as string;
        }
        product.highlights = highlights;
      }

      products.push(product);
    }
  }

  // --- LỚP 2: bottom-line-text fallback (if not found inside product cards) ---
  const missingBottomLine = products.some(p => !p.bottomLine);
  if (missingBottomLine) {
    const bottomLineTexts = await layer3_evaluate(page, () => {
      const els = document.querySelectorAll('[data-testid="bottom-line-text"]');
      return Array.from(els).map(el => el.textContent?.trim() || '');
    });
    if (bottomLineTexts && bottomLineTexts.length === products.length) {
      bottomLineTexts.forEach((text, i) => {
        if (text && !products[i].bottomLine) {
          products[i].bottomLine = text;
        }
      });
    }
  }

  // --- LỚP 2: Index counter (rank from data-testid) ---
  const rankCounters = await layer3_evaluate(page, () => {
    const counters = document.querySelectorAll('[data-testid="index-counter"]');
    return Array.from(counters).map(el => el.textContent?.trim() || '');
  });

  if (rankCounters && rankCounters.length === products.length) {
    rankCounters.forEach((rank, i) => {
      products[i].rank = parseInt(rank) || i + 1;
    });
  }

  // --- Map bestFor labels from best-of-products section ---
  const bestOfItems = (category as any)._bestOfItems as { name: string; bestFor: string }[] | undefined;
  if (bestOfItems && bestOfItems.length > 0) {
    for (const product of products) {
      const match = bestOfItems.find(
        item => item.name.toLowerCase().trim() === product.name?.toLowerCase().trim()
      );
      if (match?.bestFor) {
        product.bestFor = match.bestFor;
      }
    }
    delete (category as any)._bestOfItems;
  }

  log(`  → Products found: ${products.length}`);
  products.forEach(p => {
    log(`    ${p.rank}. ${p.name} (${p.slug}) - ${p.basePrice || 'no price'} - bestFor: ${p.bestFor || 'N/A'}`);
  });

  return { category, products };
}
