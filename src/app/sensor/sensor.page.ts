import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-sensor',
  templateUrl: 'sensor.page.html',
  styleUrls: ['sensor.page.scss']
})


export class SensorPage {
  latestPointUrl: string = "";

  constructor(private http: HttpClient, private storage: Storage) {

  }
  'https://air.eng.utah.edu/dbapi/api/lastValue?fieldKey=pm25,temperature,humidity'
}
