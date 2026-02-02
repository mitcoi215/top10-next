// scripts/scraper/scrape-comparison.ts
// =====================================================================
// CÀO TRANG COMPARISON (e.g. /hosting/comparison)
// Áp dụng Công Thức Vàng 8 Lớp
// =====================================================================

import { Page } from 'playwright';
import type { ScrapedComparison, ScrapedComparisonProduct, ScrapedMiniReview } from './types';
import {
  layer2_byTestId,
  layer3_evaluate,
} from './layers';
import { log } from './utils';

/**
 * Cào toàn bộ data từ trang comparison
 * URL pattern: https://www.10rating/{category}/comparison
 */
export async function scrapeComparisonPage(
  page: Page,
  url: string,
): Promise<ScrapedComparison> {
  log(`[Comparison] Navigating to: ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  const comparison: ScrapedComparison = {
    products: [],
  };

  // ===========================================================
  // HERO SECTION
  // ===========================================================
  log('[Comparison] Cào Hero data...');

  comparison.lastUpdated = await layer2_byTestId(page, 'last-updated') || undefined;

  const heroData = await layer3_evaluate(page, () => {
    const h1 = document.querySelector('h1');
    const subtitle = document.querySelector('[class*="subtitle"], [class*="hero"] p');
    return {
      title: h1?.textContent?.trim() || null,
      subtitle: subtitle?.textContent?.trim() || null,
    };
  });

  if (heroData) {
    comparison.heroTitle = heroData.title || undefined;
    comparison.heroSubtitle = heroData.subtitle || undefined;
  }

  log(`  → Hero: ${comparison.heroTitle}`);

  // ===========================================================
  // PRODUCT CARDS (Nissim product cards)
  // ===========================================================
  log('[Comparison] Cào Product cards...');

  const productCards = await layer3_evaluate(page, () => {
    const cards: any[] = [];
    const containers = document.querySelectorAll('[data-testid="nissim-product-card-container"]');

    containers.forEach((card, index) => {
      const data: any = {};

      // data-product-id from card container
      data.productId = card.getAttribute('data-product-id') || '';

      // Position/Rank
      const posEl = card.querySelector('[data-testid="position"]');
      data.position = posEl ? parseInt(posEl.textContent?.trim() || '') || (index + 1) : (index + 1);

      // Product name - from the card's name element
      const nameEl = card.querySelector('[class*="e6kphim23"]') ||
                     card.querySelector('h2') ||
                     card.querySelector('[data-testid="product-name"]');
      data.name = nameEl?.textContent?.trim() || '';

      // Logo
      const logoEl = card.querySelector('[data-testid="nissim-logo-light"]') ||
                     card.querySelector('img[class*="logo"]');
      data.logoUrl = logoEl?.getAttribute('src') || '';

      // Overall score
      const scoreEl = card.querySelector('[data-testid="avg-score"]');
      data.overallScore = scoreEl ? parseFloat(scoreEl.textContent?.trim() || '') || null : null;

      // Score label (Exceptional, Excellent, etc.) - text nodes only (exclude SVG arrow)
      const labelEl = card.querySelector('[data-testid="top-label"]');
      if (labelEl) {
        let labelText = '';
        labelEl.childNodes.forEach(node => {
          if (node.nodeType === 3) labelText += node.textContent;
        });
        data.scoreLabel = labelText.trim();
      }

      // Bottom line
      const blEl = card.querySelector('[data-testid="nissim-bottom-line"]');
      data.bottomLine = blEl ? blEl.textContent?.replace(/\s+/g, ' ').trim() : '';

      // Ribbon text (e.g. "Our Most Popular")
      const ribbonEl = card.querySelector('[data-testid="addon-text"]');
      if (ribbonEl) {
        let ribbonText = '';
        ribbonEl.childNodes.forEach(node => {
          if (node.nodeType === 3) ribbonText += node.textContent;
        });
        data.ribbon = ribbonText.trim();
      }

      // Features / bullet points
      const features: string[] = [];
      card.querySelectorAll('[data-testid="product-attribute"]').forEach(li => {
        const divText = li.querySelector('div')?.textContent?.replace(/\s+/g, ' ').trim();
        if (divText) features.push(divText);
      });
      data.features = features;

      // CTA (primary) - get href + text + data-product-name
      const ctaEl = card.querySelector('[data-testid="popover-trigger"]') as HTMLAnchorElement | null;
      if (ctaEl) {
        data.ctaUrl = ctaEl.getAttribute('href') || '';
        data.ctaText = ctaEl.querySelector('span')?.textContent?.trim() || 'Visit Site';
        // data-product-name on CTA link is the slug
        const ctaProductName = ctaEl.getAttribute('data-product-name') || '';
        if (ctaProductName) data.productName = ctaProductName;
      } else {
        // Fallback: first link with data-product-id
        const fallbackCta = card.querySelector('a[data-product-id]') as HTMLAnchorElement | null;
        data.ctaUrl = fallbackCta?.getAttribute('href') || '';
        data.ctaText = fallbackCta?.querySelector('span')?.textContent?.trim() || 'Visit Site';
        const fbName = fallbackCta?.getAttribute('data-product-name') || '';
        if (fbName) data.productName = fbName;
      }

      // Secondary CTA
      const secCtaEl = card.querySelector('[data-testid="nissim-secondary-cta"]') as HTMLAnchorElement | null;
      data.secondaryCtaUrl = secCtaEl?.getAttribute('href') || '';
      data.secondaryCtaText = secCtaEl?.querySelector('span')?.textContent?.trim() || '';

      // Review count + slug from review link
      const reviewEl = card.querySelector('a[href*="reviews"]') as HTMLAnchorElement | null;
      const reviewText = reviewEl?.textContent?.trim() || '';
      data.reviewCount = reviewText.replace(/[^0-9,]/g, '').trim();

      // Slug: from review link > data-product-name > derived from name
      const reviewHref = reviewEl?.getAttribute('href') || '';
      const slugMatch = reviewHref.match(/\/reviews\/([^#?/]+)/);
      if (slugMatch) {
        data.slug = slugMatch[1];
      } else if (data.productName) {
        data.slug = data.productName;
      } else {
        data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      }

      cards.push(data);
    });

    return cards;
  });

  if (productCards) {
    for (const card of productCards) {
      const product: ScrapedComparisonProduct = {
        position: card.position,
        name: card.name,
        slug: card.slug,
        productId: card.productId || undefined,
        logoUrl: card.logoUrl || undefined,
        overallScore: card.overallScore || undefined,
        scoreLabel: card.scoreLabel || undefined,
        bottomLine: card.bottomLine || undefined,
        ribbon: card.ribbon || undefined,
        features: card.features || [],
        ctaUrl: card.ctaUrl || undefined,
        ctaText: card.ctaText || 'Visit Site',
        secondaryCtaUrl: card.secondaryCtaUrl || undefined,
        secondaryCtaText: card.secondaryCtaText || undefined,
        reviewCount: card.reviewCount || undefined,
      };
      comparison.products.push(product);
    }
  }

  log(`  → Products found: ${comparison.products.length}`);
  comparison.products.forEach(p => {
    log(`    #${p.position} ${p.name} (${p.slug}) [pid:${p.productId}] - Score: ${p.overallScore} (${p.scoreLabel}) - Features: ${p.features.length} - Ribbon: ${p.ribbon || '-'}`);
  });

  // ===========================================================
  // WYSIWYG CONTENT (below chart)
  // ===========================================================
  log('[Comparison] Cào Wysiwyg content...');

  comparison.wysiwygContent = await layer3_evaluate(page, () => {
    const container = document.querySelector('[data-role="chart-wysiwyg-container"]');
    if (!container) return null;
    // Get the section[data-role="wysiwyg"] inside
    const wysiwyg = container.querySelector('section[data-role="wysiwyg"]');
    if (wysiwyg) return wysiwyg.innerHTML;
    // Fallback: get full container HTML
    return container.innerHTML;
  }) || undefined;

  log(`  → Wysiwyg: ${comparison.wysiwygContent ? comparison.wysiwygContent.length + ' chars' : 'N/A'}`);

  // ===========================================================
  // MINI REVIEWS ("Our Top 3 Picks" section below wysiwyg)
  // ===========================================================
  log('[Comparison] Cào Mini Reviews (Our Top 3 Picks)...');

  const miniReviewsData = await layer3_evaluate(page, () => {
    const reviews: any[] = [];

    // Find mini-review items inside the mini-reviews section
    const items = document.querySelectorAll('section[class*="mini-reviews"] li[class*="mini-reviews__item"], .mini-reviews__item');

    // If not found by class, try the container with data-component="mini-reviews"
    const fallbackItems = items.length > 0 ? items : document.querySelectorAll('[data-component="mini-reviews"] li');

    fallbackItems.forEach((item, idx) => {
      const data: any = {};
      data.position = idx + 1;

      // Index counter
      const indexEl = item.querySelector('[data-testid="index-counter"]');
      if (indexEl) {
        data.position = parseInt(indexEl.textContent?.trim() || '') || (idx + 1);
      }

      // Logo
      const logoEl = item.querySelector('[data-testid="hybrid-logo-light"]') ||
                     item.querySelector('[data-role="mini-review-product-logo"]');
      data.logoUrl = logoEl?.getAttribute('src') || '';
      data.name = logoEl?.getAttribute('alt') || '';

      // Score value
      const scoreEl = item.querySelector('[data-role="score-value"]');
      data.overallScore = scoreEl ? parseFloat(scoreEl.textContent?.trim() || '') || null : null;

      // Score label (Exceptional, Excellent, etc.)
      const labelEl = item.querySelector('[data-role="score-wording"] span');
      data.scoreLabel = labelEl?.textContent?.trim() || '';

      // Highlight (short text above CTA)
      const highlightEl = item.querySelector('.mini-reviews__product-highlight, [class*="product-highlight"]');
      data.highlight = highlightEl?.textContent?.trim() || '';

      // Bottom line (from mini-reviews-bottom-line)
      const blEl = item.querySelector('[data-testid="mini-reviews-bottom-line"]');
      data.bottomLine = blEl?.textContent?.replace(/\s+/g, ' ').trim() || '';

      // Description paragraph
      const descSection = item.querySelector('[data-testid="mini-reviews-description"], .mini-reviews__product-description');
      const descP = descSection?.querySelector('p');
      data.description = descP?.textContent?.replace(/\s+/g, ' ').trim() || '';

      // Read review link
      const reviewLink = item.querySelector('[data-testid="description-review-link"], [data-role="read-review"]') as HTMLAnchorElement | null;
      data.reviewLink = reviewLink?.getAttribute('href') || '';

      // Slug from review link
      const rlMatch = data.reviewLink?.match(/\/reviews\/([^#?/]+)/);
      if (rlMatch) {
        data.slug = rlMatch[1];
      } else {
        data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      }

      // Product ID from CTA
      const ctaEl = item.querySelector('[data-testid="product-cta"], [data-testid="popover-trigger"]');
      data.productId = ctaEl?.getAttribute('data-product-id') || '';
      data.ctaUrl = ctaEl?.getAttribute('href') || '';
      data.ctaText = ctaEl?.querySelector('span')?.textContent?.trim() || 'Visit Site';

      // Pros & Cons
      const pros: string[] = [];
      const cons: string[] = [];
      item.querySelectorAll('[data-testid="pros-and-cons-pros"] [data-role="bullet"]').forEach(b => {
        const t = b.querySelector('div')?.textContent?.trim();
        if (t) pros.push(t);
      });
      item.querySelectorAll('[data-testid="pros-and-cons-cons"] [data-role="bullet"]').forEach(b => {
        const t = b.querySelector('div')?.textContent?.trim();
        if (t) cons.push(t);
      });
      data.pros = pros;
      data.cons = cons;

      reviews.push(data);
    });

    return reviews.length > 0 ? reviews : null;
  });

  if (miniReviewsData) {
    comparison.miniReviews = miniReviewsData.map((r: any): ScrapedMiniReview => ({
      position: r.position,
      name: r.name,
      slug: r.slug,
      productId: r.productId || undefined,
      logoUrl: r.logoUrl || undefined,
      overallScore: r.overallScore || undefined,
      scoreLabel: r.scoreLabel || undefined,
      highlight: r.highlight || undefined,
      bottomLine: r.bottomLine || undefined,
      description: r.description || undefined,
      reviewLink: r.reviewLink || undefined,
      pros: r.pros?.length > 0 ? r.pros : undefined,
      cons: r.cons?.length > 0 ? r.cons : undefined,
      ctaUrl: r.ctaUrl || undefined,
      ctaText: r.ctaText || 'Visit Site',
    }));
  }

  log(`  → Mini Reviews: ${comparison.miniReviews?.length || 0}`);
  comparison.miniReviews?.forEach(r => {
    log(`    #${r.position} ${r.name} (${r.slug}) - Score: ${r.overallScore} - Pros: ${r.pros?.length || 0} Cons: ${r.cons?.length || 0}`);
  });

  // ===========================================================
  // SIDEBAR DATA
  // ===========================================================
  log('[Comparison] Cào Sidebar data...');

  comparison.socialProofCount = await layer3_evaluate(page, () => {
    const els = document.querySelectorAll('[class*="people"], [class*="shopper"], [class*="social-proof"]');
    for (const el of els) {
      const match = el.textContent?.match(/([\d,]+)\s*(people|shoppers|users|visitors)/i);
      if (match) return match[1];
    }
    const proofEl = document.querySelector('[data-testid="social-proof-count"]');
    return proofEl?.textContent?.trim() || null;
  }) || undefined;

  comparison.scoreBreakdown = await layer3_evaluate(page, () => {
    const items: { name: string; score: number; description?: string }[] = [];
    const scoreItems = document.querySelectorAll('[class*="score-breakdown"] [class*="item"], [class*="score-disclaimer"] [class*="item"]');
    scoreItems.forEach(item => {
      const nameEl = item.querySelector('[class*="name"], [class*="label"], [class*="title"]');
      const scoreEl = item.querySelector('[class*="score"], [class*="value"], [class*="number"]');
      const descEl = item.querySelector('[class*="desc"], [class*="description"]');
      const name = nameEl?.textContent?.trim();
      const score = scoreEl ? parseFloat(scoreEl.textContent?.trim() || '') : NaN;
      if (name && !isNaN(score)) {
        items.push({ name, score, description: descEl?.textContent?.trim() || undefined });
      }
    });
    return items.length > 0 ? items : null;
  }) || undefined;

  log(`  → Social proof: ${comparison.socialProofCount || 'N/A'}`);
  log(`  → Score breakdown: ${comparison.scoreBreakdown?.length || 0} items`);

  // ===========================================================
  // FAQ SECTION
  // ===========================================================
  log('[Comparison] Cào FAQ data...');

  comparison.faqs = await layer3_evaluate(page, () => {
    const faqs: { question: string; answer: string }[] = [];

    // Strategy A: data-testid faq items
    const faqItems = document.querySelectorAll('[data-testid="faq-item"], .faq-item');
    faqItems.forEach(item => {
      const q = item.querySelector('[data-testid="faq-question"], button, h3, h4')?.textContent?.trim();
      const a = item.querySelector('[data-testid="faq-answer"], [class*="answer"], p')?.textContent?.trim();
      if (q && a) faqs.push({ question: q, answer: a });
    });

    // Strategy B: schema.org FAQPage
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

  log(`  → FAQs: ${comparison.faqs?.length || 0}`);

  // ===========================================================
  // SUMMARY
  // ===========================================================
  log('');
  log(`[Comparison] Done! ${comparison.products.length} products, ${comparison.miniReviews?.length || 0} mini-reviews, wysiwyg: ${comparison.wysiwygContent ? 'YES' : 'NO'}`);

  return comparison;
}
