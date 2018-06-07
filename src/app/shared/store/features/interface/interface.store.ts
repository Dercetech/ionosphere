import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import { StoreService } from '../../../services/store.service';
import { I18nService } from '../../../i18n/services/i18n-service';

import { interfaceKey } from '../../store.keys';
import { GenericStore } from '../../classes/generic-store';
import { AppInitializedAction } from '../app/app.actions';

import { handlers, InterfaceHandlerContext } from './interface.handlers';
import { selectsFactory } from './interface.selects';

import { menuContents } from '../../../../menu.contents';
import { SwitchLanguageAction } from './interface.actions';

export interface InterfaceState {
  //headerDisplayed: boolean;
  //menuDisplayed: boolean;
  menuCompact: boolean;
  menuContents: any;
  currentLanguage: string;
  languageLoading: boolean;
}

const initialState: InterfaceState = {
  //headerDisplayed: true, // see custom selector
  //menuDisplayed: true, // see custom selector
  menuCompact: false,
  menuContents,
  currentLanguage: 'fr',
  languageLoading: true
};

@Injectable()
export class InterfaceStore extends GenericStore<InterfaceHandlerContext> {
  constructor(actions$: Actions, store: Store<any>, storeService: StoreService, i18nService: I18nService) {
    super(
      { actions$, i18nService, storeService },
      {
        storeService,
        featureKey: interfaceKey,
        initialState,
        customSelects: selectsFactory(store)
      }
    );
  }

  static reducer(state = initialState, action: any): InterfaceState {
    return super.processState(handlers, state, action);
  }

  @Effect() appInitialized = this.processEffect(handlers, AppInitializedAction.TYPE);
  @Effect() switchLanguageRequested = this.processEffect(handlers, SwitchLanguageAction.TYPE);
}
