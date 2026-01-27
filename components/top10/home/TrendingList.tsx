'use client';

import { useState } from 'react';

// Trending data - exact 10 items from original HTML template
const trendingItems = [
  {
    rank: 1,
    title: 'Hosting',
    href: '/hosting',
    image: '/top10-images/Hosting.20221025063909.jpg',
    description: 'Top 10 Best Web Hosting Providers & Companies in 2026',
    date: 'Oct, 2024',
    articles: [
      {
        title: 'How Smart WordPress Security Features Can Protect Your Site from Cyber Attacks',
        href: '/hosting/wordpress-security-features',
        image: '/top10-images/shutterstock_21847135611.jpg',
        author: 'Luis-santiago Saldivar',
        date: 'Dec, 2024',
      },
      {
        title: "How Secure Hosting Features Safeguard Your SMB's Data and Why You Should Care",
        href: '/hosting/secure-hosting-features',
        image: '/top10-images/shutterstock_193708215731.jpg',
        author: 'Luis-santiago Saldivar',
        date: 'Dec, 2024',
      },
      {
        title: 'IONOS Review',
        href: '/hosting/reviews/ionos',
        image: '/top10-images/2023_Logo_TV-services.20230330090500.20240718074123.png',
        author: '',
        date: 'Jun, 2023',
        isReview: true,
      },
    ],
  },
  {
    rank: 2,
    title: 'Home Security',
    href: '/home-security',
    image: '/top10-images/Untitleddesign86.20221025070645.jpg',
    description: 'Top 10 Best Home Security Systems & Companies 2026 - Keep Your Home Safe',
    date: 'May, 2024',
    articles: [
      {
        title: '5 Best Video Doorbells of 2026 for a Safer Home',
        href: '/home-security/best-video-doorbells-for-a-safer-home',
        image: '/top10-images/Home_Security-1765286288398.20251209131954.png',
        author: 'Chris Wilson',
        date: 'Dec, 2025',
      },
      {
        title: 'Where to Install Security Cameras In Your Home',
        href: '/home-security/where-to-install-home-security-cameras',
        image: '/top10-images/Home_Security-1765286288398.20251209131947.png',
        author: 'Chris Wilson',
        date: 'Dec, 2025',
      },
      {
        title: 'ADT Review',
        href: '/home-security/reviews/adt',
        image: '/top10-images/ADT_LogoRGB-12.20240523093040.svg',
        author: '',
        date: 'Mar, 2024',
        isReview: true,
      },
    ],
  },
  {
    rank: 3,
    title: 'Project Management',
    href: '/project-management',
    image: '/top10-images/Header1.20191008075541.jpg',
    description: 'Top 10 Best Project Management Software & Tools to Organize Your Team',
    date: 'Dec, 2024',
    articles: [
      {
        title: 'Airtable Alternatives: 5 Similar Project Management Software to Try in 2026',
        href: '/project-management/airtable-alternatives',
        image: '/top10-images/Project_Management_1-1765292911543.20251209151007.png',
        author: 'Michael Klobe',
        date: 'Dec, 2025',
      },
      {
        title: 'Asana Alternatives: 5 Best Project Management Software to Try in 2026',
        href: '/project-management/asana-alternatives',
        image: '/top10-images/shutterstock_26435825691.20251215105814.jpg',
        author: 'Michael Klobe',
        date: 'Dec, 2025',
      },
      {
        title: 'monday.com Review',
        href: '/project-management/reviews/mondaycom',
        image: '/top10-images/large-logo-monday.20200225145423.png',
        author: '',
        date: 'Nov, 2022',
        isReview: true,
      },
    ],
  },
  {
    rank: 4,
    title: 'VoIP',
    href: '/voip',
    image: '/top10-images/Frame19931.20240730092346.png',
    description: 'Top 10 Best VoIP Providers & Phone Services Companies',
    date: 'Jul, 2024',
    articles: [
      {
        title: 'Google Voice Alternatives: 5 Best VoIP Services to Try in 2026',
        href: '/voip/google-voice-alternatives',
        image: '/top10-images/VoIP_1-1765295588175.20251209155441.png',
        author: 'Cameron Coward',
        date: 'Dec, 2025',
      },
      {
        title: 'How AI Is Changing the World of Non-Fixed VoIP and How to Get Ahead',
        href: '/voip/ai-changing-the-world-of-nonfixed-voip',
        image: '/top10-images/shutterstock_26610842451.20251215110448.jpg',
        author: 'Rodney Garner',
        date: 'Dec, 2025',
      },
      {
        title: 'Vonage Review',
        href: '/voip/reviews/vonage',
        image: '/top10-images/VonageLogo.20210211094543.png',
        author: '',
        date: 'Jun, 2024',
        isReview: true,
      },
    ],
  },
  {
    rank: 5,
    title: 'Id Theft',
    href: '/id-theft/comparison',
    image: '/top10-images/Header1.20191017124608.20251119085808.jpg',
    description: 'Best Identity Theft Protection Services 2026',
    date: 'Nov, 2025',
    articles: [
      {
        title: 'How to Check for Identity Theft: A Comprehensive Guide for 2026',
        href: '/id-theft/how-to-check-for-identity-theft-a-comprehensive-guide',
        image: '/top10-images/ID_Theft_1-1765289030199.20251209140504.jpg',
        author: 'Christopher Somerville',
        date: 'Jan, 2026',
      },
      {
        title: 'Nightmarish ID Theft Stories From Real Victims',
        href: '/id-theft/nightmarish-id-theft-stories-from-real-victims',
        image: '/top10-images/ID_Theft_1-1765289030199.20251209140500.jpg',
        author: 'Erin Donaghue',
        date: 'Jan, 2026',
      },
      {
        title: 'Aura Review',
        href: '/id-theft/reviews/aura',
        image: '/top10-images/Aura_Logo_xSite.20210609113526.png',
        author: '',
        date: 'Nov, 2022',
        isReview: true,
      },
    ],
  },
  {
    rank: 6,
    title: 'Website Builders',
    href: '/website-builders/comparison',
    image: '/top10-images/WebsiteBuilders.20251216080336.jpg',
    description: 'Compare the Best Website Builders of 2026',
    date: 'Dec, 2025',
    articles: [
      {
        title: 'How to Grow Your Business Online in 10 Steps',
        href: '/website-builders/how-to-grow-your-business-online',
        image: '/top10-images/shutterstock_23134528751.20251215114007.jpg',
        author: 'Luis-santiago Saldivar',
        date: 'Dec, 2025',
      },
      {
        title: 'WordPress Alternatives: 5 Website Builders to Try in 2026',
        href: '/website-builders/top-wordpress-alternatives-easily-build-and-launch-your-site',
        image: '/top10-images/Website_Builder_1-1765295756624.20251209155752.png',
        author: 'Milena Alexandrova',
        date: 'Dec, 2025',
      },
      {
        title: 'Wix Review',
        href: '/website-builders/reviews/wix',
        image: '/top10-images/Product_WIX_Size_300x100-Light-NoBg.20240327091206.svg',
        author: '',
        date: 'Mar, 2023',
        isReview: true,
      },
    ],
  },
  {
    rank: 7,
    title: 'Dating Sites & Apps',
    href: '/dating',
    image: '/top10-images/dating.20210105130957.jpg',
    description: 'Top 10 Best Free Online Dating Sites and Apps in 2026 - Find Singles Online',
    date: 'Nov, 2024',
    articles: [
      {
        title: 'Top 10 Best Free Gay Dating Sites and Apps in 2026',
        href: '/dating/best-gay-dating-sites',
        image: '/top10-images/Group8251.20240218123834.png',
        author: 'Morgan Mandriota',
        date: 'Dec, 2025',
      },
      {
        title: '40% of People Would Consider Dating an AI Partner, Survey Says',
        href: '/dating/ai-dating-survey',
        image: '/top10-images/dating-an-ai-partner-hero1.jpg',
        author: 'Antonia Greco',
        date: 'Dec, 2025',
      },
      {
        title: 'eharmony Review',
        href: '/dating/reviews/eharmony',
        image: '/top10-images/2023_Logo_Eharmony.20231224094829.svg',
        author: '',
        date: 'Jul, 2025',
        isReview: true,
      },
    ],
  },
  {
    rank: 8,
    title: 'Online Therapy',
    href: '/online-therapy/comparison',
    image: '/top10-images/online-therapy.20210105125951.jpg',
    description: 'Best Online Therapy Services 2026',
    date: 'Dec, 2025',
    articles: [
      {
        title: 'Our Top 10 Best Mental Health Tools and Apps',
        href: '/online-therapy/best-mental-health-tools-and-apps',
        image: '/top10-images/Untitleddesign-2024-07-14T141948.9901.20240714112002.png',
        author: 'Susan Halsey',
        date: 'Jan, 2026',
      },
      {
        title: 'How Much Does Online Therapy Cost?',
        href: '/online-therapy/how-much-does-online-therapy-cost',
        image: '/top10-images/Online Therapy.20200909112943.jpg',
        author: 'Katherine Cullen',
        date: 'Jan, 2026',
      },
      {
        title: 'BetterHelp Review',
        href: '/online-therapy/reviews/betterhelp',
        image: '/top10-images/Product_betterhelp_Size_300x100-Light-NoBg.20240606172311.svg',
        author: '',
        date: 'Apr, 2025',
        isReview: true,
      },
    ],
  },
  {
    rank: 9,
    title: 'Background Check',
    href: '/background-check',
    image: '/top10-images/Untitleddesign68.20220713103907.jpg',
    description: 'Top 10 Best Online Background Check Sites & Companies in 2026',
    date: 'Jan, 2025',
    articles: [
      {
        title: 'How to Catch a Cheater: Top Online Resources for Uncovering Infidelity in 2026',
        href: '/background-check/best-background-checks-to-investigate-suspected-infidelity',
        image: '/top10-images/Group88221.20240304152026.png',
        author: 'Erin Donaghue',
        date: 'Dec, 2025',
      },
      {
        title: 'Top 10 Best Reverse Phone Number Lookup Sites & Services in 2026',
        href: '/background-check/all-you-need-to-know-about-reverse-phone-lookup',
        image: '/top10-images/reversephone.20201106094612.jpg',
        author: 'Phillip Richardson',
        date: 'Jan, 2026',
      },
      {
        title: 'BeenVerified Review',
        href: '/background-check/reviews/beenverified',
        image: '/top10-images/BVLogoGray-Green.20240827061751.png',
        author: '',
        date: 'Apr, 2024',
        isReview: true,
      },
    ],
  },
  {
    rank: 10,
    title: 'Meal Delivery',
    href: '/meal-delivery',
    image: '/top10-images/meal-delivery.20210105125548.jpg',
    description: 'Top 10 Best Meal Delivery Services for 2026 - Save Time and Money',
    date: 'Jun, 2024',
    articles: [
      {
        title: 'Freshly Alternatives: 5 Similar Meal Delivery Services Worth Trying in 2026',
        href: '/meal-delivery/freshly-alternatives-for-quick-healthy-meals',
        image: '/top10-images/shutterstock_23842239991.20251215104804.jpg',
        author: 'Anju Mobin',
        date: 'Dec, 2025',
      },
      {
        title: '10 of Our Favorite Home Chef Recipes: What Meals to Try Next',
        href: '/meal-delivery/our-favorite-home-chef-recipes-to-try',
        image: '/top10-images/Meal_Delivery_1-1765289430855.20251209141235.jpg',
        author: 'Marianne Rocha-taglione',
        date: 'Dec, 2025',
      },
      {
        title: 'HelloFresh Review',
        href: '/meal-delivery/reviews/hellofresh',
        image: '/top10-images/Hello Fresh_logo.20201221084138.png',
        author: '',
        date: 'Aug, 2023',
        isReview: true,
      },
    ],
  },
];

