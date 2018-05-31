import { TypedAction } from './typed-action';

export class DocumentMonitoringRequestAction extends TypedAction {
  static TYPE = '[Database] Document monitoring requested';
  constructor(public payload: { documentKey: string }) {
    super();
  }
}

export class DocumentMonitoringReleaseAction extends TypedAction {
  static TYPE = '[Database] Document monitoring released';
  constructor(public payload: { documentKey: string }) {
    super();
  }
}

export class CollectionMonitoringRequestAction extends TypedAction {
  static TYPE = '[Database] Collection monitoring requested';
  constructor(public payload: { collectionKey: string; targetStore: string }) {
    super();
  }
}

export class CollectionMonitoringReleaseAction extends TypedAction {
  static TYPE = '[Database] Collection monitoring released';
  constructor(public payload: { collectionKey: string; targetStore: string }) {
    super();
  }
}
