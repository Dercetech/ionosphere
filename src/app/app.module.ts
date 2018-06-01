import { ErrorHandler, NgModule, enableProdMode, APP_INITIALIZER } from '@angular/core';
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
import { RoutingModule } from './routing/routing.module';
import { RoutingService } from './routing/routing.service';
import { AppExceptionHandler } from './app.error.handler';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

const initializeConfig = (routingService: RoutingService) => () => {
  console.log('APP STARTED with env ' + ENV.mode);
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
    LayoutModule.forRoot(),
    RoutingModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    SplashScreen,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeConfig,
      deps: [RoutingService],
      multi: true
    },
    //{ provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: ErrorHandler, useClass: AppExceptionHandler },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class AppModule {}
