import { Component, inject, OnInit } from "@angular/core";
import { Client } from "../../../models/client";
import { CommonModule } from "@angular/common";
import { ClientService } from "../services/client.service";
import { catchError, of, take, tap } from "rxjs";

@Component({
  selector: 'app-clients',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
  standalone: true,
  imports: []
})
export class ClientComponent implements OnInit {
  private clientService = inject(ClientService);
  clients: Client[] = [];
  loading = false;

  
  ngOnInit() { this.reload(); }
  reload() {
    this.clientService.getClients().pipe(
      take(1),
      tap((clients) => {
        console.log('clientes', clients)
        this.clients = clients;
      }),
      catchError((err) => {return of(undefined); console.log('error', err)})
    ).subscribe();
  }
}