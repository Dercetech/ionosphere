import { catchError, map, switchMap, tap } from 'rxjs/operators';

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
          catchError((err: Error) => {
            return of(new actions.LoginFailureAction());
          })
        )
      )
    )
};

// Login succcess
_handlers[actions.LoginSuccessAction.TYPE] = {
  action: (state, action: actions.LoginSuccessAction) => {
    const authenticating = false;
    const authenticated = true;
    return { ...state, authenticated, authenticating };
  }
};

// Login failure
_handlers[actions.LoginFailureAction.TYPE] = {
  action: (state, action: actions.LoginFailureAction) => {
    const authenticating = false;
    const authenticated = false;
    const authenticationError = 'GFY';
    return { ...state, authenticated, authenticating, authenticationError };
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
