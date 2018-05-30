import { merge, BehaviorSubject, Subscription } from 'rxjs';
import { concatMap, takeUntil, filter, take, tap, map } from 'rxjs/operators';

import { firestore } from 'firebase';
import { DocumentChangeAction, AngularFirestoreCollection } from 'angularfire2/firestore';

import { TypedAction } from './typed-action';
import { SynchronizedCollectionAction } from './synchronized-collection-action';
import { CollectionMonitoringRequestAction, CollectionMonitoringReleaseAction } from './sychronized-store.actions';
import { GenericStore, GenericContext, SelectRegistrationContext } from './generic-store';

import { User } from '../../models/user';

import { BackendService } from '../../services/interfaces/backend.service';
import { StoreService } from '../../services/store.service';

export interface MonitorHandler {
  collectionKey: string;
  storeKey: string;
  backendService: BackendService;
}

export interface SynchronizedCollectionState {
  documents: any[];
  entities: any;
  loading: boolean;
}

export class SynchronizedStore<T extends GenericContext> extends GenericStore<T> {
  private _storeService: StoreService;
  private _monitors = {};

  constructor(context: T, registrationContext: SelectRegistrationContext, monitorHandlers: MonitorHandler[]) {
    super(context, SynchronizedStore.augmentRegistrationContextWithMonitors(registrationContext, monitorHandlers));
    this._storeService = registrationContext.storeService;
  }

  static augmentRegistrationContextWithMonitors(
    registrationContext: SelectRegistrationContext,
    monitorHandlers: MonitorHandler[]
  ) {
    return registrationContext;
  }

  static processState(handlers: any, state: any, action: TypedAction) {
    if (action instanceof SynchronizedCollectionAction) {
      const { operation, collectionKey, storeKey, documents } = action.payload;
      const slice: SynchronizedCollectionState = {
        documents: [...state[storeKey].documents],
        entities: { ...state[storeKey].entities },
        loading: false
      };

      switch (operation) {
        case 'added': {
          documents.forEach((snapshot: firestore.QueryDocumentSnapshot) => {
            const entity = { ...snapshot.data(), id: snapshot.id };
            // Array of document snapshots
            slice.documents.push(entity);
            // List of entities
            slice.entities[entity.id] = entity;
          });
          break;
        }
        case 'modified': {
          documents.forEach((snapshot: firestore.QueryDocumentSnapshot) => {
            const entity = { ...snapshot.data(), id: snapshot.id };
            // Find index
            const index = slice.documents.findIndex(document => entity.id === document.id);
            // Array of document snapshots
            slice.documents[index] = entity;
            // List of entities
            slice.entities[entity.id] = entity;
          });
          break;
        }
        case 'removed': {
          documents.forEach((snapshot: firestore.QueryDocumentSnapshot) => {
            // Array of document snapshots
            const index = slice.documents.findIndex(document => snapshot.id === document.id);
            slice.documents.splice(index, 1);
            // List of entities
            delete slice.entities[snapshot.id];
          });
          break;
        }
      }
      return { ...state, [storeKey]: slice };
    }
    return super.processState(handlers, state, action);
  }

  monitorCollections(monitorHandlers: MonitorHandler[]) {
    return merge(
      this.getContext()
        .actions$.ofType(CollectionMonitoringRequestAction.TYPE)
        .pipe(
          tap(({ payload: { collectionKey } }: CollectionMonitoringRequestAction) => {
            const handlerSettings = monitorHandlers.find(handler => handler.collectionKey === collectionKey);
            if (handlerSettings) {
              const { storeKey, backendService } = handlerSettings;
              console.log(
                'requesting collection "' + collectionKey + '" from backend service to local slice "' + storeKey + '".'
              );

              if (!this._monitors[collectionKey]) {
                this._monitors[collectionKey] = {
                  retain: 0,
                  added$: backendService.getCollectionAddMonitor(collectionKey, 'added'),
                  modified$: backendService.getCollectionAddMonitor(collectionKey, 'modified'),
                  removed$: backendService.getCollectionAddMonitor(collectionKey, 'removed'),
                  subscription: null
                };
              }

              const monitor = this._monitors[collectionKey];
              monitor.retain === 0 &&
                ['added', 'modified', 'removed'].forEach((operation: 'added' | 'modified' | 'removed') => {
                  monitor.subscription = monitor[`${operation}$`]
                    .pipe(map((actions: DocumentChangeAction[]) => actions.map(action => action.payload.doc)))
                    .subscribe((documents: firestore.QueryDocumentSnapshot[]) => {
                      this._storeService.dispatch(
                        new SynchronizedCollectionAction({ documents, operation, collectionKey, storeKey })
                      );
                    });
                });

              monitor.retain++;
            }
          })
        ),

      this.getContext()
        .actions$.ofType(CollectionMonitoringReleaseAction.TYPE)
        .pipe(
          tap(({ payload: { collectionKey } }: CollectionMonitoringReleaseAction) => {
            const handlerSettings = monitorHandlers.find(handler => handler.collectionKey === collectionKey);
            if (handlerSettings) {
              const { storeKey, backendService } = handlerSettings;
              console.log(
                'releasing collection "' + collectionKey + '" from backend service to local slice "' + storeKey + '".'
              );
              const monitor = this._monitors[collectionKey];
              monitor.retain--;
              if (monitor.retain <= 0) {
                monitor.retain = 0;
                monitor.subscription.unsubscribe();
                monitor.subscription = null;
                console.log('garbage collecting...<<<<<<<<<<s<<s');
              }
            }
          })
        )
    );
  }
}
