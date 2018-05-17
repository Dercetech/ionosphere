import {
  ErrorHandler,
  NgModule,
  enableProdMode,
  APP_INITIALIZER
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { FirebaseModule } from './firebase.module';

import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule
} from 'ngx-perfect-scrollbar';

import { ENV } from '@app/env';
ENV.production && enableProdMode();

import { MyApp } from './app.component';

import { RootStoreModule } from './shared/store/store.module';
import { ServicesModule } from './shared/services/services.module';
import { I18nModule } from './shared/i18n/i18n.module';
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from './shared/layout/layout.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    IonicModule.forRoot(MyApp),
    PerfectScrollbarModule,

    RootStoreModule.forRoot(),
    FirebaseModule,

    SharedModule,
    ServicesModule.forRoot(),
    I18nModule.forRoot(),
    LayoutModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    {
      provide: APP_INITIALIZER,
      useFactory: () =>
        function() {
          console.log('APP STARTED with env ' + ENV.mode);
        },
      deps: [],
      multi: true
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class AppModule {}
