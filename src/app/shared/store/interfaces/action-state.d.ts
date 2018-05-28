export interface ActionState<T> {
  completed: boolean | Error;
  processing: boolean;
  token: T;
}
