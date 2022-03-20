import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-home',
  styles: [`
    div[fxLayout] {margin-top: 32px;}
  `],
  template: `
    <div *ngIf="displayLogin">
      <app-login></app-login>
    </div>
    <div *ngIf="!displayLogin">
        <span class="mat-display-3">You get a lemon...</span>
    </div>
    <!--<div fxLayout="column" fxLayoutAlign="center center">
      <span class="mat-display-2">Hello, Lemonite!</span>
      <button mat-raised-button color="primary">Login</button>
      <button mat-raised-button color="primary" routerLink="/manager">Login as Manager</button>
    </div>-->
  `
})
export class HomeComponent implements OnInit {

  displayLogin = true;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.authStatus
      .subscribe(authStatus => this.displayLogin = !authStatus.isAuthenticated);
  }

  /*get displayLogin() {
    return this._displayLogin;
  }*/

}
