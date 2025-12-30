import { Routes } from '@angular/router';
import { MainLayout } from '@app/layout/main-layout/main-layout';

export default <Routes>[
  {
    path: '',
    component: MainLayout,
    providers: [],
    children: [
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.routes'),
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: '**',
        redirectTo: 'settings',
      },
    ],
  },
];
