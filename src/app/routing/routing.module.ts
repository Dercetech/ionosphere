import { NgModule } from '@angular/core';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { RoutingService } from './routing.service';
import { IonicModule } from 'ionic-angular';
import { StoreModule } from '@ngrx/store';
import { routingKey } from './store/routing.key';
import { RouteStore } from './store/routing.store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    IonicModule,
    StoreModule.forFeature(routingKey, RouteStore.reducer),
    EffectsModule.forFeature([RouteStore])
  ]
})
export class RoutingModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RoutingModule,
      providers: [RoutingService]
    };
  }
}
