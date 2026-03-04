import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatButtonModule],
  templateUrl: './detail-client.component.html',
  styleUrls: ['./detail-client.component.css'],
})
export class DetailClientComponent{

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { name: string, phone: string, address: string, notes: string },
    private dialogRef: MatDialogRef<DetailClientComponent>,
  ) {
    console.log('DATA RECIBIDO →', this.data);
  }

  close() {
    this.dialogRef.close();
  }

  // Avatar
  private avatarPalette = [
    '#e0e7ff',
    '#dbeafe',
    '#e9d5ff',
    '#f5d0fe',
    '#cffafe',
    '#e0f2fe',
    '#d1fae5',
    '#fde68a',
  ];

  private hashCode(str: string): number {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }

  getAvatarBg(name: string): string {
    const i = this.hashCode(name || 'x') % this.avatarPalette.length;
    return this.avatarPalette[i];
  }

  getAvatarFg(name: string): string {
    const bg = this.getAvatarBg(name).replace('#', '');
    const r = parseInt(bg.substring(0, 2), 16);
    const g = parseInt(bg.substring(2, 4), 16);
    const b = parseInt(bg.substring(4, 6), 16);
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma > 180 ? '#0f172a' : '#ffffff';
  }

   // Iniciales
  getInitials(fullName: string | null | undefined): string {
    const clean = (fullName ?? '').trim();
    if (!clean) return '??';

    const parts = clean.split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';

    return (first + last).toUpperCase();
  }
}
