import { Action } from '@ngrx/store';

export class TypedAction implements Action {
  static TYPE = '[NO TYPE]';
  readonly type: string;

  constructor() {
    this.type = (<typeof TypedAction>this.constructor).TYPE;
  }
}
