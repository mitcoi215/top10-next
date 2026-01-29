'use client';

import { useState } from 'react';

// Arrow icon SVG
const ArrowIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.405 6.613l-4.022 3.89a.718.718 0 000 1.039.779.779 0 001.074 0l5.32-5.144a.718.718 0 000-1.039L6.458.215A.771.771 0 005.92 0a.771.771 0 00-.537.215.718.718 0 000 1.04l4.022 3.889H.76c-.42 0-.76.329-.76.734 0 .406.34.735.76.735h8.645z"
      fill="currentColor"
    />
  </svg>
);

// Default data for fallback
const defaultCategoryGroups = [
  {
    id: '0',
    name: 'Lifestyle',
    icon: '/top10-images/lifestyle.20240115133645.svg',
    categories: [
      { name: 'Dating', exploreHref: '/dating', compareHref: '/dating/comparison' },
      { name: 'Meal Delivery Services', exploreHref: '/meal-delivery', compareHref: '/meal-delivery/comparison' },
      { name: 'TV Services', exploreHref: '/tv-services', compareHref: '/tv-services/comparison' },
    ],
  },
  {
    id: '1',
    name: 'Health & Wellness',
    icon: '/top10-images/health.20240115133541.svg',
    categories: [
      { name: 'Online Therapy', exploreHref: '/online-therapy', compareHref: '/online-therapy/comparison' },
      { name: 'Medical Alerts', exploreHref: '/medical-alerts', compareHref: '/medical-alerts/comparison' },
    ],
  },
  {
    id: '2',
    name: 'Home',
    icon: '/top10-images/home.20240115133606.svg',
    categories: [
      { name: 'Moving', exploreHref: '/moving-companies', compareHref: '/moving-companies/comparison' },
      { name: 'Home Security', exploreHref: '/home-security', compareHref: '/home-security/comparison' },
    ],
  },
  {
    id: '3',
    name: 'Business',
    icon: '/top10-images/business.20240115133519.svg',
    categories: [
      { name: 'CRM', exploreHref: '/crm', compareHref: '/crm/comparison' },
      { name: 'Website Builders', exploreHref: '/website-builders', compareHref: '/website-builders/comparison' },
      { name: 'Hosting Services', exploreHref: '/hosting', compareHref: '/hosting/comparison' },
    ],
  },
  {
    id: '4',
    name: 'Security',
    icon: '/top10-images/security.20240115133625.svg',
    categories: [
      { name: 'Background Check', exploreHref: '/background-check', compareHref: '/background-check/comparison' },
      { name: 'ID Theft', exploreHref: '/id-theft', compareHref: '/id-theft/comparison' },
      { name: 'VPN', exploreHref: '/vpn', compareHref: '/vpn/comparison' },
    ],
  },
];

interface Category {
  id?: string;
  slug?: string;
  name: string;
  icon?: string | null;
  exploreHref?: string | null;
  compareHref?: string | null;
}

interface CategoryGroup {
  id: string;
  slug?: string;
  name: string;
  icon?: string | null;
  categories: Category[];
}

interface HeroSectionProps {
  categoryGroups?: CategoryGroup[] | null;
}

// Subcategory component
const SubcategoryItem = ({
  name,
  exploreHref,
  compareHref
}: {
  name: string;
  exploreHref?: string | null;
  compareHref?: string | null;
}) => (
  <div data-role="sub-category" data-testid="sub-two-links" className="ni-1hvu95" style={{ display: 'flex' }}>
    <div data-role="sub-category-title" className="ni-cg6g9y">{name}</div>
    <div className="ni-8eku1f">
      <a data-testid="link" target="_self" href={exploreHref || '#'} className="ni-1oe2nzy">
        Explore<ArrowIcon />
      </a>
      <div className="ni-1i1o349"></div>
      <a data-testid="link" target="_self" href={compareHref || '#'} className="ni-1xk84tj">
        Compare<ArrowIcon />
      </a>
    </div>
  </div>
);

// Map icon string/emoji to image path
const getIconPath = (icon?: string | null, name?: string) => {
  if (icon && icon.startsWith('/')) return icon;
  // Map by group name if icon is emoji or missing
  const iconMap: Record<string, string> = {
    'Lifestyle': '/top10-images/lifestyle.20240115133645.svg',
    'Health & Wellness': '/top10-images/health.20240115133541.svg',
    'Home': '/top10-images/home.20240115133606.svg',
    'Business': '/top10-images/business.20240115133519.svg',
    'Security': '/top10-images/security.20240115133625.svg',
  };
  return iconMap[name || ''] || '/top10-images/lifestyle.20240115133645.svg';
};

export default function HeroSection({ categoryGroups }: HeroSectionProps) {
  const [activeCategory, setActiveCategory] = useState<number>(-1);

  // Use provided data or fallback to defaults
  const groups = categoryGroups && categoryGroups.length > 0 ? categoryGroups : defaultCategoryGroups;

  // Get current active category data
  const activeData = activeCategory >= 0 ? groups[activeCategory] : null;

  return (
    <div className="ni-1hjxear">
      <div data-role="top-wrap" data-testid="top-wrap" className="ni-1yyakb4">
        <div className="ni-c8z8t5">
          {/* Title */}
          <div className="ni-kghpb1">
            <div>Compare and shop the <span>Top10</span> best services &amp; products for you</div>
          </div>

          {/* Category Cards */}
          <div className="ni-hapki3">
            {groups.map((group, idx) => (
              <div key={group.id || idx} data-role="category-and-sub-wrap">
                <div>
                  <div
                    data-role="category"
                    data-idx={idx}
                    className="ni-sh3crd"
                    onMouseEnter={() => setActiveCategory(idx)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getIconPath(group.icon, group.name)} alt="category-icon" className="ni-vsqybe" />
                    <div data-role="category-title" className={activeCategory === idx ? 'ni-1u18vzq' : 'ni-a9trmo'}>{group.name}</div>
                    <div className="plus ni-cu3t18">+</div>
                    <div className="minus ni-g18mml">-</div>
                  </div>
                </div>
                {/* Arrow indicators */}
                <div
                  data-role="arrow-bottom"
                  className="ni-z3tru0"
                  style={{ display: activeCategory === idx ? 'flex' : 'none' }}
                ></div>
                <div
                  data-role="arrow-top"
                  className="ni-fi68f4"
                  style={{ display: activeCategory === idx ? 'flex' : 'none' }}
                ></div>
              </div>
            ))}
          </div>

          {/* Single Dropdown */}
          {activeData && (
            <div className="ni-cpg42y">
              <div className="ni-9qmydc">
                {activeData.categories.map((cat, idx) => (
                  <SubcategoryItem
                    key={cat.name || idx}
                    name={cat.name}
                    exploreHref={cat.exploreHref}
                    compareHref={cat.compareHref}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
