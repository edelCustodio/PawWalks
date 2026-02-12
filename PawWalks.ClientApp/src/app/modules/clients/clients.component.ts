import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { DataGridConfig } from '../../shared/components/data-grid/data-grid.model';
import { ClientsService } from './services/clients.service';
import { ClientDetailDto } from './models/clients.model';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, DataGridComponent],
  templateUrl: './clients.component.html',
})
export class ClientsComponent implements OnInit {
  clients = signal<ClientDetailDto[]>([]);
  loading = signal(false);

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
  };

  constructor(
    private clientsService: ClientsService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.loading.set(true);
    this.clientsService.getClients().subscribe({
      next: (response) => {
        this.clients.set(response.items);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.loading.set(false);
      },
    });
  }

  editClient(client: ClientDetailDto) {
    this.router.navigate(['/clients', client.id, 'edit']);
  }

  deleteClient(client: ClientDetailDto) {
    if (
      confirm(
        `Are you sure you want to delete ${client.firstName} ${client.lastName}?`,
      )
    ) {
      this.clientsService.deleteClient(client.id).subscribe({
        next: () => {
          this.loadClients();
        },
        error: (error) => {
          console.error('Error deleting client:', error);
          alert('Error deleting client');
        },
      });
    }
  }

  onRowClick(client: ClientDetailDto) {
    this.router.navigate(['/clients', client.id]);
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
}
