import { inject } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  type,
  withMethods,
} from '@ngrx/signals';
import { LoginService } from '../../pages/login/login.service';
import { RegisterService } from '../../pages/register/register.service';
import { ResetService } from '../../pages/reset/reset.service';
import { DialogService } from '../../shared/dialog/dialog.service';
import { AuthEvent } from '../utils';
import { UserService } from '../utils/user.service';
import { AuthState, initialState } from './auth.state';
import {
  confirmPasswordReset,
  register,
  signIn,
} from './store.helpers';
import { SignInService } from '../utils/sign-in.service';

export function withAuthMethods<_>() {
  return signalStoreFeature(
    { state: type<AuthState>() },
    withMethods(
      (
        store,
        resetService = inject(ResetService),
        registerService = inject(RegisterService),
        signInService = inject(SignInService),

        dialog = inject(DialogService)
      ) => ({
        signIn: signIn(signInService, store, AuthEvent.LOGIN),
        register: register(registerService, store, AuthEvent.REGISTER),

        confirmPasswordReset: confirmPasswordReset(
          store,
          AuthEvent.RESET,
          resetService,
          dialog
        ),
        // loadUserById: loadUserById(userService, store, AuthEvent.LOGIN),
      })
    ),
    withMethods((store, service = inject(LoginService)) => ({
      login(): void {
        service.onLogin(store.user());
      },
      logout(): void {
        patchState(store, initialState);
        service.onLogout();
      },
    }))
  );
}
