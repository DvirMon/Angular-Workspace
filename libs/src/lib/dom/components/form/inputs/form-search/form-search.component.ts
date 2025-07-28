
import {
  Component,
  InputSignal,
  effect,
  input,
  output
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { createValueChangesEmitter } from '../../helpers';

export interface SearchMediaResultsData {
  totalMediaResults: number;
}

@Component({
  selector: 'dom-form-search',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule
],
  templateUrl: './form-search.component.html',
  styleUrls: ['./form-search.component.scss'],
})
export class FormSearchComponent {
  control: InputSignal<FormControl<string>> =
    input.required<FormControl<string>>();

  label: InputSignal<string | undefined> = input<string>();

  initialValue: InputSignal<string | undefined> = input<string>();

  valueChanged = output<string>();

  private handleValueChanges = createValueChangesEmitter((value) =>
    this.valueChanged.emit(value)
  );

  constructor() {
    effect(
      () => {
        if (this.control()) {
          this.handleValueChanges(this.control().valueChanges);
        }
      },
      { allowSignalWrites: true }
    );
  }
}
