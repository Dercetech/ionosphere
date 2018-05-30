import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { AdminUsersPage } from './admin-users';

@NgModule({
  declarations: [AdminUsersPage],
  imports: [IonicPageModule.forChild(AdminUsersPage)],
  exports: [AdminUsersPage]
})
export class AdminUsersPageModule {}
