import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, of, take, tap } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { ModelFormGroup } from '../../../../../../models/model-form-group.models';
import { Client, NewClient } from '../../models/client';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ROUTES_API } from '../../../../../../constants/routes/routes.const';
import { MainLayoutService } from '../../../../services/main-layout.service';
import { FeedbackService } from '../../../../services/feedback.service';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-new-clients',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
})
export class NewClientComponent implements OnInit {
  private readonly clientService = inject(ClientService);
  private readonly mainLayoutService = inject(MainLayoutService);
  private readonly feedbackService = inject(FeedbackService);
  private readonly _fb = inject(FormBuilder);

  loading = false;

  clientForm: FormGroup<ModelFormGroup<NewClient>> = this.createForm();

  ngOnInit() {}

  /**
   * Creación del formulario
   * @returns {FormGroup<ModelFormGroup<NewClient>>}
   */
  private createForm(): FormGroup<ModelFormGroup<NewClient>> {
    return this._fb.nonNullable.group({
      name: this._fb.nonNullable.control('', { validators: [Validators.required] }),
      surname1: this._fb.nonNullable.control('', { validators: [Validators.required] }),
      surname2: this._fb.nonNullable.control(''),
      phone: this._fb.nonNullable.control('', { validators: [Validators.required] }),
      address: this._fb.nonNullable.control('', { validators: [Validators.required] }),
      notes: this._fb.nonNullable.control(''),
    });
  }

  // Limpiar formulario
  clearForm(): void {
    this.clientForm.reset({
      name: '',
      surname1: '',
      surname2: '',
      address: '',
      notes: '',
      phone: '',
    });
  }

  /**
   * Creo el cliente y lo guardo en bbdd
   */
  addClient(): void {
    this.postClient();
    // Pendiente validaciones campos para cuando este incorrecto
  }

  // Posteo el cliente
  postClient(): void {
    this.clientService
      .createClient(this.clientForm.getRawValue())
      .pipe(
        take(1),
        tap((clientCreated) => {
          Swal.fire({
            title: '¡Operación exitosa!',
            text: `Se ha agregado a ${clientCreated.name} ${clientCreated.surname1} ${clientCreated.surname2 ?? ''} correctamente`,
            icon: 'success',
            iconColor: '#22c55e',
            timer: 3000,
            showConfirmButton: false,
            background: '#ffffff',
            color: '#1f2937',
            width: '420px',
            padding: '1.4rem',
            backdrop: `rgba(0, 0, 0, 0.15)`,
          });
          this.clearForm(); // Limpiamos el formulario
        }),
        catchError(() => {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo agregar el cliente.',
            icon: 'error',
            iconColor: '#dc2626',
            background: '#fee2e2',
            color: '#7f1d1d',
            confirmButtonColor: '#dc2626',
            confirmButtonText: 'Entendido',
            width: '420px',
            padding: '1.4rem',
            backdrop: `rgba(0, 0, 0, 0.25)`,
          });
          return of(undefined);
        }),
      )
      .subscribe();
  }

  // Volver pantalla anterior
  goBack(): void {
    this.mainLayoutService.onBack();
  }
}
