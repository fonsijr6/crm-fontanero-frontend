import { Component, OnInit, inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
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
import { AuthService } from '../../../auth/services/auth.service';
import moment from 'moment';
import { ROUTES_API } from '../../../../constants/routes/routes.const';

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
  ],
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private doc = inject(DOCUMENT);
  private storage = inject(SafeStorage);
  private breakpoint = inject(BreakpointObserver);

  // Estado responsivo
  isHandset = signal(false);

  // Tema claro/oscuro
  theme = signal<Theme>('light');

  // KPIs (conecta a tu backend cuando quieras)
  totalClients = signal<number>(120);
  totalStock = signal<number>(35);

  // Tabla últimos clientes
  displayedColumns = ['name', 'phone', 'address', 'actions'];
  // Esto realmente serán los ultimos 4 clientes creados con fecha mas reciente
  latestClients: ClientRow[] = [
    { name: 'María García', phone: '(123) 456-780', address: 'C/ Llecacea, 8' },
    { name: 'Juan Pérez', phone: '600 123 456', address: 'Av. La Laguna 205, 06001' },
    { name: 'Ana López', phone: '722 987 321', address: 'C/ Valleparanga 15A, 04600' },
    { name: 'David Rodríguez', phone: '654 321 987', address: 'C/ Beillecía, 63-123-45' },
  ];

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
    // Modo responsive
    this.breakpoint
      .observe('(max-width: 960px)')
      .subscribe((res) => this.isHandset.set(res.matches));

    // Cargar tema persistido (SSR‑safe)
    if (isPlatformBrowser(this.platformId)) {
      const saved = (this.storage.getItem('theme') as Theme | null) ?? 'light';
      this.theme.set(saved);
      this.applyTheme(saved);
    }
  }

  toggleTheme(): void {
    const next: Theme = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(next);
    if (isPlatformBrowser(this.platformId)) {
      this.storage.setItem('theme', next);
      this.applyTheme(next);
    }
  }

  /**
   *
   * @param t
   * @returns
   */
  private applyTheme(t: Theme): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.doc.documentElement.setAttribute('data-theme', t);
  }

  // Navegación
  go(path: string): void {
    this.router.navigate([path]);
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
