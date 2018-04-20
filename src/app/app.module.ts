import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, enableProdMode } from '@angular/core';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MetaReducer, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NgrxActionsModule } from 'ngrx-actions';
import { storeFreeze } from 'ngrx-store-freeze';

import { AngularFireModule } from 'angularfire2';

import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule
} from 'ngx-perfect-scrollbar';

import { ENV } from '@app/env';
ENV.production && enableProdMode();

import { MyApp } from './app.component';

import { I18nModule } from './shared/i18n/i18n.module';
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from './shared/layout/layout.module';

import * as fromStore from './shared/store/';
import { ServicesModule } from './shared/services/services.module';

const metaReducers: MetaReducer<any>[] = !ENV.production ? [storeFreeze] : [];

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    PerfectScrollbarModule,

    // Redux & store
    StoreModule.forRoot({}, { metaReducers }),
    EffectsModule.forRoot([]),
    NgrxActionsModule.forRoot(fromStore.rootStores),
    !ENV.production ? StoreDevtoolsModule.instrument({ maxAge: 25 }) : [],

    // Firebase
    AngularFireModule.initializeApp(ENV.firebase),

    // Ionosphere
    ServicesModule.forRoot(),
    I18nModule.forRoot(),
    SharedModule,
    LayoutModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    SplashScreen,
    ...fromStore.rootStoresToProvide,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class AppModule {
  constructor() {
    console.log('APP STARTED with env ' + ENV.mode);
  }
}
