import { TypedAction } from '../../classes/typed-action';

export class UserCreationRequestAction extends TypedAction {
  static TYPE = '[Auth] Login requested';
  constructor(public payload: { displayName: string; username: string; password: string }) {
    super();
  }
}
