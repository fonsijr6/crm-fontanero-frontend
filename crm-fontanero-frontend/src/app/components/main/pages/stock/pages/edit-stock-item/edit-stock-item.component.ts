import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { catchError, of, take, tap } from 'rxjs';
import { ROUTES_API } from '../../../../../../constants/routes/routes.const';
import { MainLayoutService } from '../../../../services/main-layout.service';
import { ModelFormGroup } from '../../../../../../models/model-form-group.models';
import { NewStockItem, StockItem } from '../../models/stock.models';
import { StockService } from '../../services/stock.service';
import { MaterialTypes } from '../../constans/stock-item.const';
import { MatOption } from '@angular/material/select';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-edit-stock-item',
  standalone: true,
  imports: [
    CommonModule,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatOption,
    MatIconModule,
  ],
  templateUrl: './edit-stock-item.component.html',
  styleUrls: ['./edit-stock-item.component.css'],
})
export class EditStockItemComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly _fb = inject(FormBuilder);
  private readonly stockService = inject(StockService);
  private readonly mainLayoutService = inject(MainLayoutService);

  protected materialTypes = MaterialTypes;

  stockItemId!: string;
  loading = false;

  editStockForm: FormGroup<ModelFormGroup<NewStockItem>> = this.createForm();

  ngOnInit() {
    this.stockItemId = this.route.snapshot.paramMap.get('id')!;
    this.patchForm();
  }

  /**
   * Completo formulario
   * @returns {FormGroup<ModelFormGroup<NewStockItem>>}
   */
  private createForm(): FormGroup<ModelFormGroup<NewStockItem>> {
    return this._fb.nonNullable.group({
      name: this._fb.nonNullable.control('', {
        validators: [Validators.required, Validators.minLength(2)],
      }),
      typeMaterial: this._fb.nonNullable.control('', { validators: [Validators.required] }),
      warehouseUnits: this._fb.nonNullable.control(0, {
        validators: [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)],
      }),
      vanUnits: this._fb.nonNullable.control(0, {
        validators: [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)],
      }),
    });
  }

  // Pachear el item seleecionado en el form de edición
  patchForm(): void {
    this.stockService
      .getItemById(this.stockItemId)
      .pipe(
        take(1),
        tap((item) => this.completeForm(item)),
      )
      .subscribe();
  }

  // Completo el form con el item que recupeo de back
  completeForm(item: StockItem): void {
    this.editStockForm.patchValue({
      name: item.name,
      typeMaterial: item.typeMaterial,
      warehouseUnits: item.warehouseUnits ?? 0,
      vanUnits: item.vanUnits ?? 0,
    });
  }

  // Actualizar item
  update(): void {
    if (!this.editStockForm.valid) return;

    this.stockService
      .updateItem(this.stockItemId, this.editStockForm.getRawValue())
      .pipe(
        take(1),
        tap(() => {
          Swal.fire({
            title: '¡Operación exitosa!',
            text: `Material actualizado correctamente`,
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
          this.mainLayoutService.navigateTo(ROUTES_API.DASHBOARD);
        }),
        catchError(() => {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo actualizar el material.',
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
