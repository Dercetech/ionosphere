import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import { StoreService } from '../../../services/store.service';
import { UsersService } from '../../../services/users.service';

import { usersKey } from '../../store.keys';
import { GenericStore } from '../../classes/generic-store';

import { UserCreationRequestAction } from './users.actions';
import { handlers, UsersHandlerContext } from './users.handlers';
import { selectsFactory } from './users.selects';
import { ActionState } from '../../interfaces/action-state';

export interface UsersState {
  registration: ActionState<string>;
}

const initialState: UsersState = {
  registration: {
    data: null,
    error: null,
    processing: false
  }
};

@Injectable()
export class UsersStore extends GenericStore<UsersHandlerContext> {
  constructor(actions$: Actions, store: Store<any>, storeService: StoreService, usersService: UsersService) {
    super(
      { actions$, usersService },
      {
        storeService,
        featureKey: usersKey,
        initialState,
        customSelects: selectsFactory(store)
      }
    );
  }

  static reducer(state = initialState, action): UsersState {
    return super.processState(handlers, state, action);
  }

  @Effect() userCreateRequest = this.processEffect(handlers, UserCreationRequestAction.TYPE);
}
