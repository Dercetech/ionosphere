import { Store, Action, Effect } from 'ngrx-actions';

import { of } from 'rxjs/observable/of';
import { tap, concatMap } from 'rxjs/operators';

import * as fromServices from '../../services';
import * as fromActions from './authentication.actions';

export interface AuthenticationState {
  authenticated: boolean;
  authenticating: boolean;
  authError: string;
}

@Store({
  authenticated: true,
  authenticating: false,
  authError: null
})
export class AuthenticationStore {
  constructor(private _authService: fromServices.AuthenticationService) {}

  // LOGIN /////////////////////////////////////

  @Action(fromActions.Login)
  initiateLogin(state: AuthenticationState, { payload }: fromActions.Login) {
    const authenticating = true;
    const authError = null;
    return { ...state, authenticating, authError };
  }

  @Action(fromActions.LoginSuccess)
  loginSuccess(
    state: AuthenticationState,
    { payload }: fromActions.LoginSuccess
  ) {
    const authenticated = true;
    const authenticating = false;
    return { ...state, authenticated, authenticating };
  }

  @Action(fromActions.LoginFailed)
  loginFailed(
    state: AuthenticationState,
    { payload }: fromActions.LoginFailed
  ) {
    const authenticated = false;
    const authenticating = false;
    const authError = payload;
    return { ...state, authenticated, authenticating, authError };
  }

  @Effect(fromActions.Login)
  effectLogin(state: AuthenticationState, { payload }: fromActions.Login) {
    return this._authService
      .authenticate(payload)
      .pipe(
        tap(authResult => console.log('login success')),
        concatMap(authResult =>
          of(
            authResult.success
              ? new fromActions.LoginSuccess()
              : new fromActions.LoginFailed(authResult.error)
          )
        )
      );
  }

  // LOGOUT ////////////////////////////////////

  @Action(fromActions.Logout)
  initiateLogout(state: AuthenticationState) {
    return { ...state };
  }

  @Action(fromActions.LogoutSuccess)
  logoutSuccess(state: AuthenticationState) {
    return { ...state, authenticated: false };
  }

  @Effect(fromActions.Logout)
  effectLogout(state: AuthenticationState) {
    return of(new fromActions.LogoutSuccess()).pipe(
      tap(() => console.log('logout complete'))
    );
  }
}
