import '@/styles/top10.css';
import { Top10Header, Top10Footer } from '@/components/top10/layout';
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

export const metadata = {
  title: 'Top 10 Lists of the Best Products and Services | Top10.com',
  description:
    'Top10.com is a comparison platform that brings you useful top 10 lists covering a wide variety of products and services that can help you save time and money',
};

export default function HomePage() {
  return (
    <div className="top10-page">
      <Top10Header />

      <main>
        <HeroSection />
        <BrandLogos />
        <TrendingList />
        <StatsSection />
        <ExpertsSection />
        <MissionSection />
        <MoreArticles />
        <ExploreCategories />
      </main>

      <Top10Footer />
    </div>
  );
}
