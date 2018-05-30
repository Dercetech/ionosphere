export interface ListState<T> {
  documents: T[];
  entities: { [key: string]: T };
  loading: boolean;
}
