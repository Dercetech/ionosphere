import { TypedAction } from '../../classes/typed-action';

export class SetMenuCompactAction extends TypedAction {
  static readonly type = '[interface] set menu compact';
  constructor(public payload: boolean) {
    super();
  }
}

export class ToggleMenuCompactAction extends TypedAction {
  static readonly type = '[interface] toggle menu compact';
}
