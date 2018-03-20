import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import {MetaReducer, StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {NgrxActionsModule} from "ngrx-actions";
import {storeFreeze} from "ngrx-store-freeze";


import { MyApp } from './app.component';

import {LayoutModule} from './shared/layout/layout.module';
import {SharedModule} from "./shared/shared.module";
import {MenuModule} from "./features/menu/menu.module";

import {HomePage} from "./features/home/home";

import * as fromRootStore from "./shared/store/";
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from "ngx-perfect-scrollbar";


// Not for production
const environment = {
  dev: true,
  prod: false
};

const stores = [fromRootStore.RootStore];
const metaReducers: MetaReducer<any>[] = !environment.prod ? [storeFreeze] : [];

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    PerfectScrollbarModule,

    StoreModule.forRoot({}, { metaReducers }),
    EffectsModule.forRoot([]),
    NgrxActionsModule.forRoot({}),

    // FrameworkSingletonsModule.forRoot(),
    SharedModule,
    LayoutModule,

    MenuModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ...stores,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class AppModule {}
