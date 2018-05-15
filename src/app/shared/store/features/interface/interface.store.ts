import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';

import { StoreService } from '../../../services/store.service';

import { interfaceKey } from '../../store.keys';
import { GenericStore } from '../../classes/generic-store';

import { handlers } from './interface.handlers';
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
  menuDisplayed: false, // see custom selector
  menuCompact: false,
  menuContents
};

@Injectable()
export class InterfaceStore extends GenericStore {
  constructor(
    _actions$: Actions,
    private _store: Store<any>,
    private _storeService: StoreService
  ) {
    super({ actions$: _actions$ });
    this.registerSelects();
  }

  static reducer(state = initialState, action: any): InterfaceState {
    return super.processState(handlers, state, action);
  }

  registerSelects() {
    this._storeService.registerSelects(
      interfaceKey,
      Object.keys(initialState),
      selectsFactory(this._store)
    );
  }
}
