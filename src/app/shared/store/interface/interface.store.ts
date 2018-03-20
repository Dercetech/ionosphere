import { Store, Action } from 'ngrx-actions';

import * as fromActions from './actions';

export interface InterfaceState {
  displayMenu: boolean
}

@Store({
  displayMenu: false
})
export class InterfaceStore {

  constructor(){}

  @Action(fromActions.InterfaceToggleMenuVisibility)
  setMenuCompact(state: InterfaceState, { payload }: fromActions.InterfaceToggleMenuVisibility ) {
    return {
      ...state,
      displayMenu: !state.displayMenu
    }
  }

}
