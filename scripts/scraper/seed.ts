// scripts/scraper/seed.ts
// =====================================================================
// SEED DATABASE từ JSON đã cào
// =====================================================================
//
// Usage:
//   npx tsx scripts/scraper/seed.ts hosting
//   npx tsx scripts/scraper/seed.ts dating
//
// Flow:
//   1. Đọc JSON file từ output/
//   2. Tạo/update Authors
//   3. Tạo/update Category
//   4. Tạo/update Products
// =====================================================================

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import type { ScrapeResult, ScrapedAuthor, ScrapedCategory, ScrapedProduct, ScrapedArticle } from './types';

const prisma = new PrismaClient();

// Category → Group mapping
const CATEGORY_GROUP_MAP: Record<string, string> = {
  'hosting': 'business',
  'website-builders': 'business',
  'crm': 'business',
  'project-management': 'business',
  'voip': 'business',
  'pos': 'business',
  'payroll': 'business',
  'accounting': 'business',
  'legal-services': 'business',
  'dating': 'lifestyle',
  'tv-services': 'lifestyle',
  'meal-delivery': 'lifestyle',
  'mobile-plans': 'lifestyle',
  'language-learning': 'lifestyle',
  'vpn': 'security',
  'background-check': 'security',
  'id-theft': 'security',
  'cyber-security': 'security',
  'online-therapy': 'health-wellness',
  'medical-alerts': 'health-wellness',
  'hearing-aids': 'health-wellness',
  'dna-testing': 'health-wellness',
  'home-security': 'home',
  'home-warranty': 'home',
  'moving': 'home',
  'internet-providers': 'home',
};

const CATEGORY_ICONS: Record<string, string> = {
  'hosting': '🌐',
  'dating': '❤️',
  'vpn': '🔐',
  'tv-services': '📺',
  'home-security': '🏠',
  'online-therapy': '🧠',
  'crm': '📊',
  'website-builders': '🛠️',
  'meal-delivery': '🍽️',
  'background-check': '🔍',
};

