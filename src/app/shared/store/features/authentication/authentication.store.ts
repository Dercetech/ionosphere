import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import { StoreService } from '../../../services/store.service';
import { AuthenticationService } from '../../../services/authentication.service';

import { authenticationKey } from '../../store.keys';
import { GenericStore } from '../../classes/generic-store';

import { LoginRequestAction, LogoutRequestAction, PasswordResetRequestAction } from './authentication.actions';
import { handlers, AuthenticationHandlerContext } from './authentication.handlers';
import { selectsFactory } from './authentication.selects';
import { ActionState } from '../../interfaces/action-state';
import { FirebaseUser } from '../../../models/user.firebase';

export interface AuthenticationState {
  authenticated: boolean;
  authenticatedUser: FirebaseUser;
  login: ActionState<string>;
  passwordReset: ActionState<string>;
}

const initialState: AuthenticationState = {
  authenticated: false,
  authenticatedUser: null,
  login: {
    error: null,
    processing: false,
    data: null
  },
  passwordReset: {
    error: null,
    processing: false,
    data: null
  }
};

@Injectable()
export class AuthenticationStore extends GenericStore<AuthenticationHandlerContext> {
  constructor(actions$: Actions, store: Store<any>, storeService: StoreService, authService: AuthenticationService) {
    super(
      { actions$, authService },
      {
        storeService,
        featureKey: authenticationKey,
        initialState,
        customSelects: selectsFactory(store)
      }
    );
  }

  static reducer(state = initialState, action): AuthenticationState {
    return super.processState(handlers, state, action);
  }

  @Effect() loginRequest = this.processEffect(handlers, LoginRequestAction.TYPE);
  @Effect() passwordResetRequest = this.processEffect(handlers, PasswordResetRequestAction.TYPE);
  @Effect() logoutRequest = this.processEffect(handlers, LogoutRequestAction.TYPE);
}
