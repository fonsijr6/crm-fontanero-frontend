import { FormControl, FormGroup, FormArray } from '@angular/forms';
//Interfaz pra ayudar en el tipado de formularios
export type ModelFormGroup<T> = {
  [K in keyof T]-?:                               // siempre existe el control
    T[K] extends Array<infer U>
      ? FormArray<FormGroup<ModelFormGroup<NonNullable<U>>>>
      : NonNullable<T[K]> extends object
        ? FormGroup<ModelFormGroup<NonNullable<T[K]>>>
        : FormControl<NonNullable<T[K]>>;
};
