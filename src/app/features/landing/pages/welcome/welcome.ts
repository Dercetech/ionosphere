import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Store } from '@ngrx/store';

import { InterfaceSetLanguage } from '../../../../shared/store/interface';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _store: Store<any>
  ) {}

  ionViewDidLoad() {}

  switchLang(langId: string) {
    this._store.dispatch(new InterfaceSetLanguage(langId));
  }
}
