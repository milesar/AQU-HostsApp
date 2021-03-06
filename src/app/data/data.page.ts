import { Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { ActionSheetController } from '@ionic/angular';
import { Observable } from "rxjs";

import 'rxjs/add/operator/takeWhile';

/**
 * DataPage handles all live data from the sensor, and provides 3 charts for viewing recent
 * data (as configured on the settings page). The data pull methods and 3 charts are all built
 * on this page. Aside from retrieving the sensor ID from local, persistent storage, this page
 * wholly self containted and not dependent on any other modules or models.
 */
@Component({
  selector: 'app-data',
  templateUrl: 'data.page.html',
  styleUrls: ['data.page.scss']
})

export class DataPage {
  @ViewChild('PM25Chart') PM25Chart;
  @ViewChild('TempChart') TempChart;
  @ViewChild('trendChart') trendChart;

  public end: Date = new Date();
  public dayRange: number = 3;
  public dataRate: number = 10;
  public monthRange: number = 365;
  private alive: boolean;

  // Start date is back calculated from 
  public start: Date = new Date(Date.now() - this.dayRange * 86400000);
  public startDateTime: string = this.start.toISOString();

  public dailyStart: Date = new Date(Date.now() - this.monthRange * 86400000);
  public dailyStartDateTime: string = this.dailyStart.toISOString();

  public endDateTime: string = this.end.toISOString();

  public sensorID: string = "";
  public fetchFrequency: number = 600000; // 10 minutes, 600000
  public baseInterval: string = '10m';
  public dailyInterval: string = '4000m';

  public avgPM25Url: string = "";
  public anualPm25TrendUrl: string = "";
  public avgTempUrl: string = "";
  public AQIDataCalcUrl: string = "";
  public response: any[];

  public trendChartEl: any;
  public PM25ChartEl: any;
  public TempChartEl: any;
  public chartLoadingEl: any;

  public Tempdata: Array<Object>;
  public pm25data: Array<Object>;

  public dailyTempdata: Array<Object>;
  public dailypm25data: Array<Object>;
  public averagePM25: number;

  constructor(private http: HttpClient, 
              private storage: Storage,
              public actionSheetController: ActionSheetController) {
    this.storage.get('sensor_ID').then((val) => {
      this.sensorID = <string>val;
      this.buildFields();
      this.pm25data = new Array<Object>();
      this.Tempdata = new Array<Object>();
      this.dailypm25data = new Array<Object>();
      this.alive = true;
      this.createTrendChart();
      this.createPM25Chart();
      this.createTempChart();
    }).then(() => {
      this.fetchChartData();
    }).then(() => this.updateAllCharts());
  }

  ngDoCheck(): void {
    this.updateAllCharts();
  }

  /**
   * Set the alive flag to false and kill the timer observables.
   * 
   */
  ngOnDestroy() {
    this.alive = false;
  }

  /**
   * Workaround for local storage promise, can be called after sensor_ID has been retrieved. All routes
   * to AQ&U API are defined here.
   */
  private buildFields () {
    this.avgPM25Url = `https://air.eng.utah.edu/dbapi/api/processedDataFrom?id=${this.sensorID}&sensorSource=airu&start=${this.startDateTime}&end=${this.endDateTime}&function=mean&functionArg=pm25&timeInterval=${this.baseInterval}`;
    this.anualPm25TrendUrl = `https://air.eng.utah.edu/dbapi/api/processedDataFrom?id=${this.sensorID}&sensorSource=airu&start=${this.dailyStartDateTime}&end=${this.endDateTime}&function=mean&functionArg=pm25&timeInterval=${this.dailyInterval}`;
    this.avgTempUrl = `https://air.eng.utah.edu/dbapi/api/processedDataFrom?id=${this.sensorID}&sensorSource=airu&start=${this.startDateTime}&end=${this.endDateTime}&function=mean&functionArg=temperature&timeInterval=${this.baseInterval}`;
    this.AQIDataCalcUrl = `https://air.eng.utah.edu/dbapi/api/processedDataFrom?id=${this.sensorID}&sensorSource=airu&start=${this.startDateTime}&end=${this.endDateTime}&function=mean&functionArg=temperature&timeInterval=${this.baseInterval}`;
    this.setDates();
  }

  /**
   * Fetch and update chart data set, only fetch data within the user defined range (days).
   * 
   */
  private fetchChartData() {
    console.log(this.anualPm25TrendUrl);

    TimerObservable.create(0, this.fetchFrequency)
      .takeWhile(() => this.alive)
      .subscribe(() => {
        this.setDates();
        this.http.get(this.avgPM25Url)
          .subscribe(data => {
            this.pm25data = [];
            data['data'].forEach((element) => {
              this.pm25data.push({ x: <Date>element.time, y: <number>element.pm25 });
              this.averagePM25 += <number>element.pm25;
              });
          });

        this.http.get(this.avgTempUrl)
          .subscribe(data => {
            this.Tempdata = [];
            data['data'].forEach((element) => {
              this.Tempdata.push({ x: <Date>element.time, y: <number>element.mean });
            });
          });

        this.http.get(this.anualPm25TrendUrl)
          .subscribe(data => {
            this.setDates();
            console.log("pull averages");
            this.dailypm25data = [];
            data['data'].forEach((element) => {
              this.dailypm25data.push({ x: <Date>element.time, y: <Number>element.pm25 });
            });
          });
        
        this.updateAllCharts();
        console.log("update averaged temp data");
        console.log("update averaged pm25 data");
    });
  }

  /**
   * Updates all charts, since ChartJS was somehow not detecting the data change once 
   * embedded in the TimerObservable for some reason. Overkill, need a better solution.
   */
  updateAllCharts(): void {
    this.TempChartEl.data.datasets.forEach((dataset) => {
      dataset.data = this.Tempdata;
    });
    this.PM25ChartEl.data.datasets.forEach((dataset) => {
      dataset.data = this.pm25data;
    });
    this.trendChartEl.data.datasets.forEach((dataset) => {
      dataset.data = this.dailypm25data;
    });;
    this.trendChartEl.update();
    this.PM25ChartEl.update();
    this.TempChartEl.update();
  }

  /**
   * Set the dates based on the user specified ranges in reference to the current time.
   * 
   */
  private setDates() {
    this.start.setTime(Date.now() - this.dayRange * 86400000);
    this.startDateTime = this.start.toISOString();
    this.dailyStart.setTime(Date.now() - this.monthRange * 86400000);
    this.dailyStartDateTime = this.dailyStart.toISOString();

    this.endDateTime = this.end.toISOString();
  }

  /**
   * Calculates the AQI based on the current 24 hour average (moving).
   * 
   * Current EPA revised guidlines (2006) for health outcomes as a function of 24 hour average 
   * pm2.5 levels (ug / m^3) are used as breakpoints to assign a qualitative impact class.
   * 
   * Breakpoints are as follows:
   * 
   * 'Good' 0 - 12.0
   * 'Moderate' 12.1 - 35.4
   * 'Unhealthy for Sensitive Groups' 35.5 - 55.4
   * 'Unhealthy' 55.5 - 150.4
   * 'Very Unhealthy' 150.5 -250.4
   * 'Hazardous' 250.5 - 500
   * 
   */

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Observations',
      buttons: [{
        text: 'Fire',
        role: 'destructive',
        icon: 'bonfire',
        handler: () => {
          console.log('observed a fire');
        }
      }, {
        text: 'Barbecue',
        icon: 'bonfire',
        handler: () => {
          console.log('observed a barbeque');
        }
      }, {
        text: 'Construction',
        icon: 'bonfire',
        handler: () => {
          console.log('observed construction');
        }
      }, {
        text: 'Windy',
        icon: 'bonfire',
        handler: () => {
          console.log('observed wind');
        }
        }, {
          text: 'Fireworks',
          icon: 'bonfire',
          handler: () => {
            console.log('observed fireworks');
          }
        },{
        text: 'Nevermind',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('observation cancelled');
        }
      }]
    });
    await actionSheet.present();
  }

  /**
   * Configure and create the trend chart.
   *
   */
  createTrendChart(): void {
    this.trendChartEl = new Chart(this.trendChart.nativeElement,
        {
        
          type: 'line',
          data: {
            datasets: [{
              label: "PM 2.5",
              data: this.dailypm25data,
              fill: true,
              //yAxisID: 'PM25',
              borderColor: "rgba(122,203,177,1)",
              backgroundColor: "rgba(122,203,177,0.5)"
            }, 
          ]
          },
          options: {
            animation: {
              duration: 0, // general animation time
            },
            hover: {
              animationDuration: 0, // duration of animations when hovering an item
            },
            responsiveAnimationDuration: 0, // animation duration after a resize
            elements: {
              line: {
                tension: 0, // disables bezier curves
                borderJoinStyle: 'round',
                borderWidth: 1
              },
              point: {
                radius: 0
              }
            },

            legend: {
              display: false,
              position: 'right',
              labels: {
                boxWidth: 20,
                fontColor: 'black'
              }
            },
            scales: {
              xAxes: [{
                type: 'time',
                time: {
                  unit: 'month',
                  unitStepSize: 1,
                  displayFormats: {
                    'hour': 'MMM D'
                  }
                },
                gridLines: {
                  display: false,
                  color: "rgba(242,242,242,1)"
                },
                scaleLabel: {
                  display: true,
                  labelString: "Time"
                },
                ticks: {
                  maxRotation: 90,
                  minRotation: 90
                }
              }],
              yAxes: [
                {
                  ticks: {
                    min: 0
                  },
                  gridLines: {
                    display: false,
                    color: "rgba(242,242,242,1)"
                  },
                  scaleLabel: {
                    display: true,
                    labelString: "ug/m^3"
                  }
                }
              ]
            }
          }
        });
    console.log("createBarChart()")
  }

  /**
   * Configure the pm25 chart, define configuration options
   *
   */
  createPM25Chart(): void {
    this.PM25ChartEl = new Chart(this.PM25Chart.nativeElement,
      {
        type: 'line',
        data: {
          datasets: [{
            label: "",
            data: this.pm25data,
            fill: true,
            borderColor: "rgba(121,0,252,1)",
            backgroundColor: "rgba(121,0,252, 0.5)"
          }]
        },
        options: {
          animation: {
            duration: 0, // general animation time
          },
          hover: {
            animationDuration: 0, // duration of animations when hovering an item
          },
          responsiveAnimationDuration: 0, // animation duration after a resize
          elements: {
            line: {
              tension: 0, // disables bezier curves
              borderJoinStyle: 'round',
              borderWidth: 1
            },
            point: {
              radius: 0
            }
          },

          legend: {
            display: false,
            position: 'right',
            labels: {
              boxWidth: 20,
              fontColor: 'black'
            }
          },
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: 'hour',
                unitStepSize: 24,
                displayFormats: {
                  'hour': 'MMM D hA'
                }
              },
              gridLines: {
                display: false,
                color: "rgba(242,242,242,1)"
              },
              scaleLabel: {
                display: true,
                labelString: "Time"
              },
              ticks: {
                autoSkip: false,
                maxRotation: 90,
                minRotation: 90
              }
            }],
            yAxes: [
              {
                gridLines: {
                  display: false,
                  color: "rgba(242,242,242,1)"
                },
                scaleLabel: {
                  display: true,
                  labelString: "ug/m^3"
                },
                ticks: {
                  min:0
                }
              }
            ]
          }
        }
      });
    console.log("createPM25Chart()")
  }

  /**
   *
   * Configure the temperature chart, define configuration options
   *
   */
  createTempChart(): void {
    this.TempChartEl = new Chart(this.TempChart.nativeElement,
      {
        type: 'line',
        data: {
          datasets: [{
            label: "",
            data: this.Tempdata,
            fill: true,
            borderColor: "rgba(241,133,61,1)",
            backgroundColor: "rgba(241,133,61,0.5)"
          }]
        },
        options: {
          animation: {
            duration: 0, // general animation time
          },
          hover: {
            animationDuration: 0, // duration of animations when hovering an item
          },
          responsiveAnimationDuration: 0, // animation duration after a resize
          elements: {
            line: {
              tension: 0, // disables bezier curves
              borderJoinStyle: 'round',
              borderWidth: 1
            },
            point: {
              radius: 0
            }
          },

          legend: {
            display: false,
            position: 'right',
            labels: {
              boxWidth: 20,
              fontColor: 'black'
            }
          },
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: 'hour',
                unitStepSize: 24,
                displayFormats: {
                  'hour': 'MMM D hA'
                }
              },
              gridLines: {
                display: false,
                color: "rgba(242,242,242,1)"
              },
              scaleLabel: {
                display: true,
                labelString: "Time"
              },
              ticks: {
                autoSkip: false,
                maxRotation: 90,
                minRotation: 90
              }
            }],
            yAxes: [
              {
                gridLines: {
                  display: false,
                  color: "rgba(242,242,242,1)"
                },
                scaleLabel: {
                  display: true,
                  labelString: "F"
                },
                ticks: {
                  min: -10
                }
              }
            ]
          }
        }
      });
    console.log("createTempChart()")
  }
}