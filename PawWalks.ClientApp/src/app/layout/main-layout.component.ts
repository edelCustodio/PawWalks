import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  isSidenavOpen = signal(true);

  navItems = [
    { path: '/clients', icon: 'people', label: 'Clientes' },
    { path: '/dogs', icon: 'pets', label: 'Perros' },
    { path: '/walks', icon: 'directions_walk', label: 'Paseos' },
  ];

  toggleSidenav(): void {
    this.isSidenavOpen.update((value) => !value);
  }

  logout(): void {
    // TODO: Implement logout logic
    console.log('Logout');
  }
}
