'use client';

import { ExpertsBlock, AuthorOption } from './types';

interface ExpertsBlockEditorProps {
  block: ExpertsBlock;
  onChange: (block: ExpertsBlock) => void;
  onDelete: () => void;
  authors: AuthorOption[];
}

export default function ExpertsBlockEditor({
  block,
  onChange,
  onDelete,
  authors,
}: ExpertsBlockEditorProps) {
  const updateData = (updates: Partial<ExpertsBlock['data']>) => {
    onChange({
      ...block,
      data: { ...block.data, ...updates },
    });
  };

  const toggleAuthor = (authorId: string) => {
    const currentIds = block.data.authorIds;
    if (currentIds.includes(authorId)) {
      updateData({ authorIds: currentIds.filter((id) => id !== authorId) });
    } else {
      updateData({ authorIds: [...currentIds, authorId] });
    }
  };

  const removeAuthor = (authorId: string) => {
    updateData({ authorIds: block.data.authorIds.filter((id) => id !== authorId) });
  };

  const moveAuthor = (index: number, direction: 'up' | 'down') => {
    const newIds = [...block.data.authorIds];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newIds.length) return;
    [newIds[index], newIds[newIndex]] = [newIds[newIndex], newIds[index]];
    updateData({ authorIds: newIds });
  };

  const selectedAuthors = block.data.authorIds
    .map((id) => authors.find((a) => a.id === id))
    .filter(Boolean) as AuthorOption[];

  const availableAuthors = authors.filter((a) => !block.data.authorIds.includes(a.id));

  return (
    <div className="block-editor experts-block">
      <div className="block-header">
        <div className="block-type">
          <span className="block-icon">👥</span>
          <span>Experts Section</span>
        </div>
        <button type="button" className="btn-delete" onClick={onDelete} title="Delete block">
          ×
        </button>
      </div>

      <div className="block-content">
        {/* Title Configuration */}
        <div className="header-fields">
          <div className="title-preview">
            <span className="preview-label">Preview:</span>
            <span className="preview-title">
              {block.data.titlePrefix || 'Our'}{' '}
              <span className="highlight">{block.data.highlightWord || 'Hosting'}</span>{' '}
              {block.data.titleSuffix || 'Experts'}
            </span>
          </div>
          <div className="form-row title-fields">
            <div className="form-group">
              <label>Prefix</label>
              <input
                type="text"
                value={block.data.titlePrefix || ''}
                onChange={(e) => updateData({ titlePrefix: e.target.value })}
                placeholder="Our"
              />
            </div>
            <div className="form-group highlight-field">
              <label>Highlight Word <span className="color-indicator">(#FF4A64)</span></label>
              <input
                type="text"
                value={block.data.highlightWord || ''}
                onChange={(e) => updateData({ highlightWord: e.target.value })}
                placeholder="Hosting"
                className="highlight-input"
              />
            </div>
            <div className="form-group">
              <label>Suffix</label>
              <input
                type="text"
                value={block.data.titleSuffix || ''}
                onChange={(e) => updateData({ titleSuffix: e.target.value })}
                placeholder="Experts"
              />
            </div>
            <div className="form-group">
              <label>Background</label>
              <input
                type="color"
                value={block.data.backgroundColor || '#f5f5f5'}
                onChange={(e) => updateData({ backgroundColor: e.target.value })}
                className="color-input"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Description (optional)</label>
            <textarea
              value={block.data.description || ''}
              onChange={(e) => updateData({ description: e.target.value })}
              placeholder="Brief description about your expert team..."
              rows={2}
            />
          </div>
        </div>

        {/* Selected Authors */}
        <div className="section">
          <h4>Selected Experts ({selectedAuthors.length})</h4>
          {selectedAuthors.length === 0 ? (
            <div className="empty-state">No experts selected. Choose from the list below.</div>
          ) : (
            <div className="selected-authors">
              {selectedAuthors.map((author, index) => (
                <div key={author.id} className="author-card selected">
                  <div className="author-avatar">
                    {author.avatar ? (
                      <img src={author.avatar} alt={author.name} />
                    ) : (
                      <div className="avatar-placeholder">{author.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="author-info">
                    <div className="author-name">{author.name}</div>
                    <div className="author-title">{author.title || 'Expert'}</div>
                  </div>
                  <div className="author-actions">
                    <button
                      type="button"
                      className="btn-move"
                      onClick={() => moveAuthor(index, 'up')}
                      disabled={index === 0}
                      title="Move up"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      className="btn-move"
                      onClick={() => moveAuthor(index, 'down')}
                      disabled={index === selectedAuthors.length - 1}
                      title="Move down"
                    >
                      →
                    </button>
                    <button
                      type="button"
                      className="btn-remove-small"
                      onClick={() => removeAuthor(author.id)}
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Authors */}
        <div className="section">
          <h4>Available Authors ({availableAuthors.length})</h4>
          {availableAuthors.length === 0 ? (
            <div className="empty-state">All authors are selected.</div>
          ) : (
            <div className="available-authors">
              {availableAuthors.map((author) => (
                <div
                  key={author.id}
                  className="author-card available"
                  onClick={() => toggleAuthor(author.id)}
                >
                  <div className="author-avatar">
                    {author.avatar ? (
                      <img src={author.avatar} alt={author.name} />
                    ) : (
                      <div className="avatar-placeholder">{author.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="author-info">
                    <div className="author-name">{author.name}</div>
                    <div className="author-title">{author.title || 'Expert'}</div>
                  </div>
                  <div className="add-icon">+</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .block-editor {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          overflow: hidden;
        }

        .block-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #fef3c7;
          border-bottom: 1px solid #fcd34d;
        }

        .block-type {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          color: #92400e;
        }

        .block-icon {
          font-size: 18px;
        }

        .btn-delete {
          width: 28px;
          height: 28px;
          border: none;
          background: #fee2e2;
          color: #dc2626;
          border-radius: 6px;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-delete:hover {
          background: #fecaca;
        }

        .block-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .header-fields {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .title-preview {
          padding: 12px 16px;
          background: #f9fafb;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .preview-label {
          font-size: 12px;
          color: #6b7280;
          flex-shrink: 0;
        }

        .preview-title {
          font-size: 20px;
          font-weight: 700;
        }

        .preview-title .highlight {
          color: #FF4A64;
        }

        .form-row {
          display: flex;
          gap: 12px;
          align-items: flex-end;
        }

        .title-fields {
          flex-wrap: wrap;
        }

        .title-fields .form-group {
          flex: 1;
          min-width: 100px;
        }

        .highlight-field {
          flex: 1.5 !important;
        }

        .highlight-input {
          border-color: #FF4A64 !important;
        }

        .color-indicator {
          color: #FF4A64;
          font-weight: normal;
          font-size: 11px;
        }

        .flex-1 {
          flex: 1;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        label {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }

        input, textarea {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }

        .color-input {
          width: 50px;
          height: 38px;
          padding: 4px;
          cursor: pointer;
        }

        textarea {
          resize: vertical;
        }

        .section {
          border-top: 1px solid #e5e7eb;
          padding-top: 16px;
        }

        .section h4 {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 12px 0;
        }

        .empty-state {
          padding: 16px;
          text-align: center;
          color: #9ca3af;
          font-size: 14px;
          background: #f9fafb;
          border-radius: 6px;
        }

        .selected-authors, .available-authors {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .author-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          min-width: 250px;
        }

        .author-card.available {
          cursor: pointer;
          transition: all 0.2s;
        }

        .author-card.available:hover {
          border-color: #f59e0b;
          background: #fffbeb;
        }

        .author-avatar {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .author-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          background: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 600;
          color: #6b7280;
        }

        .author-info {
          flex: 1;
          min-width: 0;
        }

        .author-name {
          font-weight: 500;
          color: #1f2937;
          font-size: 14px;
        }

        .author-title {
          font-size: 12px;
          color: #6b7280;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .author-actions {
          display: flex;
          gap: 4px;
        }

        .btn-move {
          width: 28px;
          height: 28px;
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-move:hover:not(:disabled) {
          background: #f3f4f6;
        }

        .btn-move:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .btn-remove-small {
          width: 28px;
          height: 28px;
          border: none;
          background: #fee2e2;
          color: #dc2626;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .btn-remove-small:hover {
          background: #fecaca;
        }

        .add-icon {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          color: #6b7280;
          border-radius: 50%;
          font-size: 18px;
          font-weight: bold;
        }

        .author-card.available:hover .add-icon {
          background: #f59e0b;
          color: white;
        }
      `}</style>
    </div>
  );
}
