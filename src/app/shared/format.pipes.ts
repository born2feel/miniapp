import { Pipe, PipeTransform } from '@angular/core';
import { formatPhone, plural } from './format';

@Pipe({ name: 'phone' })
export class PhonePipe implements PipeTransform {
  transform(phone: string): string {
    return formatPhone(phone);
  }
}

@Pipe({ name: 'plural' })
export class PluralPipe implements PipeTransform {
  transform(count: number, one: string, many: string): string {
    return plural(count, [one, many]);
  }
}
