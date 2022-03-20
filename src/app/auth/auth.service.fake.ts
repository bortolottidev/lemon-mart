import {Injectable} from '@angular/core';
import {defaultAuthStatus, IAuthService, IAuthStatus} from './auth.service';
import {BehaviorSubject, Observable, of} from 'rxjs';

@Injectable()
export class AuthServiceFake implements IAuthService {
  authStatus = new BehaviorSubject<IAuthStatus>(defaultAuthStatus);

  getToken(): string {
    return '';
  }

  login(email: string, password: string): Observable<IAuthStatus> {
    return of(defaultAuthStatus);
  }

  logout(): void {}

}
