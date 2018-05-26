import { of, pipe } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { GenericContext } from '../../classes/generic-store';
import { UsersService, UserCreationError } from '../../../services/users.service';

import * as actions from './users.actions';

export interface UsersHandlerContext extends GenericContext {
  usersService: UsersService;
}

const _handlers = {};

// User creation request
_handlers[actions.UserCreationRequestAction.TYPE] = {
  action: (state, action: actions.UserCreationRequestAction) => {
    return {
      ...state,
      registering: true,
      registeringErrorMessage: null,
      registeringErrorPwdTooWeak: false,
      registeringErrorEmailTaken: false
    };
  },

  effect: (action$, context: UsersHandlerContext) =>
    action$.pipe(
      switchMap(({ payload }: actions.UserCreationRequestAction) =>
        context.usersService
          .createUserWithEmailAndPassword(payload)
          .pipe(
            map(() => new actions.UserCreationSuccessAction()),
            catchError((error: UserCreationError) => of(new actions.UserCreationErrorAction(error)))
          )
      )
    )
};

// User creation success
_handlers[actions.UserCreationSuccessAction.TYPE] = {
  action: (state, action: actions.UserCreationSuccessAction) => {
    return {
      ...state,
      registering: false
    };
  }
};

// User creation failure
_handlers[actions.UserCreationErrorAction.TYPE] = {
  action: (state, { payload }: actions.UserCreationErrorAction) => {
    return {
      ...state,
      registering: false,
      registeringErrorMessage: payload.message,
      registeringErrorPwdTooWeak: payload.errors.isWeak,
      registeringErrorEmailTaken: payload.errors.emailExists
    };
  }
};

export const handlers = _handlers;
