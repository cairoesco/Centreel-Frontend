import { SettingsComponent } from './settings.component';
import { SettingsRoutes } from './settings.routing';
import { SharedModule } from '../shared/shared.module'
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { QuillModule } from 'ngx-quill';
import { AgreementComponent } from './agreement/agreement.component';
import { ProvincetaxComponent } from './provincetax/provincetax.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { SmtpSettingComponent } from './smtp-setting/smtp-setting.component';
import { RolesComponent } from './roles/roles.component';
import { RoleEditComponent } from './roles/role-edit/role-edit.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { PermissionAddComponent } from './permissions/permission-add/permission-add.component';
import { PermissionEditComponent } from './permissions/permission-edit/permission-edit.component';
import { ProvinceSettingsComponent } from './province-settings/province-settings.component';
import { ChainSettingsComponent } from './chain-settings/chain-settings.component';
import { SettingsService } from './settings.service';
import { StoreSettingComponent } from './store-setting/store-setting.component';
import { EmailSettingComponent } from './email-setting/email-setting.component';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(SettingsRoutes),
        FormsModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        NgxDatatableModule,
        QuillModule.forRoot(),
    ],
    declarations: [
        AgreementComponent,
        ProvincetaxComponent,
        WarehouseComponent,
        SettingsComponent,
        SmtpSettingComponent,
        RolesComponent,
        RoleEditComponent,
        PermissionsComponent,
        PermissionAddComponent,
        PermissionEditComponent,
        ProvinceSettingsComponent,
        ChainSettingsComponent,
        StoreSettingComponent,
        EmailSettingComponent
    ],
    providers: [SettingsService]
})
export class SettingsModule {
}
