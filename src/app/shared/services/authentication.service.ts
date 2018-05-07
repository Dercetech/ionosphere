import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { delay, tap } from 'rxjs/operators';

import { Store } from '@ngxs/store';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

import {
  LoginSuccess,
  Logout
} from '../store/authentication/authentication.actions';

@Injectable()
export class AuthenticationService {
  constructor(private _store: Store, private _afAuth: AngularFireAuth) {
    this._afAuth.authState
      .pipe(tap(user => console.log('user is ', user)))
      .subscribe(user =>
        this._store.dispatch(
          user ? new LoginSuccess({ username: user.displayName }) : new Logout()
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
    return of({ success: true }).pipe(delay(750));
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    // return this._afAuth.auth.signInWithPopup(provider).then(credential => {
    return this._afAuth.auth.signInWithRedirect(provider).then(credential => {
      console.log('a nigga got logged in');
    });
  }

  signOut() {
    this._afAuth.auth.signOut().then(() => this._store.dispatch(new Logout()));
  }
}
