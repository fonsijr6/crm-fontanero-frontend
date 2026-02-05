import { Component, inject, OnInit } from '@angular/core';
import { Client, ClientCardVm } from '../models/client';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ClientMapper } from '../mapper/client-mapper';
import { FormsModule } from '@angular/forms';
import { MainLayoutService } from '../../../services/main-layout.service';
import { ROUTES_API } from '../../../../../constants/routes/routes.const';
import { ClientService } from '../services/client.service';
import { catchError, finalize, of, switchMap, take, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from './confirm-delete/confirm-delete-dialog.component';
import { FeedbackService } from '../../../services/feedback.service';
import { LoadingService } from '../../../../../core';

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
    ScrollingModule,
    FormsModule,
  ],
})
export class ClientComponent implements OnInit {
  private readonly mainLayoutService = inject(MainLayoutService);
  private readonly clientService = inject(ClientService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly feedbackService = inject(FeedbackService);
  private readonly loadingService = inject(LoadingService);

  // Cargo previamente los clients antes de pintar el componente
  clients: Client[] = this.activatedRoute.snapshot.data['clients'] ?? [];

  // Filtro de búsqueda listado clients
  filterText = '';
  clientCard: ClientCardVm[] = [];
  filtered: ClientCardVm[] = [];

  loading = false;

  ngOnInit(): void {
    this.loadingService.show();
    setTimeout(() => this.loadingService.hide(), 2000);

    this.mapFiltered();
    this.applyFilter();
  }

  /**
   * Mapeamos el filtrado
   */
  mapFiltered(): void {
    if (this.clients.length) {
      this.clientCard = this.clients.map(ClientMapper.toClientCardVm);
    }
  }

  /**
   * Aplicamos filtros
   */
  applyFilter(): void {
    const toCompare = this.normalize(this.filterText);
    if (!toCompare) {
      this.filtered = this.clientCard;
      return;
    }
    this.filtered = this.clientCard.filter(
      (vm) =>
        this.normalize(vm.name).includes(toCompare) ||
        this.normalize(vm.phone).includes(toCompare) ||
        this.normalize(vm.address).includes(toCompare) ||
        this.normalize(vm.notes).includes(toCompare),
    );
  }

  /**
   * Normalizar el string sin acentos
   * @param s
   * @returns {string}
   */
  private normalize(s?: string): string {
    return (s ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '') // quita acentos
      .trim();
  }

  /** Devuelve iniciales (máx 2) a partir del nombre completo */
  getInitials(fullName: string | undefined | null): string {
    const clean = (fullName ?? '').trim();
    if (!clean) return '??';
    const parts = clean.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  }

  /** Hash simple para elegir un color consistente por nombre */
  private hashCode(str: string): number {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0; // 32-bit
    }
    return Math.abs(h);
  }

  /** Paleta de fondos suaves (azules/violetas) */
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

  /** Selecciona color de fondo y primer plano accesible */
  getAvatarBg(name: string): string {
    const i = this.hashCode(name || 'x') % this.avatarPalette.length;
    return this.avatarPalette[i];
  }

  getAvatarFg(name: string): string {
    // contraste básico: si el fondo es claro, texto oscuro
    // (técnica Luma aproximada para decidir)
    const bg = this.getAvatarBg(name).replace('#', '');
    const r = parseInt(bg.substring(0, 2), 16);
    const g = parseInt(bg.substring(2, 4), 16);
    const b = parseInt(bg.substring(4, 6), 16);
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma > 180 ? '#0f172a' : '#ffffff'; // slate-900 u blanco
  }

  /**
   * Limpiar filtros
   */
  clearFilter(): void {
    this.filterText = '';
    this.applyFilter();
  }

  // A editar cliente
  onEdit(cc: ClientCardVm) {
    this.mainLayoutService.navigateTo(`${ROUTES_API.EDIT_CLIENT}/${cc._id}`);
  }

  // Eliminar cliente
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
        switchMap((result) => (result ? this.clientService.getClients() : of(null))),
        tap((clients) => {
          if (!clients) return;
          this.clients = clients;
          this.mapFiltered();
          this.applyFilter();
          this.feedbackService.success('Cliente eliminado con éxito ✔');
        }),
        catchError(() => {
          this.feedbackService.error('Error al eliminar el cliente ❌');
          return of(null);
        }),
        finalize(() => this.loadingService.hide()),
      )
      .subscribe();
  }

  // A visualizar perfil cliente
  onView(cc: ClientCardVm) {
    this.mainLayoutService.navigateTo(`${ROUTES_API.VIEW_CLIENT}/${cc._id}`);
  }
}
