import { Component, Signal, inject } from '@angular/core';
import { Router } from '@angular/router';

import { KeyValuePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { EntityMap } from '@ngrx/signals/entities';
import { Store } from '../../store/store';
import {
  FavoriteEntity,
  FavoriteEntityComponent,
} from '../../weather/weather-favorite-card/favorite-card.component';

@Component({
  selector: 'weather-space-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  standalone: true,
  imports: [FavoriteEntityComponent, KeyValuePipe, MatButton],
})
export class FavoritesPageComponent {
  #store = inject(Store);

  items: Signal<EntityMap<FavoriteEntity>>;
  isMetric: Signal<boolean>;
  hasFavorites: Signal<boolean>;

  constructor(private router: Router) {
    this.items = this.#store.favoritesEntityMap;
    this.isMetric = this.#store.isMetric;
    this.hasFavorites = this.#store.hasFavorites;
  }

  public onSelectionChanged({ id }: FavoriteEntity): void {
    this.#store.updateCurrentId(id);
    this.router.navigateByUrl('/');
  }
}
