export class Login {
  static readonly type = '[Auth] Login';
  constructor(public payload: { username: string; password: string }) {}
}

export class LoginWithGoogle {
  static readonly type = '[Auth] Login with Google';
}

export class LoginSuccess {
  static readonly type = '[Auth] Login success';
  constructor(public payload: { username: string }) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}
