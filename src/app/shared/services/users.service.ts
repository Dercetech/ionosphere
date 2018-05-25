import { Injectable } from '@angular/core';
import { StoreService } from './store.service';

import { AngularFireAuth } from 'angularfire2/auth';
import { Observer, Observable } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(private _afAuth: AngularFireAuth) {}

  createUserWithEmailAndPassword(userData: { displayName: string; username: string; password: string }) {
    const email = userData.username;
    const pwd = userData.password;
    const { auth } = this._afAuth;
    return new Observable<any>((observer: Observer<any>) => {
      auth
        .createUserWithEmailAndPassword(email, pwd)
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
