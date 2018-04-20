import { Component, ViewChild, OnInit } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Store } from '@ngrx/store';
import { Select } from 'ngrx-actions';

import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map } from 'rxjs/operators';

import { MenuSetCompact } from './shared/store/menu';
import { InterfaceSetLanguage } from './shared/store/interface';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  // Use @ViewChild as NavController is not available at this time
  // the <ion-nav> element is "kind of my nav controller" represented in a template.
  // View child will be selectEntry after my template has been rendered and a reference of type "NavController" will be stored in a "nav" variable.
  @ViewChild('nav') nav: NavController;

  // Not in use unless there are variants of the .ionosphere theme (found in theme/variables > import /ionosphere/
  theme: string = 'ionosphere';

  // Interface tweaks
  @Select('interface.displayMenu') interfaceDisplayMenu$;
  navClasses$: Observable<string[]>;

  // Menu
  @Select('menu.displayed') menuDisplayed$;
  @Select('menu.compact') menuCompact$;

  // Routing
  rootPage: any = 'LoginPage';

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private _store: Store<any>
  ) {
    // Perform native calls here
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

    // Navigation tweaks
    this.navClasses$ = combineLatest([this.interfaceDisplayMenu$]).pipe(
      map(([interfaceDisplayMenu]) => [
        interfaceDisplayMenu ? 'interface-display-menu' : ''
      ])
    );
  }

  ngOnInit(): void {
    //setTimeout( () => { this._store.dispatch(new InterfaceSetLanguage('fr')); } , 1500);
    this._store.dispatch(new InterfaceSetLanguage('fr'));
  }

  onSplitChange(): void {
    this._store.dispatch(new MenuSetCompact(false));
  }
}
