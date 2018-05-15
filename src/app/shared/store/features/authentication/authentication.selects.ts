import { createSelector } from '@ngrx/store';
import { NgrxService } from '../../services/ngrx.service';
import { authenticationKey } from '../../store.keys';

const _selectsFactory = store => {
  const authenticationStatus = createSelector(
    NgrxService.getSelector(authenticationKey, 'authenticated'),
    NgrxService.getSelector(authenticationKey, 'token'),
    (authenticated, token) =>
      authenticated ? 'authenticated | ' + token : 'not authenticated'
  );

  return { status$: store.select(authenticationStatus) };
};

export const selectsFactory = _selectsFactory;
