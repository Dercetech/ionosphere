import {ModuleWithProviders, NgModule} from '@angular/core';
import {FlexLayoutModule} from "@angular/flex-layout";
import {IonicModule} from 'ionic-angular';

import {LayoutService} from './services/layout.service';
import {DesktopMenuComponent} from './components/desktop-menu/desktop-menu';


@NgModule({
	declarations: [
	  DesktopMenuComponent
  ],
	imports: [
	  IonicModule,
    FlexLayoutModule
  ],
	exports: [
	  DesktopMenuComponent
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
