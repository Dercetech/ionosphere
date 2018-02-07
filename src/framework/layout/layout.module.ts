import {ModuleWithProviders, NgModule} from '@angular/core';

import {LayoutService} from './services/layout.service';
import {DesktopMenuComponent} from './components/desktop-menu/desktop-menu';


@NgModule({
	declarations: [
	  DesktopMenuComponent
  ],
	imports: [],
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
