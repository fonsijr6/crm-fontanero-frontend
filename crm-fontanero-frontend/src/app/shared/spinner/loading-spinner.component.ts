import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    @if (loadingService.loading$ | async) {
      <ng-container>
        <div class="overlay">
          <mat-progress-spinner mode="indeterminate" diameter="70"></mat-progress-spinner>
        </div>
      </ng-container>
    }
  `,
  styles: [
    `
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
      }
    `,
  ],
  imports: [CommonModule, MatProgressSpinnerModule], // <-- CommonModule para async
})
export class LoadingSpinnerComponent {
  loadingService = inject(LoadingService);
}
