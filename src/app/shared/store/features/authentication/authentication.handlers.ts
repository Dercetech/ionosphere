import { catchError, map, switchMap } from 'rxjs/operators';

import { GenericContext } from '../../classes/generic-store';

import * as actions from './authentication.actions';
import { AuthenticationService } from '../../../services/authentication.service';
import { of } from 'rxjs';
import { SetRootPageAction } from '../../../../routing/store/routing.actions';
import { routes } from '../../../../routing/routes';
import { ActionState } from '../../interfaces/action-state';

export interface AuthenticationHandlerContext extends GenericContext {
  authService: AuthenticationService;
}

const _handlers = {};

// Login request
_handlers[actions.LoginRequestAction.TYPE] = {
  action: (state, action: actions.LoginRequestAction) => {
    const login: ActionState<string> = { processing: true, error: null, data: null };
    return { ...state, authenticated: false, login };
  },

  effect: (action$, context: AuthenticationHandlerContext) =>
    action$.pipe(
      switchMap(({ payload }: actions.LoginRequestAction) =>
        context.authService
          .authenticate(payload)
          .pipe(
            map(data => new SetRootPageAction({ route: routes.dashboard.page })),
            catchError((error: Error) => of(new actions.LoginFailureAction(error)))
          )
      )
    )
};

// Login succcess
_handlers[actions.LoginSuccessAction.TYPE] = {
  action: (state, { payload }: actions.LoginSuccessAction) => {
    const login = { ...state.login, processing: false };
    return { ...state, authenticated: true, login };
  }
};

// Login failure
_handlers[actions.LoginFailureAction.TYPE] = {
  action: (state, { payload }: actions.LoginFailureAction) => {
    console.log('processing action for login failure');
    const error = payload;
    const login = { ...state.login, processing: false, error };
    return { ...state, login };
  }
};

// Password reset request
_handlers[actions.PasswordResetRequestAction.TYPE] = {
  action: (state, action: actions.PasswordResetRequestAction) => {
    const passwordReset: ActionState<string> = { ...state.passwordReset, processing: true, data: null, error: null };
    return { ...state, passwordReset };
  },

  effect: (action$, context: AuthenticationHandlerContext) =>
    action$.pipe(
      switchMap(({ payload }: actions.PasswordResetRequestAction) =>
        context.authService.askForNewPassword(payload.username).pipe(
          map(data => new actions.PasswordResetSuccessAction()),
          catchError((error: Error) => {
            return of(new actions.PasswordResetFailureAction(error));
          })
        )
      )
    )
};

// Password reset succcess
_handlers[actions.PasswordResetSuccessAction.TYPE] = {
  action: (state, { payload }: actions.LoginSuccessAction) => {
    const passwordReset = { ...state.passwordReset, processing: false };
    return { ...state, passwordReset };
  }
};

// Password reset failure
_handlers[actions.PasswordResetFailureAction.TYPE] = {
  action: (state, { payload }: actions.LoginFailureAction) => {
    const error = payload;
    const passwordReset = { ...state.passwordReset, processing: false, error };
    return { ...state, passwordReset };
  }
};

// Logout request
_handlers[actions.LogoutRequestAction.TYPE] = {
  effect: (action$, context: AuthenticationHandlerContext) =>
    action$.pipe(
      switchMap(() =>
        context.authService
          .signOut()
          .pipe(
            map(() => new SetRootPageAction({ route: routes.login.page })),
            catchError(err => of(new actions.LogoutFailureAction()))
          )
      )
    )
};

// Logout succcess
_handlers[actions.LogoutSuccessAction.TYPE] = {
  action: (state, action: actions.LogoutSuccessAction) => {
    return { ...state, authenticated: false };
  }
};

export const handlers = _handlers;
