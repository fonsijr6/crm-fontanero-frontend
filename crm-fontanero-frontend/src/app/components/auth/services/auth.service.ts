import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.dev';
import { AUTH_API } from '../constants/auth-api-const';
import { LoginResponse } from '../models/auth.models';
import { SafeStorage } from '../../../core/safe-storage-service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(SafeStorage);

  // No leemos localStorage aquí para evitar SSR issues
  private token$ = new BehaviorSubject<string | null>(null);

  constructor() {
    // Cargar token de forma segura solo en navegador
    const existing = this.storage.getItem('token');
    if (existing) {
      this.token$.next(existing);
    }
  }

  get accessToken(): string | null {
    return this.token$.value;
  }

  setToken(token: string | null) {
    if (token) {
      this.storage.setItem('token', token);
      this.token$.next(token);
    } else {
      this.storage.removeItem('token');
      this.token$.next(null);
    }
  }

  login(data: { email: string; password: string }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}${AUTH_API.LOGIN}`, data, {
        withCredentials: true,
      })
      .pipe(tap((res) => this.setToken(res.token)));
  }

  refresh(): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${environment.apiUrl}${AUTH_API.REFRESH}`,
        {},
        { withCredentials: true },
      )
      .pipe(tap((res) => this.setToken(res.token)));
  }

  logout(): Observable<void> {
    this.setToken(null);
    return this.http.post<void>(
      `${environment.apiUrl}${AUTH_API.LOGOUT}`,
      {},
      { withCredentials: true },
    );
  }
}
