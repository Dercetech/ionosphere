import { createSelector } from '@ngrx/store';

import { ENV } from '@app/env';

import { NgrxService } from '../../services/ngrx.service';
import { authenticationKey } from '../../store.keys';

const _selectsFactory = store => {
  const menuDisplayedSelector = createSelector(
    NgrxService.getSelector(authenticationKey, 'authenticated'),
    authenticated => {
      console.log('authenticated ' + authenticated);
      return ENV.interface.allowMenu && authenticated;
    }
  );

  const headerDisplayedSelector = createSelector(
    NgrxService.getSelector(authenticationKey, 'authenticated'),
    authenticated => ENV.interface.allowHeader && authenticated
  );

  return {
    menuDisplayed$: store.select(menuDisplayedSelector),
    headerDisplayed$: store.select(headerDisplayedSelector)
  };
};

export const selectsFactory = _selectsFactory;
