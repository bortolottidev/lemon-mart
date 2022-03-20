import {Injectable} from '@angular/core';
import {IUsers, IUserService} from './user.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {IUser, User} from '../user';


@Injectable()
export class UserServiceFake implements IUserService {
  currentUser = new BehaviorSubject<IUser>(new User());

  getCurrentUser(): Observable<IUser> {
    return of(new User());
  }

  getUser(id): Observable<IUser> {
    return of(new User(id));
  }

  getUsers(pageSize: number, searchText: string, pageToSkip: number): Observable<IUsers> {
    return of({
      total: 1,
      items: [new User()]
    } as IUsers);
  }

  updateUser(user: IUser): Observable<IUser> {
    return of(user);
  }

}
