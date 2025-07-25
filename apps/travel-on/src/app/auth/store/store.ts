import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { signalStore, withState } from '@ngrx/signals';
import { initialState } from './auth.state';
import { withAuthComputed } from './with-auth-computed';
import { withAuthMethods } from './with-auth-methods';

export const AuthStore = signalStore(
  { providedIn: 'root' },
  // withDevtools('auth'),
  withState(initialState),
  withAuthMethods(),
  withAuthComputed()
);
