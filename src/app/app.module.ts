import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import {MetaReducer, StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import { StoreDevtoolsModule, StoreDevtools } from '@ngrx/store-devtools';
import {NgrxActionsModule} from "ngrx-actions";
import {storeFreeze} from "ngrx-store-freeze";

import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from "ngx-perfect-scrollbar";


import { MyApp } from './app.component';

import {LayoutModule} from './shared/layout/layout.module';
import {SharedModule} from "./shared/shared.module";

import * as fromStore from "./shared/store/";


// Not for production
const environment = {
  dev: true,
  prod: false
};

const metaReducers: MetaReducer<any>[] = !environment.prod ? [storeFreeze] : [];

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    PerfectScrollbarModule,

    StoreModule.forRoot({}, { metaReducers }),
    EffectsModule.forRoot([]),
    NgrxActionsModule.forRoot(fromStore.rootStores),
    !environment.prod ? StoreDevtoolsModule.instrument({ maxAge: 25 }) : [],

    SharedModule,
    LayoutModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ...fromStore.rootStoresToProvide,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class AppModule {}
