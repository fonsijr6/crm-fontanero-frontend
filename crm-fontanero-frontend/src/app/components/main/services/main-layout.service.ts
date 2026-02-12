import { Location } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MainLayoutService {
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  // Navegación
  navigateTo(path: string, extras?: any): void {
    this.router.navigate([path], extras);
  }

  // Volver ppantalla anterior
  onBack(): void {
    this.location.back();
  }
}
