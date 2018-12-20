import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RestProvider } from './providers/AQUapi-provider';

import { ChartsModule } from 'ng2-charts';

import { IonicStorageModule } from '@ionic/storage';
import { TabsPage } from './tabs/tabs.page';
import { PairPage } from './pair/pair.page';
import { PairPageModule } from './pair/pair.module';
import { TabsPageModule } from './tabs/tabs.module';
import { TabsPageRoutingModule } from './tabs/tabs.router.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [PairPage, TabsPage],
  imports: [BrowserModule,
    PairPageModule,
    TabsPageModule, 
    FormsModule,
    IonicModule.forRoot(),
    ChartsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    TabsPageRoutingModule,
    IonicStorageModule.forRoot()],
  providers: [
    StatusBar,
    SplashScreen,
    RestProvider,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  
}
