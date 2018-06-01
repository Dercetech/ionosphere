import { merge, BehaviorSubject, Subscription } from 'rxjs';
import { concatMap, takeUntil, filter, take, tap, map } from 'rxjs/operators';

import { firestore } from 'firebase';
import { DocumentChangeAction, AngularFirestoreCollection } from 'angularfire2/firestore';

import { TypedAction } from './typed-action';
import { SynchronizedCollectionAction } from './synchronized-collection-action';
import {
  CollectionMonitoringRequestAction,
  CollectionMonitoringReleaseAction,
  DocumentMonitoringRequestAction,
  DocumentMonitoringReleaseAction
} from './sychronized-store.actions';
import { GenericStore, GenericContext, SelectRegistrationContext } from './generic-store';

import { User } from '../../models/user';

import { BackendService } from '../../services/classes/backend.service';
import { StoreService } from '../../services/store.service';
import { SynchronizedDocumentAction } from './synchronized-document-action';
import { LogoutSuccessAction } from '../features/authentication/authentication.actions';

export interface DocumentMonitorHandler {
  backendService: BackendService;
  folderPath: string;
  localStoreKey: string;
}

export interface CollectionMonitorHandler {
  collectionKey: string;
  storeKey: string;
  backendService: BackendService;
}

export interface SynchronizedDocumentState {
  document: any;
  id: string;
  loading: boolean;
}

export interface SynchronizedCollectionState {
  documents: any[];
  entities: any;
  loading: boolean;
}

export class SynchronizedStore<T extends GenericContext> extends GenericStore<T> {
  private _storeService: StoreService;
  private _targetStore: string;
  private _documentMonitors = {};
  private _monitors = {};

  constructor(context: T, registrationContext: SelectRegistrationContext) {
    super(context, registrationContext);
    this._storeService = registrationContext.storeService;
    this._targetStore = registrationContext.featureKey;
  }

