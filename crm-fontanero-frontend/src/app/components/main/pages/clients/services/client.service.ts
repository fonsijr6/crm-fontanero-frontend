import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client, NewClient } from '../models/client';
import { BaseApiService } from '../../../../../services/base-api.service';

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

  createClient(data: Partial<NewClient>): Observable<NewClient> {
    return this.post<NewClient>(data);
  }

  updateClient(id: string, data: Partial<Client>): Observable<Client> {
    return this.put<Client>(id, data);
  }

  deleteClient(id: string): Observable<Client> {
    return this.delete(id);
  }
}
