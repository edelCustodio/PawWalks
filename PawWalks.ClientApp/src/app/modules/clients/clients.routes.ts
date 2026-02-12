import { Routes } from '@angular/router';
import { clientsResolver } from './resolvers/clients.resolver';
import { clientResolver } from './resolvers/client.resolver';

export const CLIENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./clients.component').then((m) => m.ClientsComponent),
    resolve: {
      clients: clientsResolver,
    },
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./client-form/client-form.component').then(
        (m) => m.ClientFormComponent,
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./client-form/client-form.component').then(
        (m) => m.ClientFormComponent,
      ),
    resolve: {
      client: clientResolver,
    },
  },
];
