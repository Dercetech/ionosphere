import { Store, Action, Effect } from 'ngrx-actions';
import { map } from 'rxjs/operators';

import { I18nService } from '../../i18n/services/i18n-service';

import { ENV } from '@app/env';
import * as fromActions from './actions';

export interface InterfaceState {
  displayMenu: boolean;
  activeLanguage: string;
  languageLoading: boolean;
}

@Store({
  displayMenu: ENV.interface.showHeader,
  activeLanguage: 'en',
  languageLoading: true
})
export class InterfaceStore {
  constructor(private _i18n: I18nService) {}

  @Action(fromActions.InterfaceToggleMenuVisibility)
  setMenuCompact(
    state: InterfaceState,
    { payload }: fromActions.InterfaceToggleMenuVisibility
  ) {
    return {
      ...state,
      displayMenu: !state.displayMenu
    };
  }

  @Action(fromActions.InterfaceSetLanguage)
  setInterfaceLanguage(
    state: InterfaceState,
    { payload }: fromActions.InterfaceSetLanguage
  ) {
    const activeLanguage = payload;
    const languageLoading = true;
    return { ...state, activeLanguage, languageLoading };
  }

  @Action(fromActions.InterfaceLanguageLoadSuccess)
  loadInterfaceLanguageSuccess(state: InterfaceState) {
    const languageLoading = false;
    return { ...state, languageLoading };
  }

  @Effect(fromActions.InterfaceSetLanguage)
  loadInterfaceLanguage(
    state: InterfaceState,
    { payload }: fromActions.InterfaceSetLanguage
  ) {
    const activeLanguage = payload;
    return this._i18n
      .switchToLanguage$(activeLanguage)
      .pipe(map(success => new fromActions.InterfaceLanguageLoadSuccess()));
  }
}
