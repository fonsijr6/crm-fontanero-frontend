import { Component, inject, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';
import { ToolbarComponent } from '../../../shared/toolbar/toolbar.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, MatSidenavModule, ToolbarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {
  @ViewChild('drawer') sidenav!: MatSidenav;

  theme = signal<'light' | 'dark'>('light');
  breakpointObserver = inject(BreakpointObserver);

  isHandset() {
    return this.breakpointObserver.isMatched(Breakpoints.Handset);
  }

  toggleTheme = () => {
    this.theme.update((v) => (v === 'light' ? 'dark' : 'light'));
  };

  toggleSidebar = () => {
    this.sidenav.toggle();
  };
}
