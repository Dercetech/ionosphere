import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';

import { StoreService } from '../../../services/store.service';

import { interfaceKey } from '../../store.keys';
import { GenericStore } from '../../classes/generic-store';

import { handlers, InterfaceHandlerContext } from './interface.handlers';
import { selectsFactory } from './interface.selects';

import { menuContents } from '../../../../menu.contents';

export interface InterfaceState {
  headerDisplayed: boolean;
  menuDisplayed: boolean;
  menuCompact: boolean;
  menuContents: any;
}

const initialState: InterfaceState = {
  headerDisplayed: true, // see custom selector
  menuDisplayed: true, // see custom selector
  menuCompact: false,
  menuContents
};

@Injectable()
export class InterfaceStore extends GenericStore<InterfaceHandlerContext> {
  constructor(actions$: Actions, store: Store<any>, storeService: StoreService) {
    super(
      { actions$ },
      {
        storeService,
        featureKey: interfaceKey,
        propertyKeys: Object.keys(initialState),
        customSelects: selectsFactory(store)
      }
    );
  }

  static reducer(state = initialState, action: any): InterfaceState {
    return super.processState(handlers, state, action);
  }
}
