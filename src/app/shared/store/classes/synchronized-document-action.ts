import { TypedAction } from './typed-action';

import { firestore } from 'firebase';

export class SynchronizedDocumentAction extends TypedAction {
  static TYPE = '[Database] Document "__KEY__" updated';
  readonly type: string;

  constructor(
    public payload: {
      document: any;
      storeKey: string;
    }
  ) {
    super();
    this.type = (<typeof TypedAction>this.constructor).TYPE.replace('__KEY__', payload.storeKey);
  }
}
