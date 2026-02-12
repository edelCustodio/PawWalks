import { Routes } from '@angular/router';

export const CLIENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./clients.component').then((m) => m.ClientsComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./client-form/client-form.component').then(
        (m) => m.ClientFormComponent,
      ),
  },
];
