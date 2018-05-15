import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AngularFireAuth } from 'angularfire2/auth';

import {
  LoginSuccessAction,
  LogoutRequestAction
} from '../store/features/authentication/authentication.actions';

import { StoreService } from './store.service';

@Injectable()
export class AuthenticationService {
  constructor(private _store: StoreService, private _afAuth: AngularFireAuth) {
    this._afAuth.authState.subscribe(user =>
      this._store.dispatch(
        user ? new LoginSuccessAction() : new LogoutRequestAction()
      )
    );
    // .switchMap(user => {
    //   if (user) {
    //     return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
    //   } else {
    //     return Observable.of(null)
    //   }
    // })
  }

  authenticate(credentials: {
    username: string;
    password: string;
  }): Observable<any> {
    const result =
      credentials.username !== 'bad'
        ? { success: true }
        : { success: false, error: 'bad user' };
    return of(result).pipe(delay(750));
  }

  signOut() {
    this._afAuth.auth
      .signOut()
      .then(() => this._store.dispatch(new LogoutRequestAction()));
  }
}
