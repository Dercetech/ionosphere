import { NgModule } from '@angular/core';
import { LoginWidgetComponent } from './components/login-widget/login-widget';
import { IonicModule } from 'ionic-angular';

@NgModule({
  imports: [IonicModule],
  declarations: [LoginWidgetComponent],
  exports: [LoginWidgetComponent]
})
export class LoginModule {}
