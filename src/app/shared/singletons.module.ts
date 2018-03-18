import {ModuleWithProviders, NgModule} from "@angular/core";
import {LayoutModule} from './layout/layout.module';

@NgModule({
  imports: [
    LayoutModule.forRoot()
  ],
  exports: []
})

export class FrameworkSingletonsModule {

  constructor(){}

  static forRoot():ModuleWithProviders {
    return {
      ngModule: FrameworkSingletonsModule,
      providers: [ ]
    }
  }
}
