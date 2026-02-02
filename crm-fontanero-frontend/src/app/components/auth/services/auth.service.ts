import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.dev';
import { AUTH_API } from '../constants/auth-api-const';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private token$ = new BehaviorSubject<string | null>(
    this.isBrowser() ? localStorage.getItem('token') : null,
  );

  private isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  get accessToken() {
    return this.token$.value;
  }

  setToken(token: string | null) {
    if (!this.isBrowser()) return;

    if (token) {
      localStorage.setItem('token', token);
      this.token$.next(token);
    } else {
      localStorage.removeItem('token');
      this.token$.next(null);
    }
  }

  login(data: { email: string; password: string }) {
    return this.http
      .post<any>(`${environment.apiUrl}${AUTH_API.LOGIN}`, data, { withCredentials: true })
      .pipe(tap((res) => this.setToken(res.token)));
  }

  refresh() {
    return this.http
      .post<any>(`${environment.apiUrl}${AUTH_API.REFRESH}`, {}, { withCredentials: true })
      .pipe(tap((res) => this.setToken(res.token)));
  }

  logout() {
    this.setToken(null);
    return this.http.post(`${environment.apiUrl}${AUTH_API.LOGOUT}`, {}, { withCredentials: true });
  }
}
