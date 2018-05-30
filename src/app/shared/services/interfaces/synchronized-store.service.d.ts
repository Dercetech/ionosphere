export interface SynchronizedStoreService {
  monitorCollection(collectionKey: string);
  releaseMonitor(collectionKey);
}
