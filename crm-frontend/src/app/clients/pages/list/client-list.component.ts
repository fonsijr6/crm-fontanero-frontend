// src/app/clients/pages/list/clients-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ClientService, Client } from '../../services/client.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clients-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
  imports: [CommonModule]
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  loading = false;

  constructor(private clientsSvc: ClientService) {}
  ngOnInit() { this.reload(); }
  reload() {
    this.loading = true;
    this.clientsSvc.list().subscribe({
      next: (res) => this.clients = res,
      error: (err) => console.error(err)
    }).add(() => this.loading = false);
  }
}
