import { NgModule, ModuleWithProviders } from '@angular/core';

import { MetaReducer, StoreModule, ActionReducerMap } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { NgrxService } from './services/ngrx.service';
import { AuthenticationStore } from './features/authentication/authentication.store';
import { authenticationKey } from './store.keys';

const reducers: ActionReducerMap<any> = {
  [authenticationKey]: AuthenticationStore.reducer
};

const effects: any[] = [AuthenticationStore];

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, {
      /*metaReducers*/
    }),
    StoreDevtoolsModule.instrument({ maxAge: 15 }),
    EffectsModule.forRoot(effects)
  ]
})
export class RootStoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RootStoreModule,
      providers: [NgrxService]
    };
  }
}
