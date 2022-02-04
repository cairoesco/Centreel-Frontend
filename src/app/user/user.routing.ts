import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent} from './user.component';
import { AddUserComponent} from "./add-user/add-user.component";
import { EditUserComponent} from "./edit-user/edit-user.component";
import { AuthGuardService } from '../session/authguard.service';
import { CanDeactivateGuard } from '../shared/guard/can-deactivate.guard';

const routes: Routes = 
[
    {path: '',component: UserComponent,data: { title: 'Employee' }},
    {
       path: 'create',
       component: AddUserComponent,
     //  canActivate: [AuthGuardService],
       canDeactivate: [CanDeactivateGuard],
       data: { title: 'Create Employee', breadcrumb: {name:'Create Employee',url:"create"} }
    }, 
    {
      path: ':id/view',component: EditUserComponent,
     // canActivate: [AuthGuardService],
      data: { title: 'View Employee', breadcrumb: {name:'View Employee',url:":id/view"} }
    }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class UserRoutingModule { }
