import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output, OnInit } from '@angular/core';
import { DocumentProperty } from './interfaces/document-properties';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';
import { Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil, tap, filter, map } from 'rxjs/operators';

@Component({
  selector: 'field-editor',
  templateUrl: 'field-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldEditorComponent implements OnInit {
  prop: DocumentProperty = null;

  private _value$: Subject<any> = new Subject();
  private _destroy$: Subject<void> = new Subject();

  @Input('property')
  set property(property: DocumentProperty) {
    this.prop = { ...property };
  }

  @Output('update') updateEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {
    this._value$
      .pipe(
        takeUntil(this._destroy$),
        filter(value => this.prop.value != value),
        map(value => (isNaN(value) ? value : Number.parseFloat(value))),
        debounceTime(this.prop.type === 'boolean' ? 0 : 750),
        tap(() => console.log('saving'))
      )
      .subscribe(value => this.updateEmitter.emit({ ...this.prop, value }));
  }

  onValueChanged(value) {
    this.validateNewValue(value) ? this._value$.next(value) : this.revertLastChange();
  }

  private validateNewValue(newValue: any) {
    if (this.prop.type === 'number') {
      return !isNaN(newValue);
    }
    return true;
  }

  private revertLastChange() {
    this.prop.value = this.prop.value;
  }
}
