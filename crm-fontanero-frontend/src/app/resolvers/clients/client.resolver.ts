import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { Client } from '../../components/clients/models/client';
import { ClientService } from '../../components/clients/services/client.service';
import { inject } from '@angular/core';

export const clientsResolver: ResolveFn<Client[]> = () => {
  const clientService = inject(ClientService);
  return clientService.getClients().pipe(catchError(() => of([])));
};
