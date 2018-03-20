import { Store, Action } from 'ngrx-actions';

import * as fromActions from './actions';

export interface InterfaceState {
  displayMenu: boolean;
  activeLanguage: string;
}

@Store({
  displayMenu: false,
  activeLanguage: 'en'
})
export class InterfaceStore {

  constructor() { }

  @Action(fromActions.InterfaceToggleMenuVisibility)
  setMenuCompact(state: InterfaceState, { payload }: fromActions.InterfaceToggleMenuVisibility) {
    return {
      ...state,
      displayMenu: !state.displayMenu
    }
  }

  @Action(fromActions.InterfaceSetLanguage)
  setInterfaceLanguage(state: InterfaceState, { payload }: fromActions.InterfaceSetLanguage) {
    const activeLanguage = payload;
    return { ...state, activeLanguage }
  }
}
