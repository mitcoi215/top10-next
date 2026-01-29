'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ContentBlock,
  AuthorOption,
  createTextBlock,
  createComparisonTableBlock,
  createExpertsBlock,
} from './types';
import TextBlockEditor from './TextBlockEditor';
import ComparisonTableBlockEditor from './ComparisonTableBlockEditor';
import ExpertsBlockEditor from './ExpertsBlockEditor';

interface BottomContentEditorProps {
  value: string; // JSON string of blocks
  onChange: (value: string) => void;
  authors: AuthorOption[];
}

// Helper to parse blocks from value
function parseBlocks(value: string): ContentBlock[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // If not valid JSON, it might be legacy HTML - ignore
  }
  return [];
}

export default function BottomContentEditor({
  value,
  onChange,
  authors,
}: BottomContentEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(() => parseBlocks(value));
  const [showAddMenu, setShowAddMenu] = useState(false);
  const lastValueRef = useRef(value);

  // Sync when value prop changes from outside (e.g., form reset, initial load)
  useEffect(() => {
    // Only update if value changed externally (not from our own onChange)
    if (value !== lastValueRef.current) {
      const newBlocks = parseBlocks(value);
      setBlocks(newBlocks);
      lastValueRef.current = value;
    }
  }, [value]);

  // Sync changes back to parent
  const syncChanges = useCallback((newBlocks: ContentBlock[]) => {
    setBlocks(newBlocks);
    onChange(JSON.stringify(newBlocks));
  }, [onChange]);

  const addBlock = (type: 'text' | 'comparison-table' | 'experts') => {
    let newBlock: ContentBlock;
    switch (type) {
      case 'text':
        newBlock = createTextBlock();
        break;
      case 'comparison-table':
        newBlock = createComparisonTableBlock();
        break;
      case 'experts':
        newBlock = createExpertsBlock();
        break;
    }
    syncChanges([...blocks, newBlock]);
    setShowAddMenu(false);
  };

  const updateBlock = (index: number, updatedBlock: ContentBlock) => {
    const newBlocks = [...blocks];
    newBlocks[index] = updatedBlock;
    syncChanges(newBlocks);
  };

  const deleteBlock = (index: number) => {
    if (confirm('Are you sure you want to delete this block?')) {
      syncChanges(blocks.filter((_, i) => i !== index));
    }
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newBlocks.length) return;
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    syncChanges(newBlocks);
  };

  return (
    <div className="bottom-content-editor">
      {/* Blocks List */}
      <div className="blocks-list">
        {blocks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <p>No content blocks yet</p>
            <p className="empty-hint">Add blocks to build your content section</p>
          </div>
        ) : (
          blocks.map((block, index) => (
            <div key={block.id} className="block-wrapper">
              {/* Block Controls */}
              <div className="block-controls">
                <button
                  type="button"
                  className="btn-move"
                  onClick={() => moveBlock(index, 'up')}
                  disabled={index === 0}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="btn-move"
                  onClick={() => moveBlock(index, 'down')}
                  disabled={index === blocks.length - 1}
                  title="Move down"
                >
                  ↓
                </button>
              </div>

              {/* Block Editor */}
              {block.type === 'text' && (
                <TextBlockEditor
                  block={block}
                  onChange={(b) => updateBlock(index, b)}
                  onDelete={() => deleteBlock(index)}
                />
              )}
              {block.type === 'comparison-table' && (
                <ComparisonTableBlockEditor
                  block={block}
                  onChange={(b) => updateBlock(index, b)}
                  onDelete={() => deleteBlock(index)}
                />
              )}
              {block.type === 'experts' && (
                <ExpertsBlockEditor
                  block={block}
                  onChange={(b) => updateBlock(index, b)}
                  onDelete={() => deleteBlock(index)}
                  authors={authors}
                />
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Block Button */}
      <div className="add-block-container">
        {showAddMenu ? (
          <div className="add-menu">
            <div className="add-menu-header">
              <span>Add Block</span>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowAddMenu(false)}
              >
                ×
              </button>
            </div>
            <div className="add-menu-options">
              <button
                type="button"
                className="add-option"
                onClick={() => addBlock('text')}
              >
                <span className="option-icon">📝</span>
                <div className="option-info">
                  <span className="option-title">Text Block</span>
                  <span className="option-desc">Rich text content with formatting</span>
                </div>
              </button>
              <button
                type="button"
                className="add-option"
                onClick={() => addBlock('comparison-table')}
              >
                <span className="option-icon">📊</span>
                <div className="option-info">
                  <span className="option-title">Comparison Table</span>
                  <span className="option-desc">Compare providers side by side</span>
                </div>
              </button>
              <button
                type="button"
                className="add-option"
                onClick={() => addBlock('experts')}
              >
                <span className="option-icon">👥</span>
                <div className="option-info">
                  <span className="option-title">Experts Section</span>
                  <span className="option-desc">Display team of experts</span>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="btn-add-block"
            onClick={() => setShowAddMenu(true)}
          >
            + Add Content Block
          </button>
        )}
      </div>

      <style jsx>{`
        .bottom-content-editor {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .blocks-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .empty-state {
          padding: 48px 24px;
          text-align: center;
          background: #f9fafb;
          border: 2px dashed #e5e7eb;
          border-radius: 12px;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 12px;
        }

        .empty-state p {
          margin: 0;
          color: #6b7280;
        }

        .empty-hint {
          font-size: 14px;
          margin-top: 4px !important;
        }

        .block-wrapper {
          display: flex;
          gap: 8px;
        }

        .block-controls {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-top: 12px;
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
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-move:hover:not(:disabled) {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .btn-move:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .block-wrapper > :global(.block-editor) {
          flex: 1;
        }

        .add-block-container {
          margin-top: 8px;
        }

        .btn-add-block {
          width: 100%;
          padding: 16px;
          background: white;
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          color: #6b7280;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-add-block:hover {
          background: #f9fafb;
          border-color: #FE4A64;
          color: #FE4A64;
        }

        .add-menu {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: white;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .add-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          font-weight: 600;
          color: #374151;
        }

        .btn-close {
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          color: #6b7280;
          font-size: 20px;
          cursor: pointer;
          border-radius: 4px;
        }

        .btn-close:hover {
          background: #e5e7eb;
        }

        .add-menu-options {
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .add-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          transition: background 0.2s;
        }

        .add-option:hover {
          background: #f3f4f6;
        }

        .option-icon {
          font-size: 24px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          border-radius: 8px;
        }

        .option-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .option-title {
          font-weight: 500;
          color: #1f2937;
          font-size: 14px;
        }

        .option-desc {
          font-size: 12px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}
