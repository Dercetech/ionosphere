import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { ModalsService } from '../../../../shared/services/modals.service';
import { UsersService } from '../../../../shared/services/users.service';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {
  constructor(private _modalsService: ModalsService, private _usersService: UsersService) {}

  ionViewDidLoad() {}

  onEdit() {
    this._modalsService.editDocument('VAn9OJ9G3JhPSBZWAxXvL9lwSOx2', this._usersService);
  }
}
