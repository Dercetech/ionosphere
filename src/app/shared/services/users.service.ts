import { Injectable } from '@angular/core';

import { Observer, Observable } from 'rxjs';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { StoreService } from './store.service';
import { BackendService } from './interfaces/backend.service';
import { take } from 'rxjs/operators';
import {
  CollectionMonitoringRequestAction,
  CollectionMonitoringReleaseAction
} from '../store/classes/sychronized-store.actions';
import { usersKey } from '../store/store.keys';

export interface UserCreationError {
  message: string;
  errors: {
    isWeak: boolean;
    emailExists: boolean;
  };
}

export const USERS_KEY = {
  all: 'users.all'
};

@Injectable()
export class UsersService implements BackendService {
  constructor(private _storeService: StoreService, private _afAuth: AngularFireAuth, private _afs: AngularFirestore) {}

  getPermissionsForUser() {
    this._afs
      .collection('users')
      .doc('U4bGn4H9elgBBzftsWsf')
      .valueChanges()
      .pipe(take(1))
      .subscribe(data => console.log('data'));
  }

  getCollectionMonitor<T>(collectionKey, operation) {
    switch (collectionKey) {
      case USERS_KEY.all:
        return this._afs.collection<any>('users').stateChanges([operation]);
    }

    return null;
  }

  getDocumentMonitor(documentKey: string) {
    return this._afs.doc(documentKey).valueChanges();
  }

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
          observer.error(this.getUserCreationErrors(err));
          observer.complete();
        });
    });
  }

  private getUserCreationErrors(err): UserCreationError {
    const isWeak = false;
    const emailExists = false;

    let message = '';
    let errors = { isWeak, emailExists };

    if (err && err.code) this.processUserCreationErrors(err, errors);
    if (err && err.errors) {
      err.errors.forEach(err => this.processUserCreationErrors(err, errors));
    }

    message = errors.isWeak ? message + 'Password is too weak. ' : message;
    message = errors.emailExists ? message + 'Email alread registered. ' : message;

    return { message, errors };
  }

  private processUserCreationErrors(err, errors) {
    if (err.message && err.message.indexOf('WEAK_PASSWORD') !== -1) {
      errors.isWeak = true;
    }
    if (err.code && err.code.indexOf('auth/weak-password') !== -1) {
      errors.isWeak = true;
    }
    if (err.message && err.message.indexOf('EMAIL_EXISTS') !== -1) {
      errors.emailExists = true;
    }
    if (err.code && err.code.indexOf('auth/email-already-in-use') !== -1) {
      errors.emailExists = true;
    }
  }
}
