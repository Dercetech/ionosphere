import { TypedAction } from './typed-action';

export class GenericStore {

  constructor(private _context: any) {}

  static processState(handlers: any, state: any, action: TypedAction) {
    const actionHandler = handlers[action.type] && handlers[action.type].action;
    return actionHandler ? actionHandler(state, action) : state;
  }

  processEffect(handlers: any, actionType: string) {
    const effectHandler = handlers[actionType] && handlers[actionType].effect
    if (effectHandler) {
      return effectHandler(this._context.actions$.ofType(actionType), this._context);
    }
    else {
      throw (actionType + ' > action has no registered effect handler');
    }
  }
}