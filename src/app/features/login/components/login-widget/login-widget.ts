import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController, ToastController } from 'ionic-angular';

import { Observable, Subject, combineLatest } from 'rxjs';

import { CustomValidators } from '../../../../shared/tools/custom-validators';
import { LayoutService } from '../../../../shared/layout/layout.service';
import { StoreService } from '../../../../shared/services/store.service';
import {
  LoginRequestAction,
  PasswordResetRequestAction
} from '../../../../shared/store/features/authentication/authentication.actions';
import { UserCreationRequestAction } from '../../../../shared/store/features/users/users.actions';
import { takeUntil, take, filter, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'login-widget',
  templateUrl: 'login-widget.html'
})
export class LoginWidgetComponent {
  mode: string = 'login';
  signUpPage: string = 'SignUpPage';

  private loginForm: FormGroup;
  private registerForm: FormGroup;
  private passwordRecoveryForm: FormGroup;

  constructor(
    private _loadingCtrl: LoadingController,
    private _alertCtrl: AlertController,
    private _toastCtrl: ToastController,
    private _formBuilder: FormBuilder,
    private _customValidators: CustomValidators,
    private _storeService: StoreService,
    private _layoutService: LayoutService
  ) {
    this.loginForm = this._formBuilder.group({
      email: ['jem@dercetech.com', [Validators.required, this._customValidators.getEmailValidator()]],
      password: ['password', Validators.required]
    });

    this.registerForm = this._formBuilder.group({
      displayName: ['Jem'],
      email: ['jem@dercetech.com', [Validators.required, this._customValidators.getEmailValidator()]],
      emailConfirm: ['jem@dercetech.com', [Validators.required, this._customValidators.matchOtherValidator('email')]],
      password: ['password', Validators.required],
      passwordConfirm: ['password', [Validators.required, this._customValidators.matchOtherValidator('password')]]
    });

    this.passwordRecoveryForm = this._formBuilder.group({
      email: ['', [Validators.required, this._customValidators.getEmailValidator()]]
    });
  }

  onOpenPasswordLostScreen(): void {
    this.loginForm.value.email && this.passwordRecoveryForm.controls.email.setValue(this.loginForm.value.email);
    this.mode = 'recovery';
  }

  onLogin(): void {
    // Loading...
    const loading = this._loadingCtrl.create({ content: 'signing in...' });
    loading.present();

    // Dispatch
    const username = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this._storeService.dispatch(new LoginRequestAction({ username, password }));

    // Processing
    const { select } = this._storeService;
    const { processing$, error$ } = select.authentication.login;
    processing$
      .pipe(filter(processing => !processing), switchMap(processingComplete => combineLatest(error$)), take(1))
      .subscribe(([error]) => {
        loading.dismiss();
        error &&
          this._alertCtrl
            .create({
              title: 'authentication error',
              message: error.message,
              buttons: ['ok']
            })
            .present();
      });
  }

  onRegister(): void {
    // Loading...
    const loading = this._loadingCtrl.create({ content: 'registring...' });
    loading.present();

    // Dispatch
    const displayName = this.registerForm.value.displayName;
    const username = this.registerForm.value.email;
    const password = this.registerForm.value.password;
    this._storeService.dispatch(new UserCreationRequestAction({ displayName, username, password }));

    // Processing
    const { select } = this._storeService;
    const { processing$, error$, data$ } = select.users.registration;
    processing$
      .pipe(filter(processing => !processing), switchMap(processingComplete => combineLatest(error$, data$)), take(1))
      .subscribe(([error]) => {
        loading.dismiss();
        (error
          ? this._alertCtrl.create({
              title: 'registration error',
              message: error.message,
              buttons: ['ok']
            })
          : this._toastCtrl.create({
              position: 'top',
              message: `Welcome, ${displayName}!`,
              duration: 1500
            })
        ).present();
      });
  }

  onNewPasswordRequest(): void {
    // Loading...
    const loading = this._loadingCtrl.create({ content: 'requesting reset link...' });
    loading.present();

    // Dispatch
    const username = this.passwordRecoveryForm.value.email;
    this._storeService.dispatch(new PasswordResetRequestAction({ username }));

    // Processing
    const { select } = this._storeService;
    const { processing$, error$, data$ } = select.authentication.passwordReset;
    processing$
      .pipe(filter(processing => !processing), switchMap(processingComplete => combineLatest(error$)), take(1))
      .subscribe(([error]) => {
        loading.dismiss();
        this.mode = error ? this.mode : 'login';
        (error
          ? this._alertCtrl.create({
              title: 'password reset error',
              message: error.message,
              buttons: ['ok']
            })
          : this._toastCtrl.create({
              position: 'top',
              showCloseButton: true,
              closeButtonText: 'ok',
              message: 'A reset link has been sent to this email address.'
            })
        ).present();
      });
  }
}
