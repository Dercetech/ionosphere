import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { LoginPage } from './login';
import { SharedModule } from '../../../shared/shared.module';
import { LoginModule } from '../login.module';

@NgModule({
  declarations: [LoginPage],
  imports: [IonicPageModule.forChild(LoginPage), SharedModule, LoginModule]
})
export class LoginPageModule {}
