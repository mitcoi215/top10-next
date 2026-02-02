/**
 * Scrape comparison page data from saved HTML file
 * Usage: node scripts/scrape-comparison.js
 *
 * Extracts product data from 10rating comparison page HTML
 * and outputs JSON ready for import via API.
 */

const fs = require('fs');
const path = require('path');

// Use cheerio for HTML parsing
let cheerio;
try {
  cheerio = require('cheerio');
} catch {
  console.error('cheerio not installed. Run: npm install cheerio');
  process.exit(1);
}

const HTML_FILE = path.join(__dirname, '..', 'screen_html', 'Top 10 Best Home Security System Providers.html');

function scrape() {
  const html = fs.readFileSync(HTML_FILE, 'utf-8');
  const $ = cheerio.load(html);

  const products = [];

  $('[data-testid="nissim-product-card-container"]').each((idx, el) => {
    const card = $(el);

    // Rank/position
    const position = parseInt(card.find('[data-testid="position"]').first().text().trim()) || (idx + 1);

    // Product name
    const name = card.find('[class*="e6kphim23"]').first().text().trim();

    // Logo URL
    const logoImg = card.find('[data-testid="nissim-logo-light"]').first();
    const logoUrl = logoImg.attr('src') || '';

    // Score
    const scoreText = card.find('[data-testid="avg-score"]').first().text().trim();
    const overallScore = parseFloat(scoreText) || null;

    // Score label (Exceptional, Excellent, etc.)
    const scoreLabel = card.find('[data-testid="top-label"]').first().contents().filter(function () {
      return this.nodeType === 3; // text nodes only
    }).text().trim();

    // Bottom line (clean up whitespace from HTML formatting)
    const bottomLine = card.find('[data-testid="nissim-bottom-line"]').first().text().replace(/\s+/g, ' ').trim();

    // Ribbon text (e.g. "Our Top Pick")
    const ribbonText = card.find('[data-testid="addon-text"]').first().contents().filter(function () {
      return this.nodeType === 3;
    }).text().trim();

    // Features / bullet points
    const features = [];
    card.find('[data-testid="product-attribute"]').each((_, li) => {
      const text = $(li).find('div').first().text().trim();
      if (text) features.push(text);
    });

    // CTA URL (primary)
    const ctaLink = card.find('[data-testid="popover-trigger"]').first();
    const ctaUrl = ctaLink.attr('href') || '';
    const ctaText = ctaLink.find('span').first().text().trim() || 'Visit Site';

    // Secondary CTA
    const secondaryCta = card.find('[data-testid="nissim-secondary-cta"]').first();
    const secondaryCtaUrl = secondaryCta.attr('href') || '';
    const secondaryCtaText = secondaryCta.find('span').first().text().trim() || '';

    // Review count
    const reviewLink = card.find('[class*="e6kphim18"]').first();
    const reviewText = reviewLink.text().trim();
    const reviewCount = parseInt(reviewText.replace(/,/g, '')) || 0;

    // Product description (below card, if any)
    const descEl = card.next('[data-testid="nissim-product-description-container"]');
    const description = descEl.length ? descEl.text().trim() : '';

    // Product slug (from review link or CTA URL)
    const reviewHref = reviewLink.attr('href') || '';
    const slugMatch = reviewHref.match(/\/reviews\/([^#?]+)/);
    const slug = slugMatch ? slugMatch[1] : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    products.push({
      position,
      name,
      slug,
      logoUrl,
      overallScore,
      scoreLabel,
      bottomLine,
      ribbon: ribbonText || null,
      features,
      ctaUrl,
      ctaText,
      secondaryCtaUrl,
      secondaryCtaText,
      reviewCount,
      description: description || null,
    });
  });

  return products;
}

function main() {
  if (!fs.existsSync(HTML_FILE)) {
    console.error(`HTML file not found: ${HTML_FILE}`);
    process.exit(1);
  }

  console.log(`Scraping: ${HTML_FILE}\n`);
  const products = scrape();

  console.log(`Found ${products.length} products:\n`);
  products.forEach((p) => {
    console.log(`  #${p.position} ${p.name}`);
    console.log(`    Score: ${p.overallScore} (${p.scoreLabel})`);
    console.log(`    Bottom Line: ${p.bottomLine}`);
    console.log(`    Ribbon: ${p.ribbon || '-'}`);
    console.log(`    Features: ${p.features.length} items`);
    p.features.forEach((f, i) => console.log(`      ${i + 1}. ${f}`));
    console.log(`    CTA: ${p.ctaText}`);
    console.log(`    Reviews: ${p.reviewCount}`);
    console.log('');
  });

  // Save JSON output
  const outputFile = path.join(__dirname, '..', 'screen_html', 'comparison-data.json');
  fs.writeFileSync(outputFile, JSON.stringify(products, null, 2));
  console.log(`JSON saved to: ${outputFile}`);

  // Also generate API import script
  const importScript = `
/**
 * Import scraped comparison data into the database
 * Usage: Run this in browser console on admin page, or via node with fetch
 *
 * Prerequisites:
 * 1. Products must already exist in the category
 * 2. You need an admin token
 */

const ADMIN_TOKEN = 'YOUR_ADMIN_TOKEN';
const API_BASE = 'http://localhost:3000/api';
const CATEGORY_SLUG = 'home-security';

const scrapedProducts = ${JSON.stringify(products, null, 2)};

async function importData() {
  // 1. Get category to find product IDs
  const catRes = await fetch(\`\${API_BASE}/categories/\${CATEGORY_SLUG}\`);
  const category = await catRes.json();
  console.log('Category:', category.name, '- Products:', category.products.length);

  // 2. Match scraped products to existing products by name/slug
  for (const scraped of scrapedProducts) {
    const existing = category.products.find(p =>
      p.slug === scraped.slug ||
      p.name.toLowerCase() === scraped.name.toLowerCase()
    );

    if (!existing) {
      console.log(\`⚠ No match for: \${scraped.name} (slug: \${scraped.slug})\`);
      continue;
    }

    console.log(\`Updating: \${existing.name} (id: \${existing.id})\`);

    const res = await fetch(\`\${API_BASE}/products/\${existing.id}\`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${ADMIN_TOKEN}\`,
      },
      body: JSON.stringify({
        overallScore: scraped.overallScore,
        scoreLabel: scraped.scoreLabel || null,
        bottomLine: scraped.bottomLine || null,
        ribbon: scraped.ribbon || null,
        ctaUrl: scraped.ctaUrl || null,
        ctaText: scraped.ctaText || 'Visit Site',
        features: scraped.features,
        rank: scraped.position,
      }),
    });

    if (res.ok) {
      console.log(\`  ✓ Updated \${existing.name}\`);
    } else {
      console.log(\`  ✗ Failed \${existing.name}: \${res.status}\`);
    }
  }

  console.log('\\nDone! Refresh the comparison page to see changes.');
}

importData();
`;

  const importFile = path.join(__dirname, '..', 'screen_html', 'import-comparison.js');
  fs.writeFileSync(importFile, importScript.trim());
  console.log(`Import script saved to: ${importFile}`);
}

main();
