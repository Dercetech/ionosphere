import { catchError, map, switchMap } from 'rxjs/operators';

import { GenericContext, fire } from '../../classes/generic-store';

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
    const login: ActionState<string> = fire.request();
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
    const login = fire.succeed(state.login);
    return { ...state, authenticated: true, login };
  }
};

// Login failure
_handlers[actions.LoginFailureAction.TYPE] = {
  action: (state, { payload }: actions.LoginFailureAction) => {
    const login = fire.fail(state.login, payload);
    return { ...state, login };
  }
};

// Password reset request
_handlers[actions.PasswordResetRequestAction.TYPE] = {
  action: (state, action: actions.PasswordResetRequestAction) => {
    const passwordReset: ActionState<string> = fire.request();
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
    const passwordReset = fire.succeed(state.passwordReset);
    return { ...state, passwordReset };
  }
};

// Password reset failure
_handlers[actions.PasswordResetFailureAction.TYPE] = {
  action: (state, { payload }: actions.LoginFailureAction) => {
    const passwordReset = fire.fail(state.passwordReset, payload);
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
