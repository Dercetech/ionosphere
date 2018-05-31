import { TypedAction } from './typed-action';

import { firestore } from 'firebase';

export class SynchronizedCollectionAction extends TypedAction {
  static TYPE = '[Database] Collection "__COLLECTION__" > documents __OPERATION__';
  readonly type: string;

  constructor(
    public payload: {
      documents: firestore.QueryDocumentSnapshot[];
      collectionKey: string;
      rootStoreKey: string;
      localStoreKey: string;
      operation: 'added' | 'modified' | 'removed';
    }
  ) {
    super();
    this.type = (<typeof TypedAction>this.constructor).TYPE.replace('__COLLECTION__', payload.collectionKey).replace(
      '__OPERATION__',
      payload.operation
    );
  }
}
