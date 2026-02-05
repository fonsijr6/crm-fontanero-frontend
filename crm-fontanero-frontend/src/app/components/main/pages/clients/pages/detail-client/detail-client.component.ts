import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client';
import { take, tap } from 'rxjs';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-client.component.html',
  styleUrls: ['./detail-client.component.css'],
})
export class DetailClientComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly clientService = inject(ClientService);

  client: Client | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.clientService
      .getClientById(id)
      .pipe(
        take(1),
        tap((c) => (this.client = c)),
      )
      .subscribe();
  }
}
