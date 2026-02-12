import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../../services/base-api.service';
import { StockItem } from '../models/stock.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StockService extends BaseApiService {
  constructor() {
    super();
    this.setController('stock');
  }

  getItems(): Observable<StockItem[]> {
    return this.getAll<StockItem[]>();
  }
  getItemById(id: string): Observable<StockItem> {
    return this.getOne<StockItem>(id);
  }
  createItem(data: any): Observable<StockItem> {
    return this.post<StockItem>(data);
  }
  updateItem(id: string, data: any): Observable<StockItem> {
    return this.put<StockItem>(id, data);
  }
  deleteItem(id: string): Observable<void> {
    return this.delete<void>(id);
  }
}
