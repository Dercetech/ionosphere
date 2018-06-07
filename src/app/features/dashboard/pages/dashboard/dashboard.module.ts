import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardPage } from './dashboard';
import { DashboardModule } from '../../dashboard.module';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [DashboardPage],
  imports: [SharedModule, DashboardModule, IonicPageModule.forChild(DashboardPage)]
})
export class DashboardPageModule {}
