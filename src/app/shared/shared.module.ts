import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from 'ionic-angular';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { I18nModule } from './i18n/i18n.module';
import { ValidatorsModule } from './tools/validators.module';

import { LoadingFullscreenComponent } from './components/loading-fullscreen/loading-fullscreen';

import { ScrollHideDirective } from './layout/directives/scroll-hide';
import { ScrollEffectDirective } from './layout/directives/scroll-effect';
import { DocumentEditorComponent } from './components/document-editor/document-editor';

const modals = [DocumentEditorComponent];

@NgModule({
  declarations: [
    // Components
    LoadingFullscreenComponent,

    // Components: Modals
    ...modals,

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
    PerfectScrollbarModule,
    I18nModule,
    ValidatorsModule
  ],
  exports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
    I18nModule,
    ValidatorsModule,

    // Components
    LoadingFullscreenComponent,

    // Directives
    ScrollHideDirective,
    ScrollEffectDirective
  ],
  entryComponents: [...modals]
})
export class SharedModule {}
