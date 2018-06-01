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
import { BackendService } from './interfaces/backend.service';

@Injectable()
export class AuthenticationService {
  constructor(private _store: StoreService, private _afs: AngularFirestore, private _afAuth: AngularFireAuth) {}

  monitorAuthentication() {
    return this._afAuth.authState.pipe(
      concatMap(fireUser => [fireUser ? new LoginSuccessAction({ uid: fireUser.uid }) : new LogoutSuccessAction()])
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
