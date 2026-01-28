import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './auth/pages/login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'clients',
    canActivate: [AuthGuard],
    loadComponent: () => import('./clients/pages/list/client-list.component').then(m => m.ClientListComponent)
  },
  { path: '', pathMatch: 'full', redirectTo: 'clients' },
  { path: '**', redirectTo: 'clients' }
];

@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class AppRoutingModule {}