  static processSynchronizedState(handlers: any, state: any, action: TypedAction, expectedRootStoreKey: string) {
    //
    // Handle document updates
    if (action instanceof SynchronizedDocumentAction) {
      const { rootStoreKey, localStoreKey, document, documentKey } = action.payload;

      // Only process collection sync events for the targetted store
      if (expectedRootStoreKey !== rootStoreKey) {
        return super.processState(handlers, state, action);
      }

      const slice: SynchronizedDocumentState = { document, id: documentKey, loading: false };
      return { ...state, [localStoreKey]: slice };
    }

    // Handle collection updates
    else if (action instanceof SynchronizedCollectionAction) {
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

  monitorDocument(targetStoreKey: string, documentKey: string) {
    const targetStore = this._targetStore;
    this._storeService.dispatch(new DocumentMonitoringRequestAction({ documentKey, targetStore, targetStoreKey }));
  }

  releaseDocumentMonitor(targetStoreKey: string) {
    const targetStore = this._targetStore;
    this._storeService.dispatch(new DocumentMonitoringReleaseAction({ targetStore, targetStoreKey }));
  }

  monitorCollection(collectionKey: string) {
    const targetStore = this._targetStore;
    this._storeService.dispatch(new CollectionMonitoringRequestAction({ collectionKey, targetStore }));
  }

  releaseCollectionMonitor(collectionKey: string) {
    const targetStore = this._targetStore;
    this._storeService.dispatch(new CollectionMonitoringReleaseAction({ collectionKey, targetStore }));
  }

  documentMonitoringSetup(monitorHandlers: DocumentMonitorHandler[]) {
    return merge(
      // Document monitor retain
      this.getContext()
        .actions$.ofType(DocumentMonitoringRequestAction.TYPE)
        .pipe(
          tap(({ payload: { documentKey, targetStore, targetStoreKey } }: DocumentMonitoringRequestAction) => {
            if (targetStore !== this._targetStore) {
              return;
            }
            // Pick the handler for this local key
            const handlerSettings: DocumentMonitorHandler = monitorHandlers.find(
              handler => handler.localStoreKey === targetStoreKey
            );
            if (handlerSettings) {
              const { backendService, folderPath } = handlerSettings;
              if (!this._documentMonitors[targetStoreKey]) {
                this._documentMonitors[targetStoreKey] = {
                  retain: 0,
                  monitor$: backendService.getDocumentMonitor(handlerSettings.folderPath, documentKey),
                  subscription: null
                };
              }

              const monitor = this._documentMonitors[targetStoreKey];
              if (monitor.retain === 0) {
                monitor.subscription = monitor.monitor$.subscribe(document => {
                  this._storeService.dispatch(
                    new SynchronizedDocumentAction({
                      document,
                      documentKey,
                      rootStoreKey: targetStore,
                      localStoreKey: targetStoreKey
                    })
                  );
                });
              }

              monitor.retain++;
            }
          })
        ),

      // Document monitor release
      this.getContext()
        .actions$.ofType(DocumentMonitoringReleaseAction.TYPE)
        .pipe(
          tap(({ payload: { targetStore, targetStoreKey } }: DocumentMonitoringReleaseAction) => {
            if (targetStore !== this._targetStore) {
              return;
            }
            const monitor = this._documentMonitors[targetStoreKey];
            if (monitor) {
              monitor.retain--;
              if (monitor.retain < 0) {
                console.warn('[Document Monitoring] Release > Monitor counter should not be lower than 0!');
                monitor.retain = 0;
              }
              if (monitor.retain === 0) {
                if (!monitor.subscription) {
                  console.warn(
                    '[Document Monitoring] Release > No subscription available when releasing the monitor: ' +
                      targetStoreKey
                  );
                }
                [monitor.subscription].forEach((subscription: Subscription) => {
                  if (subscription.closed) {
                    console.warn(
                      '[Document Monitoring] Release > A subscription was already closed when releasing the monitor: ' +
                        targetStoreKey
                    );
                  }
                  subscription.unsubscribe();
                });
                monitor.subscription = null;
              }
            }
          })
        )
    );
  }

  collectionMonitoringSetup(monitorHandlers: CollectionMonitorHandler[]) {
    return merge(
      // Collection monitor retain
      this.getContext()
        .actions$.ofType(CollectionMonitoringRequestAction.TYPE)
        .pipe(
          tap(({ payload: { collectionKey, targetStore } }: CollectionMonitoringRequestAction) => {
            if (targetStore !== this._targetStore) {
              return;
            }
            const handlerSettings = monitorHandlers.find(handler => handler.collectionKey === collectionKey);
            if (handlerSettings) {
              const { storeKey, backendService } = handlerSettings;
              if (!this._monitors[collectionKey]) {
                this._monitors[collectionKey] = {
                  retain: 0,
                  added$: backendService.getCollectionMonitor(collectionKey, 'added'),
                  modified$: backendService.getCollectionMonitor(collectionKey, 'modified'),
                  removed$: backendService.getCollectionMonitor(collectionKey, 'removed'),
                  subscriptions: null
                };
              }

              const monitor = this._monitors[collectionKey];
              if (monitor.retain === 0) {
                const operations: ('added' | 'modified' | 'removed')[] = ['added', 'modified', 'removed'];
                monitor.subscriptions = operations.map(operation =>
                  monitor[`${operation}$`]
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
                    })
                );
              }

              monitor.retain++;
            } else {
              console.warn(
                '[Collection Monitoring] Setup > There was no handler found for requested key: ' + collectionKey
              );
            }
          })
        ),

      // Collection monitor release
      this.getContext()
        .actions$.ofType(CollectionMonitoringReleaseAction.TYPE)
        .pipe(
          tap(({ payload: { collectionKey, targetStore } }: CollectionMonitoringReleaseAction) => {
            if (targetStore !== this._targetStore) {
              return;
            }
            const monitor = this._monitors[collectionKey];
            if (monitor) {
              monitor.retain--;
              if (monitor.retain < 0) {
                console.warn('[Collection Monitoring] Release > Monitor counter should not be lower than 0!');
                monitor.retain = 0;
              }
              if (monitor.retain === 0) {
                if (monitor.subscriptions.length !== 3) {
                  console.warn(
                    '[Collection Monitoring] Release > No subscriptions were available when releasing the monitor: ' +
                      collectionKey
                  );
                }
                monitor.subscriptions.forEach((subscription: Subscription) => {
                  if (subscription.closed) {
                    console.warn(
                      '[Collection Monitoring] Release > A subscription was already closed when releasing the monitor: ' +
                        collectionKey
                    );
                  }
                  subscription.unsubscribe();
                });
                monitor.subscriptions.length = 0;
              }
            } else {
              console.warn(
                '[Collection Monitoring] Release > There was no monitor found for requested key: ' + collectionKey
              );
            }
          })
        )
    );
  }

  logoutRoutine() {
    super.logoutRoutine();
    return this.getContext()
      .actions$.ofType(LogoutSuccessAction.TYPE)
      .pipe(take(1), tap(() => this.releaseMonitors()));
  }

  private releaseMonitors() {
    this.releaseCollectionMonitors();
    this.releaseDocumentMonitors();
  }

  private releaseCollectionMonitors() {
    Object.keys(this._monitors).forEach(key => {
      const monitor = this._monitors[key];
      monitor && monitor.subscriptions && monitor.subscriptions.forEach(subscription => subscription.unsubscribe());
      this._monitors[key] = null;
    });
  }

  private releaseDocumentMonitors() {
    Object.keys(this._documentMonitors).forEach(key => {
      const monitor = this._monitors[key];
      monitor && monitor.subscription && monitor.subscription.unsubscribe();
      this._documentMonitors[key] = null;
    });
  }
}
