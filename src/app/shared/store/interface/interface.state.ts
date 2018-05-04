import { State, Action, StateContext } from '@ngxs/store';
import { SetMenuCompact, ToggleMenuCompact } from './interface.actions';

import { menuContents } from '../../../menu.contents';

export interface InterfaceStateModel {
  headerDisplayed: boolean;
  menuDisplayed: boolean;
  menuCompact: boolean;
  menuContents: any;
}

@State<InterfaceStateModel>({
  name: 'interface',
  defaults: {
    headerDisplayed: false,
    menuDisplayed: true,
    menuCompact: false,
    menuContents
  }
})
export class InterfaceState {
  @Action(ToggleMenuCompact)
  toggleMenuCompact({
    patchState,
    getState
  }: StateContext<InterfaceStateModel>) {
    const { menuCompact } = getState();
    patchState({ menuCompact: !menuCompact });
  }

  @Action(SetMenuCompact)
  setMenuCompact(
    { patchState }: StateContext<InterfaceStateModel>,
    { payload }: SetMenuCompact
  ) {
    patchState({
      menuCompact: payload
    });
  }
}
