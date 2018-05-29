import { TypedAction } from '../../classes/typed-action';

// App ready
export class AppInitializedAction extends TypedAction {
  static TYPE = '[App] Application initialized';
}
