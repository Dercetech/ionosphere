import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';

import {Select} from "ngrx-actions";


@Component({
  selector: 'side-menu',
  templateUrl: 'side-menu.html'
})

export class SideMenuComponent implements OnInit {

  private sectionsStates: any = {};
  private expandedCategory: string = null;

  @Input('set-compact')
  set _setCompact(value: boolean) {
    this.compactClassActive = value;
    this.small = value;
  }

  @Output() compact: EventEmitter<boolean> = new EventEmitter<boolean>();
  @HostBinding('class.compact') compactClassActive: boolean = false;
  small: boolean = false;


  @Select('menu.structure') structure$;

  constructor() {}

  ngOnInit() {
    this.structure$.subscribe(data => console.log('found' , data));
  }

  toggleSize(): void {
    this.compactClassActive = !this.compactClassActive;
    this.compact.emit(this.compactClassActive);
    this.small = !this.small;
  }

  toggleSectionExpanded(section: any): void {
    const sectionId = section.id;
    this.sectionsStates[sectionId] = this.sectionsStates[sectionId] ? false : true;
  }

  isSectionExpanded(section: any): boolean {
    const sectionId = section.id;
    return this.sectionsStates[sectionId] ? this.sectionsStates[sectionId] : false;
  }

  setExpandedCategory(section: any, category: any): void {
    const sectionId = section.id;
    const categoryId = category.id;
    this.expandedCategory = this.expandedCategory === (categoryId + sectionId) ? null : (categoryId + sectionId);
  }

  isCategoryExpanded(section: any, category: any): boolean {
    const sectionId = section.id;
    const categoryId = category.id;
    return this.expandedCategory === (categoryId + sectionId);
  }

}
