import { createSelector } from '@ngrx/store';

import { ENV } from '@app/env';

import { NgrxService } from '../../services/ngrx.service';
import { appKey } from '../../store.keys';

const _selectsFactory = store => {
  const appReadySelector = createSelector(
    NgrxService.getSelector(appKey, 'loginCheckComplete'),
    loginCheckComplete => loginCheckComplete
  );

  return {
    ready$: store.select(appReadySelector)
  };
};

export const selectsFactory = _selectsFactory;
