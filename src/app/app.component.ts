import {Component, ViewChild} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  // Use @ViewChild as NavController is not available at this time
  // the <ion-nav> element is "kind of my nav controller" represented in a template.
  // View child will be selectEntry after my template has been rendered and a reference of type "NavController" will be stored in a "nav" variable.
  @ViewChild('nav') nav: NavController;

  // Not in use unless there are variants of the .ionosphere theme (found in theme/variables > import /ionosphere/
  theme: string = 'ionosphere';

  // Tell the split pane whether to enter compact mode or not
  isCompact: boolean = false;

  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  onCompact(isCompact: boolean): void {
    this.isCompact = isCompact;
  }

  onMSplitChange(): void {
    this.isCompact = false;
  }
}

