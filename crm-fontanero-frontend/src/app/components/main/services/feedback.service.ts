import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private readonly snackbar = inject(MatSnackBar);

  success(message: string) {
    this.snackbar.open(message, 'OK', {
      duration: 3000,
      panelClass: ['snackbar-success'],
    });
  }

  error(message: string) {
    this.snackbar.open(message, 'Cerrar', {
      duration: 4000,
      panelClass: ['snackbar-error'],
    });
  }
}
