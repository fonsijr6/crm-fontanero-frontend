import { Component, inject, OnInit } from '@angular/core';
import { Client } from '../models/client';
import { CommonModule } from '@angular/common';
import { ClientService } from '../services/client.service';
import { catchError, of, take, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-clients',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ClientComponent implements OnInit {
  private clientService = inject(ClientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  clients: Client[] = this.route.snapshot.data['clients'] ?? []; // Cargo previamente los clientes antes de pintar el componente
  loading = false;

  ngOnInit() {}
  reload() {
    this.loading = true;

    this.clientService
      .getClients()
      .pipe(
        take(1),
        tap((clients) => {
          this.clients = clients ?? [];
          this.loading = false;
        }),
        catchError((err) => {
          this.loading = false;
          console.log('error', err);
          return of([]);
        }),
      )
      .subscribe();
  }

  goStock() {
    this.router.navigate(['/stock']);
  }
}
