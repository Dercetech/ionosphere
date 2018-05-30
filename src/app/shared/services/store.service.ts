import { Injectable } from '@angular/core';

// ACL declaration
import { StoreAntiCorruptionLayer } from './interfaces/store';

// ACL implementation
import { NgrxService } from '../store/services/ngrx.service';
import { SynchronizedStoreService } from './interfaces/synchronized-store.service';
import {
  CollectionMonitoringRequestAction,
  CollectionMonitoringReleaseAction
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

  monitorCollection(collectionKey: string) {
    this.dispatch(new CollectionMonitoringRequestAction({ collectionKey }));
  }

  releaseMonitor(collectionKey) {
    this.dispatch(new CollectionMonitoringReleaseAction({ collectionKey }));
  }
}
