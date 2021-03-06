import { NgModule } from '@angular/core';
import { WelcomeComponent } from './containers/welcome.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [WelcomeComponent],
  imports: [SharedModule],
  exports: [WelcomeComponent]
})
export class LandingModule {}
