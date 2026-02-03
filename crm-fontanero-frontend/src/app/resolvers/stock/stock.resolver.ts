import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { inject } from '@angular/core';
import { StockItem } from '../../components/main/pages/stock/models/stock.models';
import { StockService } from '../../components/main/pages/stock/services/stock.service';

export const stockResolver: ResolveFn<StockItem[]> = () => {
  const stockService = inject(StockService);
  return stockService.getItems().pipe(catchError(() => of([])));
};
