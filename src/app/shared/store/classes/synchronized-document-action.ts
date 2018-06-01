import { TypedAction } from './typed-action';

import { firestore } from 'firebase';

export class SynchronizedDocumentAction extends TypedAction {
  static TYPE = '[Database] Document /__STORE__/__KEY__ updated';
  readonly type: string;

  constructor(
    public payload: {
      document: any;
      documentKey: string;
      rootStoreKey: string;
      localStoreKey: string;
    }
  ) {
    super();
    this.type = (<typeof TypedAction>this.constructor).TYPE.replace('__STORE__', payload.rootStoreKey).replace(
      '__KEY__',
      payload.localStoreKey
    );
  }
}
