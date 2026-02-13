import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import {
  DataGridConfig,
  ColumnConfig,
} from '../../shared/components/data-grid/data-grid.model';
import { WalksService } from './services/walks.service';
import {
  WalkListItemDto,
  getWalkStatusText,
  getWalkStatusColor,
} from './models/walks.model';
import { SnackbarService } from '../../core/services/snack-bar.service';
import { PagedResult } from '../../shared/models/pagination';

@Component({
  selector: 'app-walks',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    DataGridComponent,
  ],
  templateUrl: './walks.component.html',
  styleUrl: './walks.component.scss',
})
export class WalksComponent implements OnInit {
  private readonly _walksService = inject(WalksService);
  private readonly _snackbarService = inject(SnackbarService);
  private readonly _route = inject(ActivatedRoute);

  walks = signal<WalkListItemDto[]>([]);
  isLoading = signal(false);
  totalCount = signal(0);
  pageIndex = signal(0);
  pageSize = signal(10);

  gridConfig = computed<DataGridConfig<WalkListItemDto>>(() => ({
    columns: [
      {
        key: 'startAt',
        header: 'Date & Time',
        formatter: (value: any, walk: WalkListItemDto) =>
          this.formatDateTime(walk.startAt),
      },
      {
        key: 'dogCount',
        header: 'Dogs',
        formatter: (value: any, walk: WalkListItemDto) =>
          `${walk.dogCount} ${walk.dogCount === 1 ? 'dog' : 'dogs'}`,
      },
      {
        key: 'durationMinutes',
        header: 'Duration',
        formatter: (value: any, walk: WalkListItemDto) =>
          `${walk.durationMinutes} min`,
      },
      {
        key: 'status',
        header: 'Status',
        formatter: (value: any, walk: WalkListItemDto) => {
          const status = getWalkStatusText(walk.status);
          const color = getWalkStatusColor(walk.status);
          return `<span class="px-2 py-1 rounded-full text-xs font-semibold ${color}">${status}</span>`;
        },
        renderAsHtml: true,
      },
    ],
    pageable: false, // We'll use external pagination
    filterable: false,
    noDataMessage: 'No walks scheduled',
    loading: this.isLoading(),
  }));

  ngOnInit(): void {
    this.loadWalks();
  }

  loadWalks(): void {
    this.isLoading.set(true);
    const walksData = this._route.snapshot.data[
      'walks'
    ] as PagedResult<WalkListItemDto>;
    this.walks.set(walksData.items);
    this.totalCount.set(walksData.totalCount);
    this.isLoading.set(false);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadWalks();
  }

  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getStatusText = getWalkStatusText;
  getStatusColor = getWalkStatusColor;
}
