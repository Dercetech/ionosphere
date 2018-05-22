import { Injectable } from '@angular/core';

import { take, filter, tap, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { StoreService } from '../shared/services/store.service';
import { NavController } from 'ionic-angular';

import { routes } from './routes';
import {
  SetRootPageAction,
  PushPageAction,
  PopPageAction
} from './store/routing.actions';

@Injectable()
export class RoutingService {
  // Obtained from the app.component where the nav is created
  private _nav: NavController;

  public routes: any = routes;

  constructor(private _storeService: StoreService) {}

  initRouting(nav: NavController) {
    this._nav = nav;

    // Set root as the app becomes ready. Either login page OR last visited (defaults to dashboard)
    this._storeService.select.app.ready$
      .pipe(filter((isReady: boolean) => isReady))
      .switchMap(() =>
        this._storeService.select.authentication.authenticated$.pipe(take(1))
      )
      .subscribe(isAuthenticated => {
        const route = isAuthenticated ? routes.welcome : routes.login;
        const params = {};
        this._storeService.dispatch(new SetRootPageAction({ route, params }));
      });
  }

  setRoot(route: string, params?: any) {
    this._nav.setRoot(route, params);
  }

  push(route: string, params?: any) {
    this._storeService.dispatch(new PushPageAction({ route, params }));
  }

  pop() {
    this._storeService.dispatch(new PopPageAction());
  }
}
