import { merge, BehaviorSubject, Subscription } from 'rxjs';
import { concatMap, takeUntil, filter, take, tap, map } from 'rxjs/operators';

import { firestore } from 'firebase';
import { DocumentChangeAction, AngularFirestoreCollection } from 'angularfire2/firestore';

import { TypedAction } from './typed-action';
import { SynchronizedCollectionAction } from './synchronized-collection-action';
import {
  CollectionMonitoringRequestAction,
  CollectionMonitoringReleaseAction,
  DocumentMonitoringRequestAction
} from './sychronized-store.actions';
import { GenericStore, GenericContext, SelectRegistrationContext } from './generic-store';

import { User } from '../../models/user';

import { BackendService } from '../../services/interfaces/backend.service';
import { StoreService } from '../../services/store.service';
import { SynchronizedDocumentAction } from './synchronized-document-action';

export interface DocumentMonitorHandler {
  documentKey: string;
  storeKey: string;
  backendService: BackendService;
}

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
  private _documentMonitors = {};
  private _monitors = {};

  constructor(context: T, registrationContext: SelectRegistrationContext) {
    super(context, registrationContext);
    this._storeService = registrationContext.storeService;
  }

  static processSynchronizedState(handlers: any, state: any, action: TypedAction, expectedRootStoreKey: string) {
    if (action instanceof SynchronizedCollectionAction) {
      const { operation, collectionKey, rootStoreKey, localStoreKey, documents } = action.payload;

      // Only process collection sync events for the targetted store
      if (expectedRootStoreKey !== rootStoreKey) {
        return super.processState(handlers, state, action);
      }

      const slice: SynchronizedCollectionState = {
        documents: [...state[localStoreKey].documents],
        entities: { ...state[localStoreKey].entities },
        loading: false
      };

      switch (operation) {
        case 'added': {
          documents.forEach((snapshot: firestore.QueryDocumentSnapshot) => {
            const entity = { ...snapshot.data(), id: snapshot.id };
            // Array of document snapshots
            const index = slice.documents.findIndex(document => entity.id === document.id);
            if (index >= 0) {
              slice.documents[index] = entity;
            } else {
              slice.documents.push(entity);
            }
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
      return { ...state, [localStoreKey]: slice };
    }
    return super.processState(handlers, state, action);
  }

  getStoreService() {
    return this._storeService;
  }

  monitorDocuments(monitorHandlers: DocumentMonitorHandler[]) {
    return this.getContext()
      .actions$.ofType(DocumentMonitoringRequestAction.TYPE)
      .pipe(
        tap(({ payload: { documentKey } }: DocumentMonitoringRequestAction) => {
          const handlerSettings = monitorHandlers.find(handler => handler.documentKey === documentKey);
          if (handlerSettings) {
            const { storeKey, backendService } = handlerSettings;
            if (!this._documentMonitors[documentKey]) {
              this._documentMonitors[documentKey] = {
                retain: 0,
                monitor$: backendService.getDocumentMonitor(documentKey),
                subscription: null
              };
            }

            const monitor = this._documentMonitors[documentKey];
            if (monitor.retain === 0) {
              monitor.subscription = monitor.monitor$.subscribe(document => {
                this._storeService.dispatch(new SynchronizedDocumentAction({ document, storeKey }));
              });
            }

            monitor.retain++;
          }
        })
      );
  }

  monitorCollections(monitorHandlers: MonitorHandler[]) {
    return merge(
      this.getContext()
        .actions$.ofType(CollectionMonitoringRequestAction.TYPE)
        .pipe(
          tap(({ payload: { collectionKey, targetStore } }: CollectionMonitoringRequestAction) => {
            const handlerSettings = monitorHandlers.find(handler => handler.collectionKey === collectionKey);
            if (handlerSettings) {
              const { storeKey, backendService } = handlerSettings;

              if (!this._monitors[collectionKey]) {
                this._monitors[collectionKey] = {
                  retain: 0,
                  added$: backendService.getCollectionMonitor(collectionKey, 'added'),
                  modified$: backendService.getCollectionMonitor(collectionKey, 'modified'),
                  removed$: backendService.getCollectionMonitor(collectionKey, 'removed'),
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
                        new SynchronizedCollectionAction({
                          documents,
                          operation,
                          collectionKey,
                          rootStoreKey: targetStore,
                          localStoreKey: storeKey
                        })
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
              const monitor = this._monitors[collectionKey];
              if (monitor) {
                monitor.retain--;
                if (monitor.retain <= 0) {
                  monitor.retain = 0;
                  monitor.subscription.unsubscribe();
                  monitor.subscription = null;
                }
              }
            }
          })
        )
    );
  }
}
