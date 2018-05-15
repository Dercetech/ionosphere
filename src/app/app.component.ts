import { Component, ViewChild, OnInit } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Observable } from 'rxjs';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map } from 'rxjs/operators';

import { SetMenuCompactAction } from './shared/store/features/interface/interface.actions';
import { StoreService } from './shared/services/store.service';

@Component({
  templateUrl: 'app.component.html'
})
export class MyApp implements OnInit {
  // Not in use unless there are variants of the .ionosphere theme (found in theme/variables > import /ionosphere/
  theme: string = 'ionosphere';

  @ViewChild('nav') nav: NavController;

  // Classes to apply to the main view (i.e. toggle the header)
  navClasses$: Observable<string[]>;

  headerDisplayed$: Observable<boolean>;
  menuDisplayed$: Observable<boolean>;
  menuCompact$: Observable<boolean>;

  rootPage: any = 'WelcomePage';

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private _storeService: StoreService
  ) {
    // Perform native calls here
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.headerDisplayed$ = this._storeService.select.interface.headerDisplayed$;
    this.menuDisplayed$ = this._storeService.select.interface.menuDisplayed$;
    this.menuCompact$ = this._storeService.select.interface.menuCompact$;

    // Navigation tweaks
    /*
    this.navClasses$ = combineLatest([this.headerDisplayed$]).pipe(
      map(([interfaceDisplayMenu]) => [
        interfaceDisplayMenu ? 'interface-display-menu' : ''
      ])
    );
    */
  }

  ngOnInit(): void {
    // setTimeout( () => { this._store.dispatch(new InterfaceSetLanguage('fr')); } , 1500);
    // this._store.dispatch(new InterfaceSetLanguage('fr'));
  }

  onSplitChange(): void {
    this._storeService.dispatch(new SetMenuCompactAction(false));
  }
}
