import { Injectable } from '@angular/core';

// ACL declaration
import { StoreAntiCorruptionLayer } from './interfaces/store';

// ACL implementation
import { NgrxService } from '../store/services/ngrx.service';
import { SynchronizedStoreService } from './interfaces/synchronized-store.service';
import {
  CollectionMonitoringRequestAction,
  CollectionMonitoringReleaseAction,
  DocumentMonitoringRequestAction,
  DocumentMonitoringReleaseAction
} from '../store/classes/sychronized-store.actions';

@Injectable()
export class StoreService implements StoreAntiCorruptionLayer, SynchronizedStoreService {
  private antiCorruptionLayer: StoreAntiCorruptionLayer = null;

  public select: any;

  constructor(ngrxACL: NgrxService) {
    // Plug a store implementation of the ACL
    this.antiCorruptionLayer = ngrxACL;

    // Expose abstracted store internals
    this.select = this.antiCorruptionLayer.select;
  }

  registerSelects(featureKey, initialState: any, customSelects?: any) {
    this.antiCorruptionLayer.registerSelects(featureKey, initialState, customSelects);
  }

  getSelect$(absolutePathOrFeature: string, property?: string) {
    return this.antiCorruptionLayer.getSelect$(absolutePathOrFeature);
  }

  dispatch(action: any) {
    this.antiCorruptionLayer.dispatch(action);
  }

  monitorDocument(documentKey) {
    this.dispatch(new DocumentMonitoringRequestAction({ documentKey }));
  }

  releaseDocument(documentKey) {
    this.dispatch(new DocumentMonitoringReleaseAction({ documentKey }));
  }

  dispatchCollectionMonitoringRequest(collectionKey: string, targetStore: string) {
    this.dispatch(new CollectionMonitoringRequestAction({ collectionKey, targetStore }));
  }

  dispatchCollectionMonitoringRelease(collectionKey: string, targetStore: string) {
    this.dispatch(new CollectionMonitoringReleaseAction({ collectionKey, targetStore }));
  }
}
