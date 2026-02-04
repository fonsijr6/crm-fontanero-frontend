import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppRouter } from './app.routes';
import { MainLayoutComponent } from './components/main/pages/main-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppRouter],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('crm-fontanero-frontend');
}