// Collapse all SVG icon - exact from original
const CollapseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 25" fill="none" className="ni-ocefd3">
    <mask id="collapse-all-arrow_svg__a" fill="#fff">
      <path fillRule="evenodd" d="M13.426 6.067a.61.61 0 00-1.218.024l.116 5.743a.61.61 0 00.593.597l5.78.153a.61.61 0 10.032-1.218l-4.362-.116 6.237-6.237a.61.61 0 10-.862-.861l-6.229 6.228-.087-4.313z" clipRule="evenodd"></path>
    </mask>
    <path fill="currentColor" d="M12.805 5.47l.04 2-.04-2zm.621.597l-2 .04 2-.04zm-1.218.024l2-.04-2 .04zm.116 5.743l-2 .04 2-.04zm.593.597l.053-2-.053 2zm5.78.153l.053-2-.053 2zm.625-.593l2 .053-2-.053zm-.593-.625l.053-2-.053 2zm-4.362-.116l-1.414-1.414a2 2 0 001.361 3.414l.053-2zm5.375-7.098l-1.414-1.415 1.414 1.415zm-6.229 6.228l-2 .04a2 2 0 003.415 1.375l-1.415-1.415zm-.668-2.91a1.39 1.39 0 01-1.418-1.363l3.999-.08a2.61 2.61 0 00-2.662-2.557l.081 4zm1.362-1.419a1.39 1.39 0 01-1.362 1.418l-.08-3.999a2.61 2.61 0 00-2.557 2.662l4-.081zm.116 5.743l-.116-5.743-3.999.08.116 5.744 4-.081zm-1.353-1.362a1.39 1.39 0 011.353 1.362l-3.999.08a2.61 2.61 0 002.54 2.556l.106-3.998zm5.78.153l-5.78-.153-.106 3.998 5.78.154.106-4zm-1.427 1.353a1.39 1.39 0 011.427-1.353l-.106 3.998a2.61 2.61 0 002.677-2.539l-3.998-.106zm1.353 1.427a1.39 1.39 0 01-1.353-1.427l3.998.106a2.61 2.61 0 00-2.539-2.677l-.106 3.998zm-4.362-.115l4.362.115.106-3.998-4.362-.116-.106 3.999zM19.19 3.6l-6.237 6.236 2.828 2.829 6.237-6.237-2.828-2.829zm0 1.966a1.39 1.39 0 010-1.967l2.828 2.829a2.61 2.61 0 000-3.69L19.19 5.565zm1.966 0a1.39 1.39 0 01-1.966 0l2.828-2.829a2.61 2.61 0 00-3.69 0l2.828 2.829zm-6.228 6.229l6.228-6.23-2.828-2.828-6.229 6.23 2.829 2.828zm-3.501-5.688l.087 4.314 3.999-.08-.087-4.315-4 .081z" mask="url(#collapse-all-arrow_svg__a)"></path>
    <mask id="collapse-all-arrow_svg__b" fill="#fff">
      <path fillRule="evenodd" d="M10.576 19.515a.61.61 0 101.218-.024l-.116-5.743a.61.61 0 00-.593-.597l-5.78-.153a.61.61 0 00-.032 1.218l4.361.116-6.237 6.237a.61.61 0 00.862.861l6.23-6.23.087 4.315z" clipRule="evenodd"></path>
    </mask>
    <path fill="currentColor" d="M11.197 20.112l-.024-1.218.024 1.218zm-.621-.597l1.218-.024-1.218.024zm1.218-.024l-1.218.024 1.218-.024zm-.116-5.743l1.219-.025-1.219.025zm-.593-.597l-.032 1.218.032-1.218zm-5.78-.153l-.032 1.218.032-1.218zm-.625.593l-1.218-.032 1.218.032zm.593.625l-.032 1.218.032-1.218zm4.361.116l.862.861a1.219 1.219 0 00-.83-2.08l-.032 1.219zm.855.869l1.218-.025a1.219 1.219 0 00-2.08-.837l.862.862zm.684 3.693a.61.61 0 01.621.597l-2.437.049a1.828 1.828 0 001.865 1.79l-.05-2.436zm-.597.621a.61.61 0 01.597-.621l.049 2.437a1.828 1.828 0 001.79-1.865l-2.436.05zm-.116-5.743l.116 5.743 2.437-.049-.116-5.743-2.437.05zm.593.597a.61.61 0 01-.593-.597l2.437-.049a1.828 1.828 0 00-1.78-1.79l-.064 2.436zm-5.78-.153l5.78.153.064-2.437-5.78-.152-.064 2.436zm.625-.593a.61.61 0 01-.625.593l.064-2.436a1.828 1.828 0 00-1.875 1.779l2.436.064zm-.593-.625a.61.61 0 01.593.625l-2.436-.064a1.828 1.828 0 001.779 1.875l.064-2.436zm4.361.115l-4.36-.115-.065 2.436 4.36.116.065-2.437zM4.26 21.43l6.237-6.237-1.724-1.723-6.237 6.237L4.26 21.43zm0-.861a.61.61 0 010 .861l-1.724-1.723a1.828 1.828 0 000 2.585L4.26 20.57zm-.862 0a.61.61 0 01.862 0l-1.724 1.723a1.828 1.828 0 002.586 0L3.397 20.57zm6.23-6.23l-6.23 6.23 1.724 1.723 6.23-6.23-1.724-1.723zm2.167 5.152l-.087-4.315-2.437.05.087 4.314 2.437-.05z" mask="url(#collapse-all-arrow_svg__b)"></path>
  </svg>
);

