import { catchError, map, switchMap } from 'rxjs/operators';

import { GenericContext } from '../../classes/generic-store';

import * as actions from './authentication.actions';
import { AuthenticationService } from '../../../services/authentication.service';

export interface AuthenticationHandlerContext extends GenericContext {
  authService: AuthenticationService;
}

const _handlers = {};

// Login request
_handlers[actions.LoginRequestAction.TYPE] = {
  action: (state, action: actions.LoginRequestAction) => {
    const authenticating = true;
    const authenticated = false;
    const token = null;
    return { ...state, authenticated, authenticating, token };
  },

  effect: (action$, context: AuthenticationHandlerContext) =>
    action$.pipe(
      switchMap(({ payload }: actions.LoginRequestAction) =>
        context.authService.authenticate(payload).pipe(
          map((token: string) => new actions.LoginSuccessAction({ token }))
          // catchError(err => of(new userActions.loadUsersFailed(err)) )
        )
      )
    )
};

// Login succcess
_handlers[actions.LoginSuccessAction.TYPE] = {
  action: (state, action: actions.LoginSuccessAction) => {
    const authenticating = false;
    const authenticated = true;
    const token = action.payload.token;
    return { ...state, authenticated, authenticating, token };
  }
};

export const handlers = _handlers;
