import { createSelector } from '@ngrx/store';
import { NgrxService } from '../../services/ngrx.service';
import { authenticationKey } from '../../store.keys';

// If menu is allowed by config: Show upon conditions
// if (ENV.interface.showMenu) {
//   combineLatest(
//     this._authenticated$,
//     authenticated => authenticated
//   ).subscribe(showMenu => (showMenu ? this.showMenu() : this.hideMenu));
// }

const _selectsFactory = store => {
  return {};
};

export const selectsFactory = _selectsFactory;
