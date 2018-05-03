import { Injectable } from '@angular/core';

import { Select } from 'ngrx-actions';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';

import { ENV } from '@app/env';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter } from 'rxjs/operators';

@Injectable()
export class InterfaceService {
  @Select('authentication.authenticated')
  private _authenticated$: Observable<boolean>;

  constructor(private _store: Store<any>) {
    // If menu is allowed by config: Show upon conditions
    if (ENV.interface.showMenu) {
      combineLatest(
        this._authenticated$,
        authenticated => authenticated
      ).subscribe(showMenu => (showMenu ? this.showMenu() : this.hideMenu));
    }
  }

  private showMenu() {
    this._store.dispatch(new );
  }

  private hideMenu() {
    this._store.dispatch();
  }
}
