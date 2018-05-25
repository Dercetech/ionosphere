import { TypedAction } from '../../classes/typed-action';

export class UserCreationRequestAction extends TypedAction {
  static TYPE = '[Users] User creation request with username & pwd';
  constructor(public payload: { displayName: string; username: string; password: string }) {
    super();
  }
}

export class UserCreationSuccessAction extends TypedAction {
  static TYPE = '[Users] User creation success';
}

export class UserCreationErrorAction extends TypedAction {
  static TYPE = '[Users] User creation error';
  constructor(public payload: { error: any }) {
    super();
  }
}
