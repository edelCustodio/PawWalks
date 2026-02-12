import {
  Component,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  signal,
  computed,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { DataGridConfig, ColumnConfig, RowAction } from './data-grid.model';

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
  ],
  templateUrl: './data-grid.component.html',
  styleUrl: './data-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGridComponent<T> {
  @Input({ required: true }) set config(value: DataGridConfig<T>) {
    this._config.set(value);
  }

  @Input({ required: true }) set data(value: T[]) {
    this.dataSignal.set(value);
    this.updateDataSource();
  }

  @Output() rowClick = new EventEmitter<T>();
  @Output() selectionChange = new EventEmitter<T[]>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Signals
  _config = signal<DataGridConfig<T>>({
    columns: [],
    pageable: true,
    pageSize: 10,
    pageSizeOptions: [5, 10, 25, 50],
    filterable: true,
    filterPlaceholder: 'Search...',
    noDataMessage: 'No data available',
  });

  private dataSignal = signal<T[]>([]);
  displayedColumns = computed(() => {
    const config = this._config();
    const columns = config.columns.map((col) => col.key);

    if (config.selectable) {
      columns.unshift('select');
    }

    if (config.actions && config.actions.length > 0) {
      columns.push('actions');
    }

    return columns;
  });

  // Data source
  dataSource = new MatTableDataSource<T>([]);
  selection = new SelectionModel<T>(true, []);

  constructor() {
    // Update data source when data changes
    effect(() => {
      const data = this.dataSignal();
      this.dataSource.data = data;
    });
  }

  ngAfterViewInit() {
    if (this._config().pageable) {
      this.dataSource.paginator = this.paginator;
    }

    if (this._config().columns.some((col) => col.sortable)) {
      this.dataSource.sort = this.sort;
    }
  }

  private updateDataSource() {
    this.dataSource.data = this.dataSignal();
    this.selection.clear();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onRowClick(row: T) {
    this.rowClick.emit(row);
  }

  executeAction(action: RowAction<T>, row: T, event: Event) {
    event.stopPropagation();
    action.action(row);
  }

  isActionVisible(action: RowAction<T>, row: T): boolean {
    return action.isVisible ? action.isVisible(row) : true;
  }

  isActionDisabled(action: RowAction<T>, row: T): boolean {
    return action.isDisabled ? action.isDisabled(row) : false;
  }

  getCellValue(row: T, column: ColumnConfig<T>): any {
    if (column.formatter) {
      return column.formatter(
        this.getNestedValue(row, column.field as string),
        row,
      );
    }

    return this.getNestedValue(row, column.field as string);
  }

  private getNestedValue(obj: any, path: string): any {
    if (!path) return '';

    return path.split('.').reduce((current, prop) => {
      return current && current[prop] !== undefined ? current[prop] : '';
    }, obj);
  }

  // Selection methods
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource.data);
    }
    this.selectionChange.emit(this.selection.selected);
  }

  toggleRow(row: T) {
    this.selection.toggle(row);
    this.selectionChange.emit(this.selection.selected);
  }

  checkboxLabel(row?: T): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }
}
