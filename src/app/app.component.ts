import {
  Component,
  ViewChild,
  OnInit,
  HostBinding,
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';

import { NavController, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Observable, combineLatest, of } from 'rxjs';
import { map, tap, filter, take } from 'rxjs/operators';

import { SetMenuCompactAction } from './shared/store/features/interface/interface.actions';
import { StoreService } from './shared/services/store.service';
import { RoutingService } from './routing/routing.service';

const stateEnteringDom = { opacity: 0 };
const stateInDOM = { opacity: 1 };
const stateLeavingDom = { opacity: 0 };

@Component({
  templateUrl: 'app.component.html',
  animations: [
    trigger('visibilityTrigger', [
      state('in', style(stateInDOM)),
      transition('void => *', [style(stateEnteringDom), animate(1000)]),
      transition('* => void', [animate(1, style(stateLeavingDom))])
    ])
  ]
})
export class MyApp implements OnInit {
  theme: string = 'ionosphere';

  @HostBinding('@visibilityTrigger') visibilityTrigger = null;

  @ViewChild('nav') nav: NavController;

  appReady$: Observable<boolean>;
  menuDisplayed$: Observable<boolean>;
  menuCompact$: Observable<boolean>;

  // Classes to apply to the main view (i.e. toggle the header)
  navClasses$: Observable<string[]> = of(['interface-display-menu']);

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private _routingService: RoutingService,
    private _storeService: StoreService
  ) {
    // Perform native calls here
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.appReady$ = this._storeService.select.app.ready$;
    this.menuDisplayed$ = this._storeService.select.interface.menuDisplayed$;
    this.menuCompact$ = this._storeService.select.interface.menuCompact$;

    // Navigation tweaks
    this.navClasses$ = combineLatest(
      this._storeService.select.interface.headerDisplayed$
    ).pipe(
      map(([headerDisplayed]) => [
        headerDisplayed ? 'interface-display-menu' : ''
      ])
    );
  }

  ngOnInit(): void {
    // setTimeout( () => { this._store.dispatch(new InterfaceSetLanguage('fr')); } , 1500);
    // this._store.dispatch(new InterfaceSetLanguage('fr'));

    // At this stage, it is guaranteed to have root store entries ready (i.e. including select.app slice)
    this._routingService.initRouting(this.nav);
  }

  onSplitChange(): void {
    this._storeService.dispatch(new SetMenuCompactAction(false));
  }
}
