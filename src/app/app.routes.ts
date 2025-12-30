import { Routes } from '@angular/router';

export const routes: Routes = [
  // {
  //   path: 'auth',
  //   loadChildren: () => import('@auth/auth.routes'),
  // },
  {
    path: 'portal',
    // canActivate: [authGuard],
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('./features/main/main.routes'),
  },
  {
    path: '**',
    redirectTo: 'portal',
  },
];
