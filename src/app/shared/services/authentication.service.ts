import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { delay } from 'rxjs/operators';

@Injectable()
export class AuthenticationService {
  authenticate(credentials: {
    username: string;
    password: string;
  }): Observable<any> {
    const result =
      credentials.username !== 'bad'
        ? { success: true }
        : { success: false, error: 'bad user' };
    return of(result).pipe(delay(1500));
  }
}
