import { Component, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx'; 
import { Storage } from '@ionic/storage';
import { TabsPage } from './tabs/tabs.page';
import { Router } from '@angular/router';
import { PairPage } from './pair/pair.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})

export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public storage: Storage,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.storage.ready().then(() => {
        this.storage.get('sensorID').then((id) => {
          if(id){
            this.router.navigateByUrl('tabs');
          } else {
            this.router.navigateByUrl('pair');
          }
        });
      });
    });
  }
}
