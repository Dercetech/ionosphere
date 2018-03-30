import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Select } from 'ngrx-actions';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {
  map,
  concatMap,
  delay,
  filter,
  switchMap,
  tap,
  catchError,
  take
} from 'rxjs/operators';

@Injectable()
export class I18nService {
  @Select('interface.activeLanguage')
  private _currentLanguage$: Observable<string>;

  @Select('interface.languageLoading')
  private _languageLoading$: Observable<boolean>;

  //private _currentLang: string = null;
  //private dict: {};
  private _keys: {};

  //  private _languageLoaded$ = new BehaviorSubject<boolean>(false);
  //  public readonly languageLoaded$ = this._languageLoaded$.asObservable();

  activeLanguage$ = of('en', 'fr').pipe(
    concatMap(lang => of(lang).pipe(delay(1000)))
  );

  constructor(private http: Http) {
    //this.currentLanguage$.pipe(filter(lang => lang && lang.length === 2)).subscribe(langCode => this.setLanguage(langCode));
  }

  // private setLanguage(langCode: string) {
  //   if (this._currentLang === langCode) {
  //     return;
  //   } else {
  //     this.loadLanguage(langCode);
  //   }
  // }

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
        (loading, currentLanguage) => {
          console.log('crap');
          return this.getTranslation(ref, currentLanguage);
        }
      )
    );
  }

  // private loadLanguage(langCode: string) {
  //   this.http
  //     .get(`./assets/i18n/${langCode}.json`)
  //     .pipe(map((res: any) => res.json()))
  //     .subscribe(
  //       translations => (this.dict = translations),
  //       () => {},
  //       () => this._languageLoaded$.next(true)
  //     );
  // }

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

  // getActiveLanguage(): string {
  //   return this._currentLang;
  // }

  // getAvailableLanguages(): string[] {
  //   return this._availableLangs;
  // }

  /*
  getTranslationInCurrentLanguage(ref: any): string {
    // Is string or description translation object?
    if (this.isObject(ref)) {
      if (ref.hasOwnProperty(this._currentLang)) {
        if (ref[this._currentLang]) return ref[this._currentLang];
        else if (ref['en']) ref['en'];
        else if (ref['fr']) ref['fr'];
        else {
          const langs = Object.keys(ref);
          if (langs && langs.length > 0) return ref[langs[0]];
          else return 'no translation';
        }
      } else return '';
    } else {
      return this.getTranslationFromDictionaryInCurrentLanguage(ref);
    }
  }

  private getTranslationFromDictionaryInCurrentLanguage(ref: string): string {
    if (!ref) return '';
    if (!this.dict) return ref;

    const segments: string[] = ref.split('.');

    let key,
      level = this.dict;
    while ((key = segments.shift())) {
      level = level[key];
      if (!level) {
        console.warn(
          'i18n missing key "' + ref + '" in lang ' + this._currentLang
        );
        level = ref;
        break;
      }
    }

    return <string>level;
  }

  */

  private isObject(obj): boolean {
    return obj === Object(obj);
  }
}
