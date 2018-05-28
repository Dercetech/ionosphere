import { of, pipe } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { GenericContext, fire } from '../../classes/generic-store';
import { UsersService, UserCreationError } from '../../../services/users.service';
import { ActionState } from '../../interfaces/action-state';

import * as actions from './users.actions';

export interface UsersHandlerContext extends GenericContext {
  usersService: UsersService;
}

const _handlers = {};

// User creation request
_handlers[actions.UserCreationRequestAction.TYPE] = {
  action: (state, action: actions.UserCreationRequestAction) => {
    const registration: ActionState<string> = fire.request();
    return { ...state, registration };
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
    const registration = fire.succeed(state.registration);
    return { ...state, registration };
  }
};

// User creation failure
_handlers[actions.UserCreationErrorAction.TYPE] = {
  action: (state, { payload }: actions.UserCreationErrorAction) => {
    const registration = fire.fail(state.registration, payload);
    return { ...state, registration };
  }
};

export const handlers = _handlers;
