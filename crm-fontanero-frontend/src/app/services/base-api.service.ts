import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.dev';

export abstract class BaseApiService {
  protected http = inject(HttpClient);
  private controller = '';

  protected setController(controller: string): void {
    this.controller = controller;
  }

  // Construye la URL final: /api/controller/ + segmentos
  private url(path: string = ''): string {
    return `${environment.apiUrl}/${this.controller}${path}`;
  }

  // Métodos base
  protected getAll<T>(): Observable<T> {
    return this.http.get<T>(this.url());
  }

  protected getOne<T>(id: string): Observable<T> {
    return this.http.get<T>(this.url(`/${id}`));
  }

  protected post<T>(body: any): Observable<T> {
    return this.http.post<T>(this.url(), body);
  }

  protected put<T>(id: string, body: any): Observable<T> {
    return this.http.put<T>(this.url(`/${id}`), body);
  }

  protected delete<T>(id: string): Observable<T> {
    return this.http.delete<T>(this.url(`/${id}`));
  }
}
