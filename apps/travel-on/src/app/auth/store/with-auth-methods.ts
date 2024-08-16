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
  loadUserById,
  register,
  signIn
} from './store.helpers';

export function withAuthMethods<_>() {
  return signalStoreFeature(
    { state: type<AuthState>() },
    withMethods(
      (
        store,
        resetService = inject(ResetService),
        registerService = inject(RegisterService),
        loginService = inject(LoginService),

        userService = inject(UserService),

        dialog = inject(DialogService)
      ) => ({
        signIn: signIn(loginService, store, AuthEvent.LOGIN),
        register: register(registerService, store, AuthEvent.REGISTER),
  
        confirmPasswordReset: confirmPasswordReset(
          store,
          AuthEvent.RESET,
          resetService,
          dialog
        ),
        loadUserById: loadUserById(userService, store, AuthEvent.LOGIN),
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
