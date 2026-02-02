import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { authGuard } from './components/auth/guards/auth.guard';
import { clientsResolver } from './resolvers/clients/client.resolver';
import { stockResolver } from './resolvers/stock/stock.resolver';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/pages/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/main/pages/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'clients',
    canActivate: [authGuard],
    resolve: { clients: clientsResolver },
    loadComponent: () =>
      import('./components/clients/pages/client.component').then((m) => m.ClientComponent),
  },
  {
    path: 'stock',
    canActivate: [authGuard],
    resolve: { stock: stockResolver },
    loadComponent: () =>
      import('./components/stock/pages/stock.component').then((m) => m.StockComponent),
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];

@NgModule({ imports: [], exports: [RouterModule] })
export class AppRouter {}
