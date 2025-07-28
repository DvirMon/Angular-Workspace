import { signalStore, withMethods } from '@ngrx/signals';
import { FavoriteHttpService } from '../favorites/favorite.https.service';
import { withFavorites } from './features/with-favorites.feature';
import { withPlaces } from './features/with-places.feature';

export const AppStore = signalStore(
  { providedIn: 'root' },
  // withDevtools('store'),
  withPlaces(),
  withFavorites(FavoriteHttpService),
  withMethods((store) => ({
    clearStore(): void {
      store.removePlaces();
      store.removeFavorite();
    },
  }))
);
