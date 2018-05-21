import { NgModule, ModuleWithProviders } from '@angular/core';

import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { ENV } from '@app/env';

import { NgrxService } from './services/ngrx.service';
import {
  authenticationKey,
  interfaceKey,
  appKey,
  routingKey
} from './store.keys';
import { AuthenticationStore } from './features/authentication/authentication.store';
import { InterfaceStore } from './features/interface/interface.store';
import { AppStore } from './features/app/appstore';
import { RouteStore } from './features/routing/routing.store';

const reducers: ActionReducerMap<any> = {
  // [authenticationKey]: AuthenticationStore.reducer,
  // [appKey]: AppStore.reducer,
  // [interfaceKey]: InterfaceStore.reducer
};

const metaReducers = ENV.production ? {} : {};

export const stores: any[] = [
  AuthenticationStore,
  AppStore,
  InterfaceStore,
  RouteStore
];

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, metaReducers),
    StoreModule.forFeature(authenticationKey, AuthenticationStore.reducer),
    StoreModule.forFeature(appKey, AppStore.reducer),
    StoreModule.forFeature(interfaceKey, InterfaceStore.reducer),
    StoreModule.forFeature(routingKey, RouteStore.reducer),
    ENV.production ? [] : StoreDevtoolsModule.instrument({ maxAge: 15 }),
    EffectsModule.forRoot([...stores])
  ],
  providers: [...stores]
})
export class RootStoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RootStoreModule,
      providers: [NgrxService]
    };
  }
}
