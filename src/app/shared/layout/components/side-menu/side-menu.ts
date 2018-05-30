import { Component, HostBinding, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { StoreService } from '../../../services/store.service';

import { ToggleMenuCompactAction } from '../../../store/features/interface/interface.actions';
import { SetRootPageAction } from '../../../../routing/store/routing.actions';
import { LogoutRequestAction } from '../../../store/features/authentication/authentication.actions';

@Component({
  selector: 'side-menu',
  templateUrl: 'side-menu.html'
})
export class SideMenuComponent implements OnInit, OnDestroy {
  private sectionsStates: any = {};
  private expandedCategory: string = null;

  @HostBinding('class.compact') compactClassActive: boolean = false;

  contents$;
  compact$;

  private _destroy$ = new Subject<any>();

  constructor(private _store: StoreService) {
    this.contents$ = <Observable<any>>this._store.select.interface.menuContents$;
    this.compact$ = this._store.select.interface.menuCompact$;
  }

  ngOnInit() {
    this.compact$.pipe(takeUntil(this._destroy$)).subscribe(isCompact => (this.compactClassActive = isCompact));
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  toggleCompact(): void {
    this._store.dispatch(new ToggleMenuCompactAction());
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
    this.expandedCategory = this.expandedCategory === categoryId + sectionId ? null : categoryId + sectionId;
  }

  isCategoryExpanded(section: any, category: any): boolean {
    const sectionId = section.id;
    const categoryId = category.id;
    return this.expandedCategory === categoryId + sectionId;
  }

  onMenuElement({ action, destination }: any) {
    if (action) {
      switch (action) {
        case 'logout':
          return this._store.dispatch(new LogoutRequestAction());
      }
    }
    if (destination) {
      if (typeof destination === 'string') {
        this._store.dispatch(new SetRootPageAction({ route: destination }));
      }
    }
  }
}
