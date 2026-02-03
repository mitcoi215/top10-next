import '@/styles/top10.css';
import { Top10Header, Top10Footer } from '@/components/top10/layout';
import { SetoffBox } from '@/components/top10/category';
import {
  HeroSection,
  BrandLogos,
  TrendingList,
  StatsSection,
  ExpertsSection,
  MissionSection,
  MoreArticles,
  ExploreCategories,
} from '@/components/top10/home';
import { prisma } from '@/lib/prisma';

// Disable caching - always fetch fresh data from DB
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Top 10 Lists of the Best Products and Services | 10rating',
  description:
    '10rating is a comparison platform that brings you useful top 10 lists covering a wide variety of products and services that can help you save time and money',
};

async function getHomepageData() {
  try {
    // Fetch homepage settings
    const settings = await prisma.homepageSettings.findFirst();

    // Fetch category groups with their categories
    const categoryGroups = await prisma.categoryGroup.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        slug: true,
        name: true,
        icon: true,
        categories: {
          where: { showInHero: true },
          orderBy: { order: 'asc' },
          select: {
            id: true,
            slug: true,
            name: true,
            icon: true,
            exploreHref: true,
            compareHref: true,
          },
        },
      },
    });

    // Fetch experts (authors)
    let experts: any[] = [];
    if (settings?.expertIds && settings.expertIds.length > 0) {
      experts = await prisma.author.findMany({
        where: { id: { in: settings.expertIds } },
        select: {
          id: true,
          slug: true,
          name: true,
          avatar: true,
          title: true,
        },
      });
    }

    // Fetch more articles
    let moreArticles: any[] = [];
    if (settings?.moreArticleIds && settings.moreArticleIds.length > 0) {
      moreArticles = await prisma.article.findMany({
        where: { id: { in: settings.moreArticleIds } },
        select: {
          id: true,
          slug: true,
          title: true,
          featuredImage: true,
          category: {
            select: { slug: true },
          },
        },
      });
    }

    return {
      settings,
      categoryGroups,
      experts,
      moreArticles,
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return {
      settings: null,
      categoryGroups: [],
      experts: [],
      moreArticles: [],
    };
  }
}

export default async function HomePage() {
  const { settings, categoryGroups, experts, moreArticles } = await getHomepageData();

  return (
    <div className="top10-page">
      <SetoffBox />
      <Top10Header />

      <main>
        <HeroSection categoryGroups={categoryGroups} heroTagline={settings?.heroTagline} />
        <BrandLogos logos={settings?.brandLogos as any[]} />
        <TrendingList items={settings?.trendingItems as any[]} />
        <StatsSection
          listsCount={settings?.statsListsCount}
          hoursCount={settings?.statsHoursCount}
          decisionsCount={settings?.statsDecisionsCount}
        />
        <ExpertsSection experts={experts} />
        <MissionSection
          missionTitle={settings?.missionTitle}
          missionContent={settings?.missionContent}
          missionImage={settings?.missionImage}
          missionCta={settings?.missionCta}
          methodTitle={settings?.methodTitle}
          methodContent={settings?.methodContent}
          methodImage={settings?.methodImage}
          methodCta={settings?.methodCta}
        />
        <MoreArticles articles={moreArticles} />
        <ExploreCategories categories={settings?.exploreCategories as any[]} />
      </main>

      <Top10Footer />
    </div>
  );
}
