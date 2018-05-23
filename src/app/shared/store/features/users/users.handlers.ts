import { of, pipe } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { GenericContext } from '../../classes/generic-store';
import { UsersService } from '../../../services/users.service';

import * as actions from './users.actions';

export interface UsersHandlerContext extends GenericContext {
  usersService: UsersService;
}

const _handlers = {};

// User creation request
_handlers[actions.UserCreationRequestAction.TYPE] = {
  action: (state, action: actions.UserCreationRequestAction) => {
    return { ...state };
  },

  effect: (action$, context: UsersHandlerContext) =>
    action$.pipe(
      switchMap(({ payload }: actions.UserCreationRequestAction) =>
        context.usersService.createUser(payload).pipe(
          map((token: string) => new actions.LoginSuccessAction({ token }))
          // catchError(err => of(new userActions.loadUsersFailed(err)) )
        )
      )
    )
};

export const handlers = _handlers;
