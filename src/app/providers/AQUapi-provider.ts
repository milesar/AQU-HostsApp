import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class RestProvider {
    
    end: Date = new Date();
    dayRange: number = 3;
    dataRate: number = 30;
    start: Date = new Date(Date.now() - this.dayRange * 86400000);
    startDateTime: string = this.start.toISOString();
    
    endDateTime: string = this.end.toISOString();
    sensorID: string = 'S-A-085';

    baseUrl: string = "";
    response: any[];
    constructor(private httpClient: HttpClient) { 

        this.baseUrl = `https://air.eng.utah.edu/dbapi/api/processedDataFrom?id=${this.sensorID}
                &sensorSource=airu
                &start=${this.startDateTime}
                &end=${this.endDateTime}
                &function=mean
                &functionArg=pm25,Temp
                &timeInterval=30m`;
    }

    // Sending a GET request to /AQU api. 
    // /api/rawDataFrom ? id = <id>& sensorSource=<sensor source >& start=<start date >& end=<end date >& show=<what to show >
    // Get the raw data none aggregated(not averaged) from a start date to an end date for a specific sensor from a specific source(airu or PurpleAir). 
    // < id >= sensor id for airUs, the id for PurpleAirs, the location for DAQs, to be sure of the IDs for example for DAQ please use the call air.eng.utah.edu / dbapi / api / liveSensors / purpleAir and look for DAQ sensors.For airUs and PurpleAir sensor you can get the ID from the map.
    // < sensor source > = airu; PurpleAir for PurpleAir, DAQ or Mesowest sensors
    // < start date > = YYYY - MM - DDTHH: MM: SSZ e.g. 2018 - 03 - 01T00: 00: 00Z
    // < end date > = YYYY - MM - DDTHH: MM: SSZ e.g. 2018 - 03 - 01T00: 00: 00Z
    // < what to show > = datastreams (temperature, co, no, etc).
    
    public getData() {
        this.httpClient.get<any[]>(this.baseUrl);
    }
}