import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from 'ionic-angular';

import { Observable, combineLatest } from 'rxjs';
import { switchMap, take, filter } from 'rxjs/operators';

export interface AlertOptions {
  title: string;
  message: string;
  error: {
    title: string;
    btnOk: string;
  };
}
export interface AlertEvents {
  waitToBeFalse$: Observable<boolean>;
  successIfTrue$: Observable<boolean>;
  error$: Observable<string>;
}

@Injectable()
export class LayoutService {
  constructor(private loadingCtrl: LoadingController, private _alertCtrl: AlertController) {}

  public createModal(options: AlertOptions, events: AlertEvents) {
    const alert = this._alertCtrl.create({
      title: options.title,
      message: options.message,
      enableBackdropDismiss: false
    });

    events.waitToBeFalse$
      .pipe(filter(pending => !pending), switchMap(() => combineLatest(events.error$, events.successIfTrue$)), take(1))
      .subscribe(([error, authenticated]) => {
        alert.dismiss();
        if (!authenticated) {
          const errorAlert = this._alertCtrl.create({
            title: options.error.title,
            message: error,
            buttons: ['ok']
          });
          errorAlert.present();
        }
      });

    alert.present();
  }
}
