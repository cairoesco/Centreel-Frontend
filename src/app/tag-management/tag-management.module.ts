import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { TagManagementRoutingModule } from './tag-management-routing.module';
import { TagManagementComponent } from './tag-management.component';
import { TagManagementFilterDialogComponent } from './tag-management-filter-dialog/tag-management-filter-dialog.component';
import { TagManagementService } from './tag-management.service'
import { SharedModule } from '../shared/shared.module';
// import { PreferredProductDialogComponent } from './preferred-product-dialog/preferred-product-dialog.component'
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { AddTagManagementComponent } from './add-tag-management/add-tag-management.component';
import { EditTagManagementComponent } from './edit-tag-management/edit-tag-management.component';


@NgModule({
    declarations: [
        TagManagementComponent,
        AddTagManagementComponent,
        EditTagManagementComponent,
        TagManagementFilterDialogComponent,
        //  AutocompleteLibModule,
        // PreferredProductDialogComponent
    ],
    imports: [SharedModule,
        CommonModule,
        TagManagementRoutingModule,
        AutocompleteLibModule,
        NgxDaterangepickerMd.forRoot({
            applyLabel: 'ok',
            separator: ' To '
        })
    ],
    providers: [TagManagementService]
})
export class TagManagementModule { }
