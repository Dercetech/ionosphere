import { of, pipe } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import {
  SetRootPageAction,
  PushPageAction,
  PopPageAction
} from './routing.actions';
import { RoutingState } from './routing.store';
import { RoutingService } from '../routing.service';

export interface RoutingHandlerContext {
  routingService: RoutingService;
}

const _handlers = {};

_handlers[SetRootPageAction.TYPE] = {
  action: (state: RoutingState, { payload }: SetRootPageAction) => {
    const rootPage = payload.route;
    return { ...state, rootPage };
  },

  effect: (action$, context: RoutingHandlerContext) =>
    action$.pipe(
      switchMap(({ payload }: SetRootPageAction) =>
        of(context.routingService.setRoot(payload.route, payload.params))
      )
    )
};

_handlers[PushPageAction.TYPE] = {
  effect: (action$, context: RoutingHandlerContext) =>
    action$.pipe(
      switchMap(({ payload }: PushPageAction) =>
        of(context.routingService.push(payload.route, payload.params))
      )
    )
};

_handlers[PopPageAction.TYPE] = {
  effect: (action$, context: RoutingHandlerContext) =>
    action$.pipe(switchMap(() => of(context.routingService.pop())))
};

export const handlers = _handlers;
