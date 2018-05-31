import { Injectable } from '@angular/core';

import { Observable, of, Observer, throwError, from } from 'rxjs';
import { delay, catchError, filter, tap, concatMap } from 'rxjs/operators';

import firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';

import {
  LoginSuccessAction,
  LogoutRequestAction,
  LogoutSuccessAction,
  AuthenticatedUserUpdateAction
} from '../store/features/authentication/authentication.actions';

import { StoreService } from './store.service';
import { map } from 'rxjs-compat/operator/map';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class AuthenticationService {
  constructor(private _store: StoreService, private _afs: AngularFirestore, private _afAuth: AngularFireAuth) {
    //this._afAuth.authState
    // .switchMap(user => this._afs.doc<FirebaseUser>(`users/${user.uid}`).valueChanges())
    // .pipe(filter(value => !!value), tap(value => console.log('value')))
    //.subscribe(user => this._store.dispatch(user ? new LoginSuccessAction() : new LogoutSuccessAction()));
    // .switchMap(user => {
    //   if (user) {
    //     return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
    //   } else {
    //     return Observable.of(null)
    //   }
    // })
  }

  monitorAuthentication() {
    return this._afAuth.authState.pipe(
      tap(fireUser => {
        this._afs
          .doc(`users/${fireUser.uid}`)
          .valueChanges()
          .pipe(
            catchError(err => {
              console.warn(err);
              return of(null);
            })
          )
          .subscribe(user => this._store.dispatch(new AuthenticatedUserUpdateAction({ ...user, id: fireUser.uid })));
      }),
      concatMap(user => [user ? new LoginSuccessAction() : new LogoutSuccessAction()])
    );
  }

  authenticate(credentials: { username: string; password: string }): Observable<any> {
    const { auth } = this._afAuth;
    // REM: One could use the "from" operator like seen in other methods, but in this case the implementation illustrates a custom observable snippet.
    const obs: Observable<any> = new Observable<any>((observer: Observer<any>) => {
      auth
        .signInWithEmailAndPassword(credentials.username, credentials.password)
        .then(() => {
          observer.next('ok');
          observer.complete();
        })
        .catch(err => {
          observer.error(err);
        });
    });

    return obs;
  }

  askForNewPassword(email: string): Observable<any> {
    const { auth } = this._afAuth;
    return from(auth.sendPasswordResetEmail(email));
  }

  signOut(): Observable<any> {
    const { auth } = this._afAuth;
    return from(auth.signOut());
  }
}
