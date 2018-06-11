import { Component } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { ViewController, NavParams, AlertController } from 'ionic-angular';
import { DocumentEditorNavParams } from './document-editor-nav-params';

import { Observable } from 'rxjs';
import { take, skip, tap, concatMap } from 'rxjs/operators';
import { map } from 'rxjs-compat/operator/map';

@Component({
  selector: 'document-editor-modal',
  templateUrl: 'document-editor-modal.html'
})
export class DocumentEditorModalComponent {
  loading = false;
  isLiveUpdate: boolean;

  private _updateFn: Function;
  private _documentState: any = null;

  data$: Observable<any>;
  private _changeGuardSubscription: Subscription;

  constructor(private _viewCtrl: ViewController, private _navParams: NavParams, private _alertCtrl: AlertController) {
    const { data$, live, updateFn } = <DocumentEditorNavParams>this._navParams.data;
    if (live) {
      this.initLiveEditMode(data$, updateFn);
    } else {
      this.initTransactionMode(data$);
    }
  }

  private initLiveEditMode(data$: Observable<any>, updateFn: Function) {
    this.isLiveUpdate = true;
    this._updateFn = updateFn;
    this.data$ = data$;
  }

  private initTransactionMode(data$: Observable<any>) {
    // Expose one-time vlaue
    this.data$ = data$.pipe(
      take(1),
      tap(() => (this.loading = false))
    );

    // Warn in case of inbound value update
    this._changeGuardSubscription = data$.pipe(skip(1)).subscribe(data => {
      this._alertCtrl
        .create({
          title: 'change detected',
          message: 'this document has been updated by someone else. Cancel your edits and start over.',
          buttons: ['ok']
        })
        .present();
    });
  }

  documentUpdated(documentState) {
    this._documentState = documentState;
    if (this.isLiveUpdate) {
      this._updateFn(documentState);
    }
  }

  ionViewWillLeave() {
    this._changeGuardSubscription && this._changeGuardSubscription.unsubscribe();
  }

  isSaveDisabled() {
    return !!!this.getData();
  }

  onClose() {
    this.dismiss();
  }

  onCancel() {
    this.dismiss();
  }

  onSave() {
    this.dismiss(this.getData());
  }

  private getData() {
    return this._documentState;
  }

  private dismiss(data?: any) {
    this._viewCtrl.dismiss(data);
  }
}
