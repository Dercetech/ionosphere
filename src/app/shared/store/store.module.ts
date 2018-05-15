import { NgModule, ModuleWithProviders } from '@angular/core';

import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { ENV } from '@app/env';

import { NgrxService } from './services/ngrx.service';
import { authenticationKey, interfaceKey } from './store.keys';
import { AuthenticationStore } from './features/authentication/authentication.store';
import { InterfaceStore } from './features/interface/interface.store';

const reducers: ActionReducerMap<any> = {
  [authenticationKey]: AuthenticationStore.reducer,
  [interfaceKey]: InterfaceStore.reducer
};

const metaReducers = ENV.production ? {} : {};

const effects: any[] = [AuthenticationStore, InterfaceStore];

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, metaReducers),
    ENV.production ? [] : StoreDevtoolsModule.instrument({ maxAge: 15 }),
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
