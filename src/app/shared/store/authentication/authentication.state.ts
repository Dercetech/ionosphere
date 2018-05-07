import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { State, Action, StateContext, Selector } from '@ngxs/store';

import { AuthenticationService } from '../../services';

import {
  Login,
  Logout,
  LoginSuccess,
  LoginWithGoogle
} from './authentication.actions';

export interface AuthenticationStateModel {
  authenticated: boolean;
  authenticating: boolean;
  authError: string;
  token: string;
}

@State<AuthenticationStateModel>({
  name: 'auth',
  defaults: {
    authenticated: false,
    authenticating: false,
    authError: null,
    token: null
  }
})
export class AuthenticationState {
  @Selector()
  static token(state: AuthenticationStateModel) {
    return state.token;
  }

  constructor(private _authService: AuthenticationService) {}

  @Action(Login)
  login(
    { patchState }: StateContext<AuthenticationStateModel>,
    { payload }: Login
  ) {
    // return this._authService.authenticate(payload).pipe(
    console.log('sync processing');
    return of('abc').pipe(
      tap(result => {
        console.log('async processing');
        patchState({ token: result });
      }),
      catchError(err => {
        console.log('async error');
        return null;
      })
    );
  }

  @Action(LoginWithGoogle)
  loginWithGoogle({ patchState }: StateContext<AuthenticationStateModel>) {
    console.log('logging in with google');
    this._authService.googleLogin();
  }

  @Action(LoginSuccess)
  loginSuccess(
    { patchState }: StateContext<AuthenticationStateModel>,
    { payload }: LoginSuccess
  ) {
    console.log('user logged in ' + payload.username);
  }

  @Action(Logout)
  logout({ patchState }: StateContext<AuthenticationStateModel>) {
    // return this._authService.logout(token).pipe(tap(() => {
    patchState({
      authenticated: false,
      authenticating: false,
      authError: null,
      token: null
    });
    // });
  }
}
