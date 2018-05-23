import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import { GenericStore } from '../../shared/store/classes/generic-store';
import { StoreService } from '../../shared/services/store.service';

import { RoutingService } from '../routing.service';
import { handlers, RoutingHandlerContext } from './routing.handlers';
import { selectsFactory } from './routing.selects';
import { routingKey } from './routing.key';
import { PushPageAction, PopPageAction, SetRootPageAction } from './routing.actions';

export interface RoutingState {
  rootPage: string;
  params: string;
}

const initialState: RoutingState = {
  rootPage: null,
  params: null
};

@Injectable()
export class RouteStore extends GenericStore<RoutingHandlerContext> {
  constructor(actions$: Actions, store: Store<any>, storeService: StoreService, routingService: RoutingService) {
    super(
      { actions$, routingService },
      {
        storeService,
        featureKey: routingKey,
        propertyKeys: Object.keys(initialState),
        customSelects: selectsFactory(store)
      }
    );
  }

  static reducer(state = initialState, action: any): RoutingState {
    return super.processState(handlers, state, action);
  }

  @Effect({ dispatch: false })
  setRoot = this.processEffect(handlers, SetRootPageAction.TYPE);

  @Effect({ dispatch: false })
  pushPage = this.processEffect(handlers, PushPageAction.TYPE);

  @Effect({ dispatch: false })
  popPage = this.processEffect(handlers, PopPageAction.TYPE);
}
