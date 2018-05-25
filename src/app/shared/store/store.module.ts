import { NgModule, ModuleWithProviders } from '@angular/core';

import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { ENV } from '@app/env';

import { NgrxService } from './services/ngrx.service';
import { authenticationKey, interfaceKey, appKey, usersKey } from './store.keys';
import { AuthenticationStore } from './features/authentication/authentication.store';
import { InterfaceStore } from './features/interface/interface.store';
import { AppStore } from './features/app/appstore';
import { UsersService } from '../services/users.service';
import { UsersStore } from './features/users/users.store';

const stores: any[] = [AuthenticationStore, AppStore, InterfaceStore, UsersStore];
const reducers: ActionReducerMap<any> = {};
const metaReducers = ENV.production ? {} : {};

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, metaReducers),
    StoreModule.forFeature(appKey, AppStore.reducer),
    StoreModule.forFeature(authenticationKey, AuthenticationStore.reducer),
    StoreModule.forFeature(interfaceKey, InterfaceStore.reducer),
    StoreModule.forFeature(usersKey, UsersStore.reducer),
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
