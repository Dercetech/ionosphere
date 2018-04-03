import { Pipe, PipeTransform } from '@angular/core';

import { I18nService } from '../services/i18n-service';

@Pipe({
  name: 'translate$'
})
export class TranslatePipe implements PipeTransform {
  constructor(private _i18n: I18nService) {}

  transform(value, args) {
    return this._i18n.getString$(value);
  }
}
