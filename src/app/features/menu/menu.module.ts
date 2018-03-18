import {NgModule} from "@angular/core";
import {NgrxActionsModule} from "ngrx-actions";

import * as fromStore from './store';

@NgModule({
  imports:[
    NgrxActionsModule.forFeature('menu', { 'contents' : fromStore.MenuStore })
  ],
  providers:[
    fromStore.MenuStore
  ]
})
export class MenuModule{
  constructor(){
  }
}
