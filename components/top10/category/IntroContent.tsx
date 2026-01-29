'use client';

import { ReactNode, useEffect, useState, useRef } from 'react';

interface TocItem {
  position: number;
  name: string;
}

interface IntroContentProps {
  content: string;
  children?: ReactNode;
  sidebar?: ReactNode;
  tocItems?: TocItem[];
}

export default function IntroContent({ content, children, sidebar, tocItems = [] }: IntroContentProps) {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const tocItemsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tocItems.length === 0) return;

    const handleScroll = () => {
      // Track active mini-review item
      const miniReviewItems = document.querySelectorAll('[data-mini-review-position]');
      let currentActive = -1;

      miniReviewItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const position = parseInt(item.getAttribute('data-mini-review-position') || '0', 10);

        // Item is in viewport (top is above middle of screen)
        if (rect.top <= window.innerHeight / 2) {
          currentActive = position;
        }
      });

      setActiveIndex(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [tocItems]);

  // Scroll TOC list to show active item
  useEffect(() => {
    if (activeIndex > 0 && tocItemsContainerRef.current) {
      const activeElement = tocItemsContainerRef.current.querySelector('.toc__item--active');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeIndex]);

  const scrollToItem = (position: number) => {
    const element = document.querySelector(`[data-mini-review-position="${position}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="charticle" suppressHydrationWarning>
      <style jsx global>{`
        .toc__items-container::-webkit-scrollbar {
          display: none;
        }
        @media screen and (min-width: 768px) {
          .charticle__left {
            position: sticky;
            top: 10px;
            align-self: flex-start;
          }
        }
      `}</style>
      <section className="charticle__top">
        <aside className="charticle__left">
          <ul className="social-share">
            <li className="btn-facebook social-share__button" data-name="social-share-buttons" data-role-id="facebookShare">
              <svg className="social-share__icon">
                <use xlinkHref="#facebook" />
              </svg>
            </li>
            <li className="btn-twitter social-share__button" data-name="social-share-buttons" data-role-id="twitterShare">
              <svg className="social-share__icon">
                <use xlinkHref="#twitter" />
              </svg>
            </li>
          </ul>
          <div
            className="toc"
            data-role="toc"
            data-page-type="charticle"
          >
            <span className="toc__title">Jump to:</span>
            <div
              ref={tocItemsContainerRef}
              className="toc__items-container"
              style={{ overflow: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
            >
              <ul className="toc__items" data-role="toc-items">
                {tocItems.map((item) => (
                  <li
                    key={item.position}
                    className={`toc__item${activeIndex === item.position ? ' toc__item--active' : ''}`}
                  >
                    <a onClick={() => scrollToItem(item.position)}>
                      {item.position}. {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
        <section className="charticle__center charticle__center--show-more-container">
          <section className="show-more__container">
            <div className="show-more__wrapper show-more__active">
              <div className="show-more__content">
                <section data-role="wysiwyg">
                  <div
                    className="charticle__wysiwyg"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </section>
              </div>
            </div>
          </section>
          {/* Additional content (BestOfList, ProductCards, FAQ) goes here */}
          {children}
        </section>
      </section>
      {/* Sidebar */}
      {sidebar}
    </div>
  );
}
