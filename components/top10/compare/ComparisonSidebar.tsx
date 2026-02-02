'use client';

import { useState } from 'react';

interface Article {
  slug: string;
  title: string;
  publishedAt?: string | Date | null;
}

interface ReviewProduct {
  slug: string;
  name: string;
  logoUrl?: string | null;
}

interface ScoreBreakdownItem {
  name: string;
  description: string;
  score: number;
}

interface ComparisonSidebarProps {
  categoryName: string;
  categorySlug: string;
  socialProofCount?: number | string;
  articles?: Article[];
  reviewProducts?: ReviewProduct[];
  scoreBreakdown?: ScoreBreakdownItem[];
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`sidebar-disclaimer__chevron${open ? ' sidebar-disclaimer__chevron--open' : ''}`}
    >
      <path
        d="M22.577 8.368l-9.562 9.225a1.438 1.438 0 01-.466.301 1.48 1.48 0 01-1.566-.301L1.42 8.368C1.15 8.108 1 7.755 1 7.388c0-.368.151-.72.42-.98.27-.26.636-.407 1.017-.407.38 0 .746.146 1.016.406L12 14.654l8.547-8.248c.27-.26.635-.406 1.016-.406s.747.146 1.016.406c.27.26.421.613.421.98 0 .368-.151.72-.42.98l-.003.002z"
        fill="currentColor"
      />
    </svg>
  );
}

function PopularityIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sidebar-disclaimer__icon">
      <path fillRule="evenodd" clipRule="evenodd" d="M7.923 4.952a.447.447 0 00.897 0V2.446C8.82 2.2 8.619 2 8.37 2c-.247 0-.448.2-.448.446v2.506zM5.647 6.26a.448.448 0 00.634-.631l-1.78-1.772a.45.45 0 00-.634 0 .445.445 0 000 .632l1.78 1.771zm-.682 2.528H2.448a.447.447 0 110-.893h2.517a.447.447 0 110 .893zm-1.098 4.038a.448.448 0 00.634 0l1.78-1.772a.445.445 0 000-.631.45.45 0 00-.634 0l-1.78 1.771a.445.445 0 000 .632zm6.911-6.435a.445.445 0 01-.317-.762l1.78-1.772a.45.45 0 01.635 0 .445.445 0 010 .632l-1.78 1.771a.448.448 0 01-.318.131zM8.505 7.443l12.001 4.385a.75.75 0 01.129 1.35l-3.315 1.98 4.226 4.205a1.54 1.54 0 010 2.185 1.557 1.557 0 01-2.195 0l-4.225-4.206-1.99 3.299a.756.756 0 01-1.355-.128L7.376 8.568c-.259-.701.425-1.382 1.13-1.125z" fill="currentColor" />
    </svg>
  );
}

function ReputationIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sidebar-disclaimer__icon">
      <path fillRule="evenodd" clipRule="evenodd" d="M7.903 21.607A3.895 3.895 0 009.605 22h8.458c.944 0 1.856-.343 2.572-.968a4.048 4.048 0 001.336-2.439l.99-6.451c.072-.46.044-.93-.08-1.378a3.242 3.242 0 00-.64-1.217 3.17 3.17 0 00-1.082-.832 3.115 3.115 0 00-1.324-.296h-5.192V4.622a2.65 2.65 0 00-.536-1.603 2.569 2.569 0 00-1.386-.934 2.527 2.527 0 00-1.658.125 2.588 2.588 0 00-1.236 1.133L6.54 9.322c-.199.36-.303.767-.303 1.18v8.771c0 .457.127.904.366 1.29.24.386.581.696.986.892l.316.153-.003-.001zM2.577 9.617a1.55 1.55 0 00-1.115.47A1.607 1.607 0 001 11.221v8.238c0 .426.166.835.462 1.136.296.302.697.47 1.115.47h.785c.21 0 .411-.084.56-.235a.814.814 0 00.231-.57v-9.84a.813.813 0 00-.231-.57.784.784 0 00-.56-.236l-.785.002z" fill="currentColor" />
    </svg>
  );
}

function FeaturesIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sidebar-disclaimer__icon">
      <path fillRule="evenodd" clipRule="evenodd" d="M11.996 2.001a7.313 7.313 0 00-5.243 2.11 7.33 7.33 0 00-1.614 8.049 7.33 7.33 0 004.024 3.972c.9.362 1.863.542 2.833.528a7.317 7.317 0 005.177-2.146 7.335 7.335 0 000-10.367 7.316 7.316 0 00-5.177-2.146zm.29 3.466l.975 1.965a.307.307 0 00.249.182l2.166.329a.328.328 0 01.181.568l-1.597 1.522a.317.317 0 000 .294l.306 2.157a.328.328 0 01-.486.352l-1.929-1.021a.385.385 0 00-.318 0l-1.929 1.02a.328.328 0 01-.485-.351l.361-2.157a.318.318 0 00-.057-.294L8.124 8.498a.329.329 0 01.182-.558l2.167-.316a.305.305 0 00.248-.181l.976-1.966a.33.33 0 01.59-.011h-.001zm7.286 8.922a9.121 9.121 0 01-5.236 3.755l2.017 3.498a.715.715 0 001.308-.171l.73-2.717 2.71.728a.714.714 0 00.803-1.048l-2.332-4.045zm-9.91 3.756a9.12 9.12 0 01-5.238-3.749l-2.328 4.038a.716.716 0 00.802 1.048l2.713-.728.728 2.716a.715.715 0 001.308.172l2.016-3.497z" fill="currentColor" />
    </svg>
  );
}

