import { TypedAction } from '../../classes/typed-action';

export class SetRootPageAction extends TypedAction {
  static TYPE = '[routing] set root page';
  constructor(public payload: string) {
    super();
  }
}
