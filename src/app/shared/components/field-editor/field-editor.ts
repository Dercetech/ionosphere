import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { DocumentProperty } from './interfaces/document-properties';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';

@Component({
  selector: 'field-editor',
  templateUrl: 'field-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldEditorComponent {
  text: string;

  prop: DocumentProperty = null;
  subProperties: DocumentProperty[] = [];
  @Input('property')
  set property(property: DocumentProperty) {
    this.prop = { ...property };
    this.subProperties = property.type === 'object' ? this.getSubProperties(property) : [];
    debugger;
  }

  @Output('update') valueChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  onValueChanged(value) {
    this.valueChanged.emit({ ...this.prop, value });
  }

  private getDataType(value: any) {
    if (!value.constructor || value.constructor === String) {
      return 'string';
    } else if (value.constructor === Object) {
      return 'object';
    } else if (value.constructor === Number) {
      return 'number';
    } else if (value.constructor === Array) {
      return 'array';
    }
  }

  private getSubProperties(property: DocumentProperty): DocumentProperty[] {
    const subProperties: DocumentProperty[] = [];
    Object.keys(property).map(key => {
      const subProperty = property[key];
      const type = this.getDataType(subProperty);
      subProperties.push({
        key,
        type,
        value: subProperty
      });
    });
    debugger;
    return subProperties;
  }
}
