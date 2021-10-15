import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CustomerComponent} from './customer.component';
import {AddCustomerComponent} from './add-customer/add-customer.component';
import { CanDeactivateGuard } from '../shared/guard/can-deactivate.guard';
const routes: Routes = 
[
    {path: '',component: CustomerComponent,data: { title: 'Customer' }},
    {
      path: 'create',
      component: AddCustomerComponent,
    //  canActivate: [AuthGuardService],
      canDeactivate: [CanDeactivateGuard],
      data: { title: 'Create Customer', breadcrumb: {name:'Create Customer',url:"create"} }
   }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class CustomerRoutingModule { }
