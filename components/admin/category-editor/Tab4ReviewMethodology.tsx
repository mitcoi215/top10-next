'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { CategoryFormData, ArticleOption } from './types';

interface Tab4Props {
  articles: ArticleOption[];
}

export default function Tab4ReviewMethodology({ articles }: Tab4Props) {
  const { register, control, watch, setValue } = useFormContext<CategoryFormData>();

  const {
    fields: thingsFields,
    append: appendThing,
    remove: removeThing,
  } = useFieldArray({
    control,
    name: 'tenThingsToKnow',
  });

  const {
    fields: criteriaFields,
    append: appendCriterion,
    remove: removeCriterion,
  } = useFieldArray({
    control,
    name: 'methodologyCriteria',
  });

  const {
    fields: exploreFields,
    append: appendExplore,
    remove: removeExplore,
  } = useFieldArray({
    control,
    name: 'exploreCards',
  });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control,
    name: 'faqs',
  });

  const mustReadArticleIds = watch('mustReadArticleIds') || [];

  const toggleArticle = (articleId: string) => {
    if (mustReadArticleIds.includes(articleId)) {
      setValue('mustReadArticleIds', mustReadArticleIds.filter(id => id !== articleId), { shouldDirty: true });
    } else {
      setValue('mustReadArticleIds', [...mustReadArticleIds, articleId], { shouldDirty: true });
    }
  };

  return (
    <div className="tab-review-methodology">
      {/* Review List Section */}
      <div className="section">
        <h2 className="section-title">Review List Page Content</h2>
        <p className="section-desc">Content for the category review list/comparison page</p>

        <div className="form-grid">
          {/* Review List Hero Image */}
          <div className="form-group full-width">
            <label htmlFor="reviewListHeroImage">
              Review List Hero Image
              <span className="tooltip" title="Hero image for the review list page">?</span>
            </label>
            <input
              id="reviewListHeroImage"
              type="text"
              {...register('reviewListHeroImage')}
              placeholder="/images/categories/tv-services-reviews.jpg"
            />
          </div>

          {/* Review List Intro */}
          <div className="form-group full-width">
            <label htmlFor="reviewListIntro">
              Review List Introduction
              <span className="tooltip" title="Rich text intro for the review list page">?</span>
            </label>
            <textarea
              id="reviewListIntro"
              {...register('reviewListIntro')}
              placeholder="Enter HTML content for the review list introduction..."
              rows={5}
            />
            <div className="hint">Supports HTML. Appears at the top of the review list page.</div>
          </div>
        </div>
      </div>

      {/* Ten Things to Know */}
      <div className="section">
        <h2 className="section-title">10 Things to Know</h2>
        <p className="section-desc">Quick facts displayed on the category page</p>

        <div className="dynamic-list">
          {thingsFields.map((field, index) => (
            <div key={field.id} className="dynamic-item">
              <span className="item-number">{index + 1}</span>
              <div className="item-content">
                <input
                  type="text"
                  {...register(`tenThingsToKnow.${index}.title` as const)}
                  placeholder="Title"
                  className="input-title"
                />
                <textarea
                  {...register(`tenThingsToKnow.${index}.description` as const)}
                  placeholder="Description..."
                  rows={2}
                />
              </div>
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeThing(index)}
              >
                x
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn-add"
            onClick={() => appendThing({ title: '', description: '' })}
          >
            + Add Thing to Know
          </button>
        </div>
      </div>

      {/* Must Read Articles */}
      <div className="section">
        <h2 className="section-title">Must-Read Articles</h2>
        <p className="section-desc">Select articles to feature in the must-read section</p>

        <div className="articles-selector">
          {articles.length === 0 ? (
            <div className="empty-state">No articles available.</div>
          ) : (
            <div className="articles-grid">
              {articles.map((article) => (
                <label key={article.id} className="article-checkbox">
                  <input
                    type="checkbox"
                    checked={mustReadArticleIds.includes(article.id)}
                    onChange={() => toggleArticle(article.id)}
                  />
                  <span className="article-info">
                    <span className="article-title">{article.title}</span>
                    <span className="article-slug">/{article.slug}</span>
                  </span>
                </label>
              ))}
            </div>
          )}
          <div className="selected-count">
            {mustReadArticleIds.length} article(s) selected
          </div>
        </div>
      </div>

      {/* Methodology Section */}
      <div className="section">
        <h2 className="section-title">Methodology</h2>
        <p className="section-desc">Explain how products are evaluated</p>

        <div className="form-group full-width mb-20">
          <label htmlFor="methodologyIntro">
            Methodology Introduction
            <span className="tooltip" title="Intro text for methodology section">?</span>
          </label>
          <textarea
            id="methodologyIntro"
            {...register('methodologyIntro')}
            placeholder="Explain your evaluation process..."
            rows={4}
          />
        </div>

        <h3 className="subsection-title">Evaluation Criteria</h3>
        <div className="dynamic-list">
          {criteriaFields.map((field, index) => (
            <div key={field.id} className="dynamic-item">
              <div className="item-content">
                <input
                  type="text"
                  {...register(`methodologyCriteria.${index}.title` as const)}
                  placeholder="Criterion title"
                  className="input-title"
                />
                <textarea
                  {...register(`methodologyCriteria.${index}.description` as const)}
                  placeholder="Describe how this criterion is evaluated..."
                  rows={2}
                />
              </div>
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeCriterion(index)}
              >
                x
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn-add"
            onClick={() => appendCriterion({ title: '', description: '' })}
          >
            + Add Evaluation Criterion
          </button>
        </div>
      </div>

      {/* Explore Cards */}
      <div className="section">
        <h2 className="section-title">Explore More Cards</h2>
        <p className="section-desc">Related content cards at the bottom of the page</p>

        <div className="dynamic-list explore-list">
          {exploreFields.map((field, index) => (
            <div key={field.id} className="explore-item">
              <div className="explore-content">
                <input
                  type="text"
                  {...register(`exploreCards.${index}.title` as const)}
                  placeholder="Card title"
                />
                <input
                  type="text"
                  {...register(`exploreCards.${index}.href` as const)}
                  placeholder="Link URL (e.g., /articles/guide)"
                />
                <input
                  type="text"
                  {...register(`exploreCards.${index}.image` as const)}
                  placeholder="Image URL"
                />
              </div>
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeExplore(index)}
              >
                x
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn-add"
            onClick={() => appendExplore({ title: '', href: '', image: '' })}
          >
            + Add Explore Card
          </button>
        </div>
      </div>

      {/* FAQs */}
      <div className="section">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-desc">Category-level FAQ section</p>

        <div className="dynamic-list">
          {faqFields.map((field, index) => (
            <div key={field.id} className="dynamic-item faq-item">
              <div className="item-content">
                <input
                  type="text"
                  {...register(`faqs.${index}.question` as const)}
                  placeholder="Question"
                  className="input-title"
                />
                <textarea
                  {...register(`faqs.${index}.answer` as const)}
                  placeholder="Answer (supports HTML)"
                  rows={3}
                />
              </div>
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeFaq(index)}
              >
                x
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn-add"
            onClick={() => appendFaq({ question: '', answer: '' })}
          >
            + Add FAQ
          </button>
        </div>
      </div>

      <style jsx>{`
        .tab-review-methodology {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .section {
          padding-bottom: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .section:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 4px 0;
        }

        .section-desc {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 20px 0;
        }

        .subsection-title {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin: 20px 0 12px 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .mb-20 {
          margin-bottom: 20px;
        }

        label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .tooltip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          background: #e5e7eb;
          border-radius: 50%;
          font-size: 10px;
          color: #6b7280;
          cursor: help;
          margin-left: 4px;
        }

        input, textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: #FE4A64;
          box-shadow: 0 0 0 3px rgba(254, 74, 100, 0.1);
        }

        textarea {
          resize: vertical;
          font-family: inherit;
        }

        .hint {
          font-size: 12px;
          color: #9ca3af;
        }

        .dynamic-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .dynamic-item {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          align-items: flex-start;
        }

        .item-number {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FE4A64;
          color: white;
          font-weight: 600;
          font-size: 13px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .item-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-title {
          font-weight: 500;
        }

        .btn-remove {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: #fee2e2;
          color: #dc2626;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.2s;
        }

        .btn-remove:hover {
          background: #fecaca;
        }

        .btn-add {
          padding: 12px 16px;
          background: white;
          border: 1px dashed #d1d5db;
          border-radius: 8px;
          color: #6b7280;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-add:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
          color: #374151;
        }

        .articles-selector {
          background: #f9fafb;
          border-radius: 8px;
          padding: 16px;
        }

        .empty-state {
          padding: 24px;
          text-align: center;
          color: #9ca3af;
          font-size: 14px;
        }

        .articles-grid {
          display: grid;
          gap: 8px;
          max-height: 300px;
          overflow-y: auto;
        }

        .article-checkbox {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .article-checkbox:hover {
          background: #f3f4f6;
        }

        .article-checkbox input[type="checkbox"] {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        .article-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .article-title {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .article-slug {
          font-size: 12px;
          color: #9ca3af;
        }

        .selected-count {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
          font-size: 13px;
          color: #6b7280;
        }

        .explore-list .explore-item {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .explore-content {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
        }

        .faq-item .item-content textarea {
          min-height: 80px;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .explore-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
