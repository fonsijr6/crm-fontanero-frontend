import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error = '';
  form = this.createForm();

  ngOnInit(): void {}

  protected createForm(): FormGroup {
    return new FormGroup({
      email: new FormControl<null | string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl<null | string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.error = 'Email y contraseña obligatorios';
      return;
    }

    this.loading = true;

    this.authService
      .login({
        email: this.form.get('email')?.value,
        password: this.form.get('password')?.value,
      })
      .subscribe({
        next: (res) => {
          this.authService.setToken(res.token);

          this.loading = false;
          this.router.navigate(['/clients']);
        },
        error: (err) => {
          console.error('Error al hacer login:', err);
          this.error = 'Credenciales incorrectas';
          this.loading = false;
        },
      });
  }
}
