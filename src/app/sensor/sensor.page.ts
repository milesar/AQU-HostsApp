import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-sensor',
  templateUrl: 'sensor.page.html',
  styleUrls: ['sensor.page.scss']
})

export class SensorPage {
  public latestPointUrl: string = "";

  public fetchFrequency: number = 600000; // 10 minute, 600000
  public baseInterval: string = '60m';

  public humidity: string = "";
  public sensorID: string = "";
  public status: string = "";
  public temperature: string = "";
  public currentReading: string = "";

  public end: Date = new Date();
  public dayRange: number = 3;
  public dataRate: number = 10;
  public monthRange: number = 365;
  private alive: boolean;

  public start: Date = new Date(Date.now() - this.dayRange * 3600000);
  public startDateTime: string = this.start.toISOString();

  public endDateTime: string = this.end.toISOString();

  public latestPoint: any;

  constructor(private http: HttpClient, private storage: Storage) {
    this.storage.get('sensor_ID').then((val) => {
      this.alive = true;
      this.sensorID = <string>val;
      this.fetchLatest();
      console.log("sensor constructor");
    });
    
  }

  fetchLatest(): void {
    TimerObservable.create(0, this.fetchFrequency)
      .takeWhile(() => this.alive)
      .subscribe(() => {
        this.setTimeRange();
        this.latestPointUrl = `https://air.eng.utah.edu/dbapi/api/rawDataFrom?id=${this.sensorID}&sensorSource=airu&start=${this.startDateTime}&end=${this.endDateTime}&show=all`;
        console.log(this.latestPointUrl);
        this.http.get(this.latestPointUrl)
          .subscribe(response => {
            this.latestPoint = response['data'].pop();
            if (this.latestPoint.pm25 !== null) {
              console.log('found data < 1hr old on server: sensor online-status verified');
              this.status = "Online";
              this.temperature = this.latestPoint.Temperature;
              this.humidity = this.latestPoint.Humidity;
              this.currentReading = this.latestPoint.pm25;
            } else {
              this.status = "OFFLINE";
              this.temperature = "--";
              this.humidity = "--";
              this.currentReading = "--";
            }
          });
        
      });
  }

  /**
   * Set the timestamps to monitor live data for the past 1 hr.
   * 
   */
  private setTimeRange(): void{
    this.start.setTime(Date.now() - this.dayRange * 3600000);
    this.startDateTime = this.start.toISOString();
    this.endDateTime = this.end.toISOString();
  }
}
