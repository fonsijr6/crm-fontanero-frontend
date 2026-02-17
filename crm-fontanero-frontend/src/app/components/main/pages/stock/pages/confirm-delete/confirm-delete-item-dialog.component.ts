import { Component, Inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>Eliminar material</h2>

    <mat-dialog-content>
      <p>
        ¿Seguro que quieres eliminar "<strong>{{ data.name }}</strong>"?
      </p>
      <p style="color: #d32f2f;">Esta acción no se puede deshacer.</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="warn" (click)="onConfirm()">Eliminar</button>
    </mat-dialog-actions>
  `,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
})
export class ConfirmDeleteItemDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { name: string },
    private dialogRef: MatDialogRef<ConfirmDeleteItemDialogComponent>,
  ) {}

  onCancel() {
    this.dialogRef.close(false);
  }

  onConfirm() {
    this.dialogRef.close(true);
  }
}
