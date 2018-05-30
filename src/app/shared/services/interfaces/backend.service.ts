export interface BackendService {
  getCollectionAddMonitor(collectionKey: string, operation: 'added' | 'removed' | 'modified'): any;
}
