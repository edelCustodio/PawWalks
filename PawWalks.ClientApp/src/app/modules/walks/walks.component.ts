import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import {
  DataGridConfig,
  ColumnConfig,
} from '../../shared/components/data-grid/data-grid.model';
import { WalksService } from './services/walks.service';
import {
  WalkListItemDto,
  WalkStatus,
  getWalkStatusText,
  getWalkStatusColor,
} from './models/walks.model';
import { SnackbarService } from '../../core/services/snack-bar.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
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
    MatTooltipModule,
    DataGridComponent,
  ],
  templateUrl: './walks.component.html',
  styleUrl: './walks.component.scss',
})
export class WalksComponent implements OnInit {
  private readonly _walksService = inject(WalksService);
  private readonly _snackbarService = inject(SnackbarService);
  private readonly _confirmationService = inject(ConfirmationService);
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
    actions: [
      {
        id: 'complete',
        label: 'Mark as Completed',
        icon: 'check_circle',
        color: 'primary',
        action: (walk: WalkListItemDto) => this.completeWalk(walk),
        isVisible: (walk: WalkListItemDto) =>
          walk.status === WalkStatus.Scheduled,
      },
      {
        id: 'cancel',
        label: 'Cancel Walk',
        icon: 'cancel',
        color: 'warn',
        action: (walk: WalkListItemDto) => this.cancelWalk(walk),
        isVisible: (walk: WalkListItemDto) =>
          walk.status === WalkStatus.Scheduled,
      },
    ],
    pageable: false, // We'll use external pagination
    filterable: false,
    noDataMessage: 'No walks scheduled',
    loading: this.isLoading(),
  }));

  ngOnInit(): void {
    // Load initial data from resolver
    const walksData = this._route.snapshot.data[
      'walks'
    ] as PagedResult<WalkListItemDto>;
    if (walksData) {
      this.walks.set(walksData.items);
      this.totalCount.set(walksData.totalCount);
    } else {
      this.loadWalks();
    }
  }

  loadWalks(): void {
    this.isLoading.set(true);
    this._walksService
      .getWalks(this.pageIndex() + 1, this.pageSize())
      .subscribe({
        next: (response) => {
          this.walks.set(response.items);
          this.totalCount.set(response.totalCount);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading walks:', error);
          this._snackbarService.error('Error loading walks');
          this.isLoading.set(false);
        },
      });
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

  completeWalk(walk: WalkListItemDto): void {
    const dialogRef = this._confirmationService.open({
      title: 'Complete Walk',
      message: `Are you sure you want to mark this walk as completed? This walk is scheduled for ${this.formatDateTime(walk.startAt)} with ${walk.dogCount} ${walk.dogCount === 1 ? 'dog' : 'dogs'}.`,
      icon: {
        show: true,
        name: 'check_circle',
        color: 'success',
      },
      actions: {
        confirm: {
          show: true,
          label: 'Complete',
          color: 'primary',
        },
        cancel: {
          show: true,
          label: 'Cancel',
        },
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this._walksService
          .updateStatus(walk.id, WalkStatus.Completed)
          .subscribe({
            next: () => {
              this._snackbarService.success('Walk completed successfully');
              this.loadWalks();
            },
            error: (error) => {
              console.error('Error completing walk:', error);
              this._snackbarService.error('Error completing walk');
            },
          });
      }
    });
  }

  cancelWalk(walk: WalkListItemDto): void {
    const dialogRef = this._confirmationService.open({
      title: 'Cancel Walk',
      message: `Are you sure you want to cancel this walk? This walk is scheduled for ${this.formatDateTime(walk.startAt)} with ${walk.dogCount} ${walk.dogCount === 1 ? 'dog' : 'dogs'}.`,
      icon: {
        show: true,
        name: 'warning',
        color: 'warn',
      },
      actions: {
        confirm: {
          show: true,
          label: 'Yes, Cancel Walk',
          color: 'warn',
        },
        cancel: {
          show: true,
          label: 'No, Keep It',
        },
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this._walksService
          .updateStatus(walk.id, WalkStatus.Cancelled)
          .subscribe({
            next: () => {
              this._snackbarService.warning('Walk cancelled');
              this.loadWalks();
            },
            error: (error) => {
              console.error('Error cancelling walk:', error);
              this._snackbarService.error('Error cancelling walk');
            },
          });
      }
    });
  }

  getStatusText = getWalkStatusText;
  getStatusColor = getWalkStatusColor;
}
