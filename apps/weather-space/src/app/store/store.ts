import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { addEntity, removeEntity } from '@ngrx/signals/entities';
import { AutocompleteOption } from '../weather/models/autocomplete-result';
import { FavoriteEntity } from '../weather/weather-favorite-card/favorite-card.component';
import { WeatherService } from '../weather/weather.service';
import { updateIsMetric } from './updaters';
import { withCurrentWeather } from './with-current.feature';
import { withFavorites } from './with-favorites.feature';
import { withFutureWeather } from './with-future.feature';
import { withOptions } from './with-options.feature';

export interface State {
  isMetric: boolean;
  isGeolocation: boolean;
  selectedId: number;
}

const initialState: State = {
  isMetric: true,
  isGeolocation: true,
  selectedId: -1,
};

export const Store = signalStore(
  { providedIn: 'root' },
  // withDevtools('store'),
  withState(initialState),
  withOptions(WeatherService),
  withCurrentWeather(WeatherService),
  withFutureWeather(WeatherService),
  withFavorites(),
  withComputed((store) => ({
    optionSelected: computed(
      () => store.optionsEntityMap()[store.selectedId()]
    ),
    hasFavorites: computed(() => store.favoritesEntities().length !== 0),
    favoritesCount: computed(() =>
      store.favoritesEntities().length > 0
        ? String(store.favoritesEntities().length)
        : ''
    ),
  })),
  withMethods((state) => ({
    setCurrentId(value: string) {
      const option = state
        .optionsEntities()
        .find((option) => optionCompareTo(option, value));
      patchState(state, { selectedId: option?.id });
    },

    updateCurrentId(id: number) {
      patchState(state, { selectedId: id });
    },

    updateIsMetric(isMetric: boolean) {
      patchState(state, updateIsMetric(isMetric));
    },

    addFavorite(item: FavoriteEntity) {
      patchState(state, addEntity(item, { collection: 'favorites' }));
    },
    removeFavorite(item: FavoriteEntity) {
      patchState(state, removeEntity(item.id, { collection: 'favorites' }));
    },
  }))
);

function optionCompareTo(option: AutocompleteOption, value: string): boolean {
  return option ? option.LocalizedName.toLowerCase() === value : false;
}
