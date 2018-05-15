import { Component } from '@angular/core';

/**
 * Generated class for the CrapComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'crap',
  templateUrl: 'crap.html'
})
export class CrapComponent {

  text: string;

  constructor() {
    console.log('Hello CrapComponent Component');
    this.text = 'Hello World';
  }

}
