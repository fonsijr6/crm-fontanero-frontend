import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TokenStorageService } from '../../core/services/token-storage.service';

type LoginResponse = { accessToken: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private tokenStorage = inject(TokenStorageService);

  private base = environment.apiUrl;


  login(payload: { email: string; password: string }) {
    return this.http.post<LoginResponse>(`${this.base}/auth/login`, payload);
  }

  saveToken(token: string) { this.tokenStorage.set(token); }
  getToken() { return this.tokenStorage.get(); }
  isAuthenticated() { return !!this.tokenStorage.get(); }
  logout() { this.tokenStorage.remove(); }
}