// Chevron icon - exact from original
const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ni-1el103i"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
  >
    <path d="M22.577 8.368l-9.562 9.225a1.438 1.438 0 01-.466.301 1.48 1.48 0 01-1.566-.301L1.42 8.368C1.15 8.108 1 7.755 1 7.388c0-.368.151-.72.42-.98.27-.26.636-.407 1.017-.407.38 0 .746.146 1.016.406L12 14.654l8.547-8.248c.27-.26.635-.406 1.016-.406s.747.146 1.016.406c.27.26.421.613.421.98 0 .368-.151.72-.42.98l-.003.002z" fill="currentColor"></path>
  </svg>
);

// Arrow icon - exact from original
const ArrowIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ni-gg3p61">
    <path d="M22.597 11.582a1.251 1.251 0 010 1.84l-5.5 5.197a1.435 1.435 0 01-1.947 0 1.251 1.251 0 010-1.84l3.154-2.98H2.375C1.615 13.8 1 13.22 1 12.5s.614-1.3 1.375-1.3h15.93L15.15 8.22a1.251 1.251 0 010-1.84 1.435 1.435 0 011.947 0l5.5 5.198v.004z" fill="currentColor"></path>
  </svg>
);

export default function TrendingList() {
  const [openItems, setOpenItems] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // All 10 items open by default

  const toggleItem = (rank: number) => {
    setOpenItems((prev) =>
      prev.includes(rank) ? prev.filter((r) => r !== rank) : [...prev, rank]
    );
  };

  const collapseAll = () => {
    setOpenItems([]);
  };

  return (
    <>
      <div className="ni-i5618i"></div>
      <div className="ni-1qnthm6">
        <div className="ni-3cvjrp">
          <div className="ni-13qkz7h">
            <div className="ni-1lm6x7r">
              <div data-testid="trend-list" className="ni-1r9q3l3">
                <div className="ni-1vgqq16">
                  <h2 className="ni-ixrrg9">Top 10 Trending List</h2>
                  <button data-testid="collapse-all-button" className="ni-un3w91" onClick={collapseAll}>
                    <span className="ni-449veh">Collapse all</span>
                    <CollapseIcon />
                  </button>
                </div>

                {trendingItems.map((item) => {
                  const isOpen = openItems.includes(item.rank);
                  return (
                    <div key={item.rank} data-testid="trend-card-open" className="ni-vzqhb2">
                      <div
                        data-testid="trend-card-header"
                        className="ni-gjtr62"
                        onClick={() => toggleItem(item.rank)}
                      >
                        <div className="ni-1uo779q">{item.rank}</div>
                        <div className="ni-44axjh">{item.title}</div>
                        <ChevronIcon open={isOpen} />
                      </div>

                      <div
                        className="ni-1v3txwc"
                        style={{ maxHeight: isOpen ? '1000px' : '0' }}
                      >
                        <div className="ni-15qoik9">
                          <div className="ni-1s81l2a">
                            <a href={item.href} className="ni-1y72xo"></a>
                            <div className="ni-851yf7">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                className="ni-r3mbvv"
                                src={item.image}
                                alt={item.title}
                                loading="lazy"
                              />
                            </div>
                            <div className="ni-ynvdgs">
                              <div className="title-container ni-1ywwwb0">
                                <h3 className="ni-9j1xd0">{item.description}</h3>
                              </div>
                              <div className="ni-fe08nx">
                                <div className="ni-v4euzz">
                                  <div className="ni-iyx4d6">{item.date}</div>
                                </div>
                              </div>
                              <a href={item.href} className="trending-item-cta ni-wmrss8">
                                <span className="ni-l9fgq9">View {item.title}</span>
                                <ArrowIcon />
                              </a>
                            </div>
                          </div>

                          {item.articles.length > 0 && (
                            <div className="ni-o0rong">
                              {item.articles.map((article, idx) => (
                                <a
                                  key={idx}
                                  href={article.href}
                                  data-testid="article-related-item"
                                  className="ni-9bmami"
                                >
                                  <div className="ni-1cftoo9 ni-kpk6ds">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={article.image}
                                      alt={article.title}
                                      loading="lazy"
                                      className="ni-1c6l3oy"
                                    />
                                  </div>
                                  <div className="ni-1vynbg8">
                                    <div className="ni-1tx4gn1">
                                      <h4 className="related-item-title ni-t4efze">{article.title}</h4>
                                    </div>
                                    <div className="ni-fe08nx">
                                      <div className="ni-85wzae">
                                        <div className="ni-b4eudn">{article.author}</div>
                                        <div className="ni-jzm02b"></div>
                                        <div className="ni-iyx4d6">{article.date}</div>
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
