import { ModuleWithProviders, NgModule } from '@angular/core';

import * as fromServices from './';

@NgModule({})
export class ServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule,
      providers: [...fromServices.services]
    };
  }
}
