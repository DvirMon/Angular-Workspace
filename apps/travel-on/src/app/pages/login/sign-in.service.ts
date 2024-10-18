import { inject, Injectable } from '@angular/core';
import { UserCredential } from '@angular/fire/auth';
import { Observable, of, switchMap } from 'rxjs';
import { FireAuthService, SignInEvent, SignInMethod, User } from '../../auth';
import { debugTap } from '../../shared/operators/debug';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from '../../shared/tokens';

interface EmailLinkData {
  email: string;
  emailLink: string;
}

interface EmailPasswordData {
  email: string;
  password: string;
}

type SignInStrategy = (data?: unknown) => Observable<UserCredential>;

@Injectable({
  providedIn: 'root',
})
export class SignInService {
  readonly #fireAuthService = inject(FireAuthService);

  readonly #signInStrategies: Map<SignInMethod, SignInStrategy> = new Map();

  readonly #http = inject(HttpClient);

  readonly #apiUrl = inject(API_URL);

  constructor() {
    this.#setSignInMap();
  }
  // Sign in with different authentication methods based on the provided event.
  public signIn$(event: SignInEvent): Observable<UserCredential> {
    const { method, data } = event;

    return of(method).pipe(
      switchMap((method: SignInMethod) => {
        const strategy = this.#signInStrategies.get(method);
        return strategy !== undefined
          ? strategy(data)
          : of({} as UserCredential);
      })
    );
  }
  public getUser(idToken: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${idToken}`,
    });

    return this.#http.get<User>(`${this.#apiUrl}/users/profile`, { headers });
  }

  #setSignInMap() {
    this.#signInStrategies.set(SignInMethod.GOOGLE, () =>
      this.#fireAuthService.signInWithGoogle$()
    );

    this.#signInStrategies.set(SignInMethod.EMAIL_PASSWORD, (data: unknown) => {
      const { email, password } = data as EmailPasswordData;
      return this.#fireAuthService.signInWithEmailAndPassword$(email, password);
    });
  }
}
