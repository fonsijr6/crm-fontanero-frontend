// src/app/clients/services/clients.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Client {
  _id: string;
  name: string;
  phone?: string;
  address?: string;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class ClientService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient) {}
  list() { return this.http.get<Client[]>(`${this.base}/clients`); }
  create(payload: Omit<Client, '_id'>) { return this.http.post<Client>(`${this.base}/clients`, payload); }
}
``