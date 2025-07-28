
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Signal,
  WritableSignal,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormErrorService } from '../../services/form-error.service';
import { InputType } from '../../models/input.types';
import { FormServerError } from '../../types';

@Component({
  selector: 'dom-form-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
],
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormInputComponent implements OnInit {
  #formErrorService = inject(FormErrorService);
  control = input.required<AbstractControl<unknown, unknown> | null>();
  name = input.required<string>();
  type = input<InputType>(InputType.TEXT);
  label = input<string | undefined>();
  hint = input<string>();
  serverError = input<FormServerError>();

  messagesMap = input<ValidationErrors>();

  formControl!: Signal<FormControl<unknown>>;

  message: WritableSignal<string> = signal('');

  blurChanged = output<FormControl>();

  constructor() {
    const error = this.serverError();

    if (error) {
      this.formControl().setErrors({ serverError: error.message });
    }
  }

  ngOnInit(): void {
    this.formControl = computed(() => this.control() as FormControl);

    const errorEmitter = this.#formErrorService.createErrorMessageEmitter(
      this.messagesMap(),
      (value) => this.message.set(value)
    );

    this.#formErrorService.handleErrorMessage(this.formControl(), errorEmitter);
  }

  onBlur() {
    this.blurChanged.emit(this.formControl());
  }
}
