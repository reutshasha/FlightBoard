import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Flight } from '../../shared/models/flight';
import { ApiResponse } from '../../shared/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.SERVER_BASE_API_URL;

  private http = inject(HttpClient);

  //TODO: 
  login(username: string, password: string): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}Auth/login`, { username, password });
  }

  getAllFlights(status?: string, destination?: string): Observable<ApiResponse<Flight[]>> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (destination) params = params.set('destination', destination);
    return this.http.get<ApiResponse<Flight[]>>(`${this.baseUrl}Flights`, { params });
  }

  addFlight(flight: Flight): Observable<Flight> {
    return this.http.post<Flight>(`${this.baseUrl}Flights`, flight);
  }

  deleteFlight(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}Flights/${id}`);
  }

}