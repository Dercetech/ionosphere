import { Injectable } from '@angular/core';

import { Observable, of, Observer } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AngularFireAuth } from 'angularfire2/auth';

import {
  LoginSuccessAction,
  LogoutRequestAction,
  LogoutSuccessAction
} from '../store/features/authentication/authentication.actions';

import { StoreService } from './store.service';

@Injectable()
export class AuthenticationService {
  constructor(private _store: StoreService, private _afAuth: AngularFireAuth) {
    this._afAuth.authState.subscribe(user =>
      this._store.dispatch(user ? new LoginSuccessAction() : new LogoutSuccessAction())
    );
    // .switchMap(user => {
    //   if (user) {
    //     return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
    //   } else {
    //     return Observable.of(null)
    //   }
    // })
  }

  authenticate(credentials: { username: string; password: string }): Observable<any> {
    const { auth } = this._afAuth;
    return new Observable<any>((observer: Observer<any>) => {
      auth
        .signInWithEmailAndPassword(credentials.username, credentials.password)
        .then(() => {
          observer.next('ok');
          observer.complete();
        })
        .catch(err => {
          observer.error(err);
          observer.complete();
        });
    });
  }

  signOut(): Observable<any> {
    const { auth } = this._afAuth;
    return new Observable<any>((observer: Observer<any>) => {
      auth
        .signOut()
        .then(() => {
          observer.next('ok');
          observer.complete();
        })
        .catch(err => {
          observer.error(err);
          observer.complete();
        });
    });
  }
}
