// scripts/scraper/scrape-article-list.ts
// =====================================================================
// CÀO TRANG TOP-READS (danh sách articles) - e.g. /home-security/top-reads
// =====================================================================

import { Page } from 'playwright';
import type { ArticleListItem } from './types';
import { layer3_evaluateArg } from './layers';
import { log } from './utils';

/**
 * Cào danh sách articles từ trang top-reads
 * URL pattern: https://www.top10.com/{category}/top-reads
 * @param limit Số lượng articles tối đa cần cào (default: 10)
 */
export async function scrapeArticleListPage(
  page: Page,
  url: string,
  limit: number = 10,
): Promise<ArticleListItem[]> {
  log(`[ArticleList] Navigating to: ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Cào danh sách articles từ trang top-reads
  const articles = await layer3_evaluateArg(page, (maxItems: number) => {
    const items: any[] = [];

    // Tìm tất cả article items
    const articleElements = document.querySelectorAll('a.agg-articles__item');

    articleElements.forEach((el, index) => {
      if (index >= maxItems) return;

      const href = el.getAttribute('href') || '';
      const entityName = el.getAttribute('entityname') || '';

      // Parse slug from href or entityname
      let slug = entityName;
      if (!slug && href) {
        const parts = href.replace(/\/$/, '').split('/');
        slug = parts[parts.length - 1];
      }

      // Title
      const titleEl = el.querySelector('.agg-articles__item__title, h2');
      const title = titleEl?.textContent?.trim() || '';

      // Summary
      const summaryEl = el.querySelector('.agg-articles__item__summary');
      const summary = summaryEl?.textContent?.trim() || '';

      // Date
      const dateEl = el.querySelector('.agg-articles__item__date');
      const date = dateEl?.textContent?.trim() || '';

      // Image
      const imgEl = el.querySelector('.agg-articles__item__image__bg, img');
      const imageUrl = imgEl?.getAttribute('src') || '';

      if (slug && title) {
        items.push({
          slug,
          title,
          summary,
          date,
          imageUrl,
          href,
        });
      }
    });

    return items;
  }, limit);

  log(`  → Articles found: ${articles?.length || 0}`);
  if (articles) {
    articles.forEach((a, i) => {
      log(`    ${i + 1}. ${a.title.slice(0, 50)}... (${a.slug})`);
    });
  }

  return articles || [];
}
