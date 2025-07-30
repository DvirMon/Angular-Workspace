import { JsonPipe, NgClass, TitleCasePipe } from '@angular/common';
import {
  Component,
  WritableSignal,
  computed,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatOption, MatOptionSelectionChange } from '@angular/material/core';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { getFormKeys } from '@dom/components/form/helpers';
import { FormAutocompleteComponent } from '@dom/components/form/inputs/form-autocomplete';
import { WritableStateSource, patchState, signalState } from '@ngrx/signals';
import { DropdownModule } from 'primeng/dropdown';
import { Observable, of } from 'rxjs';
import { Book } from '../../books/books';
import { LayoutComponent } from '../../layout/layout.component';
import {
  Loader,
  LoaderService,
  OptionChanged,
  createOptionsLoader,
  handleGroupOptions,
} from '../../shared/options.helper';
import { FiltersDataService } from './data.service';
import { mapToString } from './helpers';

interface Filters {
  book1: FormControl<Book>;
  book2: FormControl<Book>;
  book3: FormControl<Book>;
  book4: FormControl<Book>;
}

@Component({
  selector: 'books-scape-filters',
  standalone: true,
  imports: [
    NgClass,
    JsonPipe,
    TitleCasePipe,
    ReactiveFormsModule,
    DropdownModule,
    MatFormField,
    MatSuffix,
    MatLabel,
    MatInput,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatSelect,
    MatIcon,
    LayoutComponent,
    FormAutocompleteComponent
],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersPageComponent {
  #filterService = inject(FiltersDataService);

  public readonly optionsMap = signalState<Record<string, Book[]>>({});

  public readonly showForm = computed(
    () => !!Object.keys(this.optionsMap()).length
  );

  public readonly booksAutocomplete: FormGroup<Filters>;

  public readonly booKeys: WritableSignal<(keyof Filters)[]>;

  #handleOptionsChanged = this._handleOptions(
    FiltersDataService,
    this.optionsMap
  );

  constructor() {
    this.booksAutocomplete = this._buildGroup();

    this.booKeys = getFormKeys<Filters>(this.booksAutocomplete);

    // this.#handleOptionsChanged(registerGroupOptions(this.booksAutocomplete));

    const results = toSignal(this.#filterService.loadFilterOptions());

    effect(
      () => {
        if (results()) {
          patchState(this.optionsMap, { ...results() });
        }
      },
      { allowSignalWrites: true }
    );
  }

  private _buildGroup(): FormGroup<Filters> {
    return inject(NonNullableFormBuilder).group({
      book1: [{ title: 'Angular' } as Book],
      book2: [{ title: 'Angular' } as Book],
      book3: [{ title: 'Foundation' } as Book],
      book4: [{ title: 'The Hobbit' } as Book],
    }) as FormGroup<Filters>;
  }

  private _handleOptions(
    Loader: LoaderService<Loader<string, Book, 'loadOptions'>>,
    state: WritableStateSource<object>
  ) {
    const loader = createOptionsLoader(Loader, 'loadOptions');

    return handleGroupOptions(loader, state);
  }

  onSelectionChange(event: MatOptionSelectionChange<Book>) {
    // console.log(event);
  }

  onQueryChanged(query: string, key: string) {
    const optionChanged: Observable<OptionChanged> = of({ query, key });
    this.#handleOptionsChanged(optionChanged);
  }

  displayWith(value: Book | Book[]): string {
    if (Array.isArray(value)) {
      return mapToString(value, (v) => v.title, 35);
    } else {
      return (() => value.title)();
    }
  }

  displayOptionDisableWith(value: Book): boolean {
    if (value) {
      return value.title.length > 30;
    }

    return false;
  }
}
