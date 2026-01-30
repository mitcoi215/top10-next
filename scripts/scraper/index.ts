// scripts/scraper/index.ts
// =====================================================================
// MAIN ORCHESTRATOR - Cào data Top10.com theo Công Thức Vàng 8 Lớp
// =====================================================================
//
// Usage:
//   npx tsx scripts/scraper/index.ts hosting
//   npx tsx scripts/scraper/index.ts dating
//   npx tsx scripts/scraper/index.ts vpn
//
// Flow:
//   1. Cào listing page → Category data + Product cards (rank, name, highlights...)
//   2. Cào review page cho TỪNG product → Review data (scores, mainContent, verdict...)
//   3. Merge listing + review data
//   4. Output JSON file
// =====================================================================

import { chromium, Browser, Page } from 'playwright';
import { scrapeListingPage } from './scrape-listing';
import { scrapeReviewPage } from './scrape-review';
import type { ScrapedProduct, ScrapedAuthor, ScrapeResult } from './types';
import { log, sleep, retry } from './utils';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://www.top10.com';

async function main() {
  const categorySlug = process.argv[2];

  if (!categorySlug) {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║  Top10.com Scraper - Công Thức Vàng 8 Lớp                   ║');
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log('║  Usage:                                                      ║');
    console.log('║    npx tsx scripts/scraper/index.ts <category-slug>          ║');
    console.log('║                                                              ║');
    console.log('║  Examples:                                                   ║');
    console.log('║    npx tsx scripts/scraper/index.ts hosting                  ║');
    console.log('║    npx tsx scripts/scraper/index.ts dating                   ║');
    console.log('║    npx tsx scripts/scraper/index.ts vpn                      ║');
    console.log('║    npx tsx scripts/scraper/index.ts home-security            ║');
    console.log('║                                                              ║');
    console.log('║  Options:                                                    ║');
    console.log('║    --no-reviews    Skip review pages (listing only)          ║');
    console.log('║    --limit=N       Limit number of products to scrape        ║');
    console.log('║    --headless=no   Show browser window                       ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');
    process.exit(1);
  }

  // Parse options
  const skipReviews = process.argv.includes('--no-reviews');
  const limitArg = process.argv.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : Infinity;
  const headless = !process.argv.includes('--headless=no');

  log(`════════════════════════════════════════════════════════════`);
  log(`Starting scraper for category: ${categorySlug}`);
  log(`Options: skipReviews=${skipReviews}, limit=${limit === Infinity ? 'all' : limit}, headless=${headless}`);
  log(`════════════════════════════════════════════════════════════`);

  let browser: Browser | null = null;

  try {
    // Launch browser
    log('Launching browser...');
    browser = await chromium.launch({
      headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1440, height: 900 },
    });

    const page = await context.newPage();

    // =========================================================
    // STEP 1: Cào trang Category Listing
    // =========================================================
    log('');
    log('═══ STEP 1: Cào trang Category Listing ═══');
    const listingUrl = `${BASE_URL}/${categorySlug}`;
    const { category, products: listingProducts } = await retry(
      () => scrapeListingPage(page, listingUrl),
    );

    log(`→ Category: ${category.name} (${category.slug})`);
    log(`→ Products found: ${listingProducts.length}`);

    // =========================================================
    // STEP 2: Cào trang Review cho TỪNG product
    // =========================================================
    const allProducts: Partial<ScrapedProduct>[] = [];
    const allAuthors: Map<string, ScrapedAuthor> = new Map();

    const productsToScrape = listingProducts.slice(0, limit);

    if (!skipReviews) {
      log('');
      log('═══ STEP 2: Cào trang Review cho từng product ═══');

      for (let i = 0; i < productsToScrape.length; i++) {
        const listingProduct = productsToScrape[i];
        const reviewUrl = `${BASE_URL}/${categorySlug}/reviews/${listingProduct.slug}`;

        log('');
        log(`─── Product ${i + 1}/${productsToScrape.length}: ${listingProduct.name} ───`);

        try {
          const { product: reviewProduct, author } = await retry(
            () => scrapeReviewPage(page, reviewUrl),
          );

          // Merge listing data + review data
          // Listing data is base, review data overrides
          const merged: Partial<ScrapedProduct> = {
            ...listingProduct,
            ...reviewProduct,
            // Keep listing data for fields that review might not have
            rank: listingProduct.rank,
            ribbon: listingProduct.ribbon || reviewProduct.ribbon,
            bottomLine: listingProduct.bottomLine || reviewProduct.bottomLine,
            features: listingProduct.features || reviewProduct.features,
            // Merge highlights (listing has more, review might have different ones)
            highlights: {
              ...(listingProduct.highlights || {}),
              ...(reviewProduct.highlights || {}),
            },
            // Prefer review data for pros/cons (usually more complete from JSON-LD)
            pros: (reviewProduct.pros?.length || 0) > 0 ? reviewProduct.pros : listingProduct.pros,
            cons: (reviewProduct.cons?.length || 0) > 0 ? reviewProduct.cons : listingProduct.cons,
          };

          allProducts.push(merged);

          // Collect author
          if (author) {
            allAuthors.set(author.slug, author);
          }

          log(`✓ Merged: ${merged.name} (score: ${merged.overallScore}, pros: ${merged.pros?.length}, mainContent: ${merged.mainContent ? 'yes' : 'no'})`);
        } catch (err) {
          log(`✗ Failed to scrape review for ${listingProduct.name}: ${(err as Error).message}`);
          // Still add listing data
          allProducts.push(listingProduct);
        }

        // Delay between requests to be polite
        if (i < productsToScrape.length - 1) {
          const delay = 2000 + Math.random() * 3000;
          log(`  Waiting ${Math.round(delay / 1000)}s...`);
          await sleep(delay);
        }
      }
    } else {
      // No reviews, just use listing data
      allProducts.push(...productsToScrape);
    }

    // =========================================================
    // STEP 3: Output result
    // =========================================================
    log('');
    log('═══ STEP 3: Saving result ═══');

    const result: ScrapeResult = {
      category: category as any,
      products: allProducts as any,
      authors: Array.from(allAuthors.values()),
    };

    // Save to JSON file
    const outputDir = path.join(process.cwd(), 'scripts', 'scraper', 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, `${categorySlug}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
    log(`→ Saved to: ${outputPath}`);

    // Summary
    log('');
    log('═══ SUMMARY ═══');
    log(`Category: ${category.name} (${category.slug})`);
    log(`Products: ${allProducts.length}`);
    log(`Authors:  ${allAuthors.size}`);
    log('');
    log('Products:');
    allProducts.forEach((p, i) => {
      log(`  ${p.rank || i + 1}. ${p.name} (${p.slug})`);
      log(`     Score: ${p.overallScore || 'N/A'} | Price: ${p.basePrice || 'N/A'}`);
      log(`     Pros: ${p.pros?.length || 0} | Cons: ${p.cons?.length || 0}`);
      log(`     Review: ${p.mainContent ? 'YES' : 'NO'} | Verdict: ${p.verdict ? 'YES' : 'NO'}`);
    });

    log('');
    log(`Output: ${outputPath}`);
    log('Done!');
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

main();
