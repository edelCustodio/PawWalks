import { TemplateRef } from '@angular/core';

/**
 * Column definition for the data grid
 */
export interface ColumnConfig<T> {
  /** Unique identifier for the column */
  key: string;
  /** Header label to display */
  header: string;
  /** Property path in the data object (e.g., 'user.name' for nested properties) */
  field?: keyof T | string;
  /** Optional custom template for cell rendering */
  cellTemplate?: TemplateRef<any>;
  /** Width of the column (e.g., '200px', '20%', 'auto') */
  width?: string;
  /** Whether the column is sortable */
  sortable?: boolean;
  /** Align content: left, center, right */
  align?: 'left' | 'center' | 'right';
  /** Custom CSS class for the column */
  cssClass?: string;
  /** Custom formatter function to transform cell value */
  formatter?: (value: any, row: T) => string;
  /** Render formatted content as HTML (use with caution) */
  renderAsHtml?: boolean;
}

/**
 * Action button configuration for rows
 */
export interface RowAction<T> {
  /** Unique identifier for the action */
  id: string;
  /** Label or tooltip for the action */
  label: string;
  /** Material icon name */
  icon: string;
  /** Color of the action button */
  color?: 'primary' | 'accent' | 'warn';
  /** Callback function when action is clicked */
  action: (row: T) => void;
  /** Optional condition to show/hide action based on row data */
  isVisible?: (row: T) => boolean;
  /** Optional condition to enable/disable action based on row data */
  isDisabled?: (row: T) => boolean;
}

/**
 * Complete configuration for the data grid
 */
export interface DataGridConfig<T> {
  /** Array of column definitions */
  columns: ColumnConfig<T>[];
  /** Optional row actions (edit, delete, etc.) */
  actions?: RowAction<T>[];
  /** Enable row selection */
  selectable?: boolean;
  /** Enable pagination */
  pageable?: boolean;
  /** Page size options for pagination */
  pageSizeOptions?: number[];
  /** Default page size */
  pageSize?: number;
  /** Show/hide the filter input */
  filterable?: boolean;
  /** Filter placeholder text */
  filterPlaceholder?: string;
  /** CSS class for the grid container */
  containerClass?: string;
  /** Show loading spinner */
  loading?: boolean;
  /** Message to show when no data is available */
  noDataMessage?: string;
  /** Enable expandable rows to show additional content */
  expandable?: boolean;
}
