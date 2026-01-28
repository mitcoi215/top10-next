import { ReactNode } from 'react';

interface IntroContentProps {
  content: string;
  children?: ReactNode;
  sidebar?: ReactNode;
}

export default function IntroContent({ content, children, sidebar }: IntroContentProps) {
  return (
    <div className="charticle">
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
          <div className="toc" data-role="toc" data-page-type="charticle">
            <span className="toc__title">Jump to:</span>
            <div className="toc__items-container">
              <ul className="toc__items" data-role="toc-items"></ul>
            </div>
          </div>
        </aside>
        <section className="charticle__center charticle__center--show-more-container">
          <section className="show-more__container">
            <div className="show-more__wrapper">
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
