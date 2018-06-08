import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { DocumentProperty } from './interfaces/document-properties';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';

@Component({
  selector: 'field-editor',
  templateUrl: 'field-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldEditorComponent {
  prop: DocumentProperty = null;

  @Input('property')
  set property(property: DocumentProperty) {
    this.prop = { ...property };
  }

  @Output('update') updateEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  onValueChanged(value) {
    this.updateEmitter.emit({ ...this.prop, value });
  }
}
