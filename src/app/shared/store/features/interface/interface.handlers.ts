import { of, pipe } from 'rxjs';
import { catchError, map, switchMap, concatMap, merge, take, tap } from 'rxjs/operators';

import { GenericContext } from '../../classes/generic-store';

import {
  SetMenuCompactAction,
  ToggleMenuCompactAction,
  SwitchLanguageAction,
  SwitchLanguageSuccessAction
} from './interface.actions';
import { AppInitializedAction } from '../app/app.actions';
import { InterfaceState } from './interface.store';
import { I18nService } from '../../../i18n/services/i18n-service';
import { StoreService } from '../../../services/store.service';

export interface InterfaceHandlerContext extends GenericContext {
  i18nService: I18nService;
  storeService: StoreService;
}

const _handlers = {};

// App initialized
_handlers[AppInitializedAction.TYPE] = {
  effect: (action$, context) =>
    action$.pipe(
      tap(() => context.i18nService.initializeWithStore()),
      concatMap(() => context.storeService.select.interface.currentLanguage$.pipe(take(1))),
      concatMap((targetLanguage: string) => [new SwitchLanguageAction({ targetLanguage })])
    )
};

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

_handlers[SwitchLanguageAction.TYPE] = {
  action: (state: InterfaceState, { payload: { targetLanguage } }: SwitchLanguageAction) => {
    const languageLoading = true;
    const currentLanguage = targetLanguage;
    return { ...state, languageLoading, currentLanguage };
  },

  effect: (action$, context: InterfaceHandlerContext) =>
    action$.pipe(
      switchMap(({ payload: { targetLanguage } }: SwitchLanguageAction) =>
        context.i18nService.switchToLanguage(targetLanguage).pipe(
          map(() => new SwitchLanguageSuccessAction())
          //catchError(error => of(new SwitchLanguageErrorAction(error)))
        )
      )
    )
};

_handlers[SwitchLanguageSuccessAction.TYPE] = {
  action: (state: InterfaceState) => {
    const languageLoading = false;
    return { ...state, languageLoading };
  }
};

export const handlers = _handlers;
