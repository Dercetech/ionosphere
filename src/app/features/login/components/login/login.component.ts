import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  NgForm
} from '@angular/forms';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  authenticating$: Observable<boolean>;

  authError$: Observable<string>;

  credentialsForm: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.credentialsForm = formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  ngOnInit() {}

  onLogin() {
    const { username, password } = this.credentialsForm.value;
    //this._store.dispatch(new fromStore.Login({ username, password }));
  }
}
