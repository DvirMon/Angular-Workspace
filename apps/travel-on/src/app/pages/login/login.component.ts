import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  InjectionToken,
  Injector,
  Provider,
  runInInjectionContext,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CardButtonComponent } from '@dom/components/card-button';
import { FormServerError } from '@dom/components/form/types';
import { Observable, Unsubscribable } from 'rxjs';
import { LoginFormComponent, SignInEvent } from '../../auth';
import { AuthStore } from '../../auth/store/store';

interface LoginStore {
  isLoaded: Signal<boolean>;
  loginError: Signal<FormServerError | undefined>;
  signIn: (
    input: SignInEvent | Observable<SignInEvent> | Signal<SignInEvent>
  ) => Unsubscribable;
  login: () => void;
}

const LOGIN_STORE = new InjectionToken<LoginStore>('LOGIN_STORE');

function provideLoginStore(): Provider {
  return { provide: LOGIN_STORE, useExisting: AuthStore };
}

@Component({
  selector: 'to-login-page',
  standalone: true,
  imports: [LoginFormComponent, CardButtonComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideLoginStore()],
})
export class LoginPageComponent {
  #injector = inject(Injector);
  #authStore = inject(LOGIN_STORE);

  showOtp = signal(false);
  serverError = this.#authStore.loginError;

  constructor() {
    this.showOtp = signal(false);
    this.serverError = this.#authStore.loginError;

    effect(() => {
      if (this.#authStore.isLoaded()) {
        this.#authStore.login();
      }
    });
  }

  public onSignIn(event: SignInEvent) {
    this.#authStore.signIn(event);
  }

  public onForgetPassword() {
    runInInjectionContext(this.#injector || inject(Injector), () => {
      inject(Router).navigateByUrl('reset');
    });
  }
}
