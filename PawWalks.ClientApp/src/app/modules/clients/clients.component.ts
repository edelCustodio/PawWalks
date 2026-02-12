import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="container mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Clients</h1>
        <a mat-raised-button color="primary" routerLink="/clients/create">
          <mat-icon>add</mat-icon>
          New Client
        </a>
      </div>
      <p class="text-gray-600">Client list - Under development</p>
    </div>
  `,
})
export class ClientsComponent {}
