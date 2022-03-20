import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MaterialModule} from '../material.module';
import {InventoryComponent} from './inventory.component';
import {InventoryDashboardComponent} from './dashboard/inventory-dashboard.component';
import {ProductComponent} from './product/product.component';
import {CategoryComponent} from './category/category.component';
import {StockEntryComponent} from './stock-entry/stock-entry.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryComponent,
    children: [
      {
        path: '',
        redirectTo: '/inventory/dashboard',
        pathMatch: 'full',
      },
      { path: 'dashboard', component: InventoryDashboardComponent },
      { path: 'product', component: ProductComponent },
      { path: 'category', component: CategoryComponent },
      { path: 'stock-entry', component: StockEntryComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), MaterialModule],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
