import { NgOptimizedImage, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DomSanitizer } from '@angular/platform-browser';

import {
  EmailAndPasswordSignIn,
  SignInEvent,
  SignInMethod,
} from '../../auth/utils';

import { DividerHeaderComponent } from '@dom/components/divider-header';
import { getFormKeys } from '@dom/components/form/helpers';
import { FormInputComponent } from '@dom/components/form/inputs/form-input';
import { InputType } from '@dom/components/form/models';
import { FormErrorService } from '@dom/components/form/services';
import { FormServerError } from '@dom/components/form/types';
import { DEFAULT_EMAIL } from '../../shared/tokens';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'to-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgOptimizedImage,
    MatSlideToggleModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatButton,
    MatIcon,
    TitleCasePipe,
    DividerHeaderComponent,
    FormInputComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  #formErrorService = inject(FormErrorService);
  #email = inject(DEFAULT_EMAIL);

  public readonly serverError = input<FormServerError>();

  public readonly loginFormGroup: FormGroup<LoginForm>;


  public readonly errorsMap: { [key: string]: ValidationErrors } = {
    password: {
      minlength: 'password is to short',
      maxlength: 'password is to long',
    },
  };

  public readonly inputTypes: { [key: string]: InputType } = {
    password: InputType.PASSWORD,
    email: InputType.EMAIL,
  };

  public readonly formKeys: WritableSignal<(keyof LoginForm)[]>;

  public message = signal('');

  login = output<SignInEvent>();
  google = output<SignInEvent>();
  otp = output<SignInEvent>();
  emailLink = output<SignInEvent>();
  forget = output<void>();

  constructor() {
    this._setGoogleIcon();

    this.loginFormGroup = this.buildLoginForm();

    this.formKeys = getFormKeys(this.loginFormGroup);

    
  }

  private _setGoogleIcon(): void {
    inject(MatIconRegistry).addSvgIcon(
      'google',
      inject(DomSanitizer).bypassSecurityTrustResourceUrl(
        'assets/icons/google-icon.svg'
      )
    );
  }

  private buildLoginForm(): FormGroup<LoginForm> {
    return inject(NonNullableFormBuilder).group({
      email: [this.#email, [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
        ],
      ],
    });
  }

  public oGoogleSignIn(): void {
    const event = this._createSignInEvent(SignInMethod.GOOGLE);
    this.google.emit(event);
  }

  public onSubmit(value: Partial<EmailAndPasswordSignIn>): void {
    const event = this._createSignInEvent(SignInMethod.EMAIL_PASSWORD, value);
    this.login.emit(event);
  }

  public onOtpSignIn(): void {
    const event = this._createSignInEvent(SignInMethod.OPT);
    this.otp.emit(event);
  }

  public onForgetPassword() {
    this.forget.emit();
  }

  private _createSignInEvent(
    method: SignInMethod,
    data?: unknown
  ): SignInEvent {
    return {
      method,
      data,
    } as SignInEvent;
  }
}
