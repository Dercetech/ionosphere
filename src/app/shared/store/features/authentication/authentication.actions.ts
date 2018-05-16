import { TypedAction } from '../../classes/typed-action';

export class LoginRequestAction extends TypedAction {
  static TYPE = '[Auth] Login requested';
  constructor(public payload?: { username: string; password: string }) {
    super();
  }
}

export class LoginSuccessAction extends TypedAction {
  static TYPE = '[Auth] Login success';
  constructor(public payload?: { token: string }) {
    super();
  }
}

export class LogoutRequestAction extends TypedAction {
  static TYPE = '[Auth] Logout requested';
  constructor(public payload?: {}) {
    super();
  }
}

export class LogoutSuccessAction extends TypedAction {
  static TYPE = '[Auth] Logout success';
  constructor() {
    super();
  }
}

export type LoginActions =
  | LoginRequestAction
  | LoginSuccessAction
  | LogoutRequestAction
  | LogoutSuccessAction;
