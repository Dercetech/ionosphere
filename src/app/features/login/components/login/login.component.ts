import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';

import { Observable } from 'rxjs/Observable';

import { Store } from '@ngrx/store';
import { Select } from 'ngrx-actions';

import * as fromStore from '../../../../shared/store/';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Select('authentication.authenticating')
  authenticating$: Observable<boolean>;

  @Select('authentication.authError')
  authError$: Observable<string>;

  credentialsForm: FormGroup;

  constructor(
    private _store: Store<any>,
    formBuilder: FormBuilder
  ) {

    this.credentialsForm = formBuilder.group({
      'username': [null, Validators.required],
      'password': [null, Validators.required]
    });
  }

  ngOnInit() {
  }

  onLogin() {
    const { username, password } = this.credentialsForm.value;
    this._store.dispatch(new fromStore.Login({ username, password }));
  }

}