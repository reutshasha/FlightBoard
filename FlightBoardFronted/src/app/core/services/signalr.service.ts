import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Flight } from '../../shared/models/flight';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

   private hubConnection!: signalR.HubConnection;

  flightAdded$ = new Subject<Flight>();
  flightDeleted$ = new Subject<number>();
  private baseUrl = environment.SERVER_BASE_API_URL;

  public startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.baseUrl.replace(/\/api\/?$/, '') + '/Hubs/flightHub') 
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connected'))
      .catch((err: any) => console.error('SignalR connection error:', err));

    this.hubConnection.on('FlightAdded', (flight: Flight) => {
      this.flightAdded$.next(flight);
    });

    this.hubConnection.on('FlightDeleted', (id: number) => {
      this.flightDeleted$.next(id);
    });
  }
}
