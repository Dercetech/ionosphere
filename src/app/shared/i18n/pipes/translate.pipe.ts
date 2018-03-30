import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { filter, map, switchMap, tap } from 'rxjs/operators';
// import { combineLatest } from 'rxjs/observable/combineLatest';
import { Select } from 'ngrx-actions';

import { I18nService } from '../services/i18n-service';
// import { of } from 'rxjs/observable/of';

@Pipe({
  name: 'translate$'
})
export class TranslatePipe implements PipeTransform {
  @Select('interface.activeLanguage') activeLanguage$: Observable<string>;

  constructor(private _i18n: I18nService) {
    console.log('constructing this crap');
  }

  transform(value, args) {
    console.log('applying transform');
    return this._i18n.getString$(value);
    // return combineLatest([
    //   this._i18n.languageLoaded$.pipe(filter(loaded => loaded)),
    //   this.activeLanguage$
    // ]).pipe(
    //   tap(([a, b]) => {
    //     const abc = this._i18n.getTranslationInCurrentLanguage(value);
    //   }),
    //   switchMap(
    //     ([loaded, lang]) =>
    //       of(this._i18n.getTranslationInCurrentLanguage(value)),
    //     (outerStreamInput, innerStreamInput) => innerStreamInput
    //   )
    // );

    // return this._i18n.languageLoaded$.pipe(
    //   filter(loaded => loaded),
    //   combineLatest([this.activeLanguage$]),
    //   switchMap(([loaded, activeLanguage]) => {
    //     return of('abc');
    //   })
    //   // map( ([loaded, activeLanguage]) => this._i18n.getTranslationInCurrentLanguage(value) )
    // );
  }
}
