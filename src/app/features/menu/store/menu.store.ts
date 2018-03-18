import { Store, Action } from 'ngrx-actions';

import {menuContents} from "./menu.contents";

import * as fromActions from './actions';

export interface MenuState {
  display: boolean,
  structure: any
}

@Store({
  display: true,
  structure: menuContents
})
export class MenuStore {

  constructor(){}

  @Action(fromActions.MyAction)
  load(state: MenuState, { payload }: fromActions.MyAction ) {
    console.log('PIPI HIHIHI');
  }
}
