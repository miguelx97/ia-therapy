import { inject, Injectable } from '@angular/core';
import { Auth, getAuth, signInAnonymously, User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthtService {
  private auth = inject(Auth);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Listen to auth state changes
    this.auth.onAuthStateChanged(user => {
      this.currentUserSubject.next(user);
    });
  }

  async ensureAnonymousAuth(): Promise<User> {
    const currentUser = this.auth.currentUser;

    if (currentUser) {
      return currentUser;
    }

    try {
      const credential = await signInAnonymously(this.auth);
      return credential.user;
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      throw error;
    }
  }
}
