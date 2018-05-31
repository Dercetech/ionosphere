export interface SynchronizedStoreService {
  monitorDocument(documentKey: string, targetStore: string);
  releaseDocument(documentKey: string, targetStore: string);
  dispatchCollectionMonitoringRequest(collectionKey: string, targetStore: string);
  dispatchCollectionMonitoringRelease(collectionKey: string, targetStore: string);
}
