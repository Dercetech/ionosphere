import { Store, Action } from 'ngrx-actions';

import * as fromActions from './actions/';

export interface RootState {
  loading: boolean;
}

@Store({
  loading: false
})
export class RootStore {

  @Action(fromActions.MyAction)
  load(state: RootState, { payload }: fromActions.MyAction ) {
    console.log('CACA OLALA');
  }
}
