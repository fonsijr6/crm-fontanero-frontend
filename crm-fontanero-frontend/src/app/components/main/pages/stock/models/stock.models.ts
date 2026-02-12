export interface StockItem {
  _id: string;
  name: string;
  typeMaterial: string;
  warehouseUnits?: number;
  vanUnits?: number;
}

// DTO de creación: lo que espera el backend en POST
export type NewStockItem = Omit<StockItem, '_id'>;
