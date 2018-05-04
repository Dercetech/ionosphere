import { Component, ViewChild, OnInit } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map } from 'rxjs/operators';

import { Select, Store } from '@ngxs/store';
import { SetMenuCompact } from './shared/store/interface/interface.actions';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  // Not in use unless there are variants of the .ionosphere theme (found in theme/variables > import /ionosphere/
  theme: string = 'ionosphere';

  @ViewChild('nav') nav: NavController;

  //
  navClasses$: Observable<string[]>;

  // Header
  @Select('interface.headerDisplayed') headerDisplayed$: Observable<boolean>;

  // Menu
  @Select('interface.menuDisplayed') menuDisplayed$;
  @Select('interface.menuCompact') menuCompact$;

  // Routing
  rootPage: any = 'LoginPage';

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private _store: Store
  ) {
    // Perform native calls here
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

    // Navigation tweaks
    this.navClasses$ = combineLatest([this.headerDisplayed$]).pipe(
      map(([interfaceDisplayMenu]) => [
        interfaceDisplayMenu ? 'interface-display-menu' : ''
      ])
    );
  }

  ngOnInit(): void {
    // setTimeout( () => { this._store.dispatch(new InterfaceSetLanguage('fr')); } , 1500);
    // this._store.dispatch(new InterfaceSetLanguage('fr'));
  }

  onSplitChange(): void {
    this._store.dispatch(new SetMenuCompact(false));
  }
}
