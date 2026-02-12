import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import Swal from 'sweetalert2';
import { StockService } from '../../services/stock.service';
import { LoadingService } from '../../../../../../core';
import { ModelFormGroup } from '../../../../../../models/model-form-group.models';
import { NewStockItem } from '../../models/stock.models';
import { catchError, of, take, tap } from 'rxjs';
import { MaterialTypes } from '../../constans/stock-item.const';
import { MainLayoutService } from '../../../../services/main-layout.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-new-stock-item',
  standalone: true,
  templateUrl: './new-stock-item.component.html',
  styleUrls: ['./new-stock-item.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDividerModule,
    MatIconModule,
  ],
})
export class NewStockItemComponent implements OnInit {
  private readonly mainLayoutService = inject(MainLayoutService);
  private readonly stockService = inject(StockService);
  private readonly loadingService = inject(LoadingService);
  private readonly _fb = inject(FormBuilder);

  loading = false;

  // Tipos de material (puedes moverlos a un servicio si lo prefieres)
  protected materialTypes = MaterialTypes;

  stockForm: FormGroup<ModelFormGroup<NewStockItem>> = this.createForm();

  ngOnInit() {}

  /**
   * Creación del formulario
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

  // Limpiar formulario
  clearForm(): void {
    this.stockForm.reset({
      name: '',
      typeMaterial: '',
      warehouseUnits: 0,
      vanUnits: 0,
    });
  }

  addStockItem(): void {
    if (this.stockForm.invalid) {
      this.stockForm.markAllAsTouched();
      return;
    }
    const newItem: NewStockItem = this.stockForm.getRawValue();
    this.loading = true;
    this.loadingService.show();
    this.postItem(newItem);
  }

  // Postear item
  postItem(newItem: NewStockItem): void {
    this.stockService
      .createItem(newItem)
      .pipe(
        take(1),
        tap((itemCreated) => {
          Swal.fire({
            title: '¡Operación exitosa!',
            text: `Se ha agregado '${itemCreated.name}' correctamente`,
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
            text: 'No se pudo agregar el material.',
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
      .subscribe()
      .add(() => {
        this.loading = false;
        this.loadingService.hide();
      });
  }

  // Volver pantalla anterior
  goBack(): void {
    this.mainLayoutService.onBack();
  }
}
