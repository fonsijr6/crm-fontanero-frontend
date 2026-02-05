import { Component, OnInit, inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver, LayoutModule } from '@angular/cdk/layout';

// Angular Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { SafeStorage } from '../../../../core/safe-storage-service';
import moment from 'moment';
import { ROUTES_API } from '../../../../constants/routes/routes.const';
import { Client, LatestClient } from '../clients/models/client';
import { ClientMapper } from '../clients/mapper/client-mapper';
import { MomentPipe } from '../../../../pipes/moment.pipe';
import { MainLayoutService } from '../../services/main-layout.service';
import { StockItem } from '../stock/models/stock.models';

type Theme = 'light' | 'dark';
// Se eliminará
interface ClientRow {
  name: string;
  phone: string;
  address: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    CommonModule,
    LayoutModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatDividerModule,
    MatTooltipModule,
    MatBadgeModule,
    MomentPipe,
  ],
})
export class DashboardComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly doc = inject(DOCUMENT);
  private readonly storage = inject(SafeStorage);
  private readonly breakpoint = inject(BreakpointObserver);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly mainLayoutService = inject(MainLayoutService);

  // Estado responsivo
  isHandset = signal(false);

  // Tema claro/oscuro
  theme = signal<Theme>('light');

  // KPIs (conecta a tu backend cuando quieras)
  totalClients = signal<number>(0);
  totalStock = signal<number>(0);

  // Cargo previamente los clients para los ultimos clientes
  clients: Client[] = this.activatedRoute.snapshot.data['clients'] ?? [];
  stock: StockItem[] = this.activatedRoute.snapshot.data['stock'] ?? [];

  // Tabla últimos clientes
  displayedColumns = ['name', 'phone', 'address', 'creationDate'];
  // Esto realmente serán los ultimos 4 clientes creados con fecha mas reciente
  latestClients: LatestClient[] = [];

  today = moment();
  protected routes = ROUTES_API;

  agenda = [
    {
      icon: 'build',
      hour: '09:00',
      title: 'Instalación de caldera',
      client: 'Mario García',
      address: 'C/ Itacena, 8',
    },
    {
      icon: 'plumbing',
      hour: '11:30',
      title: 'Reparación fuga baño',
      client: 'Ana López',
      address: 'C/ Vallegran, 154',
    },
    {
      icon: 'home_repair_service',
      hour: '16:00',
      title: 'Cambio llave paso',
      client: 'Juan Pérez',
      address: 'Av. Laguna 120',
    },
  ];

  current = 0;

  ngOnInit(): void {
    this.responsiveMode();
    this.loadStaticTheme();
    this.setLatestClients();
    this.updateNumberClientsAndStock();
  }

  // Actualizar nº stock y clientes
  updateNumberClientsAndStock(): void {
    this.totalClients.set(this.clients.length);
    this.totalStock.set(this.stock.length);
  }

  // Rellenar ultimos clientes
  setLatestClients(): void {
    this.latestClients = this.clients
      .map(ClientMapper.toLatestClient)
      .sort((a, b) => b.createdAt!.valueOf() - a.createdAt!.valueOf())
      .slice(0, 5);
  }

  // Modo responsive
  responsiveMode(): void {
    this.breakpoint
      .observe('(max-width: 960px)')
      .subscribe((res) => this.isHandset.set(res.matches));
  }

  // Cargar tema persistido (SSR‑safe)
  loadStaticTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const saved = (this.storage.getItem('theme') as Theme | null) ?? 'light';
      this.theme.set(saved);
      this.applyTheme(saved);
    }
  }

  // Cambiar entre tema oscuro y claro
  toggleTheme(): void {
    const next: Theme = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(next);
    if (isPlatformBrowser(this.platformId)) {
      this.storage.setItem('theme', next);
      this.applyTheme(next);
    }
  }

  // Aplicar tema
  private applyTheme(t: Theme): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.doc.documentElement.setAttribute('data-theme', t);
  }

  // Navegación
  go(path: string, extras?: any): void {
    this.mainLayoutService.navigateTo(path);
  }

  onViewClient(row: any): void {
    this.router.navigate(['/clients/view']);
  }

  nextItem() {
    this.current = (this.current + 1) % this.agenda.length;
  }

  prevItem() {
    this.current = (this.current - 1 + this.agenda.length) % this.agenda.length;
  }
}
