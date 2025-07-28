import { computed, inject } from '@angular/core';
import { signalStore, withComputed } from '@ngrx/signals';
import { AbstractEvaluate } from 'ng-filters-service/abstract-evaluate';
import { MediaItem } from '../shared/types';
import { createFilterCriteria, withFilter } from './with-filter.feature';
import { getMedia, withMedia } from './with-media.feature';
import { compareTitle, withSort } from './with-sort.feature';

export const AppStore = signalStore(
  { providedIn: 'root' },
  // withDevtools('store'),
  withMedia(),
  withFilter(),
  withSort(),
  withComputed((store, service = inject(AbstractEvaluate)) => ({
    mediaV1: computed(() =>
      store
        .entities()
        // .filter(isTitleOrDate(store.searchTerm()))
        .filter(
          service.evaluate({
            criteria: createFilterCriteria(store.searchTerm()),
          })
        )
        .sort((a, b) => compareTitle(a, b, store.sortDir()))
        .reduce(getMedia, [])
    ),
    media: computed(() =>
      store
        .entities()
        .reduce(getMedia, [])
        .map((item: MediaItem) => ({
          ...item,
          data: item.data
            // .filter(isTitleOrDate(store.searchTerm()))
            .filter(
              service.evaluate({
                criteria: createFilterCriteria(store.searchTerm()),
              })
            )
            .sort((a, b) => compareTitle(a, b, store.sortDir())),
        }))
    ),
  }))
);
