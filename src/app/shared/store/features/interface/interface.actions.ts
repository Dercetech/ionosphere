import { TypedAction } from '../../classes/typed-action';

export class SetMenuCompactAction extends TypedAction {
  static TYPE = '[interface] set menu compact';
  constructor(public payload: boolean) {
    super();
  }
}

export class ToggleMenuCompactAction extends TypedAction {
  static TYPE = '[interface] toggle menu compact';
  constructor() {
    super();
  }
}