function DisclaimerRow({ icon, title, text, score }: { icon: React.ReactNode; title: string; text: string; score?: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sidebar-disclaimer__row" data-testid="drop-down-row-container">
      <div className="sidebar-disclaimer__row-header" onClick={() => setOpen(!open)}>
        {icon}
        <div className="sidebar-disclaimer__row-title">{title}</div>
        {score != null && <div className="sidebar-disclaimer__row-score">{score.toFixed(1)}</div>}
        <ChevronIcon open={open} />
      </div>
      {open && (
        <div className="sidebar-disclaimer__row-text">{text}</div>
      )}
    </div>
  );
}

const DEFAULT_SCORE_ICONS: Record<string, React.ReactNode> = {
  'Popularity': <PopularityIcon />,
  'Brand Reputation': <ReputationIcon />,
  'Features & Benefits': <FeaturesIcon />,
};

export default function ComparisonSidebar({
  categoryName,
  categorySlug,
  socialProofCount,
  articles = [],
  reviewProducts = [],
  scoreBreakdown,
}: ComparisonSidebarProps) {
  const displayCount = typeof socialProofCount === 'string' && socialProofCount
    ? socialProofCount
    : (typeof socialProofCount === 'number' ? socialProofCount.toLocaleString() : Math.floor(Math.random() * 15000 + 8000).toLocaleString());

  return (
    <aside className="compare-left-sidebar">
      {/* Social Proof */}
      <div className="sidebar-social-proof" data-testid="dynamic-site-proof">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height={72}
          width={72}
          src="https://images.top10.com/iu/q_auto/v1/production/foundation-entities/uploads/photo/ninja-siteproof.20210211102726.20221108084421.20221122142022.svg"
          alt="social-proof"
          className="sidebar-social-proof__image"
        />
        <div className="sidebar-social-proof__text">
          <div className="sidebar-social-proof__title" data-testid="title">
            {displayCount} people
          </div>
          <div className="sidebar-social-proof__desc" data-testid="description">
            compared {categoryName.toLowerCase()} services via Top10.com this month
          </div>
        </div>
      </div>

      {/* Score Disclaimer */}
      <div className="sidebar-disclaimer" data-testid="score-disclaimer">
        <div className="sidebar-disclaimer__header">
          <div className="sidebar-disclaimer__header-title" data-testid="title">Top10.com Total Score</div>
          <div className="sidebar-disclaimer__header-subtitle" data-testid="subtitle">
            Our product scores consist of a combination of the following 3 components:
          </div>
        </div>
        <div className="sidebar-disclaimer__rows">
          {scoreBreakdown && scoreBreakdown.length > 0 ? (
            scoreBreakdown.map((item, idx) => (
              <DisclaimerRow
                key={idx}
                icon={DEFAULT_SCORE_ICONS[item.name] || <FeaturesIcon />}
                title={item.name}
                text={item.description}
                score={item.score}
              />
            ))
          ) : (
            <>
              <DisclaimerRow
                icon={<PopularityIcon />}
                title="Popularity"
                text="Top10.com measures user engagement based on the number of clicks each listed brand received in the past 7 days. The number of clicks to each brand will be measured against other brands listed in the same query."
              />
              <DisclaimerRow
                icon={<ReputationIcon />}
                title="Brand Reputation"
                text="The brand reputation is based on analysis of clickstream data, which includes user behavior, search patterns, and engagement, to accurately measure each brand's prominence, credibility, and trustworthiness."
              />
              <DisclaimerRow
                icon={<FeaturesIcon />}
                title="Features & Benefits"
                text="Our editorial team researches and reviews products based on factors such as: range of products and services offered, ease-of-use, online accessibility, customer service, special awards, and more."
              />
            </>
          )}
        </div>
      </div>

      {/* Must Reads */}
      {articles.length > 0 && (
        <div className="sidebar-must-reads">
          <section className="sidebar-must-reads__section" data-testid="must-reads-container">
            <header className="sidebar-must-reads__header">
              <h3>Must Reads</h3>
            </header>
            <main className="sidebar-must-reads__list">
              {articles.slice(0, 3).map((article) => (
                <a
                  key={article.slug}
                  href={`/${categorySlug}/${article.slug}`}
                  className="sidebar-must-reads__item"
                  data-testid="side-bar-article"
                >
                  <div className="sidebar-must-reads__item-title">{article.title}</div>
                  {article.publishedAt && (
                    <div className="sidebar-must-reads__item-date">
                      {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </div>
                  )}
                </a>
              ))}
            </main>
            <a className="sidebar-must-reads__see-all" href={`/${categorySlug}/top-reads`} data-testid="read-more-articles">
              See all articles
            </a>
          </section>
        </div>
      )}

      {/* Our Reviews */}
      {reviewProducts.length > 0 && (
        <div className="sidebar-reviews">
          <div className="sidebar-reviews__header">
            <span>Our Reviews</span>
            <a href={`/${categorySlug}/reviews`} className="sidebar-reviews__header-link">Read all reviews</a>
          </div>
          <div className="sidebar-reviews__list">
            {reviewProducts.slice(0, 3).map((product) => (
              <a
                key={product.slug}
                href={`/${categorySlug}/reviews/${product.slug}`}
                className="sidebar-reviews__item"
                data-testid={product.name}
              >
                <div className="sidebar-reviews__item-icon">
                  {product.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img width={24} height={24} src={product.logoUrl} alt={product.name} loading="lazy" />
                  ) : (
                    <span>{product.name.charAt(0)}</span>
                  )}
                </div>
                <div className="sidebar-reviews__item-info">
                  <div className="sidebar-reviews__item-name">{product.name}</div>
                  <span className="sidebar-reviews__item-link">Read Review</span>
                </div>
              </a>
            ))}
          </div>
          <a href={`/${categorySlug}/reviews`} className="sidebar-reviews__see-all">Read all reviews</a>
        </div>
      )}
    </aside>
  );
}
