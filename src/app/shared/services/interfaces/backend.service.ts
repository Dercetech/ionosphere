export interface BackendService {
  getCollectionMonitor(collectionKey: string, operation: 'added' | 'removed' | 'modified'): any;
  getDocumentMonitor(documentKey: string): any;
}
