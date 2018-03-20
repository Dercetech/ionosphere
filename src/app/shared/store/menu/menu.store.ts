import { Store, Action } from 'ngrx-actions';

import {menuContents} from "./menu.contents";

import * as fromActions from './actions';

export interface MenuState {
  displayed: boolean,
  compact: boolean,
  structure: any
}

@Store({
  displayed: false,
  compact: true,
  structure: menuContents
})
export class MenuStore {

  constructor(){}

  @Action(fromActions.MenuSetCompact)
  setMenuCompact(state: MenuState, { payload }: fromActions.MenuSetCompact ) {
    return {
      ...state,
      compact: payload
    }
  }

  @Action(fromActions.MenuToggleCompact)
  toggleMenuSize(state: MenuState, { payload }: fromActions.MenuToggleCompact ) {
    return {
      ...state,
      compact: !state.compact
    }
  }

}
