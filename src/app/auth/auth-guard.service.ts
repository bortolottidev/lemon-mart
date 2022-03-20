import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route, Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService, IAuthStatus} from './auth.service';
import {UiService} from '../common/ui.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild, CanLoad {
  protected currentAuthStatus: IAuthStatus;

  constructor(protected authService: AuthService, protected router: Router, private uiService: UiService) {
    this.authService.authStatus.subscribe(
      authStatus => this.currentAuthStatus = authStatus
    );
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkLogin(route);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkLogin(childRoute);
  }

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    return this.checkLogin();
  }

  protected checkLogin(route?: ActivatedRouteSnapshot): boolean {
    let roleMatch = true;
    let params: any;

    if (route) {
      const expectedRole = route.data.expectedRole;

      if (expectedRole) {
        roleMatch = this.currentAuthStatus.userRole === expectedRole;
      }

      if (roleMatch) {
        params = { redirectUrl: route.pathFromRoot.map(({ url }) => url).join('/') };
      }
    }

    if (!this.currentAuthStatus.isAuthenticated || !roleMatch) {
      this.showAlert(this.currentAuthStatus.isAuthenticated, roleMatch);
      this.router.navigate(['login', params || {}]);
      return false;
    }

    return true;
  }

  private showAlert(isAuth: boolean, roleMatch: boolean): void {
    if (!isAuth) {
      this.uiService.showToast('You must login to continue');
    }

    if (!roleMatch) {
      this.uiService.showToast('You do not have the permissions to view this resource');
    }
  }
}
