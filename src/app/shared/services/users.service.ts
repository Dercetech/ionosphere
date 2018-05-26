import { Injectable } from '@angular/core';
import { StoreService } from './store.service';

import { AngularFireAuth } from 'angularfire2/auth';
import { Observer, Observable } from 'rxjs';

export interface UserCreationError {
  message: string;
  errors: {
    isWeak: boolean;
    emailExists: boolean;
  };
}

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
