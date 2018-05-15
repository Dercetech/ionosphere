import { Component } from '@angular/core';

@Component({
  selector: 'welcome-component',
  templateUrl: 'welcome.html'
})
export class WelcomeComponent {
  text: string;

  constructor() {
    console.log('Hello CrapComponent Component');
    this.text = 'Hello World';
  }
}
