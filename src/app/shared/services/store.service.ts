import { Injectable } from '@angular/core';

// ACL declaration
import { StoreAntiCorruptionLayer } from './interfaces/store';

// ACL implementation
import { NgrxService } from '../store/services/ngrx.service';

@Injectable()
export class StoreService implements StoreAntiCorruptionLayer {
  private antiCorruptionLayer: StoreAntiCorruptionLayer = null;

  public select: any;

  constructor(ngrxACL: NgrxService) {
    // Plug a store implementation of the ACL
    this.antiCorruptionLayer = ngrxACL;

    // Expose abstracted store internals
    this.select = this.antiCorruptionLayer.select;
  }

  registerSelects(featureKey, properties: string[], customSelects?: any) {
    this.antiCorruptionLayer.registerSelects(
      featureKey,
      properties,
      customSelects
    );
  }

  getSelect$(absolutePathOrFeature: string, property?: string) {
    return this.antiCorruptionLayer.getSelect$(absolutePathOrFeature);
  }

  dispatch(action: any) {
    this.antiCorruptionLayer.dispatch(action);
  }
}