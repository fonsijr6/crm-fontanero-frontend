import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ClientService } from '../../services/client.service';
import { Client, NewClient } from '../../models/client';
import { take, tap } from 'rxjs';
import { ROUTES_API } from '../../../../../../constants/routes/routes.const';
import { MainLayoutService } from '../../../../services/main-layout.service';
import { ModelFormGroup } from '../../../../../../models/model-form-group.models';

@Component({
  selector: 'app-edit-client',
  standalone: true,
  imports: [
    CommonModule,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css'],
})
export class EditClientComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly _fb = inject(FormBuilder);
  private readonly clientService = inject(ClientService);
  private readonly mainLayoutService = inject(MainLayoutService);

  clientId!: string;

  editForm: FormGroup<ModelFormGroup<NewClient>> = this.createForm();

  ngOnInit() {
    this.clientId = this.route.snapshot.paramMap.get('id')!;
    this.patchForm();
  }

  /**
   * Completo formulario
   * @returns {FormGroup<ModelFormGroup<NewClient>>}
   */
  private createForm(): FormGroup<ModelFormGroup<NewClient>> {
    return this._fb.nonNullable.group({
      name: this._fb.nonNullable.control('', { validators: [Validators.required] }),
      surname1: this._fb.nonNullable.control('', {
        validators: [Validators.required],
      }),
      surname2: this._fb.nonNullable.control(''),
      phone: this._fb.nonNullable.control('', {
        validators: [Validators.required],
      }),
      address: this._fb.nonNullable.control('', {
        validators: [Validators.required],
      }),
      notes: this._fb.nonNullable.control(''),
    });
  }

  // Pachear el cliente seleecionado en el form de edición
  patchForm(): void {
    this.clientService
      .getClientById(this.clientId)
      .pipe(
        take(1),
        tap((client) => {
          this.editForm.patchValue({
            name: client.name,
            surname1: client.surname1,
            surname2: client.surname2,
            address: client.address,
            phone: client.phone,
            notes: client.notes,
          });
        }),
      )
      .subscribe();
  }

  update(): void {
    if (this.editForm.invalid) return;

    this.clientService
      .updateClient(this.clientId, this.editForm.getRawValue())
      .pipe(
        take(1),
        tap(() => this.mainLayoutService.navigateTo(ROUTES_API.DASHBOARD)),
      )
      .subscribe();
  }
}
``;
