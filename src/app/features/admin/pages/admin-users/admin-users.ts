import { Component, Inject } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { StoreService } from '../../../../shared/services/store.service';
import { USERS_KEY } from '../../../../shared/services/users.service';

@IonicPage()
@Component({
  selector: 'page-admin-users',
  templateUrl: 'admin-users.html'
})
export class AdminUsersPage {
  userList$;

  constructor(private _storeService: StoreService) {
    this.userList$ = this._storeService.select.users.all.documents$;
  }

  ionViewDidLoad() {
    this._storeService.monitorCollection(USERS_KEY.all);
  }

  ionViewWillUnload() {
    this._storeService.releaseMonitor(USERS_KEY.all);
  }
}
