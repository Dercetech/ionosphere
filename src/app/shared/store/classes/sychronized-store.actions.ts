import { TypedAction } from './typed-action';

export class CollectionMonitoringRequestAction extends TypedAction {
  static TYPE = '[Monitoring] Monitoring requested';
  constructor(public payload: { collectionKey: string }) {
    super();
  }
}

export class CollectionMonitoringReleaseAction extends TypedAction {
  static TYPE = '[Monitoring] Monitoring released';
  constructor(public payload: { collectionKey: string }) {
    super();
  }
}
