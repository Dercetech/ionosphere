import { of, pipe } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AppState } from './appstore';
import {
  LoginSuccessAction,
  LogoutSuccessAction,
  LogoutRequestAction
} from '../authentication/authentication.actions';

const _handlers = {};

const setFirstLoginCheckComplete = (
  state: AppState,
  { payload }: LoginSuccessAction
) => {
  const loginCheckComplete = true;
  return { ...state, loginCheckComplete };
};

_handlers[LoginSuccessAction.TYPE] = {
  action: setFirstLoginCheckComplete
};

_handlers[LogoutSuccessAction.TYPE] = {
  action: setFirstLoginCheckComplete
};

_handlers[LogoutRequestAction.TYPE] = {
  action: setFirstLoginCheckComplete
};

export const handlers = _handlers;
