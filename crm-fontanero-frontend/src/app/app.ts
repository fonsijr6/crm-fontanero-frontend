import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppRouter } from './app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppRouter],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('crm-fontanero-frontend');
}
