import { State, Action, StateContext } from '@ngxs/store';
import { SetMenuCompact, ToggleMenuCompact } from './interface.actions';
import { of } from 'rxjs/observable/of';

import { menuContents } from '../../../menu.contents';
import { tap } from 'rxjs/operators';

export interface InterfaceStateModel {
  headerDisplayed: boolean;
  menuDisplayed: boolean;
  menuCompact: boolean;
  menuContents: any;
}

@State<InterfaceStateModel>({
  name: 'interface',
  defaults: {
    headerDisplayed: true,
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
    console.log('try here');
    return of('123').pipe(tap(result => console.log('result')));
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
