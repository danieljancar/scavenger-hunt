import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { GeolocationComponent } from '../../features/hunt/tasks/geolocation/geolocation.component';
import { QrcodeComponent } from '../../features/hunt/tasks/qrcode/qrcode.component';
import { OrientationComponent } from '../../features/hunt/tasks/orientation/orientation.component';
import { ChargeComponent } from '../../features/hunt/tasks/charge/charge.component';
import { FinishComponent } from '../../features/hunt/finish/finish.component';

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
        children: [
          {
            path: 'geolocation',
            component: GeolocationComponent,
          },
          {
            path: 'qrcode',
            component: QrcodeComponent,
          },
          {
            path: 'orientation',
            component: OrientationComponent,
          },
          {
            path: 'charge',
            component: ChargeComponent,
          },
          {
            path: 'finish',
            component: FinishComponent,
          },
        ],
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
