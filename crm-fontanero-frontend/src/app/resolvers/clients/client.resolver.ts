import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { inject } from '@angular/core';
import { ClientService } from '../../components/main/pages/clients/services/client.service';
import { Client } from '../../components/main/pages/clients/models/client';

export const clientsResolver: ResolveFn<Client[]> = () => {
  const clientService = inject(ClientService);
  return clientService.getClients().pipe(catchError(() => of([])));
};
