import { Injectable } from '@angular/core';
import { StoreService } from './store.service';

@Injectable()
export class UsersService {
  constructor(private _store: StoreService, private _afAuth: AngularFire) {}
}
