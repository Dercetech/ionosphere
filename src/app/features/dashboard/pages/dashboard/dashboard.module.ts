import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardPage } from './dashboard';
import { DashboardModule } from '../../dashboard.module';

@NgModule({
  declarations: [DashboardPage],
  imports: [DashboardModule, IonicPageModule.forChild(DashboardPage)]
})
export class DashboardPageModule {}
