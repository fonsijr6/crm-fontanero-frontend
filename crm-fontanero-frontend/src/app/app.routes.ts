import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './components/main/pages/main-layout.component';
import { clientsResolver } from './resolvers/clients/client.resolver';
import { stockResolver } from './resolvers/stock/stock.resolver';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/pages/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        resolve: { clients: clientsResolver, stock: stockResolver },
        loadComponent: () =>
          import('./components/main/pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      // CLIENTES
      {
        path: 'clients',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./components/main/pages/clients/pages/client.component').then(
                (m) => m.ClientComponent,
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./components/main/pages/clients/pages/new-client/new-client.component').then(
                (m) => m.NewClientComponent,
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./components/main/pages/clients/pages/edit-client/edit-client.component').then(
                (m) => m.EditClientComponent,
              ),
          },
          {
            path: 'detail/:id',
            loadComponent: () =>
              import('./components/main/pages/clients/pages/detail-client/detail-client.component').then(
                (m) => m.DetailClientComponent,
              ),
          },
        ],
      },
      // STOCK
      {
        path: 'stock',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./components/main/pages/stock/pages/stock.component').then(
                (m) => m.StockComponent,
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./components/main/pages/stock/pages/new-stock-item/new-stock-item.component').then(
                (m) => m.NewStockItemComponent,
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./components/main/pages/stock/pages/edit-stock-item/edit-stock-item.component').then(
                (m) => m.EditStockItemComponent,
              ),
          },
          // {
          //   path: 'detail/:id',
          //   loadComponent: () =>
          //     import('./components/main/pages/stock-item-detail.component').then(
          //       (m) => m.StockItemComponent,
          //     ),
          // },
        ],
      },
      // AGENDA
      // {
      //   path: 'agend',
      //   loadComponent: () =>
      //     import('./components/main/pages/agenda.component')
      //       .then(m => m.AgendaComponent)
      // }
    ],
  },
];
@NgModule({ imports: [], exports: [RouterModule] })
export class AppRouter {}
