import { Routes } from '@angular/router';
import { Settings } from '@app/features/main/settings/settings';

export default <Routes>[
  {
    path: '',
    component: Settings,
    providers: [],
    children: [
      {
        path: 'external-investors',
        loadComponent: () =>
          import('./external-investors/external-investors').then((m) => m.ExternalInvestors),
      },
      {
        path: '**',
        redirectTo: 'external-investors',
      },
    ],
  },
];
