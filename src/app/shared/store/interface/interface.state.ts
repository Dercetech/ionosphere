import { State, Action, StateContext } from '@ngxs/store';
import { SetMenuCompact, ToggleMenuCompact } from './interface.actions';

export interface InterfaceStateModel {
  headerDisplayed: boolean;
  menuDisplayed: boolean;
  menuCompact: boolean;
}

@State<InterfaceStateModel>({
  name: 'interface',
  defaults: {
    headerDisplayed: false,
    menuDisplayed: true,
    menuCompact: false
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
