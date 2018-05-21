import { of, pipe } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { SetRootPageAction } from './routing.actions';
import { RoutingState } from './routing.store';

const _handlers = {};

_handlers[SetRootPageAction.TYPE] = {
  action: (state: RoutingState, { payload }: SetRootPageAction) => {
    return { ...state, rootPage: payload };
  }
};

export const handlers = _handlers;
