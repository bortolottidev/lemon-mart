import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';
import {AuthService} from './auth/auth.service';
import { MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" fxLayoutGap="8px" class=app-toolbar
        [class.app-is-mobile]="media.isActive('xs')"
      >
        <button *ngIf="displayAccountIcons" mat-icon-button (click)="sidenav.toggle()"><mat-icon>menu</mat-icon></button>
        <a mat-button routerLink="/home">
          <mat-icon svgIcon="lemon"></mat-icon>
          <span class="mat-h2" style="padding-left: 8px">LemonMart</span>
        </a>
        <span class="flex-spacer"></span>
        <button *ngIf="displayAccountIcons"
          mat-mini-fab
          routerLink="/user/profile"
          matTooltip="Profile"
          aria-label="User Profile"
        >
          <mat-icon>account_circle</mat-icon>
        </button>
        <button *ngIf="displayAccountIcons"
          mat-mini-fab
          routerLink="/user/logout"
          matTooltip="Logout"
          aria-label="Logout"
        >
          <mat-icon>lock_open</mat-icon>
        </button>
      </mat-toolbar>
      <mat-sidenav-container class="app-sidenav-container"
        [style.marginTop.px]="media.isActive('xs') ? 56 : 0"
      >
        <mat-sidenav #sidenav
          [mode]="media.isActive('xs')?'over':'side'"
          [fixedInViewport]="media.isActive('xs')"
          fixedTopGap="56"
        >
          <app-navigation-menu></app-navigation-menu>
        </mat-sidenav>
        <mat-sidenav-content>
          <router-outlet class="app-container"></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [
    `
      mat-sidenav-content {
        min-height: 500px;
      }

      .app-container {
        display: flex;
        flex-direction: column;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
      .app-is-mobile .app-toolbar {
        position: fixed;
        z-index: 2;
      }
      .app-sidenav-container {
        flex: 1;
      }
      .app-is-mobile .app-sidenav-container {
        flex: 1 0 auto;
      }
      mat-sidenav {
        width: 200px;
      }
    `
  ]
})
export class AppComponent implements OnInit {

  displayAccountIcons = false;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private authService: AuthService,
    public media: MediaObserver,
  ) {
    iconRegistry.addSvgIcon('lemon', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/lemon.svg'));
  }

  ngOnInit(): void {
    this.authService.authStatus
      .subscribe(authStatus =>
        setTimeout(() => this.displayAccountIcons = authStatus.isAuthenticated, 0)
      );
  }

}
