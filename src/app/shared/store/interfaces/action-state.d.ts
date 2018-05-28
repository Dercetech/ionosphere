export interface ActionState<T> {
  error: Error;
  processing: boolean;
  data: T;
}
