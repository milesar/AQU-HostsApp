import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
import { SettingsPageModule } from '../settings/settings.module';
import { DataPageModule } from '../data/data.module';
import { SensorPageModule } from '../sensor/sensor.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    RouterModule,
    DataPageModule,
    SensorPageModule,
    SettingsPageModule
  ],
  declarations: [TabsPage]
})

export class TabsPageModule {
  
  
}
