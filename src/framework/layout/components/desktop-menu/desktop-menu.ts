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
            "title": "Dashboard",
            "fa": "fa fa-home"
          }
        ]
      },

      {
        id:"section1",
        type: "group",
        title: "Trading bots",
        categories: [
          {
            id: "entry0",
            title: "Overview",
            fa: "fa fa-line-chart"
          },
          {
            id: "entry1",
            title: "My bots",
            fa: "fa fa-users"
          },
          {
            id: "entry2",
            title: "Active processing",
            fa: "fa fa-cogs",
            sub: [
              {
                id: "sub1",
                title: "MyBot_1",
                fa: "fa fa-user-o"
              },
              {
                id: "entry1",
                title: "Columbus tracker",
                fa: "fa fa-user-o"
              },
              {
                id: "entry1",
                title: "Split opportunist",
                fa: "fa fa-user-o"
              }
            ]
          }
        ]
      },

      {
        id:"section2",
        type: "group",
        title: "My wallets",
        categories: [
          {
            id: "entry1",
            title: "Crypto",
            fa: "fa fa-connectdevelop",
            sub: [
              {
                id: "sub1",
                title: "Bitcoin",
                fa: "fa fa-btc"
              },
              {
                id: "sub2",
                title: "Ethereum",
                fa: "fa fa-diamond"
              },
              {
                id: "sub3",
                title: "Litecoin",
                fa: "fa fa-linode"
              }
            ]
          },

          {
            id: "entry2",
            title: "Fiat",
            fa: "fa fa-bank",
            sub: [
              {
                id: "sub1",
                title: "Euro",
                fa: "fa fa-euro"
              }
            ]
          }
        ]
      },
    ],

    "footer" : [
      {
        "id": "entry1",
        "title": "Free tier - upgrade",
        "fa": "fa fa-star-o"
      },
      {
        "id": "entry2",
        "title": "Settings",
        "fa": "fa fa-cog"
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
