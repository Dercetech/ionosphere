import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import { StoreService } from '../../../services/store.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { UsersService } from '../../../services/users.service';

import { authenticationKey } from '../../store.keys';
import { GenericStore } from '../../classes/generic-store';

import {
  LoginRequestAction,
  LogoutRequestAction,
  PasswordResetRequestAction,
  LoginSuccessAction,
  LogoutSuccessAction
} from './authentication.actions';
import { handlers, AuthenticationHandlerContext } from './authentication.handlers';
import { selectsFactory } from './authentication.selects';
import { ActionState } from '../../interfaces/action-state';
import { FirebaseUser } from '../../../models/user.firebase';
import { AppInitializedAction } from '../app/app.actions';
import { concatMap, tap } from 'rxjs/operators';

export interface AuthenticationState {
  authenticated: boolean;
  authenticatedUser: FirebaseUser;
  authenticatedUserId: string;
  login: ActionState<string>;
  passwordReset: ActionState<string>;
}

const initialState: AuthenticationState = {
  authenticated: false,
  authenticatedUser: null,
  authenticatedUserId: null,
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
  constructor(
    actions$: Actions,
    store: Store<any>,
    storeService: StoreService,
    authService: AuthenticationService,
    usersService: UsersService
  ) {
    super(
      { actions$, authService, usersService },
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

  @Effect({ dispatch: false })
  appInitialized_monitorAuthentication = this.getContext()
    .actions$.ofType(AppInitializedAction.TYPE)
    .pipe(
      tap(() => {
        this.getContext().authService.monitorAuthentication();
      })
    );

  @Effect() appInitialized = this.processEffect(handlers, AppInitializedAction.TYPE);
  @Effect() loginRequest = this.processEffect(handlers, LoginRequestAction.TYPE);
  @Effect() passwordResetRequest = this.processEffect(handlers, PasswordResetRequestAction.TYPE);
  @Effect() logoutRequest = this.processEffect(handlers, LogoutRequestAction.TYPE);
}
