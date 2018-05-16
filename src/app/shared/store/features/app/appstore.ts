import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';

import { StoreService } from '../../../services/store.service';

import { appKey } from '../../store.keys';
import { GenericStore } from '../../classes/generic-store';

import { handlers } from './app.handlers';
import { selectsFactory } from './app.selects';

import { menuContents } from '../../../../menu.contents';

export interface AppState {
  ready: boolean;
  loginCheckComplete: boolean;
}

const initialState: AppState = {
  ready: false, // see custom selector
  loginCheckComplete: false
};

@Injectable()
export class AppStore extends GenericStore {
  constructor(
    _actions$: Actions,
    _store: Store<any>,
    _storeService: StoreService
  ) {
    super(
      { actions$: _actions$ },
      {
        _storeService,
        featureKey: appKey,
        propertyKeys: Object.keys(initialState),
        customSelects: selectsFactory(_store)
      }
    );
  }

  static reducer(state = initialState, action: any): AppState {
    return super.processState(handlers, state, action);
  }
}
