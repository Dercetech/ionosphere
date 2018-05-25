import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';

import { StoreService } from '../../../services/store.service';

import { appKey } from '../../store.keys';
import { GenericStore } from '../../classes/generic-store';

import { handlers, AppHandlerContext } from './app.handlers';
import { selectsFactory } from './app.selects';

export interface AppState {
  //ready: boolean;
  loginCheckComplete: boolean;
}

const initialState: AppState = {
  //ready: false, // see custom selector
  loginCheckComplete: false
};

@Injectable()
export class AppStore extends GenericStore<AppHandlerContext> {
  constructor(actions$: Actions, store: Store<any>, storeService: StoreService) {
    super(
      { actions$ },
      {
        storeService,
        featureKey: appKey,
        propertyKeys: Object.keys(initialState),
        customSelects: selectsFactory(store)
      }
    );
  }

  static reducer(state = initialState, action: any): AppState {
    return super.processState(handlers, state, action);
  }
}
