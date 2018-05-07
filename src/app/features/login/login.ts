import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Store } from '@ngxs/store';
import {
  LoginWithGoogle,
  Login
} from '../../shared/store/authentication/authentication.actions';

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
    private _store: Store,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['bad', [Validators.required]],
      password: ['bad', Validators.required]
    });
  }

  ionViewDidLoad() {}

  signIn() {
    this._store.dispatch(
      new Login({
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      })
    );
  }

  signIn_google() {
    this._store.dispatch(new LoginWithGoogle());
  }
}
