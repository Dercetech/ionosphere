import { Component, HostBinding, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { Select, Store } from '@ngxs/store';

import { ToggleMenuCompact } from '../../../store/interface/interface.actions';

@Component({
  selector: 'side-menu',
  templateUrl: 'side-menu.html'
})
export class SideMenuComponent implements OnInit, OnDestroy {
  private sectionsStates: any = {};
  private expandedCategory: string = null;

  @HostBinding('class.compact') compactClassActive: boolean = false;

  @Select('interface.menuContents') contents$;
  @Select('interface.menuCompact') compact$;

  private _destroy$ = new Subject<null>();

  constructor(private _store: Store) {}

  ngOnInit() {
    this.compact$
      .pipe(takeUntil(this._destroy$))
      .subscribe(isCompact => (this.compactClassActive = isCompact));
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  toggleCompact(): void {
    this._store.dispatch(new ToggleMenuCompact());
    // this.compact.emit(this.compactClassActive);
    // this.small = !this.small;
  }

  toggleSectionExpanded(section: any): void {
    const sectionId = section.id;
    this.sectionsStates[sectionId] = this.sectionsStates[sectionId]
      ? false
      : true;
  }

  isSectionExpanded(section: any): boolean {
    const sectionId = section.id;
    return this.sectionsStates[sectionId]
      ? this.sectionsStates[sectionId]
      : false;
  }

  setExpandedCategory(section: any, category: any): void {
    const sectionId = section.id;
    const categoryId = category.id;
    this.expandedCategory =
      this.expandedCategory === categoryId + sectionId
        ? null
        : categoryId + sectionId;
  }

  isCategoryExpanded(section: any, category: any): boolean {
    const sectionId = section.id;
    const categoryId = category.id;
    return this.expandedCategory === categoryId + sectionId;
  }
}
