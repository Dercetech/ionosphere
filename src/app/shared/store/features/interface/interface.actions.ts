import { TypedAction } from '../../classes/typed-action';

export class SwitchLanguageAction extends TypedAction {
  static TYPE = '[interface] switch language request';
  constructor(public payload: { targetLanguage: string }) {
    super();
  }
}

export class SwitchLanguageSuccessAction extends TypedAction {
  static TYPE = '[interface] successfully switched to language';
}

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
