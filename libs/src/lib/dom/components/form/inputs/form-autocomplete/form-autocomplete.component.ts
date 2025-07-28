import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  effect,
  input,
  output,
  signal
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatListModule,
  MatListOption,
  MatSelectionList,
  MatSelectionListChange,
} from '@angular/material/list';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  map,
  pipe,
  tap,
} from 'rxjs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { OptionContentDirective } from '../../../../directives';
import { DisplayOptionDisablePipe } from '../../pipes/displayDisable.pipe';
import { DisplayOptionLabelPipe } from '../../pipes/displayOption.pipe';

@Component({
  selector: 'dom-form-autocomplete',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    NgTemplateOutlet,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOption,
    MatListModule,
    MatSelectionList,
    OptionContentDirective,
    DisplayOptionLabelPipe,
    DisplayOptionDisablePipe
],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormAutocompleteComponent<TOption> {
  public readonly selectedMap = signal<Record<string, TOption>>({});

  options = input.required<TOption[]>();
  control = input.required<FormControl<TOption | TOption[]>>();

  idKey = input<string>('id');
  label = input<string>('');
  defaultValue = input<string>();
  multi = input<boolean>(false);

  @ContentChild(OptionContentDirective)
  optionContentDirective!: OptionContentDirective;

  @Input() displayWith: (option: TOption) => string = () => '';
  @Input() displayOptionLabelWith: (option: TOption) => string = () => '';
  @Input() displayOptionDisableWith: (option: TOption) => boolean = () => false;
  @Input() displayOptionSelectedWith: (option: TOption) => boolean = () =>
    false;

  queryChanged = output<string>();
  optionSelected = output<TOption | TOption[]>();

  #valueChanged: Subject<string> = new Subject();

  private onTermChanged = rxMethod<string>(
    pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map((value) => (!value ? this.defaultValue() : value)),
      tap((value) => this.queryChanged.emit(value as string))
    )
  );

  constructor() {
    effect(
      () => {
        if (this.control()) {
          this.onTermChanged(this.#valueChanged.asObservable());
        }
      },
      { allowSignalWrites: true }
    );
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const option: TOption = event.option.value;
    this.optionSelected.emit(option);

    this.selectedMap.update((obj) => ({
      ...obj,
      [this.idKey()]: option,
    }));
  }

  onInputChanged() {
    this.#valueChanged.next(this.control().value as string);
  }

  public onSelectionChange(event: MatSelectionListChange): void {
    const selectedOptions: MatListOption[] =
      event.source.selectedOptions.selected;
    const options = selectedOptions.map(
      ({ value }: MatListOption) =>
        ({
          ...value,
        } as TOption)
    );

    this.control().setValue(options);
  }
}
