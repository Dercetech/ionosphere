import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';

@Component({
  selector: 'desktop-menu',
  templateUrl: 'desktop-menu.html'
})

export class DesktopMenuComponent {

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

  structure: any = {

    "scroll" : [

      {
        id:"header",
        type: "flat-group",
        categories: [
          {
            "id": "entry1",
            "title": "Overview crap",
            "fa": "fa fa-home"
          },
          {
            "id": "entry2",
            "title": "Whut else",
            "fa": "fa fa-home"
          }
        ]
      },

      {
        id:"section1",
        type: "group",
        title: "A menu section",
        categories: [
          {
            id: "entry1",
            title: "I haz sub elements",
            fa: "fa fa-medkit",
            sub: [
              {
                id: "sub1",
                title: "Entry 1",
                fa: "fa fa-medkit"
              },
              {
                id: "entry1",
                title: "Entry 1",
                fa: "fa fa-medkit"
              }
            ]
          },
          {
            id: "entry2",
            title: "Entry 2",
            fa: "fa fa-medkit"
          },
          {
            id: "entry3",
            title: "Entry 3",
            fa: "fa fa-medkit"
          }
        ]
      },

      {
        id:"section2",
        type: "group",
        title: "Another menu section",
        categories: [
          {
            id: "entry1",
            title: "Entry 1",
            fa: "fa fa-medkit"
          },
          {
            id: "entry2",
            title: "Entry 2",
            fa: "fa fa-medkit"
          },
          {
            id: "entry3",
            title: "Entry 3",
            fa: "fa fa-medkit"
          }
        ]
      },
    ],

    "footer" : [
      {
        "id": "entry1",
        "title": "Footer 1",
        "fa": "fa fa-home"
      },
      {
        "id": "entry2",
        "title": "Whut else",
        "fa": "fa fa-home"
      }
    ],

    "drawer" : true

  };

  constructor() {}

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
