import { TypedAction } from '../../shared/store/classes/typed-action';

export class SetRootPageAction extends TypedAction {
  static TYPE = '[routing] set root page';
  constructor(public payload: { route: string; params?: any }) {
    super();
  }
}

export class PushPageAction extends TypedAction {
  static TYPE = '[routing] navigation push';
  constructor(public payload: { route: string; params?: any }) {
    super();
  }
}

export class PopPageAction extends TypedAction {
  static TYPE = '[routing] navigation pop';
}
