import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'moment',
})
export class MomentPipe implements PipeTransform {
  transform(value: any, format: string = 'DD/MM/YYYY'): string {
    if (!value) return '';

    // Si ya es un objeto moment -> formatear directo
    if (moment.isMoment(value)) {
      return value.format(format);
    }

    // Si es una fecha normal
    return moment(value).format(format);
  }
}
