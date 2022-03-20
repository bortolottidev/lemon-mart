import {Injectable} from '@angular/core';
import {CacheService} from '../../auth/cache.service';
import {BehaviorSubject, Observable, throwError } from 'rxjs';
import {IUser, User} from '../user';
import {AuthService, IAuthStatus} from '../../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {catchError} from 'rxjs/operators';
import {transformError} from '../../common/common';

const USER_KEY = 'user';

export interface IUsers {
  items: IUser[];
  total: number;
}

export interface IUserService {
  currentUser: BehaviorSubject<IUser>;
  getCurrentUser(): Observable<IUser>;
  getUser(id): Observable<IUser>;
  updateUser(user: IUser): Observable<IUser>;
  getUsers(pageSize: number, searchText: string, pageToSkip: number): Observable<IUsers>;
}

@Injectable({
  providedIn: 'root'
})
export class UserService extends CacheService implements IUserService {
  currentUser = new BehaviorSubject<IUser>(this.getItem(USER_KEY) || new User());

  private currentAuthStatus: IAuthStatus;

  constructor(private httpClient: HttpClient, private authService: AuthService) {
    super();
    this.currentUser.subscribe(user => this.setItem(USER_KEY, user));
    this.authService.authStatus.subscribe(authStatus => this.currentAuthStatus = authStatus);
  }

  getCurrentUser(): Observable<IUser> {
    const userObservable = this.getUser(this.currentAuthStatus.userId).pipe(
      catchError(transformError)
    );
    userObservable.subscribe(
      user => this.currentUser.next(user),
        err => throwError(err),
    );
    return userObservable;
  }

  getUser(id): Observable<IUser> {
    return this.httpClient.get<IUser>(`${environment.baseUrl}/v1/user/${id}`);
  }

  updateUser(user: IUser): Observable<IUser> {
    this.setItem('draft-user', user);
    const updateResponse = this.httpClient
      .put<IUser>(`${environment.baseUrl}/v1/user/${user.id || 0}`, user)
      .pipe(catchError(transformError));
    updateResponse.subscribe(res => {
      this.currentUser.next(res);
      this.removeItem('draft-user');
    }, err => throwError(err));
    return updateResponse;
  }

  getUsers(pageSize: number, searchText = '', pagesToSkip = 0): Observable<IUsers> {
    return this.httpClient.get<IUsers>(`${environment.baseUrl}/v1/users`, {
      params: {
        search: searchText,
        offset: pagesToSkip.toString(),
        limit: pageSize.toString(),
      }
    });
  }
}
