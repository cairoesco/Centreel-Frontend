import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscountComponent } from './discount.component';

// import { AddDiscountComponent } from "./add-discount/add-discount.component";
// import { EditDiscountComponent} from "./edit-discount/edit-discount.component";

import { AuthGuardService } from '../session/authguard.service';
import { CanDeactivateGuard } from '../shared/guard/can-deactivate.guard';

const routes: Routes = 
[
    {path: '',component: DiscountComponent ,data: { title: 'Discount' }},
    // {
    //    path: 'create',
    //    component: AddDiscountComponent,
    //    canActivate: [AuthGuardService],
    //    canDeactivate: [CanDeactivateGuard],
    //    data: { title: 'Create Discount', breadcrumb: {name:'Create Discount',url:"create"} }
    // }, 
    // {
    //   path: ':id/view',component: EditDiscountComponent,
    //   canActivate: [AuthGuardService],
    //   data: { title: 'View Discount', breadcrumb: {name:'View Discount',url:":id/view"} }
    // }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class DiscountRoutingModule { }
