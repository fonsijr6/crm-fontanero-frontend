import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { take, tap } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { ModelFormGroup } from '../../../../../../models/model-form-group.models';
import { Client } from '../../models/client';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ROUTES_API } from '../../../../../../constants/routes/routes.const';

@Component({
  selector: 'app-new-clients',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.css'],
  standalone: true,
  imports: [CommonModule, MatFormField, MatLabel, ReactiveFormsModule, MatInputModule,MatButtonModule ],
})
export class NewClientComponent implements OnInit {
  private clientService = inject(ClientService);
  private router = inject(Router)
  private readonly _fb = inject(FormBuilder);

  loading = false;

  clientForm: FormGroup<ModelFormGroup<Client>> = this.createForm();

  ngOnInit() {}

  /**
   * Creación del formulario
   * @returns {FormGroup<ModelFormGroup<Client>>} 
   */
  private createForm(): FormGroup<ModelFormGroup<Client>> {
    return this._fb.nonNullable.group({
      name: this._fb.nonNullable.control('', { validators: [Validators.required] }),
      surname1: this._fb.nonNullable.control('', { validators: [Validators.required] }),
      surname2: this._fb.nonNullable.control('', { validators: [Validators.required] }),
      phone: this._fb.nonNullable.control('', { validators: [Validators.required] }),
      address: this._fb.nonNullable.control('', { validators: [Validators.required] }),
      notes: this._fb.nonNullable.control(''),
    });
  }

  /**
   * Creo el cliente y lo guardo en bbdd
   */
  addClient(): void {
    if (this.clientForm.valid) {
      this.clientService
        .createClient(this.clientForm.getRawValue())
        .pipe(
          take(1),
          tap((clientCreated) => console.log('Cliente Creado', clientCreated)),
        )
        .subscribe()
        .add(() => this.go(`${ROUTES_API.DASHBOARD}`));
    }
    // Pendiente mensajes/validaciones campos para cuando este incorrecto
  }

  // Navegación
  go(path: string): void {
    this.router.navigate([path]);
  }
}
