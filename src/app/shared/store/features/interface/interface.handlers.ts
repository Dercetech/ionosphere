import { of, pipe } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import {
  SetMenuCompactAction,
  ToggleMenuCompactAction
} from './interface.actions';
import { InterfaceState } from './interface.store';

const _handlers = {};

_handlers[SetMenuCompactAction.TYPE] = {
  action: (state: InterfaceState, { payload }: SetMenuCompactAction) => {
    const menuCompact = payload;
    return { ...state, menuCompact };
  }
};

_handlers[ToggleMenuCompactAction.TYPE] = {
  action: (state: InterfaceState) => {
    const menuCompact = !state.menuCompact;
    return { ...state, menuCompact };
  }
};

export const handlers = _handlers;
