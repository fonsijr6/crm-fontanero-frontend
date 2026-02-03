import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, of, take, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { StockService } from '../services/stock.service';
import { StockItem } from '../models/stock.models';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class StockComponent implements OnInit {
  private stockService = inject(StockService);
  private route = inject(ActivatedRoute);

  stock: StockItem[] = this.route.snapshot.data['stock'] ?? []; // Cargo previamente los items
  loading = false;

  ngOnInit() {}
  reload() {
    this.loading = true;

    this.stockService
      .getItems()
      .pipe(
        take(1),
        tap((items) => {
          this.stock = items ?? [];
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
}
