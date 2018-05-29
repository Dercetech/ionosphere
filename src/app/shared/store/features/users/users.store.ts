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
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AppInitializedAction } from '../app/app.actions';
import { switchMap, tap } from 'rxjs/operators';

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
  constructor(
    actions$: Actions,
    store: Store<any>,
    storeService: StoreService,
    usersService: UsersService,
    private _afs: AngularFirestore
  ) {
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

  @Effect({ dispatch: false })
  appInitialized = this.getContext()
    .actions$.ofType(AppInitializedAction.TYPE)
    .pipe(
      tap(() => {
        const usersCollection: AngularFirestoreCollection<any> = this._afs.collection<any>('users');
        const users$ = usersCollection.stateChanges(['added', 'removed', 'modified']);
        users$.subscribe(data => console.log('STATE > ', data));

        const id = this._afs.createId();
        const item = { name: 'Tristan2' };
        //usersCollection.doc(id).set(item);
      })
    );

  @Effect() userCreateRequest = this.processEffect(handlers, UserCreationRequestAction.TYPE);
}
