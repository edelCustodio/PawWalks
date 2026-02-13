import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { DataGridConfig } from '../../shared/components/data-grid/data-grid.model';
import { ClientsService } from './services/clients.service';
import { ClientDetailDto } from './models/clients.model';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { SnackbarService } from '../../core/services/snack-bar.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, DataGridComponent],
  templateUrl: './clients.component.html',
})
export class ClientsComponent implements OnInit {
  clients = signal<ClientDetailDto[]>([]);
  loading = signal(false);

  private _clientsService = inject(ClientsService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _confirmationService = inject(ConfirmationService);
  private _snackbar = inject(SnackbarService);

  get gridConfigWithLoading(): DataGridConfig<ClientDetailDto> {
    return { ...this.gridConfig, loading: this.loading() };
  }

  gridConfig: DataGridConfig<ClientDetailDto> = {
    columns: [
      {
        key: 'firstName',
        header: 'First Name',
        field: 'firstName',
        sortable: true,
        width: '200px',
      },
      {
        key: 'lastName',
        header: 'Last Name',
        field: 'lastName',
        sortable: true,
        width: '200px',
      },
      {
        key: 'email',
        header: 'Email',
        field: 'email',
        sortable: true,
      },
      {
        key: 'phone',
        header: 'Phone',
        field: 'phone',
        sortable: true,
        width: '150px',
      },
      {
        key: 'address',
        header: 'Address',
        field: 'address',
        sortable: false,
        formatter: (_, client) => this.formatAddress(client),
      },
      {
        key: 'totalDogs',
        header: 'Dogs',
        field: 'totalDogs',
        sortable: true,
        width: '80px',
        align: 'center',
      },
    ],
    actions: [
      {
        id: 'edit',
        label: 'Edit',
        icon: 'edit',
        color: 'primary',
        action: (client) => this.editClient(client),
      },
      {
        id: 'delete',
        label: 'Delete',
        icon: 'delete',
        color: 'warn',
        action: (client) => this.deleteClient(client),
      },
    ],
    pageable: true,
    pageSize: 10,
    pageSizeOptions: [5, 10, 25, 50],
    filterable: true,
    filterPlaceholder: 'Search clients...',
    noDataMessage: 'No clients found',
    expandable: true,
  };

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.loading.set(true);
    const clientsFromRoute = this._route.snapshot.data['clients'];
    this.clients.set(clientsFromRoute.items);
    this.loading.set(false);
  }

  editClient(client: ClientDetailDto) {
    this._router.navigate(['/clients', client.id, 'edit']);
  }

  deleteClient(client: ClientDetailDto) {
    const dialogRef = this._confirmationService.open({
      title: 'Delete Client',
      message: `Are you sure you want to delete ${client.firstName} ${client.lastName}? This action will also delete all associated dogs and cannot be undone.`,
      icon: {
        show: true,
        name: 'heroicons_outline:exclamation-triangle',
        color: 'warn',
      },
      actions: {
        confirm: {
          show: true,
          label: 'Delete',
          color: 'warn',
        },
        cancel: {
          show: true,
          label: 'Cancel',
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.loading.set(true);
        this._clientsService.deleteClient(client.id).subscribe({
          next: () => {
            this.loading.set(false);
            this._snackbar.success(
              `Client ${client.firstName} ${client.lastName} deleted successfully!`,
            );
            this.loadClients();
          },
          error: (error) => {
            this.loading.set(false);
            const message =
              error.error?.message ||
              `Error deleting client ${client.firstName} ${client.lastName}`;
            this._snackbar.error(message);
            console.error('Error deleting client:', error);
          },
        });
      }
    });
  }

  onRowClick(client: ClientDetailDto) {
    this._router.navigate(['/clients', client.id]);
  }

  formatAddress(client: ClientDetailDto): string {
    const parts = [
      client.addressLine1,
      client.city,
      client.state,
      client.zip,
    ].filter(Boolean);
    return parts.join(', ');
  }

  scheduleWalk(clientId: string, dogId: string) {
    // Navigate to walk scheduling page
    this._router.navigate(['/walks', 'create'], {
      queryParams: { clientId, dogId },
    });
  }

  getAge(birthDate?: string): string {
    if (!birthDate) return 'N/A';
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInYears = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      return `${ageInYears - 1} years`;
    }
    return `${ageInYears} years`;
  }
}
