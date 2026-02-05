export interface Client {
  _id: string;
  name: string;
  surname1: string;
  surname2?: string;
  phone: string;
  address: string;
  notes?: string;
  createdAt?: moment.Moment;
}

// DTO de creación: lo que espera el backend en POST
export type NewClient = Omit<Client, '_id' | 'createdAt'>;

// ViewModel para las cards
export type ClientCardVm = Pick<Client, '_id' | 'phone' | 'address'> & {
  name: string; // nombre completo formateado
  notes: string; // forzamos string para evitar 'undefined' en vista
  avatarUrl?: string; // opcional
};

// Información últimos clientes
export type LatestClient = Pick<Client, '_id' | 'name' | 'address' | 'phone' | 'createdAt'>;
