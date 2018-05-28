import { Injectable } from '@angular/core';

import { Store, createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { StoreAntiCorruptionLayer } from '../../services/interfaces/store';

@Injectable()
export class NgrxService implements StoreAntiCorruptionLayer {
  // stores an ABSOLUTE path (slice.property) and returns a property (memoized) selector
  private static _memoizedCache: any = {};

  // stores an ABSOLUTE path and returns a select$ (Observable)
  private _selectCache: any = {};

  // Pre-defined map of select$ (Observables as consumed by the containers)
  select;

  constructor(private _store: Store<any>) {
    this.select = {};
  }

  registerSelects(featureKey, initialState: any, customSelects?: any) {
    if (!this.select[featureKey]) {
      this.select[featureKey] = {};
    }
    const featureSelects = this.select[featureKey];

    // 1. Register generic properties
    const properties = Object.keys(initialState);
    properties.forEach(propertyKey => {
      if (initialState[propertyKey] && initialState[propertyKey] === 'object') {
        featureSelects[propertyKey] = featureSelects[propertyKey] ? featureSelects[propertyKey] : {};
        const complexProperty = initialState[propertyKey];
        Object.keys(complexProperty).forEach(
          complexKey =>
            (featureSelects[propertyKey][complexKey + '$'] = this.getSelect$(
              featureKey,
              propertyKey + '.' + complexKey
            ))
        );
      }

      featureSelects[propertyKey + '$'] = this.getSelect$(featureKey, propertyKey);
    });

    // 2. Register custom selects
    if (customSelects) {
      Object.keys(customSelects).forEach(propertyKey => (featureSelects[propertyKey] = customSelects[propertyKey]));
    }
  }

  // Returns a cached selector - prevents multiple instance for a single store path
  static getSelector(absolutePathOrFeature: string, property?: string) {
    const absolutePath = property ? absolutePathOrFeature + '.' + property : absolutePathOrFeature;

    const segments = absolutePath.split('.');

    if (segments.length > 3) {
      throw '[Services > Store > NGRX] Unable yet to process more than a feature store with up to two segments';
    }

    // Obtain property - from cache if possible
    if (!NgrxService._memoizedCache[absolutePath]) {
      // Obtain feature - cache if possible
      const featureName = segments[0];
      if (!NgrxService._memoizedCache[featureName]) {
        NgrxService._memoizedCache[featureName] = createFeatureSelector(featureName);
      }
      let featureSelector = NgrxService._memoizedCache[featureName];

      // Create & cache memoized selector for full path
      const propertyName = segments[1];
      const subPropertyName = segments[2];
      const propertySelector = createSelector(featureSelector, state => state[propertyName]);
      NgrxService._memoizedCache[absolutePath] = propertySelector;
    }

    return NgrxService._memoizedCache[absolutePath];
  }

  static cacheSelector(absolutePath: string, memoizedSelector: MemoizedSelector<any, any>) {
    NgrxService._memoizedCache[absolutePath] = memoizedSelector;
  }

  getSelect$(absolutePathOrFeature: string, property?: string) {
    const absolutePath = property ? absolutePathOrFeature + '.' + property : absolutePathOrFeature;
    if (!this._selectCache[absolutePath]) {
      this._selectCache[absolutePath] = this._store.select(NgrxService.getSelector(absolutePath));
    }
    return this._selectCache[absolutePath];
  }

  dispatch(action: any) {
    this._store.dispatch(action);
  }
}
