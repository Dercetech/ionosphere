import { Component, ViewChild, OnInit } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Store } from '@ngrx/store';

import { HomePage } from './features/home/home';
import { MyAction } from './shared/store/menu';

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

  // Tell the split pane whether to enter compact mode or not
  isCompact: boolean = false;

  rootPage: any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private _store: Store<any>
  ) {

    // Boilerplate
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ngOnInit(): void {
    this._store.dispatch(new MyAction())
  }

  onCompact(isCompact: boolean): void {
    this.isCompact = isCompact;
  }

  onSplitChange(): void {
    this.isCompact = false;
  }
}

