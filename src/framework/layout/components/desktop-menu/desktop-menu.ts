import { Component } from '@angular/core';

@Component({
  selector: 'desktop-menu',
  templateUrl: 'desktop-menu.html'
})

export class DesktopMenuComponent {

  private _expanded: string = null;

  constructor() {}

  expandSection(sectionName: string): void {
    this._expanded = sectionName;
  }

  isSectionExpanded(sectionName: string): boolean {
    return this._expanded === sectionName;
  }

}
