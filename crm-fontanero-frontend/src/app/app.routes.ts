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
      import('./components/auth/pages/login.component').then(
        (m) => m.LoginComponent
      ),
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
        loadComponent: () =>
          import('./components/main/pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'clients',
        children: [
          {
            path: '',
            resolve: clientsResolver,
            loadComponent: () =>
              import('./components/main/pages/clients/pages/client.component').then(
                (m) => m.ClientComponent,
              ),
          },
          // {
          //   path: 'new',
          //   loadComponent: () =>
          //     import('./components/main/pages/new-client.component').then(
          //       (m) => m.NewClientComponent,
          //     ),
          // },
          // {
          //   path: 'edit',
          //   loadComponent: () =>
          //     import('./components/main/pages/edit-client.component').then(
          //       (m) => m.NewClientComponent,
          //     ),
          // },
          // {
          //   path: ':id',
          //   loadComponent: () =>
          //     import('./components/main/pages/client-detail.component').then(
          //       (m) => m.ClientDetailComponent,
          //     ),
          // },
        ],
      },
      // STOCK
      {
        path: 'stock',
        children: [
          {
            path: '',
            resolve: stockResolver,
            loadComponent: () =>
              import('./components/main/pages/stock/pages/stock.component').then(
                (m) => m.StockComponent,
              ),
          },
          // {
          //   path: 'new',
          //   loadComponent: () =>
          //     import('./components/main/pages/new-stock-item.component').then(
          //       (m) => m.NewStockComponent,
          //     ),
          // },
          // {
          //   path: 'edit',
          //   loadComponent: () =>
          //     import('./components/main/pages/edit-stock-item.component').then(
          //       (m) => m.NewStockComponent,
          //     ),
          // },
          // {
          //   path: ':id',
          //   loadComponent: () =>
          //     import('./components/main/pages/stock-item-detail.component').then(
          //       (m) => m.StockItemComponent,
          //     ),
          // },
        ],
      },
      // AGENDA
      // {
      //   path: 'agenda',
      //   loadComponent: () =>
      //     import('./components/main/pages/agenda.component')
      //       .then(m => m.AgendaComponent)
      // }
    ],
  },
];
@NgModule({ imports: [], exports: [RouterModule] })
export class AppRouter {}
