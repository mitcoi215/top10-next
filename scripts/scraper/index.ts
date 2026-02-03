// scripts/scraper/index.ts
// =====================================================================
// MAIN ORCHESTRATOR - Cào data 10rating theo Công Thức Vàng 8 Lớp
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
import { scrapeComparisonPage } from './scrape-comparison';
import { scrapeArticleListPage } from './scrape-article-list';
import { scrapeArticlePage } from './scrape-article';
import type { ScrapedProduct, ScrapedAuthor, ScrapedArticle, ScrapeResult } from './types';
import { log, sleep, retry } from './utils';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://www.top10.com';

async function main() {
  const categorySlug = process.argv[2];

  if (!categorySlug) {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║  10rating Scraper - Công Thức Vàng 8 Lớp                   ║');
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
    console.log('║    --comparison    Also scrape comparison page               ║');
    console.log('║    --articles      Also scrape articles from top-reads       ║');
    console.log('║    --articles-limit=N  Limit articles to scrape (default 10) ║');
    console.log('║    --limit=N       Limit number of products to scrape        ║');
    console.log('║    --headless=no   Show browser window                       ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');
    process.exit(1);
  }

  // Parse options
  const skipReviews = process.argv.includes('--no-reviews');
  const scrapeComparison = process.argv.includes('--comparison');
  const scrapeArticles = process.argv.includes('--articles');
  const limitArg = process.argv.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : Infinity;
  const articlesLimitArg = process.argv.find(a => a.startsWith('--articles-limit='));
  const articlesLimit = articlesLimitArg ? parseInt(articlesLimitArg.split('=')[1]) : 10;
  const headless = !process.argv.includes('--headless=no');

  log(`════════════════════════════════════════════════════════════`);
  log(`Starting scraper for category: ${categorySlug}`);
  log(`Options: skipReviews=${skipReviews}, limit=${limit === Infinity ? 'all' : limit}, headless=${headless}`);
  log(`         comparison=${scrapeComparison}, articles=${scrapeArticles}, articlesLimit=${articlesLimit}`);
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

    // Detect redirect: some categories redirect listing → comparison
    let redirectedToComparison = false;
    log(`[Listing] Navigating to: ${listingUrl}`);
    await page.goto(listingUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    const currentUrl = page.url();
    if (currentUrl.includes('/comparison')) {
      redirectedToComparison = true;
      log(`⚠ REDIRECT DETECTED: ${listingUrl} → ${currentUrl}`);
      log(`  → Auto-enabling comparison scrape, marking comparisonRedirectEnabled`);
    }

    let category: Partial<import('./types').ScrapedCategory>;
    let listingProducts: Partial<ScrapedProduct>[];

    if (redirectedToComparison) {
      // Can't scrape listing page - create minimal category
      category = {
        slug: categorySlug,
        name: categorySlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        redirectToComparison: true,
      };
      log(`→ Category: ${category.name} (listing redirected)`);

      // Navigate to /reviews page to get product list
      const reviewsListUrl = `${BASE_URL}/${categorySlug}/reviews`;
      log(`→ Fallback: navigating to ${reviewsListUrl} to get product list...`);
      await page.goto(reviewsListUrl, { waitUntil: 'load', timeout: 30000 });
      // Wait for product cards to render (JS needs time)
      await page.waitForSelector('[data-role="chart-product-card"], a[data-role="read-review"]', { timeout: 5000 }).catch(() => {});

      const reviewsPageUrl = page.url();
      if (reviewsPageUrl.includes('/reviews')) {
        // Scrape listing-style data from /reviews page (same structure as listing)
        const result = await scrapeListingPage(page, reviewsListUrl, true);
        listingProducts = result.products;
        // Merge any extra category data from reviews page
        if (result.category.name && result.category.name !== categorySlug) {
          category.name = result.category.name;
        }
        if (result.category.heroImage) category.heroImage = result.category.heroImage;
        if (result.category.heroTitle) category.heroTitle = result.category.heroTitle;
        if (result.category.introContent) category.introContent = result.category.introContent;
        log(`→ Products from /reviews page: ${listingProducts.length}`);
      } else {
        listingProducts = [];
        log(`→ /reviews page also redirected, no products found`);
      }
    } else {
      // Normal listing scrape (page already loaded)
      const result = await scrapeListingPage(page, listingUrl, true);
      category = result.category;
      listingProducts = result.products;
      log(`→ Category: ${category.name} (${category.slug})`);
      log(`→ Products found: ${listingProducts.length}`);
    }

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
            // Prefer listing's bottomLine (short text from data-testid="bottom-line-text" on listing page)
            bottomLine: listingProduct.bottomLine || reviewProduct.bottomLine,
            // Prefer listing's heroSummary (rich HTML from listing page)
            heroSummary: listingProduct.heroSummary || reviewProduct.heroSummary,
            features: listingProduct.features || reviewProduct.features,
            // Prefer review's highlights (correct set for review page display)
            // Only fall back to listing highlights if review has none
            highlights: Object.keys(reviewProduct.highlights || {}).length > 0
              ? reviewProduct.highlights
              : (listingProduct.highlights || {}),
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
    // STEP 3: Cào Articles (nếu có --articles flag)
    // =========================================================
    const allArticles: Partial<ScrapedArticle>[] = [];

    if (scrapeArticles) {
      log('');
      log('═══ STEP 3: Cào Articles từ top-reads ═══');

      // Cào danh sách articles từ trang top-reads
      const topReadsUrl = `${BASE_URL}/${categorySlug}/top-reads`;
      const articleList = await retry(
        () => scrapeArticleListPage(page, topReadsUrl, articlesLimit),
      );

      log(`→ Articles found: ${articleList.length}`);

      // Cào từng article
      for (let i = 0; i < articleList.length; i++) {
        const articleItem = articleList[i];

        log('');
        log(`─── Article ${i + 1}/${articleList.length}: ${articleItem.title.slice(0, 50)}... ───`);

        try {
          const articleUrl = articleItem.href.startsWith('http')
            ? articleItem.href
            : `${BASE_URL}${articleItem.href}`;

          const { article, author } = await retry(
            () => scrapeArticlePage(page, articleUrl),
          );

          // Merge data từ list + detail
          const merged: Partial<ScrapedArticle> = {
            ...article,
            // Keep list data for fields that detail might not have
            summary: article.summary || articleItem.summary,
            heroImage: article.heroImage || articleItem.imageUrl,
            publishedDate: article.publishedDate || articleItem.date,
          };

          allArticles.push(merged);

          // Collect author
          if (author) {
            allAuthors.set(author.slug, author);
          }

          log(`✓ Scraped: ${merged.title} (${merged.slug})`);
        } catch (err) {
          log(`✗ Failed to scrape article: ${(err as Error).message}`);
          // Still add basic data from list
          allArticles.push({
            slug: articleItem.slug,
            title: articleItem.title,
            summary: articleItem.summary,
            heroImage: articleItem.imageUrl,
            publishedDate: articleItem.date,
            status: 'published',
          });
        }

        // Delay between requests
        if (i < articleList.length - 1) {
          const delay = 2000 + Math.random() * 3000;
          log(`  Waiting ${Math.round(delay / 1000)}s...`);
          await sleep(delay);
        }
      }
    }

    // =========================================================
    // STEP 3b: Cào trang Comparison (nếu có --comparison flag)
    // =========================================================
    let comparisonData: any = undefined;

    if (scrapeComparison || redirectedToComparison) {
      log('');
      log('═══ STEP 3b: Cào trang Comparison ═══');

      const comparisonUrl = `${BASE_URL}/${categorySlug}/comparison`;
      try {
        comparisonData = await retry(
          () => scrapeComparisonPage(page, comparisonUrl),
        );
        log(`→ Comparison products: ${comparisonData.products.length}`);
      } catch (err) {
        log(`✗ Failed to scrape comparison page: ${(err as Error).message}`);
      }
    }

    // =========================================================
    // STEP 4: Output result
    // =========================================================
    log('');
    log('═══ STEP 4: Saving result ═══');

    const result: ScrapeResult = {
      category: category as any,
      products: allProducts as any,
      authors: Array.from(allAuthors.values()),
      articles: scrapeArticles ? allArticles as any : undefined,
      comparison: comparisonData || undefined,
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
    log(`Comparison: ${comparisonData ? comparisonData.products.length + ' products' : 'skipped'}`);
    log(`Articles: ${allArticles.length}`);
    log(`Authors:  ${allAuthors.size}`);
    log('');
    log('Products:');
    allProducts.forEach((p, i) => {
      log(`  ${p.rank || i + 1}. ${p.name} (${p.slug})`);
      log(`     Score: ${p.overallScore || 'N/A'} | Price: ${p.basePrice || 'N/A'}`);
      log(`     Pros: ${p.pros?.length || 0} | Cons: ${p.cons?.length || 0}`);
      log(`     Review: ${p.mainContent ? 'YES' : 'NO'} | Verdict: ${p.verdict ? 'YES' : 'NO'}`);
    });

    if (allArticles.length > 0) {
      log('');
      log('Articles:');
      allArticles.forEach((a, i) => {
        log(`  ${i + 1}. ${a.title} (${a.slug})`);
        log(`     Author: ${a.authorName || 'N/A'} | Content: ${a.mainContent ? 'YES' : 'NO'}`);
      });
    }

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
