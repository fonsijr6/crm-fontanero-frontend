import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/pages/login.component';
import { NgModule } from '@angular/core';
import { ClientComponent } from './components/clients/pages/client.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'clients',
    component: ClientComponent
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
//   { path: '**', redirectTo: 'clients' }
];

@NgModule({ imports: [], exports: [RouterModule] })
export class AppRouter {}
