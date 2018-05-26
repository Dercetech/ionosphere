import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from 'ionic-angular';

import { Observable, Subject, combineLatest } from 'rxjs';

import { CustomValidators } from '../../../../shared/tools/custom-validators';
import { LayoutService } from '../../../../shared/layout/services/layout.service';
import { StoreService } from '../../../../shared/services/store.service';
import { LoginRequestAction } from '../../../../shared/store/features/authentication/authentication.actions';
import { UserCreationRequestAction } from '../../../../shared/store/features/users/users.actions';
import { takeUntil, take, filter, switchMap } from 'rxjs/operators';

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
    //private loadingCtrl: LoadingController,
    private _alertCtrl: AlertController,
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

  onLogin(): void {
    const username = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.signIn({ username, password });
  }

  onOpenRegisterScreen(): void {
    this.mode = 'register';
  }

  onRegister(): void {
    const displayName = this.registerForm.value.displayName;
    const username = this.registerForm.value.email;
    const password = this.registerForm.value.password;
    this._storeService.dispatch(new UserCreationRequestAction({ displayName, username, password }));
    /*
    const watchForAuthentication = this.authService.authenticated$
      .filter(isAuthenticated => isAuthenticated === true)
      .first()
      .subscribe(isAuthenticated => {
        if (isAuthenticated) {
          this._userService.updateUserData({
            displayName: this.registerForm.value.displayName,
            email: this.registerForm.value.email
          });
        }
      });
      */
    // TODO move to UserService for a cleaner architecture
    /*
    this.authService
      .signUp(this.registerForm.value.email, this.registerForm.value.password)
      .then(
        () => {},
        err => {
          let isWeak = false;
          let emailExists = false;
          let specificErrorsCount = 0;

          function checkError(err) {
            if (err.message && err.message.indexOf('WEAK_PASSWORD') !== -1) {
              isWeak = true;
              specificErrorsCount++;
            }
            if (err.code && err.code.indexOf('auth/weak-password') !== -1) {
              isWeak = true;
              specificErrorsCount++;
            }
            if (err.message && err.message.indexOf('EMAIL_EXISTS') !== -1) {
              emailExists = true;
              specificErrorsCount++;
            }
            if (
              err.code &&
              err.code.indexOf('auth/email-already-in-use') !== -1
            ) {
              emailExists = true;
              specificErrorsCount++;
            }
          }

          // Single error
          if (err && err.code) checkError(err);

          // Multiple errors
          if (err && err.errors) {
            err.errors.forEach(err => checkError(err));
          }

          if (isWeak)
            this.registerForm.controls.password.setErrors({ weak: true });
          if (emailExists)
            this.registerForm.controls.password.setErrors({ exists: true });

          watchForAuthentication.unsubscribe();
        }
      );
      */
  }

  onPasswordLost(): void {
    if (this.loginForm.value.email) this.passwordRecoveryForm.controls.email.setValue(this.loginForm.value.email);
    this.mode = 'recovery';
  }

  onNewPasswordRequest(): void {
    /*
    this.authService
      .askForNewPassword(this.passwordRecoveryForm.value.email)
      .then(
        () => {
          const alert = this.alertCtrl.create({
            title: this.i18n.getTranslationInCurrentLanguage(
              'pages.signin.new-pwd-title'
            ),
            message: this.i18n.getTranslationInCurrentLanguage(
              'pages.signin.new-pwd-requested'
            ),
            buttons: ['ok']
          });
          alert.present();
          this.mode = 'login';
        },
        err => {
          const alert = this.alertCtrl.create({
            title: this.i18n.getTranslationInCurrentLanguage(
              'pages.signin.new-pwd-title'
            ),
            message: err,
            buttons: ['ok']
          });
          alert.present();
        }
      );
      */
  }

  private signIn(credentials: { username: string; password: string }) {
    this._storeService.dispatch(new LoginRequestAction(credentials));
    const { authenticating$, authenticated$, authenticationError$ } = this._storeService.select.authentication;
    this._layoutService.createModal(
      { title: 'authenticating', message: 'please wait...', error: { title: 'authentication error ', btnOk: 'ok' } },
      { waitToBeFalse$: authenticating$, successIfTrue$: authenticated$, error$: authenticationError$ }
    );
  }
}
