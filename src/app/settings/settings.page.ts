import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage {
  constructor(
    private storage: Storage,
    private router: Router,
    public navCtrl: NavController,
  ) {

  }
  
  async pairWithAnotherSensor(){
    console.log("re-pair app")
    this.navCtrl.navigateBack('/pair');
  }
}
