import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AlertController, NavController, ToastController } from '@ionic/angular';

import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'pair',
  templateUrl: './pair.page.html',
  styleUrls: ['./pair.page.scss'],
})

export class PairPage implements OnInit {

  private sensorID: string = "S-A-167";
  private activeSensors: Array<String>;
  private activeSensorUrl: string = "https://air.eng.utah.edu/dbapi/api/liveSensors/airU";
  private getID: FormGroup;

  constructor(private http: HttpClient, 
              private storage: Storage, 
              public navCtrl: NavController,
              public alertController: AlertController,
              public toastController: ToastController,
              private formBuilder: FormBuilder
              ) { 
    this.getID = this.formBuilder.group({
      userInputID: ['']
    });
    this.activeSensors = new Array<String>();
  }

  private getActiveSensorList() {
    this.http.get<Array<Object>>(this.activeSensorUrl)
      .subscribe(data => {
        console.log(this.activeSensorUrl);
        data.forEach((element) => {
          let sensor: any = element;
          this.activeSensors.push(sensor.ID);
        });
      });
      console.log(this.activeSensors)
  }

  ngOnInit(): void {
    this.getActiveSensorList();
  }

  ngAfterViewInit(): void {
    
  }

  async onChange() {
    this.sensorID = "S-A-069";
    this.storage.set('sensor_ID', this.sensorID);
    console.log
  }

  async onSubmitID() {
    
    console.log('check active sensors list for: ' + this.sensorID);
    
    if(this.activeSensors.includes(this.sensorID)){
      console.log('found sensor ' + this.sensorID + 'authenticating');
      this.presentSuccessToast();
      this.navCtrl.navigateForward('/tabs');
    } else {
      console.log('sensor' + this.sensorID + ' not found');
      this.presentFailAlert();
    }
  }

  async presentFailAlert() {
    const alert = await this.alertController.create({
      header: 'Pair with AQ&U sensor',
      message: 'Could not find sensor ID, please check your device ID again.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentSuccessToast() {
    const toast = await this.toastController.create({
      message: 'Paired with your sensor!',
      position: 'middle',
      duration: 2000
    });
    toast.present();
  }
}
