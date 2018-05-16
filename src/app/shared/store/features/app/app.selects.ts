import { createSelector } from '@ngrx/store';

import { ENV } from '@app/env';

import { NgrxService } from '../../services/ngrx.service';
import { authenticationKey } from '../../store.keys';

const _selectsFactory = store => {
  const appReadySelector = createSelector(
    NgrxService.getSelector(authenticationKey, 'authenticated'),
    authenticated => ENV.interface.allowMenu && authenticated
  );

  return {
    ready$: store.select(appReadySelector)
  };
};

export const selectsFactory = _selectsFactory;
