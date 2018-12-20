import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { SensorPage } from '../sensor/sensor.page';
import { DataPage } from '../data/data.page';
import { SettingsPage } from '../settings/settings.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/(sensor:sensor)',
        pathMatch: 'full',
      },
      {
        path: 'sensor',
        outlet: 'sensor',
        component: SensorPage
      },
      {
        path: 'data',
        outlet: 'data',
        component: DataPage
      },
      {
        path: 'settings',
        outlet: 'settings',
        component: SettingsPage
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/(sensor:sensor)',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
