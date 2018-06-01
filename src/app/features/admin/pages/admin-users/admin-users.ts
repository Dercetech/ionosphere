import { Component, Inject } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { StoreService } from '../../../../shared/services/store.service';
import { USERS_KEY, UsersService } from '../../../../shared/services/users.service';
import { UsersStore } from '../../../../shared/store/features/users/users.store';

@IonicPage()
@Component({
  selector: 'page-admin-users',
  templateUrl: 'admin-users.html'
})
export class AdminUsersPage {
  userList$;

  constructor(
    private _storeService: StoreService,
    private _usersStore: UsersStore,
    private _usersService: UsersService
  ) {
    this.userList$ = this._storeService.select.users.all.documents$;
  }

  ionViewDidLoad() {
    this._usersStore.monitorCollection(USERS_KEY.all);
    this._usersStore.monitorDocument('authenticated', 'VAn9OJ9G3JhPSBZWAxXvL9lwSOx2');
    this._usersService.toggleDocumentProperty('VAn9OJ9G3JhPSBZWAxXvL9lwSOx2', 'permissions.pooper');
    this._usersService.setDocumentPropertyValue('VAn9OJ9G3JhPSBZWAxXvL9lwSOx2', 'crap.poot.bull', 'shit');
    this._usersService.addDocument({ cunt: true, o: 'abc' }, 'AZAZEL');
  }

  ionViewWillUnload() {
    this._usersStore.releaseCollectionMonitor(USERS_KEY.all);
    this._usersStore.releaseDocumentMonitor('authenticated');
  }
}
