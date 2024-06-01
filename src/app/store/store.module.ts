import {NgModule} from '@angular/core'
import {StoreComponent} from './store.component'
import {SharedModule} from '../shared/shared.module'
import {StoreService} from './store.service'
import {StoreRoutingModule} from './store.routing';
import { StoreAddComponent } from './store-add/store-add.component';
import { StoreViewComponent } from './store-view/store-view.component';

import {LicenseComponent} from "../dialog/license/license.component";
import {TillComponent} from "../dialog/till/till.component";
import {WarehouseComponent} from "../dialog/warehouse/warehouse.component";
import { FileUploadModule } from 'ng2-file-upload';

import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { WarehouseModalComponent } from './warehouse-modal/warehouse-modal.component';

@NgModule({
    imports: [SharedModule, StoreRoutingModule, FileUploadModule, NgxMaterialTimepickerModule],
    declarations: [StoreComponent, StoreAddComponent, StoreViewComponent, LicenseComponent, WarehouseComponent, TillComponent, WarehouseModalComponent],
    providers: [StoreService]
})

export class StoreModule{}