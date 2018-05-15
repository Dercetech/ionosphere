import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LoginRequestAction } from '../../shared/store/features/authentication/authentication.actions';

import { StoreService } from '../../shared/services/store.service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  private loginForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _storeService: StoreService,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['bad', [Validators.required]],
      password: ['bad', Validators.required]
    });
  }

  ionViewDidLoad() {}

  signIn() {
    this._storeService.dispatch(
      new LoginRequestAction({
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      })
    );
  }
}
