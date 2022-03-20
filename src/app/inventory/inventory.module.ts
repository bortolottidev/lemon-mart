import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './inventory.component';
import { InventoryDashboardComponent } from './dashboard/inventory-dashboard.component';
import { StockEntryComponent } from './stock-entry/stock-entry.component';
import { ProductComponent } from './product/product.component';
import { CategoryComponent } from './category/category.component';
import {MaterialModule} from '../material.module';


@NgModule({
  declarations: [InventoryComponent, InventoryDashboardComponent, StockEntryComponent, ProductComponent, CategoryComponent],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    MaterialModule
  ]
})
export class InventoryModule { }
