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
  PasswordResetRequestAction,
  LoginSuccessAction,
  LogoutRequestAction
} from './authentication.actions';
import { handlers, AuthenticationHandlerContext } from './authentication.handlers';
import { selectsFactory } from './authentication.selects';
import { ActionState } from '../../interfaces/action-state';
import { FirebaseUser } from '../../../models/user.firebase';
import { AppInitializedAction } from '../app/app.actions';
import { concatMap, tap, take } from 'rxjs/operators';
import { SynchronizedStore } from '../../classes/synchronized-store';

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
export class AuthenticationStore extends SynchronizedStore<AuthenticationHandlerContext> {
  constructor(
    actions$: Actions,
    store: Store<any>,
    storeService: StoreService,
    authService: AuthenticationService,
    private _usersService: UsersService
  ) {
    super(
      { actions$, authService, usersService: _usersService },
      {
        storeService,
        featureKey: authenticationKey,
        initialState,
        customSelects: selectsFactory(store)
      }
    );
  }

  static reducer(state = initialState, action): AuthenticationState {
    return super.processSynchronizedState(handlers, state, action, authenticationKey);
  }

  // Document monitoring handlers
  @Effect({ dispatch: false })
  documentMonitoringEffect = this.documentMonitoringSetup([
    { localStoreKey: 'authenticatedUser', backendService: this._usersService, folderPath: null }
  ]);

  // Collection monitoring handlers
  @Effect({ dispatch: false })
  collectionMonitoringEffect = this.collectionMonitoringSetup([]);

  @Effect() appInitialized = this.processEffect(handlers, AppInitializedAction.TYPE);
  @Effect() loginRequest = this.processEffect(handlers, LoginRequestAction.TYPE);
  @Effect() loginSuccess = this.processEffect(handlers, LoginSuccessAction.TYPE);
  @Effect() passwordResetRequest = this.processEffect(handlers, PasswordResetRequestAction.TYPE);

  // Logout request
  @Effect({ dispatch: false })
  releaseMonitorsOnLogout = this.logoutRoutine();
  @Effect() logoutRequest = this.processEffect(handlers, LogoutRequestAction.TYPE);
}
