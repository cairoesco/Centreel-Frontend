import { NgModule } from '@angular/core';
import { UserComponent } from './user.component';
import { AddUserComponent } from "./add-user/add-user.component";
import { EditUserComponent } from "./edit-user/edit-user.component";
import { SharedModule } from '../shared/shared.module'
import { UserRoutingModule } from './user.routing'
import { UserService } from './user.service'
import { FileUploadModule } from 'ng2-file-upload';
import { UserFilterDialogComponent } from './user-filter-dialog/user-filter-dialog.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
    imports: [SharedModule, UserRoutingModule, FileUploadModule],
    declarations: [UserComponent, AddUserComponent, EditUserComponent, UserFilterDialogComponent, ChangePasswordComponent],
    providers: [UserService]
})
export class UserModule { }
