import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.homepageSettings.findFirst();

  console.log('=== HomepageSettings Status ===\n');
  console.log('heroTitle:', settings?.heroTitle || '(empty)');
  console.log('heroSubtitle:', settings?.heroSubtitle || '(empty)');
  console.log('brandLogos:', settings?.brandLogos ? '✅ HAS DATA' : '❌ (empty)');
  console.log('trendingItems:', settings?.trendingItems ? '✅ HAS DATA' : '❌ (empty)');
  console.log('statsListsCount:', settings?.statsListsCount || '(empty)');
  console.log('statsHoursCount:', settings?.statsHoursCount || '(empty)');
  console.log('statsDecisionsCount:', settings?.statsDecisionsCount || '(empty)');
  console.log('expertIds:', settings?.expertIds?.length ? `✅ ${settings.expertIds.length} experts` : '❌ (empty)');
  console.log('moreArticleIds:', settings?.moreArticleIds?.length ? `✅ ${settings.moreArticleIds.length} articles` : '❌ (empty)');
  console.log('exploreCategories:', settings?.exploreCategories ? '✅ HAS DATA' : '❌ (empty)');
  console.log('missionTitle:', settings?.missionTitle || '(empty)');
  console.log('methodTitle:', settings?.methodTitle || '(empty)');

  const groups = await prisma.categoryGroup.count();
  console.log('\n=== CategoryGroups ===');
  console.log('Count:', groups > 0 ? `✅ ${groups} groups` : '❌ 0 groups');

  const authors = await prisma.author.count();
  console.log('\n=== Authors ===');
  console.log('Count:', authors > 0 ? `✅ ${authors} authors` : '❌ 0 authors');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
