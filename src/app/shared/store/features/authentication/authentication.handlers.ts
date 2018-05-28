import { catchError, map, switchMap } from 'rxjs/operators';

import { GenericContext } from '../../classes/generic-store';

import * as actions from './authentication.actions';
import { AuthenticationService } from '../../../services/authentication.service';
import { of } from 'rxjs';
import { SetRootPageAction } from '../../../../routing/store/routing.actions';
import { routes } from '../../../../routing/routes';

export interface AuthenticationHandlerContext extends GenericContext {
  authService: AuthenticationService;
}

const _handlers = {};

// Login request
_handlers[actions.LoginRequestAction.TYPE] = {
  action: (state, action: actions.LoginRequestAction) => {
    const authenticating = true;
    const authenticated = false;
    const authenticationError = null;
    return { ...state, authenticated, authenticating, authenticationError };
  },

  effect: (action$, context: AuthenticationHandlerContext) =>
    action$.pipe(
      switchMap(({ payload }: actions.LoginRequestAction) =>
        context.authService.authenticate(payload).pipe(
          map(data => new SetRootPageAction({ route: routes.dashboard.page })),
          catchError((error: Error) => {
            const { message } = error;
            return of(new actions.LoginFailureAction({ message }));
          })
        )
      )
    )
};

// Login succcess
_handlers[actions.LoginSuccessAction.TYPE] = {
  action: (state, { payload }: actions.LoginSuccessAction) => {
    const authenticating = false;
    const authenticated = true;
    return { ...state, authenticated, authenticating };
  }
};

// Login failure
_handlers[actions.LoginFailureAction.TYPE] = {
  action: (state, { payload }: actions.LoginFailureAction) => {
    const authenticating = false;
    const authenticated = false;
    const authenticationError = payload.message;
    return { ...state, authenticated, authenticating, authenticationError };
  }
};

// Password reset request
_handlers[actions.PasswordResetRequestAction.TYPE] = {
  action: (state, action: actions.LoginRequestAction) => {
    const passwordReset = { ...state.passwordReset, processing: true, completed: false };
    return { ...state, passwordReset };
  },

  effect: (action$, context: AuthenticationHandlerContext) =>
    action$.pipe(
      switchMap(({ payload }: actions.PasswordResetRequestAction) =>
        context.authService.askForNewPassword(payload.username).pipe(
          map(data => new actions.PasswordResetSuccessAction()),
          catchError((error: Error) => {
            const { message } = error;
            return of(new actions.PasswordResetFailureAction({ message }));
          })
        )
      )
    )
};

// Password reset succcess
_handlers[actions.PasswordResetSuccessAction.TYPE] = {
  action: (state, { payload }: actions.LoginSuccessAction) => {
    const passwordReset = { ...state.passwordReset, processing: false, completed: true };
    return { ...state, passwordReset };
  }
};

// Password reset failure
_handlers[actions.PasswordResetFailureAction.TYPE] = {
  action: (state, { payload }: actions.LoginFailureAction) => {
    const passwordReset = { ...state.passwordReset, processing: false, completed: payload.message };
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
    const authenticating = false;
    const authenticated = false;
    return { ...state, authenticated, authenticating };
  }
};

export const handlers = _handlers;
