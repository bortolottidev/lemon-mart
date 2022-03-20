import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerHomeComponent } from './manager-home/manager-home.component';
import { ManagerComponent } from './manager.component';
import { MaterialModule } from '../material.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { ReceiptLookupComponent } from './receipt-lookup/receipt-lookup.component';
import { FlexModule } from '@angular/flex-layout';
import {SharedComponentsModule} from '../shared-components/shared-components.module';
import { UserTableComponent } from './user-table/user-table.component';
import {UserResolve} from '../user/user/user.resolve';
import {ManagerMaterialModule} from './manager-material.module';


@NgModule({
  declarations: [ManagerHomeComponent, ManagerComponent, UserManagementComponent, ReceiptLookupComponent, UserTableComponent],
  imports: [
    CommonModule,
    ManagerRoutingModule,
    MaterialModule,
    FlexModule,
    SharedComponentsModule,
    ManagerMaterialModule
  ],
  providers: [
    UserResolve,
  ]
})
export class ManagerModule { }
