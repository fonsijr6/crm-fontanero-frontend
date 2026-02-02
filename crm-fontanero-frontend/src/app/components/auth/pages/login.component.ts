import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Moment (forma compatible)
import moment from 'moment';
import 'moment/locale/es';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SafeStorage } from '../../../core/safe-storage-service';

// Wrapper seguro

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private storage = inject(SafeStorage);

  loading = false;
  error = '';
  passwordVisible = false;
  currentYear = moment().locale('es').year();

  form = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
    remember: new FormControl<boolean>(false, { nonNullable: true }),
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const saved = this.storage.getItem('crm_email');
      if (saved) {
        this.form.patchValue({ email: saved, remember: true });
      }
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      this.error = 'Email y contraseña obligatorios';
      this.form.markAllAsTouched();
      return;
    }

    this.error = '';
    this.loading = true;

    const { email, password, remember } = this.form.getRawValue();

    if (isPlatformBrowser(this.platformId)) {
      if (remember) this.storage.setItem('crm_email', email!);
      else this.storage.removeItem('crm_email');
    }

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: (res) => {
        this.authService.setToken(res.token); // Asegúrate de cambiar AuthService a SafeStorage (abajo)
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error al hacer login:', err);
        this.error = 'Credenciales incorrectas';
        this.loading = false;
      },
    });
  }
}
