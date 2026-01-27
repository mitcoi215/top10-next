'use client';

import { useState } from 'react';

// Arrow icon SVG - exact copy from original
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

// Subcategory data - exact from original template
const lifestyleSubcategories = [
  { title: 'Dating', explore: 'https://www.top10.com/dating', compare: 'https://www.top10.com/dating/comparison' },
  { title: 'Meal Delivery Services', explore: 'https://www.top10.com/meal-delivery', compare: 'https://www.top10.com/meal-delivery/comparison' },
  { title: 'TV Services', explore: 'https://www.top10.com/tv-services', compare: 'https://www.top10.com/tv-services/live-tv-comparison' },
  { title: 'Mobile Plans', explore: 'https://www.top10.com/mobile-plans', compare: 'https://www.top10.com/mobile-plans/comparison' },
  { title: 'Language Learning', explore: 'https://www.top10.com/language-learning', compare: 'https://www.top10.com/language-learning/comparison' },
];

const healthSubcategories = [
  { title: 'Online Therapy', explore: 'https://www.top10.com/online-therapy', compare: 'https://www.top10.com/online-therapy/comparison' },
  { title: 'Medical alerts', explore: 'https://www.top10.com/medical-alerts', compare: 'https://www.top10.com/medical-alerts/comparison' },
  { title: 'Hearing Aids', explore: 'https://www.top10.com/hearing-aid', compare: 'https://www.top10.com/hearing-aid/comparison' },
  { title: 'DNA Testing', explore: 'https://www.top10.com/dna-testing', compare: 'https://www.top10.com/dna-testing/comparison' },
];

const homeSubcategories = [
  { title: 'Moving', explore: 'https://www.top10.com/moving-companies', compare: 'https://www.top10.com/moving-companies/longdistance-comparison' },
  { title: 'Home Warranty', explore: 'https://www.top10.com/home-warranty', compare: 'https://www.top10.com/home-warranty/comparison' },
  { title: 'Home security', explore: 'https://www.top10.com/home-security', compare: 'https://www.top10.com/home-security/comparison' },
  { title: 'Internet Service Providers', explore: 'https://www.top10.com/internet-providers', compare: 'https://www.top10.com/internet-providers/comparison' },
];

const businessSubcategories = [
  { title: 'CRM', explore: 'https://www.top10.com/crm', compare: 'https://www.top10.com/crm/comparison' },
  { title: 'Website Builders', explore: 'https://www.top10.com/website-builders/comparison', compare: 'https://www.top10.com/website-builders/comparison' },
  { title: 'Hosting Services', explore: 'https://www.top10.com/hosting', compare: 'https://www.top10.com/hosting/comparison' },
  { title: 'Legal Services & LLC Registration', explore: 'https://www.top10.com/legal-services', compare: 'https://www.top10.com/legal-services/llc-registration-comparison' },
  { title: 'Project Management Software', explore: 'https://www.top10.com/project-management/', compare: 'https://www.top10.com/project-management/comparison' },
  { title: 'VoIP', explore: 'https://www.top10.com/voip', compare: 'https://www.top10.com/voip/comparison' },
  { title: 'POS', explore: 'https://www.top10.com/pos', compare: 'https://www.top10.com/pos/comparison' },
  { title: 'Payroll', explore: 'https://www.top10.com/payroll', compare: 'https://www.top10.com/payroll/comparison' },
  { title: 'Merchant Services', explore: 'https://www.top10.com/merchant-services/', compare: 'https://www.top10.com/merchant-services/comparison' },
  { title: 'Accounting Software', explore: 'https://www.top10.com/accounting-software/', compare: 'https://www.top10.com/accounting-software/comparison' },
];

const securitySubcategories = [
  { title: 'Background Check', explore: 'https://www.top10.com/background-check', compare: 'https://www.top10.com/background-check/comparison' },
  { title: 'ID Theft', explore: 'https://www.top10.com/id-theft', compare: 'https://www.top10.com/id-theft/comparison' },
  { title: 'Cyber security', explore: 'https://www.top10.com/cyber-security', compare: 'https://www.top10.com/cyber-security/comparison' },
];

// All categories data
const categories = [
  {
    id: 0,
    title: 'Lifestyle',
    icon: '/top10-images/lifestyle.20240115133645.svg',
    subcategories: lifestyleSubcategories,
    cardClass: 'ni-1hvu95',
  },
  {
    id: 1,
    title: 'Health & Wellness',
    icon: '/top10-images/health.20240115133541.svg',
    subcategories: healthSubcategories,
    cardClass: 'ni-gnxpsb',
  },
  {
    id: 2,
    title: 'Home',
    icon: '/top10-images/home.20240115133606.svg',
    subcategories: homeSubcategories,
    cardClass: 'ni-gnxpsb',
  },
  {
    id: 3,
    title: 'Business',
    icon: '/top10-images/business.20240115133519.svg',
    subcategories: businessSubcategories,
    cardClass: 'ni-gnxpsb',
  },
  {
    id: 4,
    title: 'Security',
    icon: '/top10-images/security.20240115133625.svg',
    subcategories: securitySubcategories,
    cardClass: 'ni-gnxpsb',
  },
];

// Subcategory component
const SubcategoryItem = ({ title, explore, compare, cardClass = 'ni-1hvu95' }: { title: string; explore: string; compare: string; cardClass?: string }) => (
  <div data-role="sub-category" data-testid="sub-two-links" className={cardClass} style={{ display: 'flex' }}>
    <div data-role="sub-category-title" className="ni-cg6g9y">{title}</div>
    <div className="ni-8eku1f">
      <a data-testid="link" target="_self" href={explore} className="ni-1oe2nzy">
        Explore<ArrowIcon />
      </a>
      <div className="ni-1i1o349"></div>
      <a data-testid="link" target="_self" href={compare} className="ni-1xk84tj">
        Compare<ArrowIcon />
      </a>
    </div>
  </div>
);

export default function HeroSection() {
  const [activeCategory, setActiveCategory] = useState<number>(-1);

  // Get current active category data
  const activeData = activeCategory >= 0 ? categories[activeCategory] : null;

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
            {categories.map((cat) => (
              <div key={cat.id} data-role="category-and-sub-wrap">
                <div>
                  <div
                    data-role="category"
                    data-idx={cat.id}
                    className="ni-sh3crd"
                    onMouseEnter={() => setActiveCategory(cat.id)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cat.icon} alt="category-icon" className="ni-vsqybe" />
                    <div data-role="category-title" className={activeCategory === cat.id ? 'ni-1u18vzq' : 'ni-a9trmo'}>{cat.title}</div>
                    <div className="plus ni-cu3t18">+</div>
                    <div className="minus ni-g18mml">-</div>
                  </div>
                </div>
                {/* Arrow indicators - only show for active category */}
                <div
                  data-role="arrow-bottom"
                  className="ni-z3tru0"
                  style={{ display: activeCategory === cat.id ? 'flex' : 'none' }}
                ></div>
                <div
                  data-role="arrow-top"
                  className="ni-fi68f4"
                  style={{ display: activeCategory === cat.id ? 'flex' : 'none' }}
                ></div>
              </div>
            ))}
          </div>

          {/* Single Dropdown - renders content based on active category */}
          {activeData && (
            <div className="ni-cpg42y">
              <div className="ni-9qmydc">
                {activeData.subcategories.map((sub) => (
                  <SubcategoryItem
                    key={sub.title}
                    {...sub}
                    cardClass={activeData.cardClass}
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
