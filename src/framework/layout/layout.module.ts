import {ModuleWithProviders, NgModule} from '@angular/core';
import {FlexLayoutModule} from "@angular/flex-layout";
import {IonicModule} from 'ionic-angular';

import {LayoutService} from './services/layout.service';
import {DesktopMenuComponent} from './components/desktop-menu/desktop-menu';
import {HeaderShadowAfterScroll} from "./directives/header-shadow-after-scroll.directive";


@NgModule({
	declarations: [
	  DesktopMenuComponent,
    HeaderShadowAfterScroll
  ],
	imports: [
	  IonicModule,
    FlexLayoutModule
  ],
	exports: [
	  DesktopMenuComponent,
    HeaderShadowAfterScroll
  ]
})
export class LayoutModule {

  static forRoot():ModuleWithProviders {
    return {
      ngModule: LayoutModule,
      providers: [
        LayoutService
      ]
    }
  }
}
