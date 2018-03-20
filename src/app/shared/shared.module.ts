import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {IonicModule} from "ionic-angular";

import { NgrxActionsModule } from "ngrx-actions";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgrxActionsModule,
    PerfectScrollbarModule
  ],
  exports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgrxActionsModule,
    PerfectScrollbarModule
  ]
})

export class SharedModule {}
