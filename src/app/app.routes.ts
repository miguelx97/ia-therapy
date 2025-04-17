import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./screens/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'config',
    loadComponent: () => import('./screens/config/config.page').then(m => m.ConfigPage)
  },
];
