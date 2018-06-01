import { IonicErrorHandler, AlertController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class AppExceptionHandler extends IonicErrorHandler {
  constructor(private alertCtrl: AlertController) {
    super();
  }

  handleError(error) {
    switch (error.message) {
      //   case 'Network Error': {
      //     this.handleNetworkError();
      //     break;
      //   }
      default:
        this.handleOtherErrors(error);
    }
  }
  handleOtherErrors(error: any) {
    let message = '';

    switch (error.message) {
      case 'Network Error':
        message = "serveur injoignable. Assurez-vous d'être connecté à internet";
        break;
      default: {
        message = error.message;
      }
    }

    this.alertCtrl
      .create({
        title: 'état du service',
        message: error.message,
        buttons: ['ok']
      })
      .present();
  }
}
