import { Injectable } from '@angular/core';

import decode from 'jwt-decode';

import {Role} from './role.enum';
import {BehaviorSubject, Observable, of, throwError as observableThrowError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {sign} from 'fake-jwt-sign';

import { transformError } from '../common/common';
import {catchError, map} from 'rxjs/operators';
import {CacheService} from './cache.service';

export interface IAuthService {
  authStatus: BehaviorSubject<IAuthStatus>;
  login(email: string, password: string): Observable<IAuthStatus>;
  logout(): void;
  getToken(): string;
}

export interface IAuthStatus {
  isAuthenticated: boolean;
  userRole: Role;
  userId: string;
}

interface IServerAuthRespose {
  accessToken: string;
}

export const defaultAuthStatus: IAuthStatus = {
  isAuthenticated: false,
  userRole: Role.None,
  userId: null
};

@Injectable({
  providedIn: 'root'
})
export class AuthService extends CacheService implements IAuthService {
  private readonly authProvider: (
    email: string,
    password: string,
  ) => Observable<IServerAuthRespose>;

  authStatus = new BehaviorSubject<IAuthStatus>(
    this.getItem('authStatus') || defaultAuthStatus
  );

  constructor(private httpClient: HttpClient) {
    super();
    this.authStatus.subscribe(authStatus => this.setItem('authStatus', authStatus));
    this.authProvider = this.fakeAuthProvider;
  }

  private setToken(jwt: string): void {
    this.setItem('jwt', jwt);
  }

  getToken(): string {
    return this.getItem('jwt') || '';
  }

  private getDecodedToken(): IAuthStatus {
    return decode(this.getItem('jwt'));
  }

  private clearToken(): void {
    this.removeItem('jwt');
  }

  private fakeAuthProvider (
    email: string,
    password: string,
  ): Observable<IServerAuthRespose> {
    if (!email.toLowerCase().endsWith('@test.com')) {
      return observableThrowError('Failed to login! Email needs to end with @test.com');
    }

    const userRole = email.toLowerCase().includes('cashier') ? Role.Cashier
        : email.toLowerCase().includes('clerk') ? Role.Clerk
        : email.toLowerCase().includes('manager') ? Role.Manager : Role.None;
    const authStatus: IAuthStatus = {
      isAuthenticated: true,
      userId: 'e423432432',
      userRole,
    };

    const authResponse: IServerAuthRespose = {
      accessToken: sign(authStatus, 'secret', { expiresIn: '1h', algorithm: 'none' })
    };

    return of(authResponse);
  }

  login(email: string, password: string): Observable<IAuthStatus> {
    this.logout();

    const loginResponse = this.authProvider(email, password).pipe(
      map(value => {
        this.setToken(value.accessToken);
        return decode(value.accessToken) as IAuthStatus;
      }),
      catchError(transformError),
    );

    loginResponse.subscribe(res => this.authStatus.next(res), err => {
      this.logout();
      return observableThrowError(err);
    });

    return loginResponse;
  }

  logout(): void {
    this.clearToken();
    this.authStatus.next(defaultAuthStatus);
  }
}
