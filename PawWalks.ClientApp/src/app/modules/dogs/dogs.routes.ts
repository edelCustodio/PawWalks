import { Routes } from '@angular/router';

export const DOGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dogs.component').then((m) => m.DogsComponent),
  },
];
