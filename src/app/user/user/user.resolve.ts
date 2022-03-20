import {Injectable} from '@angular/core';
import {UserService} from './user.service';
import {IUser} from '../user';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';

export const USER_ID_PARAM = 'userId';

@Injectable()
export class UserResolve implements Resolve<IUser> {
  constructor(private userService: UserService){}

  resolve(route: ActivatedRouteSnapshot): Observable<IUser> {
    return this.userService.getUser(route.paramMap.get(USER_ID_PARAM));
  }
}
