// Bottom Content Editor Types
// Structured blocks for comparison tables, experts, and text content

export type BlockType = 'text' | 'comparison-table' | 'experts';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

// Text Block - Simple rich text content
export interface TextBlock extends BaseBlock {
  type: 'text';
  data: {
    title?: string;
    content: string; // HTML content
  };
}

// Comparison Table Block - Structured comparison table
export interface ComparisonTableBlock extends BaseBlock {
  type: 'comparison-table';
  data: {
    title?: string;
    description?: string;
    columns: TableColumn[];
    rows: TableRow[];
  };
}

export interface TableColumn {
  key: string;
  label: string;
}

export interface TableRow {
  provider: string;
  values: Record<string, string>;
}

// Experts Block - Display team of experts/authors
export interface ExpertsBlock extends BaseBlock {
  type: 'experts';
  data: {
    titlePrefix: string;      // "Our"
    highlightWord: string;    // "Hosting" (displayed in brand color)
    titleSuffix: string;      // "Experts"
    description?: string;
    authorIds: string[];
    backgroundColor?: string;
  };
}

// Union type for all blocks
export type ContentBlock = TextBlock | ComparisonTableBlock | ExpertsBlock;

// Author option for experts selector
export interface AuthorOption {
  id: string;
  name: string;
  avatar?: string;
  title?: string;
  slug: string;
}

// Default empty blocks
export const createTextBlock = (): TextBlock => ({
  id: crypto.randomUUID(),
  type: 'text',
  data: {
    title: '',
    content: '',
  },
});

export const createComparisonTableBlock = (): ComparisonTableBlock => ({
  id: crypto.randomUUID(),
  type: 'comparison-table',
  data: {
    title: '',
    description: '',
    columns: [
      { key: 'best_for', label: 'Best For' },
      { key: 'starting_price', label: 'Starting Price' },
      { key: 'moneyback', label: 'Moneyback Guarantee' },
    ],
    rows: [],
  },
});

export const createExpertsBlock = (): ExpertsBlock => ({
  id: crypto.randomUUID(),
  type: 'experts',
  data: {
    titlePrefix: 'Our',
    highlightWord: 'Hosting',
    titleSuffix: 'Experts',
    description: '',
    authorIds: [],
    backgroundColor: '#f5f5f5',
  },
});
