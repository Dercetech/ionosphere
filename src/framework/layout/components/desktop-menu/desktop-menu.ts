import { Component } from '@angular/core';

/**
 * Generated class for the DesktopMenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'desktop-menu',
  templateUrl: 'desktop-menu.html'
})
export class DesktopMenuComponent {

  text: string;

  constructor() {
    console.log('Hello DesktopMenuComponent Component');
    this.text = 'Hello World';
  }

}
