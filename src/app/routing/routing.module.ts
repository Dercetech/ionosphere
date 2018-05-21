import { NgModule } from '@angular/core';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { RoutingService } from './routing.service';
import { IonicModule } from 'ionic-angular';

@NgModule({
  imports: [IonicModule]
})
export class RoutingModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RoutingModule,
      providers: [RoutingService]
    };
  }
}
