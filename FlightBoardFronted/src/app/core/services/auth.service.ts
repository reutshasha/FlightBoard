import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string | null = null;
  private readonly tokenKey = 'auth_token';
  private readonly refreshTokenKey = 'refresh_token';
  private baseUrl = environment.SERVER_BASE_API_URL;

  private http = inject(HttpClient);

  login(username: string, password: string): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}Auth/login`, { username, password });
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, JSON.stringify(token));
    localStorage.setItem('token_expiry', (Date.now() + 10 * 60 * 1000).toString());
  }

  async getTokenAsync(): Promise<Observable<string | null>> {

    const token = localStorage.getItem('authToken');
    if (token) {
      const tokenObject = JSON.parse(token);
      console.log(tokenObject.accessToken);
    }
    return of(token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  saveTokenLocalStorage() {
    if (this.token) {
      localStorage.setItem(this.tokenKey, this.token);
      localStorage.setItem('token_expiry', (Date.now() + 10 * 60 * 1000).toString());

    }
  }


}

