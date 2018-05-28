import { TypedAction } from './typed-action';
import { StoreService } from '../../services/store.service';
import { Observable } from 'rxjs';
import { ActionState } from '../interfaces/action-state';

export interface SelectRegistrationContext {
  storeService: StoreService;
  featureKey: string;
  initialState: any;
  customSelects?: {
    [key: string]: Observable<any>;
  };
}

export const fire = {
  request: () => ({ processing: true, error: null, data: null }),
  succeed: (state, data?) => ({ ...state, error: null, data, processing: false }),
  fail: (state, error, data?) => ({ ...state, error, data, processing: false })
};

export interface GenericContext {
  actions$: any;
}

export class GenericStore<T extends GenericContext> {
  //constructor(private _context: any) {}
  constructor(private _context: T, registration: SelectRegistrationContext) {
    GenericStore.registerSelects(registration);
  }

  static processState(handlers: any, state: any, action: TypedAction) {
    const actionHandler = handlers[action.type] && handlers[action.type].action;
    return actionHandler ? actionHandler(state, action) : state;
  }

  static registerSelects({ storeService, featureKey, initialState, customSelects }: SelectRegistrationContext) {
    storeService.registerSelects(featureKey, initialState, customSelects);
  }

  processEffect(handlers: any, actionType: string) {
    const effectHandler = handlers[actionType] && handlers[actionType].effect;
    if (!effectHandler) {
      throw new Error(actionType + ' > action has no registered effect handler');
    }
    return effectHandler(this._context.actions$.ofType(actionType), this._context);
  }
}
