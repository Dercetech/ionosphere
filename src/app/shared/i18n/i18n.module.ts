import {ModuleWithProviders, NgModule} from '@angular/core';
import {HttpModule} from "@angular/http";

import {I18nPipesModule} from "./pipes/i18n.pipes.module";
import {TranslatePipe} from "./pipes/translate.pipe";

import {I18nService} from "./services/i18n-service";

@NgModule({
  declarations: [
  ],
  imports: [
    I18nPipesModule,
    HttpModule
  ],
  exports: [
    TranslatePipe,
  ]
})
export class I18nModule {

  static forRoot():ModuleWithProviders {
    return {
      ngModule: I18nModule,
      providers: [ I18nService ]
    };
  }

  constructor(){}
}
