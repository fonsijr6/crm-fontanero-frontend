import { Component, inject, OnInit } from '@angular/core';
import { Client, ClientCardVm } from '../models/client';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MainLayoutService } from '../../../services/main-layout.service';
import { ROUTES_API } from '../../../../../constants/routes/routes.const';
import { ClientService } from '../services/client.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from './confirm-delete/confirm-delete-dialog.component';
import { FeedbackService } from '../../../services/feedback.service';
import { LoadingService } from '../../../../../core';
import { catchError, finalize, of, switchMap, take, tap } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { ClientMapper } from '../mapper/client-mapper';

@Component({
  selector: 'app-clients',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
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
export class ClientComponent implements OnInit {
  private readonly mainLayoutService = inject(MainLayoutService);
  private readonly clientService = inject(ClientService);
  private readonly dialog = inject(MatDialog);
  private readonly feedbackService = inject(FeedbackService);
  private readonly loadingService = inject(LoadingService);

  // Listas
  clients: Client[] = [];
  clientCard: ClientCardVm[] = [];
  filtered: ClientCardVm[] = [];

  filterText = '';
  loading = false;

  ngOnInit(): void {
    this.loadClients();
  }

  // Obtener clientes del backend
  loadClients(): void {
    this.loadingService.show();

    this.clientService
      .getClients()
      .pipe(
        take(1),
        tap((clients) => {
          console.log('CLIENTES RECARGADOS:', clients);
          console.log('FILTERED ANTES:', this.filtered);

          this.clients = [...clients];
          this.mapFiltered();
          this.applyFilter();
        }),
        finalize(() => this.loadingService.hide()),
      )
      .subscribe();
  }

  // Convertir Client → ClientCardVm
  mapFiltered(): void {
    this.clientCard = this.clients.map(ClientMapper.toClientCardVm);
  }

  // Filtro de búsqueda
  applyFilter(): void {
    const toCompare = this.normalize(this.filterText);

    if (!toCompare) {
      this.filtered = [...this.clientCard];
      return;
    }

    this.filtered = this.clientCard.filter(
      (vm) =>
        this.normalize(vm.name).includes(toCompare) ||
        this.normalize(vm.phone).includes(toCompare) ||
        this.normalize(vm.address).includes(toCompare) ||
        this.normalize(vm.notes).includes(toCompare),
    );

    console.log('FILTERED DESPUÉS DEL FILTRO:', this.filtered);
  }

  clearFilter(): void {
    this.filterText = '';
    this.applyFilter();
  }

  // Normalización para búsqueda
  private normalize(s?: string): string {
    return (s ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .trim();
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
  onEdit(cc: ClientCardVm) {
    this.mainLayoutService.navigateTo(`${ROUTES_API.EDIT_CLIENT}/${cc._id}`);
  }

  onView(cc: ClientCardVm) {
    this.mainLayoutService.navigateTo(`${ROUTES_API.VIEW_CLIENT}/${cc._id}`);
  }

  // Eliminar
  onDelete(cc: ClientCardVm) {
    this.dialog
      .open(ConfirmDeleteDialogComponent, { data: { name: cc.name } })
      .afterClosed()
      .pipe(
        take(1),
        switchMap((confirmed) =>
          confirmed
            ? (this.loadingService.show(), this.clientService.deleteClient(cc._id))
            : of(null),
        ),
        tap(() => {
          Swal.fire({
            title: '¡Operación exitosa!',
            text: 'Cliente eliminado con éxito.',
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
          return this.clientService.getClients().pipe(
            tap((clients) => {
              this.clients = [...clients];
              this.mapFiltered();
              this.applyFilter();
            }),
          );
        }),
        catchError(() => {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el cliente.',
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
