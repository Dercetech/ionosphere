import { TypedAction } from './typed-action';

export class CollectionMonitoringRequestAction extends TypedAction {
  static TYPE = '[Database] Monitoring requested';
  constructor(public payload: { collectionKey: string }) {
    super();
  }
}

export class CollectionMonitoringReleaseAction extends TypedAction {
  static TYPE = '[Database] Monitoring released';
  constructor(public payload: { collectionKey: string }) {
    super();
  }
}
