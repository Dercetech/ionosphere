import { TypedAction } from './typed-action';
import { StoreService } from '../../services/store.service';
import { Observable } from 'rxjs';

export interface SelectRegistrationContext {
  _storeService: StoreService;
  featureKey: string;
  propertyKeys: string[];
  customSelects?: {
    [key: string]: Observable<any>;
  };
}

export class GenericStore {
  //constructor(private _context: any) {}
  constructor(private _context: any, registration: SelectRegistrationContext) {
    GenericStore.registerSelects(registration);
  }

  static processState(handlers: any, state: any, action: TypedAction) {
    const actionHandler = handlers[action.type] && handlers[action.type].action;
    return actionHandler ? actionHandler(state, action) : state;
  }

  static registerSelects({
    _storeService,
    featureKey,
    propertyKeys,
    customSelects
  }: SelectRegistrationContext) {
    _storeService.registerSelects(featureKey, propertyKeys, customSelects);
  }

  processEffect(handlers: any, actionType: string) {
    const effectHandler = handlers[actionType] && handlers[actionType].effect;
    if (!effectHandler) {
      throw new Error(
        actionType + ' > action has no registered effect handler'
      );
    }
    return effectHandler(
      this._context.actions$.ofType(actionType),
      this._context
    );
  }
}
