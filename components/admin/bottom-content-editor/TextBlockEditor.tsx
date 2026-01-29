'use client';

import { TextBlock } from './types';
import dynamic from 'next/dynamic';

const HtmlRichTextEditor = dynamic(() => import('../HtmlRichTextEditor'), {
  ssr: false,
  loading: () => <div className="p-4 bg-gray-50 text-gray-500">Loading editor...</div>,
});

interface TextBlockEditorProps {
  block: TextBlock;
  onChange: (block: TextBlock) => void;
  onDelete: () => void;
}

export default function TextBlockEditor({ block, onChange, onDelete }: TextBlockEditorProps) {
  const updateData = (updates: Partial<TextBlock['data']>) => {
    onChange({
      ...block,
      data: { ...block.data, ...updates },
    });
  };

  return (
    <div className="block-editor text-block">
      <div className="block-header">
        <div className="block-type">
          <span className="block-icon">📝</span>
          <span>Text Block</span>
        </div>
        <button type="button" className="btn-delete" onClick={onDelete} title="Delete block">
          ×
        </button>
      </div>

      <div className="block-content">
        <div className="form-group">
          <label>Title (optional)</label>
          <input
            type="text"
            value={block.data.title || ''}
            onChange={(e) => updateData({ title: e.target.value })}
            placeholder="Section title..."
          />
        </div>

        <div className="form-group">
          <label>Content</label>
          <HtmlRichTextEditor
            value={block.data.content}
            onChange={(content) => updateData({ content })}
            placeholder="Write your content here..."
            minHeight="150px"
          />
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
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .block-type {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          color: #374151;
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
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        input {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }

        input:focus {
          outline: none;
          border-color: #FE4A64;
          box-shadow: 0 0 0 3px rgba(254, 74, 100, 0.1);
        }
      `}</style>
    </div>
  );
}
