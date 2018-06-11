import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';

import { DocumentSubProperty, DocumentProperty } from '../field-editor/interfaces/document-properties';

@Component({
  selector: 'document-editor',
  templateUrl: 'document-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentEditorComponent {
  @Input()
  set doc(pojo: any) {
    if (pojo) {
      this.data = this.processDocument(pojo);
    }
  }

  @Input() key: string;
  @Input() level: number = 0;

  @Output('update') updateEmitter: EventEmitter<any> = new EventEmitter<any>();

  data: {
    properties: DocumentProperty[];
    subProperties: DocumentSubProperty[];
  } = {
    properties: [],
    subProperties: []
  };

  constructor() {}

  trackByFn(index: any, item: any) {
    return index;
  }

  onPropertyUpdated(updatedProperty: DocumentProperty) {
    const propertyIndex = this.data.properties.findIndex(property => property.key === updatedProperty.key);
    this.data.properties[propertyIndex] = updatedProperty;
    this.emitUpdatedDocument();
  }

  onSubdocumentUpdated(updatedSubdocument: any) {
    Object.keys(updatedSubdocument).forEach(key => {
      const idx = this.data.subProperties.findIndex((subProperty: DocumentProperty) => subProperty.key === key);
      this.data.subProperties[idx] = {
        key,
        type: 'object',
        value: updatedSubdocument[key]
      };
    });
    this.emitUpdatedDocument();
  }

  private emitUpdatedDocument() {
    const pojo = {};
    this.data.properties.forEach(property => (pojo[property.key] = property.value));
    this.data.subProperties.forEach((property: any) => (pojo[property.key] = property.value));
    this.updateEmitter.emit(this.key ? { [this.key]: pojo } : pojo);
  }

  private processDocument(data: any) {
    const properties: DocumentProperty[] = [];
    const subProperties: DocumentSubProperty[] = [];
    Object.keys(data).map(key => {
      const value = data[key];
      const type = this.getDataType(value);
      const entry = {
        key,
        value,
        type
      };
      if (type === 'object') {
        subProperties.push(entry);
      } else if (type === 'array') {
      } else {
        properties.push(entry);
      }
    });
    return {
      properties,
      subProperties
    };
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
    } else if (value.constructor === Boolean) {
      return 'boolean';
    }
  }
}
