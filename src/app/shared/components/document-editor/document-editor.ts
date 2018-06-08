import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ViewController, NavParams, AlertController } from 'ionic-angular';

import { Observable, Subscription } from 'rxjs';
import { take, skip } from 'rxjs/operators';
import { DocumentSubProperty, DocumentProperty } from '../field-editor/interfaces/document-properties';

export interface DocumentEditorNavParams {
  data$: Observable<any>;
}

@Component({
  selector: 'document-editor',
  templateUrl: 'document-editor.html'
})
export class DocumentEditorComponent {
  status = {
    loading: true
  };
  data: {
    properties: DocumentProperty[];
    subProperties: DocumentSubProperty[];
  } = {
    properties: [],
    subProperties: []
  };

  private _changeGuardSubscription: Subscription;

  constructor(private _viewCtrl: ViewController, private _navParams: NavParams, private _alertCtrl: AlertController) {
    const data$ = (<DocumentEditorNavParams>this._navParams.data).data$;

    // Obtain value
    data$.pipe(take(1)).subscribe(data => {
      this.status = { ...this.status, loading: false };
      this.data = this.dataToArray(data);
    });

    // Warn in case of inbound value update
    this._changeGuardSubscription = data$.pipe(skip(1)).subscribe(data => {
      this._alertCtrl
        .create({
          title: 'change detected',
          message:
            'this document has been updated by someone else. Your changes might conflict or overwrite the updated version.',
          buttons: ['ok']
        })
        .present();
    });
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  onPropertyUpdated(updatedProperty: DocumentProperty) {
    const propertyIndex = this.data.properties.findIndex(property => property.key === updatedProperty.key);
    this.data.properties[propertyIndex] = updatedProperty;
  }

  private dataToArray(data: any) {
    const properties: DocumentProperty[] = [];
    const subProperties: DocumentSubProperty[] = [];
    debugger;
    Object.keys(data).map(key => {
      const value = data[key];
      const type = this.getDataType(value);
      if (type === 'object') {
        subProperties.push({
          key,
          type,
          values: Object.keys(value).map(subKey => ({
            key: subKey,
            value: value[subKey],
            type: this.getDataType(value[subKey])
          }))
        });
      } else if (type === 'array') {
      } else {
        properties.push({
          key,
          value,
          type
        });
      }
    });

    return {
      properties,
      subProperties
    };

    // if (this.getDataType(data) === 'string') {
    //   return data;
    // } else {
    //   return Object.keys(data).map(key => ({
    //     key,
    //     value: this.dataToArray(data[key]),
    //     type: this.getDataType(data[key])
    //   }));
    // }
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

  ionViewWillLeave() {
    this._changeGuardSubscription.unsubscribe();
  }

  onCancel() {
    this.dismiss(null);
  }

  onSubmit() {
    this.dismiss(this.getData());
  }

  private getData() {
    return this.data;
  }

  private dismiss(data?: any) {
    this._viewCtrl.dismiss(data);
  }
}
