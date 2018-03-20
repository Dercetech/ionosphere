import {ModuleWithProviders, NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';

import {NgrxActionsModule} from "ngrx-actions";

import {SharedModule} from "../shared.module";

import {LayoutService} from './services/layout.service';
import { SideMenuComponent } from './components/side-menu/side-menu';
import {HeaderShadowAfterScroll} from "./directives/header-shadow-after-scroll.directive";

@NgModule({
	declarations: [
	  SideMenuComponent,
    HeaderShadowAfterScroll
  ],
	imports: [
	  IonicModule,
    SharedModule,
    NgrxActionsModule
  ],
	exports: [
	  SideMenuComponent,
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
