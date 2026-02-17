import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, finalize, of, switchMap, take, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { StockService } from '../services/stock.service';
import { StockItem } from '../models/stock.models';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MainLayoutService } from '../../../services/main-layout.service';
import { LoadingService } from '../../../../../core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteItemDialogComponent } from './confirm-delete/confirm-delete-item-dialog.component';
import Swal from 'sweetalert2';
import { ROUTES_API } from '../../../../../constants/routes/routes.const';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    FormsModule,
  ],
})
export class StockComponent implements OnInit {
  private stockService = inject(StockService);
  private readonly mainLayoutService = inject(MainLayoutService);
  private readonly dialog = inject(MatDialog);
  private readonly loadingService = inject(LoadingService);
  private route = inject(ActivatedRoute);

  loading = false;

  filterText = '';
  stock: StockItem[] = [];
  filtered: StockItem[] = [];

  ngOnInit(): void {
    this.loadStock();
  }

  loadStock(): void {
    this.loadingService.show();

    this.stockService
      .getItems()
      .pipe(
        take(1),
        tap((stock) => {
          this.stock = [...stock];
          this.applyFilter();
        }),
        finalize(() => this.loadingService.hide()),
      )
      .subscribe();
  }

  applyFilter() {
    const q = this.filterText.toLowerCase().trim();
    this.filtered = this.stock.filter(
      (i) => !q || i.name.toLowerCase().includes(q) || i.typeMaterial.toLowerCase().includes(q),
    );
  }

  clearFilter() {
    this.filterText = '';
    this.applyFilter();
  }

  getTotal(i: StockItem) {
    return (i.warehouseUnits || 0) + (i.vanUnits || 0);
  }

  /* Acciones */
  onIncreaseWarehouse(i: StockItem) {
    i.warehouseUnits = (i.warehouseUnits || 0) + 1;
  }
  onDecreaseWarehouse(i: StockItem) {
    i.warehouseUnits = Math.max(0, (i.warehouseUnits || 0) - 1);
  }

  onIncreaseVan(i: StockItem) {
    i.vanUnits = (i.vanUnits || 0) + 1;
  }
  onDecreaseVan(i: StockItem) {
    i.vanUnits = Math.max(0, (i.vanUnits || 0) - 1);
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

  /* Reutilizas los mismos helpers que en Clientes */
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

  // Acciones
  onView(item: StockItem) {
    this.mainLayoutService.navigateTo(`${ROUTES_API.VIEW_ITEM}/${item._id}`);
  }

  onUpdate(item: StockItem) {
    this.stockService
      .updateItem(item._id, item)
      .pipe(
        take(1),
        tap(() => this.loadingService.show()),
        tap(() => {
          Swal.fire({
            title: '¡Operación exitosa!',
            text: `Se ha actualizado el material correctamente`,
            icon: 'success',
            iconColor: '#22c55e',
            timer: 2000,
            showConfirmButton: false,
            background: '#ffffff',
            color: '#1f2937',
            width: '420px',
            padding: '1.4rem',
            backdrop: `rgba(0, 0, 0, 0.15)`,
          });
        }),
        tap(() => this.loadStock()),
      )
      .subscribe()
      .add(() => {
        this.loading = false;
        this.loadingService.hide();
      });
  }

  onEdit(item: StockItem) {
    this.mainLayoutService.navigateTo(`${ROUTES_API.EDIT_ITEM}/${item._id}`);
  }
  // Eliminar
  onDelete(item: StockItem) {
    this.dialog
      .open(ConfirmDeleteItemDialogComponent, { data: { name: item.name } })
      .afterClosed()
      .pipe(
        take(1),
        switchMap((confirmed) =>
          confirmed
            ? (this.loadingService.show(), this.stockService.deleteItem(item._id))
            : of(null),
        ),
        tap(() => {
          Swal.fire({
            title: '¡Operación exitosa!',
            text: 'Material eliminado con éxito.',
            icon: 'success',
            iconColor: '#22c55e',
            timer: 3000,
            showConfirmButton: false,
            background: '#ffffff',
            color: '#1f2937',
            width: '420px',
            padding: '1.4rem',
            backdrop: `rgba(0, 0, 0, 0.15)`,
          });
        }),
        switchMap(() => {
          return this.stockService.getItems().pipe(
            tap((stock) => {
              this.stock = [...stock];
              this.applyFilter();
            }),
          );
        }),
        catchError(() => {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el material.',
            icon: 'error',
            iconColor: '#dc2626',
            background: '#fee2e2',
            color: '#7f1d1d',
            confirmButtonColor: '#dc2626',
            confirmButtonText: 'Entendido',
            width: '420px',
            padding: '1.4rem',
            backdrop: `rgba(0, 0, 0, 0.25)`,
          });

          return of(null);
        }),
        finalize(() => this.loadingService.hide()),
      )
      .subscribe();
  }
}
