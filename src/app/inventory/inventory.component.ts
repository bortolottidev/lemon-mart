import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inventory',
  template: `
    <mat-toolbar color="accent">
      <a mat-button routerLink="/inventory/dashboard" routerLinkActive="active-link">
        Inventory Dashboard
      </a>
      <a mat-button routerLink="/inventory/stock-entry" routerLinkActive="active-link">
        Stock Entry
      </a>
      <a mat-button routerLink="/inventory/product" routerLinkActive="active-link">
        Products
      </a>
      <a mat-button routerLink="/inventory/category" routerLinkActive="active-link">
        Categories
      </a>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: [
    `div[fxLayout] { margin-top: 32px; }`,
    `.active-link {
      font-weight: bold;
      border-bottom: 2px solid #005005;
    }`
  ]
})
export class InventoryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
