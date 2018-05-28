import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from 'ionic-angular';

import { Observable, combineLatest, Subject } from 'rxjs';
import { switchMap, take, filter, tap, takeUntil } from 'rxjs/operators';

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

    const success$: Subject<void> = new Subject();

    function finalize() {
      success$.next();
      success$.complete();
      alert.dismiss();
    }

    events.waitToBeFalse$
      .pipe(
        filter(pending => !pending),
        switchMap(() => combineLatest(events.error$, events.successIfTrue$)),
        takeUntil(success$)
      )
      .subscribe(([error, success]) => {
        if (success) {
          finalize();
        }
        if (!success && error) {
          finalize();
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
