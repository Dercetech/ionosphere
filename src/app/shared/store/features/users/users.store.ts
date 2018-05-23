import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import { StoreService } from '../../../services/store.service';
import { UsersService } from '../../../services/users.service';

import { authenticationKey } from '../../store.keys';
import { GenericStore } from '../../classes/generic-store';

import { UserCreationRequestAction } from './users.actions';
import { handlers, UsersHandlerContext } from './users.handlers';
import { selectsFactory } from './users.selects';

export interface UsersState {}

const initialState: UsersState = {};

@Injectable()
export class UsersStore extends GenericStore<UsersHandlerContext> {
  constructor(actions$: Actions, store: Store<any>, storeService: StoreService, usersService: UsersService) {
    super(
      { actions$, usersService },
      {
        storeService,
        featureKey: authenticationKey,
        propertyKeys: Object.keys(initialState),
        customSelects: selectsFactory(store)
      }
    );
  }

  static reducer(state = initialState, action): UsersState {
    return super.processState(handlers, state, action);
  }

  @Effect() userCreateRequest = this.processEffect(handlers, UserCreationRequestAction.TYPE);
}
