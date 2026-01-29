'use client';

import { ComparisonTableBlock, TableColumn, TableRow } from './types';
import { useState } from 'react';

interface ComparisonTableBlockEditorProps {
  block: ComparisonTableBlock;
  onChange: (block: ComparisonTableBlock) => void;
  onDelete: () => void;
}

export default function ComparisonTableBlockEditor({
  block,
  onChange,
  onDelete,
}: ComparisonTableBlockEditorProps) {
  const [activeTab, setActiveTab] = useState<'columns' | 'data'>('data');

  const updateData = (updates: Partial<ComparisonTableBlock['data']>) => {
    onChange({
      ...block,
      data: { ...block.data, ...updates },
    });
  };

  // Column management
  const addColumn = () => {
    const key = `col_${Date.now()}`;
    updateData({
      columns: [...block.data.columns, { key, label: 'New Column' }],
    });
  };

  const updateColumn = (index: number, updates: Partial<TableColumn>) => {
    const newColumns = [...block.data.columns];
    newColumns[index] = { ...newColumns[index], ...updates };
    updateData({ columns: newColumns });
  };

  const removeColumn = (index: number) => {
    const columnKey = block.data.columns[index].key;
    const newColumns = block.data.columns.filter((_, i) => i !== index);
    // Also remove this column's data from all rows
    const newRows = block.data.rows.map((row) => {
      const newValues = { ...row.values };
      delete newValues[columnKey];
      return { ...row, values: newValues };
    });
    updateData({ columns: newColumns, rows: newRows });
  };

  // Row management
  const addRow = () => {
    const values: Record<string, string> = {};
    block.data.columns.forEach((col) => {
      values[col.key] = '';
    });
    updateData({
      rows: [...block.data.rows, { provider: '', values }],
    });
  };

  const updateRow = (index: number, updates: Partial<TableRow>) => {
    const newRows = [...block.data.rows];
    newRows[index] = { ...newRows[index], ...updates };
    updateData({ rows: newRows });
  };

  const updateRowValue = (rowIndex: number, columnKey: string, value: string) => {
    const newRows = [...block.data.rows];
    newRows[rowIndex] = {
      ...newRows[rowIndex],
      values: { ...newRows[rowIndex].values, [columnKey]: value },
    };
    updateData({ rows: newRows });
  };

  const removeRow = (index: number) => {
    updateData({
      rows: block.data.rows.filter((_, i) => i !== index),
    });
  };

  const moveRow = (index: number, direction: 'up' | 'down') => {
    const newRows = [...block.data.rows];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newRows.length) return;
    [newRows[index], newRows[newIndex]] = [newRows[newIndex], newRows[index]];
    updateData({ rows: newRows });
  };

  return (
    <div className="block-editor comparison-table-block">
      <div className="block-header">
        <div className="block-type">
          <span className="block-icon">📊</span>
          <span>Comparison Table</span>
        </div>
        <button type="button" className="btn-delete" onClick={onDelete} title="Delete block">
          ×
        </button>
      </div>

      <div className="block-content">
        {/* Title & Description */}
        <div className="header-fields">
          <div className="form-group">
            <label>Table Title</label>
            <input
              type="text"
              value={block.data.title || ''}
              onChange={(e) => updateData({ title: e.target.value })}
              placeholder="How to Compare the Best Services"
            />
          </div>
          <div className="form-group">
            <label>Description (optional)</label>
            <textarea
              value={block.data.description || ''}
              onChange={(e) => updateData({ description: e.target.value })}
              placeholder="Brief description about the comparison..."
              rows={2}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            type="button"
            className={`tab ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => setActiveTab('data')}
          >
            Table Data ({block.data.rows.length} rows)
          </button>
          <button
            type="button"
            className={`tab ${activeTab === 'columns' ? 'active' : ''}`}
            onClick={() => setActiveTab('columns')}
          >
            Columns ({block.data.columns.length})
          </button>
        </div>

        {/* Columns Tab */}
        {activeTab === 'columns' && (
          <div className="columns-editor">
            <p className="help-text">Define the columns for your comparison table. The first column "Provider" is fixed.</p>
            <div className="columns-list">
              {block.data.columns.map((col, index) => (
                <div key={col.key} className="column-item">
                  <input
                    type="text"
                    value={col.label}
                    onChange={(e) => updateColumn(index, { label: e.target.value })}
                    placeholder="Column label"
                  />
                  <button
                    type="button"
                    className="btn-remove-small"
                    onClick={() => removeColumn(index)}
                    title="Remove column"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button type="button" className="btn-add" onClick={addColumn}>
              + Add Column
            </button>
          </div>
        )}

        {/* Data Tab */}
        {activeTab === 'data' && (
          <div className="data-editor">
            {block.data.rows.length === 0 ? (
              <div className="empty-state">
                <p>No rows yet. Add providers to compare.</p>
                <button type="button" className="btn-add" onClick={addRow}>
                  + Add First Provider
                </button>
              </div>
            ) : (
              <>
                <div className="rows-list">
                  {block.data.rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="row-item">
                      <div className="row-header">
                        <div className="row-number">{rowIndex + 1}</div>
                        <input
                          type="text"
                          className="provider-input"
                          value={row.provider}
                          onChange={(e) => updateRow(rowIndex, { provider: e.target.value })}
                          placeholder="Provider name (e.g., Bluehost)"
                        />
                        <div className="row-actions">
                          <button
                            type="button"
                            className="btn-move"
                            onClick={() => moveRow(rowIndex, 'up')}
                            disabled={rowIndex === 0}
                            title="Move up"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            className="btn-move"
                            onClick={() => moveRow(rowIndex, 'down')}
                            disabled={rowIndex === block.data.rows.length - 1}
                            title="Move down"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            className="btn-remove-small"
                            onClick={() => removeRow(rowIndex)}
                            title="Remove row"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      <div className="row-values">
                        {block.data.columns.map((col) => (
                          <div key={col.key} className="value-field">
                            <label>{col.label}</label>
                            <input
                              type="text"
                              value={row.values[col.key] || ''}
                              onChange={(e) => updateRowValue(rowIndex, col.key, e.target.value)}
                              placeholder={`Enter ${col.label.toLowerCase()}...`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" className="btn-add" onClick={addRow}>
                  + Add Provider
                </button>
              </>
            )}
          </div>
        )}
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
          background: #dbeafe;
          border-bottom: 1px solid #bfdbfe;
        }

        .block-type {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          color: #1e40af;
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

        .header-fields {
          display: flex;
          flex-direction: column;
          gap: 12px;
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
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        textarea {
          resize: vertical;
        }

        .tabs {
          display: flex;
          gap: 4px;
          border-bottom: 1px solid #e5e7eb;
          margin: 0 -16px;
          padding: 0 16px;
        }

        .tab {
          padding: 10px 16px;
          border: none;
          background: transparent;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
        }

        .tab:hover {
          color: #374151;
        }

        .tab.active {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
        }

        .help-text {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
        }

        .columns-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .column-item {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .column-item input {
          flex: 1;
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

        .btn-add {
          padding: 10px 16px;
          background: white;
          border: 1px dashed #d1d5db;
          border-radius: 6px;
          color: #6b7280;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-add:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .empty-state {
          padding: 32px;
          text-align: center;
          color: #6b7280;
        }

        .empty-state p {
          margin: 0 0 16px 0;
        }

        .rows-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .row-item {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }

        .row-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .row-number {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #3b82f6;
          color: white;
          font-weight: 600;
          font-size: 13px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .provider-input {
          flex: 1;
          font-weight: 500;
        }

        .row-actions {
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

        .row-values {
          padding: 12px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }

        .value-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .value-field label {
          font-size: 12px;
          color: #6b7280;
        }

        .value-field input {
          padding: 8px 10px;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
}
