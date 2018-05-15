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
  token: string;
}

const initialState: AuthenticationState = {
  authenticated: false,
  authenticating: false,
  token: null
};

@Injectable()
export class AuthenticationStore extends GenericStore {
  constructor(
    private _actions$: Actions,
    private _store: Store<any>,
    private _storeService: StoreService,
    _authService: AuthenticationService
  ) {
    super(/*context */ { actions$: _actions$, _authService });
    this.registerSelects();
  }

  static reducer(state = initialState, action): AuthenticationState {
    return super.processState(handlers, state, action);
  }

  registerSelects() {
    this._storeService.registerSelects(
      authenticationKey,
      Object.keys(initialState),
      selectsFactory(this._store)
    );
  }

  @Effect()
  loginRequest = this.processEffect(handlers, LoginRequestAction.TYPE);
}
