import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import { StoreService } from '../../../services/store.service';
import { AuthenticationService } from '../../../services/authentication.service';

import { authenticationKey } from '../../store.keys';
import { GenericStore } from '../../classes/generic-store';

import { LoginRequestAction } from './authentication.actions';
import { handlers } from './authentication.handlers';
import { selectsFactory } from './authentication.selects';

export interface AuthenticationState {
  authenticated: boolean;
  authenticating: boolean;
}

const initialState: AuthenticationState = {
  authenticated: false,
  authenticating: true
};

@Injectable()
export class AuthenticationStore extends GenericStore {
  constructor(
    private _actions$: Actions,
    _store: Store<any>,
    _storeService: StoreService,
    _authService: AuthenticationService
  ) {
    super(
      { actions$: _actions$, _authService },
      {
        _storeService,
        featureKey: authenticationKey,
        propertyKeys: Object.keys(initialState),
        customSelects: selectsFactory(_store)
      }
    );
  }

  static reducer(state = initialState, action): AuthenticationState {
    return super.processState(handlers, state, action);
  }

  @Effect()
  loginRequest = this.processEffect(handlers, LoginRequestAction.TYPE);
}
