import { TypedAction } from '../../classes/typed-action';

// Login
export class LoginRequestAction extends TypedAction {
  static TYPE = '[Auth] Login requested';
  constructor(public payload: { username: string; password: string }) {
    super();
  }
}

export class LoginSuccessAction extends TypedAction {
  static TYPE = '[Auth] Login success';
  constructor(public payload?: { token: string }) {
    super();
  }
}

export class LoginFailureAction extends TypedAction {
  static TYPE = '[Auth] Login failure';
  constructor(public payload: Error) {
    super();
  }
}

// Authenticated user update
export class AuthenticatedUserUpdateAction extends TypedAction {
  static TYPE = '[Auth] Authenticated user updated';
  constructor(public payload: any) {
    super();
  }
}

// Password reset
export class PasswordResetRequestAction extends TypedAction {
  static TYPE = '[Auth] Password reset requested';
  constructor(public payload: { username: string }) {
    super();
  }
}

export class PasswordResetSuccessAction extends TypedAction {
  static TYPE = '[Auth] Password reset success';
}

export class PasswordResetFailureAction extends TypedAction {
  static TYPE = '[Auth] Password reset failure';
  constructor(public payload: Error) {
    super();
  }
}

// Logout
export class LogoutRequestAction extends TypedAction {
  static TYPE = '[Auth] Logout requested';
  constructor(public payload?: {}) {
    super();
  }
}

export class LogoutSuccessAction extends TypedAction {
  static TYPE = '[Auth] Logout success';
}

export class LogoutFailureAction extends TypedAction {
  static TYPE = '[Auth] Logout failure';
}
