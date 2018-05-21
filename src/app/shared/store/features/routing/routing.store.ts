import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';

import { StoreService } from '../../../services/store.service';

import { routingKey } from '../../store.keys';
import { GenericStore } from '../../classes/generic-store';

import { handlers } from './routing.handlers';
import { selectsFactory } from './routing.selects';

import { menuContents } from '../../../../menu.contents';

export interface RoutingState {
  rootPage: string;
}

const initialState: RoutingState = {
  rootPage: null
};

@Injectable()
export class RouteStore extends GenericStore {
  constructor(
    _actions$: Actions,
    _store: Store<any>,
    _storeService: StoreService
  ) {
    super(
      { actions$: _actions$ },
      {
        _storeService,
        featureKey: routingKey,
        propertyKeys: Object.keys(initialState),
        customSelects: selectsFactory(_store)
      }
    );
  }

  static reducer(state = initialState, action: any): RoutingState {
    return super.processState(handlers, state, action);
  }
}
