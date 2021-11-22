import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TagManagementComponent } from './tag-management.component';
import { AddTagManagementComponent } from './add-tag-management/add-tag-management.component'
import { EditTagManagementComponent } from './edit-tag-management/edit-tag-management.component'
import { CanDeactivateGuard } from '../shared/guard/can-deactivate.guard';

const routes: Routes = 
[
    { path: '', component: TagManagementComponent, data: { title: 'Tag Management' }},
  //   {
  //     path: 'create',
  //     component: AddCustomerComponent,
  //     canDeactivate: [CanDeactivateGuard],
  //     data: { title: 'Create Customer', breadcrumb: {name:'Create Customer',url:"create"} }
  //  }, 
   {
    path: ':id/view', component: EditTagManagementComponent,
   // canActivate: [AuthGuardService],
    data: { title: 'View Customer', breadcrumb: {name:'View Customer',url:":id/view"} }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class TagManagementRoutingModule { }
