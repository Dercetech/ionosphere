import { Component, EventEmitter, HostBinding, Input, OnInit, Output, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Select } from "ngrx-actions";

import { Subject } from 'rxjs/Subject';
import {filter, takeUntil} from 'rxjs/operators';

import { MenuToggleCompact } from '../../../store/menu';


@Component({
  selector: 'side-menu',
  templateUrl: 'side-menu.html'
})

export class SideMenuComponent implements OnInit, OnDestroy {

  private sectionsStates: any = {};
  private expandedCategory: string = null;

  // @Input('compact')
  // set _setCompact(value: boolean) {
  //   this.compactClassActive = value;
  //   this.small = value;
  // }

  // @Output() compact: EventEmitter<boolean> = new EventEmitter<boolean>();
  @HostBinding('class.compact') compactClassActive: boolean = false;
  // small: boolean = false;


  @Select('menu.structure') structure$;
  @Select('menu.compact') compact$;

  private _destroy$ = new Subject<null>();

  constructor(private _store: Store<any>) { }

  ngOnInit() {
    this.compact$.pipe(takeUntil(this._destroy$)).subscribe(isCompact => this.compactClassActive = isCompact);
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  toggleCompact(): void {
    this._store.dispatch(new MenuToggleCompact())
    // this.compact.emit(this.compactClassActive);
    // this.small = !this.small;
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
