import { JsonPipe } from '@angular/common';
import {
  Component,
  OnInit,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import { FormAutocompleteComponent } from '@dom/components/form/inputs/form-autocomplete';
import { OptionContentDirective } from '@dom/directives';
import { HighLightPipe } from '../../shared/pipes/high-light.pipe';
import { PluckPipe } from '../../shared/pipes/pluck.pipe';
import { Store } from '../../store/store';
import { AutocompleteOption } from '../../weather/models/autocomplete-result';
import { CurrentWeather } from '../../weather/models/current-weather-result';
import {
  FutureWeather,
  FutureWeatherArgs,
} from '../../weather/models/future-weather-result';
import { FavoriteEntity } from '../../weather/weather-favorite-card/favorite-card.component';
import {
  FavoriteChangeEvent,
  UnitChangeEvent,
  WeatherMediaResultComponent,
} from '../../weather/weather-result-card/weather-result.component';

@Component({
  selector: 'weather-space-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatOption,
    PluckPipe,
    JsonPipe,
    MatFormField,
    MatLabel,
    MatInput,
    MatAutocompleteTrigger,
    MatAutocomplete,
    HighLightPipe,
    WeatherMediaResultComponent,
    FormAutocompleteComponent,
    OptionContentDirective
],
})
export class LobbyPageComponent implements OnInit {
  #nfb = inject(NonNullableFormBuilder);

  #store = inject(Store);

  options: Signal<AutocompleteOption[]>;
  filtered: Signal<AutocompleteOption[]>;
  optionSelected: Signal<AutocompleteOption>;
  control!: FormControl<AutocompleteOption>;

  currentWeather: Signal<CurrentWeather>;
  futureWeather: Signal<FutureWeather>;

  isMetric: Signal<boolean>;
  isFavorite: Signal<boolean>;
  futureArgs: Signal<FutureWeatherArgs>;

  isWeatherData: Signal<boolean>;

  searchTerm: WritableSignal<string> = signal('');

  constructor() {
    this.options = this.#store.optionsEntities;

    this.optionSelected = this.#store.optionSelected;

    this.isMetric = this.#store.isMetric;

    this.filtered = computed(() =>
      this.options().filter((option) => this.predicate(option))
    );

    this.currentWeather = computed(
      () => this.#store.currentEntityMap()[this.#store.selectedId()]
    );

    this.futureArgs = computed<FutureWeatherArgs>(() => {
      return {
        id: this.#store.selectedId(),
        metric: this.#store.isMetric(),
      } as FutureWeatherArgs;
    });

    this.futureWeather = computed(
      () => this.#store.futureEntityMap()[this.#store.selectedId()]
    );

    this.isWeatherData = computed(
      () =>
        !!this.currentWeather() &&
        !!this.optionSelected() &&
        !!this.futureWeather()
    );

    this.isFavorite = computed(
      () => !!this.#store.favoritesEntityMap()[this.#store.selectedId()]
    );

    effect(() => {
      if (this.searchTerm()) {
        this.#store.loadOptions(this.searchTerm());
      }
    });
  }

  async ngOnInit(): Promise<void> {
    if (this.options().length == 0) {
      await this.#store.loadOptionAsync('tel aviv');
    }

    if (this.#store.selectedId() == -1) {
      this.#store.setCurrentId('tel aviv');
    }

    this.control = this.#nfb.control(
      this.optionSelected()
    ) as FormControl<AutocompleteOption>;

    this.#store.loadCurrentWeather(this.#store.selectedId);
    this.#store.loadFutureWeather(this.futureArgs);
  }

  onOptionSelected(option: any): void {
    this.#store.updateCurrentId(option.id);
  }

  onFavoriteChanged(event: FavoriteChangeEvent): void {
    const { selected } = event;

    const favorite: FavoriteEntity = {
      ...event,
    } as FavoriteEntity;

    if (selected) {
      this.#store.addFavorite(favorite);
    } else {
      this.#store.removeFavorite(favorite);
    }
  }

  onUnitTempChange({ metric }: UnitChangeEvent): void {
    this.#store.updateIsMetric(metric);
  }

  onQueryChanged(event: string) {
    this.searchTerm.update(() => event);
  }

  displayFn(value: AutocompleteOption): string {
    const option = value instanceof MatOption ? value.value : value;

    return option != null ? `${option.LocalizedName}` : '';
  }

  predicate(option: AutocompleteOption) {
    return option.LocalizedName.toLowerCase().includes(
      this.searchTerm().toLowerCase()
    );
  }
}
