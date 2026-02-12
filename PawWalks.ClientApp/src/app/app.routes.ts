import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'clients',
        pathMatch: 'full',
      },
      {
        path: 'clients',
        loadChildren: () =>
          import('./modules/clients/clients.routes').then(
            (m) => m.CLIENTS_ROUTES,
          ),
      },
      {
        path: 'dogs',
        loadChildren: () =>
          import('./modules/dogs/dogs.routes').then((m) => m.DOGS_ROUTES),
      },
      {
        path: 'walks',
        loadChildren: () =>
          import('./modules/walks/walks.routes').then((m) => m.WALKS_ROUTES),
      },
    ],
  },
];
