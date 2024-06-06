import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../../features/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'hunt',
        loadComponent: () =>
          import('../../features/hunt/hunt.page').then((m) => m.HuntPage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../../features/settings/settings.page').then(
            (m) => m.SettingsPage,
          ),
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];
