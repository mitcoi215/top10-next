'use client';

import { useState, useCallback } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Simple Rich Text Editor with toolbar
// For production, consider replacing with TipTap or Slate
export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [mode, setMode] = useState<'visual' | 'html'>('visual');

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    // Get updated content from contenteditable
    const editor = document.getElementById('rich-editor');
    if (editor) {
      onChange(editor.innerHTML);
    }
  }, [onChange]);

  const insertHeading = (level: number) => {
    execCommand('formatBlock', `h${level}`);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    onChange(e.currentTarget.innerHTML);
  };

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="rich-text-editor">
      {/* Toolbar */}
      <div className="editor-toolbar">
        <div className="toolbar-group">
          <button type="button" onClick={() => execCommand('bold')} title="Bold">
            <strong>B</strong>
          </button>
          <button type="button" onClick={() => execCommand('italic')} title="Italic">
            <em>I</em>
          </button>
          <button type="button" onClick={() => execCommand('underline')} title="Underline">
            <u>U</u>
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button type="button" onClick={() => insertHeading(2)} title="Heading 2">
            H2
          </button>
          <button type="button" onClick={() => insertHeading(3)} title="Heading 3">
            H3
          </button>
          <button type="button" onClick={() => execCommand('formatBlock', 'p')} title="Paragraph">
            P
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button type="button" onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
            <span style={{ fontSize: '12px' }}>&#8226; List</span>
          </button>
          <button type="button" onClick={() => execCommand('insertOrderedList')} title="Numbered List">
            <span style={{ fontSize: '12px' }}>1. List</span>
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button type="button" onClick={insertLink} title="Insert Link">
            Link
          </button>
          <button type="button" onClick={insertImage} title="Insert Image">
            Image
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button type="button" onClick={() => execCommand('removeFormat')} title="Clear Formatting">
            Clear
          </button>
        </div>

        <div className="toolbar-spacer" />

        <div className="toolbar-group mode-toggle">
          <button
            type="button"
            className={mode === 'visual' ? 'active' : ''}
            onClick={() => setMode('visual')}
          >
            Visual
          </button>
          <button
            type="button"
            className={mode === 'html' ? 'active' : ''}
            onClick={() => setMode('html')}
          >
            HTML
          </button>
        </div>
      </div>

      {/* Editor Content */}
      {mode === 'visual' ? (
        <div
          id="rich-editor"
          className="editor-content"
          contentEditable
          onInput={handleEditorInput}
          dangerouslySetInnerHTML={{ __html: value }}
          data-placeholder={placeholder || 'Start writing...'}
        />
      ) : (
        <textarea
          className="html-editor"
          value={value}
          onChange={handleHtmlChange}
          placeholder={placeholder || 'Enter HTML...'}
        />
      )}

      <style jsx>{`
        .rich-text-editor {
          border: 1px solid #d1d5db;
          border-radius: 8px;
          overflow: hidden;
        }

        .editor-toolbar {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 12px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          flex-wrap: wrap;
        }

        .toolbar-group {
          display: flex;
          gap: 2px;
        }

        .toolbar-group button {
          padding: 6px 10px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 32px;
        }

        .toolbar-group button:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .toolbar-group button:active {
          background: #e5e7eb;
        }

        .toolbar-divider {
          width: 1px;
          height: 24px;
          background: #e5e7eb;
          margin: 0 8px;
        }

        .toolbar-spacer {
          flex: 1;
        }

        .mode-toggle button {
          border-radius: 0;
        }

        .mode-toggle button:first-child {
          border-radius: 4px 0 0 4px;
        }

        .mode-toggle button:last-child {
          border-radius: 0 4px 4px 0;
          border-left: none;
        }

        .mode-toggle button.active {
          background: #FE4A64;
          color: white;
          border-color: #FE4A64;
        }

        .editor-content {
          min-height: 400px;
          padding: 16px;
          font-size: 15px;
          line-height: 1.7;
          outline: none;
        }

        .editor-content:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
        }

        .editor-content h2 {
          font-size: 24px;
          font-weight: 700;
          margin: 24px 0 12px 0;
          color: #1a1a1a;
        }

        .editor-content h3 {
          font-size: 20px;
          font-weight: 600;
          margin: 20px 0 10px 0;
          color: #1a1a1a;
        }

        .editor-content p {
          margin: 0 0 16px 0;
        }

        .editor-content ul, .editor-content ol {
          margin: 0 0 16px 0;
          padding-left: 24px;
        }

        .editor-content li {
          margin-bottom: 8px;
        }

        .editor-content a {
          color: #FE4A64;
          text-decoration: underline;
        }

        .editor-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 16px 0;
        }

        .html-editor {
          width: 100%;
          min-height: 400px;
          padding: 16px;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 13px;
          line-height: 1.6;
          border: none;
          outline: none;
          resize: vertical;
        }

        @media (max-width: 768px) {
          .toolbar-divider {
            display: none;
          }

          .editor-toolbar {
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}
