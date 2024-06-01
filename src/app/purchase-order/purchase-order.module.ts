import { NgModule } from '@angular/core';
import { PurchaseOrderRoutingModule } from './purchase-order.routing';
import { PurchaseOrderComponent } from './purchase-order.component';
import { viewPoComponent } from './view-po/view-po.component';
import { FileUploadModule } from 'ng2-file-upload';
import {SharedModule} from '../shared/shared.module';
import {FilterComponent} from "../dialog/filter/filter.component";
import { CreatePoComponent } from './create-po/create-po.component';
import {PurchaseOrderService} from './purchase-order.service';
import { PrintPoComponent } from './print-po/print-po.component';
import { FilterPoComponent } from './filter-po/filter-po.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { DraftPoComponent } from './draft-po/draft-po.component';
import { ViewDraftPoComponent } from './view-draft-po/view-draft-po.component';
// import { PrintBarcodeComponent } from '../products/products/print-barcode/print-barcode.component';
import { ProductService } from '../products/product.service';
import { CreateProductComponent } from './create-product/create-product.component';


@NgModule({
    imports: [
        PurchaseOrderRoutingModule,
        FileUploadModule,
        SharedModule,
        NgxDaterangepickerMd.forRoot({
            applyLabel: 'ok',
            separator: ' To '
        })
    ],
    declarations: [
        PurchaseOrderComponent,
        viewPoComponent,
        FilterComponent,
        CreatePoComponent,
        PrintPoComponent,
        FilterPoComponent,
        DraftPoComponent,
        ViewDraftPoComponent,
        CreateProductComponent,
        // PrintBarcodeComponent
    ],
    providers: [
        PurchaseOrderService,
        ProductService
    ]
})
export class PurchaseOrderModule {
}
