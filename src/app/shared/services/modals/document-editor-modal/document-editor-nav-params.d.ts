import { Observable } from 'rxjs';

export interface DocumentEditorNavParams {
  data$: Observable<any>;
  live: boolean;
  updateFn?: Function;
}
