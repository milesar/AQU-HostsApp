import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { AlertController, NavController, ToastController } from '@ionic/angular';

import 'rxjs/add/operator/takeWhile';

/**
 * This is the default entry route to the app: if the user has not yet paired with a device, 
 * it allows them to enter their sensor ID and setup the rest of the app to pull data from
 * their specific device (or any other) once online.
 * 
 * Current auth uses the sensor ID: this are pretty easy to guess, but the MAC addresses are not
 * provided in the 'active sensor' route at present. this scheme should be easy to change should
 * this become an issue for the program.
 */
@Component({
  selector: 'pair',
  templateUrl: './pair.page.html',
  styleUrls: ['./pair.page.scss'],
})

export class PairPage implements OnInit {
  private sensorID: string = "your sensor ID, i.e. 'S-A-167'";
  private activeSensors: Array<String>;
  private activeSensorUrl: string = "https://air.eng.utah.edu/dbapi/api/liveSensors/airU";


  constructor(private http: HttpClient, 
              private storage: Storage, 
              public navCtrl: NavController,
              public alertController: AlertController,
              public toastController: ToastController,
              ) { 
    this.activeSensors = new Array<String>();
  }

  /**
   * Fetches the list of active sensors from the AQ&U API for the purposes of validating
   * the user sensor input as an active sensor on the list. The caveat is the presumption of the 
   * sensor being active. In future, it might be helpful for the API to provide a route with ALL
   * registered sensors, active or not, including the MAC addresses, to 'authenticate' against.
   */
  private getActiveSensorList() {
    this.http.get<Array<Object>>(this.activeSensorUrl)
      .subscribe(data => {
        console.log(this.activeSensorUrl);
        data.forEach((element) => {
          let sensor: any = element;
          this.activeSensors.push(sensor.ID);
        });
      });
  }
  /**
   * Angular life-cycle method, run immediately after constructor, gets active sensor list
   * from AQ&U API.
   */
  ngOnInit(): void {
    this.getActiveSensorList();
  }

  /**
   * Debug method to help track component firing.
   */
  async onChange() {
    console.log(<string>this.sensorID); 
  }

  /**
   * Callback for handling user submission of a sensor ID. Checks the sensor ID
   * against the active list of sensors and if found routes to the main app. Otherwise
   * notifies the user of the issue, and does not pair or enter the app.
   */
  async onSubmitID() {
    
    console.log('check active sensors list for: ' + <string>this.sensorID);
    this.storage.set('sensor_ID', this.sensorID);

    if(this.activeSensors.includes(this.sensorID)){
      console.log('found sensor ' + this.sensorID + ': authenticating');
      this.presentSuccessToast();
      this.navCtrl.navigateForward('/tabs');
    } else {
      console.log('sensor ' + this.sensorID + ' not found');
      this.presentFailAlert();
    }
  }

  /**
   * Toast alert for failed pairing.
   */
  async presentFailAlert() {
    const alert = await this.alertController.create({
      header: 'Pair with AQ&U sensor',
      message: 'Could not find sensor ID, please check your device ID again.',
      buttons: ['OK']
    });

    await alert.present();
  }

  /**
   * Toast alert for succesful pairing.
   */
  async presentSuccessToast() {
    const toast = await this.toastController.create({
      message: 'Paired with your sensor!',
      position: 'middle',
      duration: 2000
    });
    toast.present();
  }
}
