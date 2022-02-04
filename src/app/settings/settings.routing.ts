import { SettingsComponent } from './settings.component';
import { SmtpSettingComponent } from './smtp-setting/smtp-setting.component';
import { Routes } from '@angular/router';
import { ProvincetaxComponent } from './provincetax/provincetax.component';
import { RolesComponent } from './roles/roles.component';
import { RoleEditComponent } from './roles/role-edit/role-edit.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { PermissionAddComponent } from './permissions/permission-add/permission-add.component';
import { PermissionEditComponent } from './permissions/permission-edit/permission-edit.component';
import { AgreementComponent } from './agreement/agreement.component';
import { ProvinceSettingsComponent } from './province-settings/province-settings.component';
import { ChainSettingsComponent } from './chain-settings/chain-settings.component';
import { StoreSettingComponent } from './store-setting/store-setting.component';

export const SettingsRoutes: Routes = [
  { path: '', component: SettingsComponent, data: { title: 'Settings' } },
  { path: 'email-settings', component: SmtpSettingComponent, data: { title: 'Email Settings' } },
  { path: 'provincetax', component: ProvincetaxComponent, data: { title: 'Province-tax Settings' } },
  { path: 'roles', component: RolesComponent, data: { title: 'Roles' } },

  {
    path: 'roles/:id/edit',
    component: RoleEditComponent,
    data: { title: 'View Role' }
  },
  { path: 'permissions', component: PermissionsComponent, data: { title: 'Permissions' } },
  {
    path: 'permissions/create',
    component: PermissionAddComponent,
    data: { title: 'Create Permission' }
  },
  {
    path: 'permissions/:id/edit',
    component: PermissionEditComponent,
    data: { title: 'View Permission' }
  },
  {
    path: 'agreement',
    component: AgreementComponent,
    data: { title: 'Agreement', breadcrumb: { name: 'Agreement', url: "agreement" } }
  },
  {
    path: 'province',
    component: ProvinceSettingsComponent,
    data: { title: 'Province', breadcrumb: { name: 'Province', url: "Province" } }
  },
  {
    path: 'setting',
    component: ProvinceSettingsComponent,
    data: { title: 'setting', breadcrumb: { name: 'Province', url: "Province" } }
  },
  {
    path: 'chain-settings',
    component: ChainSettingsComponent,
    data: { title: 'Chain Settings', breadcrumb: { name: 'Chain Settings', url: "chain-settings" } }
  },
  {
    path: 'store-settings',
    component: StoreSettingComponent,
    data: { title: 'Store Settings', breadcrumb: { name: 'Store Settings', url: "store-settings" } }
  }
];
