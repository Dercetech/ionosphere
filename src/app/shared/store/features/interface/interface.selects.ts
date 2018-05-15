import { createSelector } from '@ngrx/store';

import { ENV } from '@app/env';

import { NgrxService } from '../../services/ngrx.service';
import { authenticationKey } from '../../store.keys';

const _selectsFactory = store => {
  const menuDisplayedSelector = createSelector(
    NgrxService.getSelector(authenticationKey, 'authenticated'),
    authenticated => (ENV.interface.allowMenu ? authenticated : false)
  );

  return { menuDisplayed$: store.select(menuDisplayedSelector) };
};

export const selectsFactory = _selectsFactory;
