// scripts/scraper/bulk-scrape.ts
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const LOG_FILE = path.join(process.cwd(), 'scrape-error.log');
const DELAY_MS = 5000; 
const ARTICLES_LIMIT = 10;

/**
 * TỰ ĐỘNG LẤY DANH SÁCH CATEGORY BẰNG PLAYWRIGHT
 */
async function discoverCategories(): Promise<string[]> {
  console.log('🔍 [Playwright] Đang quét danh sách Category từ Top10.com...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  const categories = new Set<string>();

  try {
    // Điều hướng đến trang chủ
    await page.goto('https://www.top10.com/', { waitUntil: 'networkidle' });

    // Lấy tất cả các href từ thẻ <a>
    const hrefs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a'))
        .map(a => a.getAttribute('href'))
        .filter(href => href && href.startsWith('/') && href.split('/').length === 2);
    });

    const exclusions = [
      'about-us', 'contact-us', 'terms-of-use', 'privacy-policy', 
      'reviews', 'blog', 'search', 'how-we-rate', 'editorial-policy'
    ];

    hrefs.forEach(href => {
      const slug = href?.split('/')[1];
      if (
        slug && 
        !exclusions.includes(slug) && 
        !slug.includes('.') && 
        !slug.includes('?') &&
        slug.length > 2
      ) {
        categories.add(slug);
      }
    });

    const result = Array.from(categories);
    console.log(`✅ Đã tìm thấy ${result.length} danh mục tự động.`);
    return result;

  } catch (error) {
    console.error('❌ Lỗi Playwright khi quét danh sách, dùng danh sách dự phòng.');
    return ['hosting', 'vpn', 'dating', 'meal-delivery', 'home-security', 'website-builders'];
  } finally {
    await browser.close();
  }
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function logError(category: string, error: any) {
  const timestamp = new Date().toISOString();
  const errorMessage = error.stderr ? error.stderr.toString() : error.message;
  fs.appendFileSync(LOG_FILE, `[${timestamp}] CATEGORY: ${category} | ERROR: ${errorMessage}\n`);
}

async function runBulkScrape() {
  const scrapeArticles = process.argv.includes('--articles');
  const noReviews = process.argv.includes('--no-reviews');
  
  // Bước khám phá danh mục bằng Playwright
  const categories = await discoverCategories();

  console.log('════════════════════════════════════════════════════════════');
  console.log(`🚀 BẮT ĐẦU CHẠY BULK SCRAPER (PLAYWRIGHT DISCOVERY)`);
  console.log(`📊 Tổng mục tiêu: ${categories.length} categories`);
  console.log(`⚙️  Options: articles=${scrapeArticles}, no-reviews=${noReviews}`);
  console.log('════════════════════════════════════════════════════════════');

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    console.log(`\n[${i + 1}/${categories.length}] 🏗️  Đang xử lý: ${category.toUpperCase()}`);

    try {
      // 1. GỌI SCRIPT INDEX.TS (CÀO DỮ LIỆU)
      let scrapeCmd = `npx tsx scripts/scraper/index.ts ${category} --articles-limit=${ARTICLES_LIMIT}`;
      if (scrapeArticles) scrapeCmd += ' --articles';
      if (noReviews) scrapeCmd += ' --no-reviews';
      
      console.log(`   📡 Đang cào (index.ts)...`);
      execSync(scrapeCmd, { stdio: 'inherit' });

      // 2. GỌI SCRIPT SEED.TS (LƯU VÀO DATABASE)
      console.log(`   💾 Đang lưu vào DB (seed.ts)...`);
      execSync(`npx tsx scripts/scraper/seed.ts ${category}`, { stdio: 'inherit' });

      console.log(`   ✅ Hoàn thành: ${category}`);

    } catch (error: any) {
      logError(category, error);
      console.log(`   ❌ Thất bại mục ${category}. Đã ghi log lỗi.`);
    }

    if (i < categories.length - 1) {
      console.log(`   😴 Đang nghỉ ${DELAY_MS / 1000}s...`);
      await delay(DELAY_MS);
    }
  }

  console.log('\n🏁 TẤT CẢ CÔNG VIỆC ĐÃ HOÀN TẤT!');
}

runBulkScrape();