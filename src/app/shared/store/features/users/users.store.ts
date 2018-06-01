import { Injectable } from '@angular/core';

import { merge } from 'rxjs';
import { switchMap, tap, concatMap, combineLatest } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { ListState } from '../../interfaces/list-state';
import { ActionState } from '../../interfaces/action-state';
import { SynchronizedStore } from '../../classes/synchronized-store';
import { usersKey } from '../../store.keys';

import { User } from '../../../models/user';

import { StoreService } from '../../../services/store.service';
import { UsersService, USERS_KEY } from '../../../services/users.service';

import { AppInitializedAction } from '../app/app.actions';
import { UserCreationRequestAction } from './users.actions';
import { handlers, UsersHandlerContext } from './users.handlers';
import { selectsFactory } from './users.selects';
import { LogoutRequestAction, LoginSuccessAction } from '../authentication/authentication.actions';
import { map } from 'rxjs-compat/operator/map';
import { of } from 'rxjs';
import { SynchronizedCollectionAction } from '../../classes/synchronized-collection-action';
import { CollectionMonitoringRequestAction } from '../../classes/sychronized-store.actions';

export const UserCollectionKeys = {
  USERS_ALL: 'users.all'
};

export interface UsersState {
  registration: ActionState<string>;
  all: ListState<User>;
}

const initialState: UsersState = {
  registration: {
    data: null,
    error: null,
    processing: false
  },
  all: {
    entities: {},
    documents: [],
    loading: false
  }
};

@Injectable()
export class UsersStore extends SynchronizedStore<UsersHandlerContext> {
  constructor(actions$: Actions, store: Store<any>, storeService: StoreService, private _usersService: UsersService) {
    super(
      { actions$, usersService: _usersService },
      {
        storeService,
        featureKey: usersKey,
        initialState,
        customSelects: selectsFactory(store)
      }
    );
  }

  static reducer(state = initialState, action): UsersState {
    return super.processSynchronizedState(handlers, state, action, usersKey);
  }

  // Document monitoring handlers
  @Effect({ dispatch: false })
  documentMonitoringEffect = this.documentMonitoringSetup([
    { localStoreKey: 'authenticated', backendService: this._usersService, folderPath: null }
  ]);

  // Collection monitoring handlers
  @Effect({ dispatch: false })
  collectionMonitoringEffect = this.collectionMonitoringSetup([
    {
      backendService: this._usersService,
      collectionKey: USERS_KEY.all,
      storeKey: 'all'
    }
  ]);

  // Regular effects
  @Effect() userCreateRequest = this.processEffect(handlers, UserCreationRequestAction.TYPE);
}
