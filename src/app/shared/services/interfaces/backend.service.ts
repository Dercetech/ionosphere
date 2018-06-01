export interface BackendService {
  getCollectionMonitor(collectionKey: string, operation: 'added' | 'removed' | 'modified'): any;
  getDocumentMonitor(folderPath: string, documentKey: string): any;
}
