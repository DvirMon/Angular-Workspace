import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  input,
  output,
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
import { MatCard, MatCardContent } from '@angular/material/card';

import { Register } from '../../auth/index';
import { DividerHeaderComponent } from '@dom/components/divider-header';
import { FormInputComponent } from '@dom/components/form/inputs/form-input';
import {
  getFormKeys,
  handleServerErrorEffect,
} from '@dom/components/form/helpers';
import { FormServerError } from '@dom/components/form/types';
import { InputType } from '@dom/components/form/models';

interface RegisterForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'to-register-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TitleCasePipe,
    MatCard,
    MatCardContent,
    MatButton,
    FormInputComponent,
    DividerHeaderComponent,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  #injector = inject(Injector);

  serverError = input<FormServerError>();

  public readonly registerFormGroup: FormGroup<RegisterForm>;

  public readonly formKeys: WritableSignal<(keyof RegisterForm)[]>;

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

  register = output<Register>();

  constructor() {
    this.registerFormGroup = this._buildRegisterForm();
    this.formKeys = getFormKeys(this.registerFormGroup);

    handleServerErrorEffect(
      this.#injector,
      this.serverError,
      this.registerFormGroup
    );
  }

  private _buildRegisterForm(): FormGroup<RegisterForm> {
    return inject(NonNullableFormBuilder).group({
      email: ['dmezZ@example.com', [Validators.required, Validators.email]],
      password: [
        'djkjdfkdfj',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
        ],
      ],
      // confirmPassword: ['',
      //   [Validators.required, Validators.pattern(this.validationService.regex.password)]],
    });
  }

  public onSubmit(value: Partial<Register>): void {
    this.register.emit(value as Register);
  }
}
