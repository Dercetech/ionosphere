import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from 'ionic-angular';

import { NgrxActionsModule } from 'ngrx-actions';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { I18nModule } from './i18n/i18n.module';

import { ScrollHideDirective } from './layout/directives/scroll-hide';
import { ScrollEffectDirective } from './layout/directives/scroll-effect';

@NgModule({
  declarations: [
    // Directives
    ScrollHideDirective,
    ScrollEffectDirective
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgrxActionsModule,
    PerfectScrollbarModule,
    I18nModule
  ],
  exports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgrxActionsModule,
    PerfectScrollbarModule,
    I18nModule,

    // Components

    // Directives
    ScrollHideDirective,
    ScrollEffectDirective
  ]
})
export class SharedModule {}
