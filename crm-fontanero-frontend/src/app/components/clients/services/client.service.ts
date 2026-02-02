import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../services/base-api.service';
import { Client } from '../models/client';

@Injectable({
  providedIn: 'root',
})
export class ClientService extends BaseApiService {
  constructor() {
    super();
    this.setController('clients');
  }

  getClients(): Observable<Client[]> {
    return this.getAll<Client[]>();
  }

  getClientById(id: string): Observable<Client> {
    return this.getOne<Client>(id);
  }

  createClient(data: Partial<Client>): Observable<Client> {
    return this.post<Client>(data);
  }

  updateClient(id: string, data: Partial<Client>): Observable<Client> {
    return this.put<Client>(id, data);
  }

  deleteClient(id: string): Observable<any> {
    return this.delete(id);
  }
}
