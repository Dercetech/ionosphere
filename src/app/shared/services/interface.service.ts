import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ENV } from '@app/env';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter } from 'rxjs/operators';

@Injectable()
export class InterfaceService {
  private _authenticated$: Observable<boolean>;

  constructor() {
    // If menu is allowed by config: Show upon conditions
    // if (ENV.interface.showMenu) {
    //   combineLatest(
    //     this._authenticated$,
    //     authenticated => authenticated
    //   ).subscribe(showMenu => (showMenu ? this.showMenu() : this.hideMenu));
    // }
  }

  private showMenu() {}

  private hideMenu() {}
}
