import { inject, Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MainLayoutService {
  private readonly router = inject(Router);

  // Navegación
  navigateTo(path: string, extras?: any): void {
    this.router.navigate([path], extras);
  }
}
