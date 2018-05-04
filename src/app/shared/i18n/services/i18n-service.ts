import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, filter, switchMap, tap, catchError, take } from 'rxjs/operators';

@Injectable()
export class I18nService {
  // @Select('interface.activeLanguage')
  private _currentLanguage$: Observable<string>;

  // @Select('interface.languageLoading')
  private _languageLoading$: Observable<boolean>;

  private _keys: {};

  constructor(private http: Http) {}

  public switchToLanguage$(langCode: string): Observable<boolean> {
    return this.http
      .get(`./assets/i18n/${langCode}.json`)
      .pipe(
        map((res: any) => res.json()),
        tap(translations => (this._keys = translations)),
        switchMap(() => of(true)),
        catchError(() => of(false))
      );
  }

  getString$(ref: any): Observable<string> {
    return this._languageLoading$.pipe(
      filter(loading => loading === false),
      switchMap(
        () => this._currentLanguage$.pipe(take(1)),
        (loading, currentLanguage) => this.getTranslation(ref, currentLanguage)
      )
    );
  }

  private getTranslation(ref: any, langId: string): string {
    if (this.isObject(ref)) {
      if (ref.hasOwnProperty(langId)) {
        if (ref[langId]) return ref[langId];
        else if (ref['en']) ref['en'];
        else if (ref['fr']) ref['fr'];
        else {
          const langs = Object.keys(ref);
          if (langs && langs.length > 0) return ref[langs[0]];
          else return 'no translation';
        }
      } else return '';
    } else {
      return this.getTranslationFromDictionary(ref, langId);
    }
  }

  private getTranslationFromDictionary(ref: string, langId: string): string {
    if (!ref) return '';
    if (!this._keys) return ref;
    const segments: string[] = ref.split('.');

    let key,
      level = this._keys;
    while ((key = segments.shift())) {
      level = level[key];
      if (!level) {
        console.warn('i18n missing key "' + ref + '" in lang ' + langId);
        level = ref;
        break;
      }
    }

    return <string>level;
  }

  private isObject(obj): boolean {
    return obj === Object(obj);
  }
}
