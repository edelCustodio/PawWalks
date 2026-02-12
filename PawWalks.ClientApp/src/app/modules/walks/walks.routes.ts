import { Routes } from '@angular/router';

export const WALKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./walks.component').then((m) => m.WalksComponent),
  },
];
