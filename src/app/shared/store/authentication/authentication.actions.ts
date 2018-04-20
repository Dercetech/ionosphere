export class Login {
  readonly type = '[Authentication] Login request';
  constructor(public payload: {
    username: string;
    password: string;
  }) { }
}

export class LoginSuccess {
  readonly type = '[Authentication] Login success';
  constructor(public payload?: any) { }
}

export class LoginFailed {
  readonly type = '[Authentication] Login failed';
  constructor(public payload?: any) { }
}

export class Logout {
  readonly type = '[Authentication] Logout request';
  constructor() { }
}

export class LogoutSuccess {
  readonly type = '[Authentication] Logout success';
  constructor() { }
}