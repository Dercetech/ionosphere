export interface StoreAntiCorruptionLayer {
  select: any;
  registerSelects(featureKey, properties: string[], customSelects?: any);
  getSelect$(absolutePathOrFeature: string, property?: string): any;
  dispatch(action: any);
}
