import { Injectable } from '@angular/core';
import {
  CollectionReference,
  Firestore,
  QuerySnapshot,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { mapQuerySnapshotDoc } from '../../shared/helpers';
import { User } from './auth.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly USERS_COLLECTION = 'users';
  private readonly usersRef: CollectionReference<User>;

  constructor(private readonly firestore: Firestore) {
    this.usersRef = collection(
      this.firestore,
      this.USERS_COLLECTION
    ) as CollectionReference<User>;
  }

  public getUserById(userId: string): Observable<User> {
    const querySnapshot$ = this._getUserQuerySnapshot$('userId', userId);
    return querySnapshot$.pipe(mapQuerySnapshotDoc<User>());
  }

  public loadUserById$(userId: string): Observable<User> {
    const querySnapshot$ = this._getUserQuerySnapshot$('userId', userId);
    return querySnapshot$.pipe(mapQuerySnapshotDoc<User>());
  }

  public saveUser(user: User): void {
    from(addDoc(this.usersRef, user));
  }

  public addUser(user: User): Observable<User> {
    return this._checkDocumentExists(user.userId).pipe(
      switchMap((empty: boolean) => {
        if (empty) {
          return from(addDoc(this.usersRef, user)).pipe(
            map(() => user) // Return the user after successful addition
          );
        } else {
          return of(user);
        }
      })
    );
  }

  private _checkDocumentExists(userId: string): Observable<boolean> {
    const querySnapshot$ = this._getUserQuerySnapshot$('userId', userId);
    return querySnapshot$.pipe(map((querySnapshot) => querySnapshot.empty));
  }

  private _getUserQuerySnapshot$(
    getBy: keyof User,
    value: string
  ): Observable<QuerySnapshot<User>> {
    return from(getDocs(query(this.usersRef, where(getBy, '==', value))));
  }
}