async function main() {
  const categorySlug = process.argv[2];

  if (!categorySlug) {
    console.log('Usage: npx tsx scripts/scraper/seed.ts <category-slug>');
    console.log('Example: npx tsx scripts/scraper/seed.ts hosting');
    process.exit(1);
  }

  const inputPath = path.join(process.cwd(), 'scripts', 'scraper', 'output', `${categorySlug}.json`);

  if (!fs.existsSync(inputPath)) {
    console.error(`File not found: ${inputPath}`);
    console.error(`Run the scraper first: npx tsx scripts/scraper/index.ts ${categorySlug}`);
    process.exit(1);
  }

  console.log(`Reading: ${inputPath}`);
  const data: ScrapeResult = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

  try {
    // =========================================================
    // STEP 1: Upsert Authors
    // =========================================================
    console.log('\n═══ STEP 1: Authors ═══');
    const authorIdMap = new Map<string, string>();

    for (const authorData of data.authors) {
      const author = await prisma.author.upsert({
        where: { slug: authorData.slug },
        update: {
          name: authorData.name,
          avatar: authorData.avatar,
          bio: authorData.bio,
          title: authorData.title,
          socialLinks: authorData.socialLinks || undefined,
        },
        create: {
          slug: authorData.slug,
          name: authorData.name,
          avatar: authorData.avatar,
          bio: authorData.bio,
          title: authorData.title,
          socialLinks: authorData.socialLinks || undefined,
        },
      });
      authorIdMap.set(authorData.name, author.id);
      console.log(`  ✓ Author: ${author.name} (${author.id})`);
    }

    // =========================================================
    // STEP 2: Upsert Category
    // =========================================================
    console.log('\n═══ STEP 2: Category ═══');
    const catData = data.category;
    const groupSlug = CATEGORY_GROUP_MAP[categorySlug] || 'business';

    // Find or create group
    let group = await prisma.categoryGroup.findUnique({ where: { slug: groupSlug } });
    if (!group) {
      group = await prisma.categoryGroup.create({
        data: {
          slug: groupSlug,
          name: groupSlug.charAt(0).toUpperCase() + groupSlug.slice(1).replace(/-/g, ' '),
          order: 0,
        },
      });
    }

    // Find author for category (first author found)
    const firstAuthorId = authorIdMap.values().next().value || null;

    const category = await prisma.category.upsert({
      where: { slug: categorySlug },
      update: {
        name: catData.name || categorySlug,
        heroTitle: catData.heroTitle,
        heroImage: catData.heroImage,
        introContent: catData.introContent,
        sidebarPeopleCount: catData.sidebarPeopleCount,
        bestOfListTitle: catData.bestOfListTitle,
        methodologyTitle: catData.methodologyTitle,
        methodologyIntro: catData.methodologyIntro,
        criteriaTitle: catData.criteriaTitle,
        methodologyCriteria: catData.methodologyCriteria || undefined,
        bottomContent: catData.bottomContent,
        faqs: catData.faqs || undefined,
        metaTitle: catData.metaTitle,
        metaDescription: catData.metaDescription,
        ogImage: catData.ogImage,
      },
      create: {
        slug: categorySlug,
        name: catData.name || categorySlug,
        icon: CATEGORY_ICONS[categorySlug] || '📦',
        color: 'bg-blue-100',
        featured: true,
        order: 0,
        groupId: group.id,
        authorId: firstAuthorId,
        exploreHref: `/${categorySlug}`,
        compareHref: `/${categorySlug}/compare`,
        heroTitle: catData.heroTitle,
        heroImage: catData.heroImage,
        introContent: catData.introContent,
        sidebarPeopleCount: catData.sidebarPeopleCount,
        bestOfListTitle: catData.bestOfListTitle || `Our Top 10 Best ${catData.name || categorySlug}:`,
        compareBoxTitle: catData.compareBoxTitle,
        compareBoxDescription: catData.compareBoxDescription,
        compareBoxStats: catData.compareBoxStats,
        methodologyTitle: catData.methodologyTitle,
        methodologyIntro: catData.methodologyIntro,
        criteriaTitle: catData.criteriaTitle,
        methodologyCriteria: catData.methodologyCriteria || undefined,
        bottomContent: catData.bottomContent,
        faqs: catData.faqs || undefined,
        metaTitle: catData.metaTitle,
        metaDescription: catData.metaDescription,
        ogImage: catData.ogImage,
      },
    });
    console.log(`  ✓ Category: ${category.name} (${category.id})`);

    // =========================================================
    // STEP 3: Upsert Products
    // =========================================================
    console.log('\n═══ STEP 3: Products ═══');

    for (const prodData of data.products) {
      // Find author for this product
      const productAuthorId = prodData.authorName
        ? authorIdMap.get(prodData.authorName) || firstAuthorId
        : firstAuthorId;

      const product = await prisma.product.upsert({
        where: { slug: prodData.slug },
        update: {
          name: prodData.name,
          logoUrl: prodData.logoUrl,
          ctaUrl: prodData.ctaUrl,
          ctaText: prodData.ctaText || 'Visit Site',
          status: 'published',
          rank: prodData.rank || 0,
          ribbon: prodData.ribbon,
          tagline: prodData.tagline,
          bottomLine: prodData.bottomLine,
          bestFor: prodData.bestFor,
          basePrice: prodData.basePrice,
          overallScore: prodData.overallScore,
          scoreLabel: prodData.scoreLabel,
          scores: prodData.scoresDetailed || prodData.scores || undefined,
          highlights: prodData.highlights || undefined,
          features: prodData.features || undefined,
          reviewTitle: prodData.reviewTitle,
          reviewSubtitle: prodData.reviewSubtitle,
          rating: prodData.rating,
          reviewCount: prodData.reviewCount,
          readTime: prodData.readTime,
          summaryTitle: prodData.summaryTitle,
          heroSummary: prodData.heroSummary,
          videoUrl: prodData.videoUrl,
          pros: prodData.pros || [],
          cons: prodData.cons || [],
          mainContent: prodData.mainContent,
          verdict: prodData.verdict,
          faqs: prodData.faqs || undefined,
          metaTitle: prodData.metaTitle,
          metaDescription: prodData.metaDescription,
          ogImage: prodData.ogImage,
          canonical: prodData.canonical,
          publishedAt: prodData.publishedAt ? new Date(prodData.publishedAt) : undefined,
        },
        create: {
          slug: prodData.slug,
          name: prodData.name,
          logoUrl: prodData.logoUrl,
          ctaUrl: prodData.ctaUrl,
          ctaText: prodData.ctaText || 'Visit Site',
          reviewHref: `/${categorySlug}/reviews/${prodData.slug}`,
          status: 'published',
          categoryId: category.id,
          authorId: productAuthorId,
          rank: prodData.rank || 0,
          ribbon: prodData.ribbon,
          tagline: prodData.tagline,
          bottomLine: prodData.bottomLine,
          bestFor: prodData.bestFor,
          basePrice: prodData.basePrice,
          overallScore: prodData.overallScore,
          scoreLabel: prodData.scoreLabel,
          scores: prodData.scoresDetailed || prodData.scores || undefined,
          highlights: prodData.highlights || undefined,
          features: prodData.features || undefined,
          reviewTitle: prodData.reviewTitle,
          reviewSubtitle: prodData.reviewSubtitle,
          rating: prodData.rating,
          reviewCount: prodData.reviewCount,
          readTime: prodData.readTime,
          summaryTitle: prodData.summaryTitle,
          heroSummary: prodData.heroSummary,
          videoUrl: prodData.videoUrl,
          pros: prodData.pros || [],
          cons: prodData.cons || [],
          mainContent: prodData.mainContent,
          verdict: prodData.verdict,
          faqs: prodData.faqs || undefined,
          metaTitle: prodData.metaTitle,
          metaDescription: prodData.metaDescription,
          ogImage: prodData.ogImage,
          canonical: prodData.canonical,
          publishedAt: prodData.publishedAt ? new Date(prodData.publishedAt) : undefined,
        },
      });

      console.log(`  ✓ ${prodData.rank}. ${product.name} (${product.id}) - score: ${product.overallScore || 'N/A'}`);
    }

    // =========================================================
    // STEP 4: Upsert Articles (if any)
    // =========================================================
    let articlesSeeded = 0;
    if (data.articles && data.articles.length > 0) {
      console.log('\n═══ STEP 4: Articles ═══');

      for (const articleData of data.articles) {
        // Find author for this article
        const articleAuthorId = articleData.authorName
          ? authorIdMap.get(articleData.authorName) || firstAuthorId
          : firstAuthorId;

        const article = await prisma.article.upsert({
          where: { slug: articleData.slug },
          update: {
            title: articleData.title,
            subtitle: articleData.subtitle,
            articleType: 'guide',  // Ensure correct type on update
            featuredImage: articleData.heroImage,
            content: articleData.mainContent,
            excerpt: articleData.summary,
            metaTitle: articleData.metaTitle,
            metaDescription: articleData.metaDescription,
            ogImage: articleData.ogImage,
            canonical: articleData.canonical,
            publishedAt: articleData.publishedAt ? new Date(articleData.publishedAt) : undefined,
            status: 'published',
          },
          create: {
            slug: articleData.slug,
            title: articleData.title,
            subtitle: articleData.subtitle,
            articleType: 'guide',  // 'guide' | 'blog' - NOT 'charticle' (charticle is for product reviews)
            status: 'published',
            categoryId: category.id,
            authorId: articleAuthorId,
            featuredImage: articleData.heroImage,
            content: articleData.mainContent,
            excerpt: articleData.summary,
            metaTitle: articleData.metaTitle,
            metaDescription: articleData.metaDescription,
            ogImage: articleData.ogImage,
            canonical: articleData.canonical,
            publishedAt: articleData.publishedAt ? new Date(articleData.publishedAt) : new Date(),
          },
        });

        articlesSeeded++;
        console.log(`  ✓ ${articlesSeeded}. ${article.title.slice(0, 50)}... (${article.id})`);
      }
    }

    // =========================================================
    // STEP 5: Seed Comparison data (if any)
    // =========================================================
    if (data.comparison && data.comparison.products.length > 0) {
      console.log('\n═══ STEP 5: Comparison ═══');
      const comp = data.comparison;

      // Match comparison products to DB products by slug to get IDs
      const dbProducts = await prisma.product.findMany({
        where: { categoryId: category.id },
        select: { id: true, slug: true, name: true },
      });

      // Update each product with comparison-specific data (score, scoreLabel, bottomLine, ribbon, features, ctaUrl, ctaText)
      for (const cp of comp.products) {
        const dbProd = dbProducts.find(p => p.slug === cp.slug);
        if (!dbProd) {
          console.log(`  ⚠ No DB match for comparison product: ${cp.name} (${cp.slug})`);
          continue;
        }

        await prisma.product.update({
          where: { id: dbProd.id },
          data: {
            overallScore: cp.overallScore ?? undefined,
            scoreLabel: cp.scoreLabel ?? undefined,
            bottomLine: cp.bottomLine ?? undefined,
            ribbon: cp.ribbon ?? undefined,
            ctaUrl: cp.ctaUrl ?? undefined,
            ctaText: cp.ctaText || 'Visit Site',
            reviewCount: cp.reviewCount ?? undefined,
            // Save comparison-specific features separately from review features
            comparisonFeatures: cp.features && cp.features.length > 0 ? cp.features : undefined,
          },
        });
        console.log(`  ✓ Updated product: ${dbProd.name} (score: ${cp.overallScore}, compFeatures: ${cp.features?.length || 0})`);
      }

      // Build Top 3 product data for category-level storage
      const top3 = comp.products.slice(0, 3);
      const top3ProductIds: string[] = [];
      const top3ProductData: any[] = [];

      for (const tp of top3) {
        const dbProd = dbProducts.find(p => p.slug === tp.slug);
        if (!dbProd) continue;
        top3ProductIds.push(dbProd.id);
        top3ProductData.push({
          id: dbProd.id,
          overallScore: tp.overallScore || null,
          scoreLabel: tp.scoreLabel || '',
          bottomLine: tp.bottomLine || '',
          ribbon: tp.ribbon || '',
          ctaUrl: tp.ctaUrl || '',
          ctaText: tp.ctaText || 'Visit Site',
          features: tp.features || [],
        });
      }

      // Build comparison product order (the order products appear on comparison page)
      const comparisonProductOrder: string[] = [];
      for (const cp of comp.products) {
        const dbProd = dbProducts.find(p => p.slug === cp.slug);
        if (dbProd) comparisonProductOrder.push(dbProd.id);
      }

      // Update category with comparison fields
      await prisma.category.update({
        where: { id: category.id },
        data: {
          comparisonRedirectEnabled: data.category.redirectToComparison === true,
          comparisonTitle: comp.heroTitle || undefined,
          comparisonSubtitle: comp.heroSubtitle || undefined,
          comparisonProductOrder: comparisonProductOrder,
          comparisonTop3Enabled: top3ProductIds.length >= 3,
          comparisonTop3Title: `Top 3 ${category.name} Services`,
          comparisonTop3ProductIds: top3ProductIds,
          comparisonTop3Ribbon: top3[0]?.ribbon || 'Our Recommendation',
          comparisonTop3ProductData: top3ProductData,
          comparisonLeftSidebarEnabled: true,
          comparisonSocialProofCount: comp.socialProofCount || undefined,
          comparisonScoreBreakdown: comp.scoreBreakdown || undefined,
          comparisonBelowFaqContent: comp.wysiwygContent || undefined,
          ...(comp.faqs && comp.faqs.length > 0 ? { faqs: comp.faqs } : {}),
        },
      });

      console.log(`  ✓ Category comparison fields updated`);
      console.log(`  ✓ Product order: ${comparisonProductOrder.length} products`);
      console.log(`  ✓ Top 3: ${top3ProductIds.length} products`);
      console.log(`  ✓ FAQs: ${comp.faqs?.length || 0}`);
    }

    // =========================================================
    // SUMMARY
    // =========================================================
    console.log('\n═══ SEED COMPLETE ═══');
    console.log(`Category: ${category.name}`);
    console.log(`Authors:  ${data.authors.length}`);
    console.log(`Products: ${data.products.length}`);
    console.log(`Comparison: ${data.comparison ? data.comparison.products.length + ' products' : 'none'}`);
    console.log(`Articles: ${articlesSeeded}`);
    console.log('Done!');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
