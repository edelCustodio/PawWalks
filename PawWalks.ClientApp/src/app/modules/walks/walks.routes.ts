import { Routes } from '@angular/router';
import { walksResolver } from './resolvers/walks.resolver';

export const WALKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./walks.component').then((m) => m.WalksComponent),
    resolve: {
      walks: walksResolver,
    },
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./walk-form/walk-form.component').then(
        (m) => m.WalkFormComponent,
      ),
  },
];
