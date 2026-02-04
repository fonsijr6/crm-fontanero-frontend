import { Component, Input, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ROUTES_API } from '../../constants/routes/routes.const';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, LayoutModule, MatSidenavModule, MatIconModule, MatListModule],
})
export class SidebarComponent {
  protected routes = ROUTES_API;

  /**
   * vuelta al login
   */
  logOut(): void {
    localStorage.removeItem('token');
    window.location.href = `${this.routes.LOGIN}`;
  }
}
