import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products.routing';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../shared/shared.module'
import { ProductsComponent } from './products/products.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { ProductsVariantsComponent } from './products-variants/products-variants.component';
import { ViewProductComponent } from './products/view-product/view-product.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ProductService } from './product.service';
import { Ng5SliderModule } from 'ng5-slider';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import { InventoryModalComponent } from './products/inventory-modal/inventory-modal.component';
import { DefaultProductSearchComponent } from './products/default-product-search/default-product-search.component';
import { SupplierDialogComponent } from './products/supplier-dialog/supplier-dialog.component';
import { ConfirmationDialogComponent } from './products/confirmation-dialog/confirmation-dialog.component';
import { ReconsileInventoryComponent } from './reconsile-inventory/reconsile-inventory.component';
import { HotTableModule } from '@handsontable/angular';
import { FilterReconcileDialogComponent } from './reconsile-inventory/filter-dialog/filter-dialog.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
// import { PrintBarcodeComponent } from './products/print-barcode/print-barcode.component';
// import { TdFileService, IUploadOptions } from '@covalent/core/file';
@NgModule({
    imports: [
        CommonModule,
        ProductsRoutingModule,
        NgxDatatableModule,
        SharedModule,
        Ng5SliderModule,
        FileUploadModule,
        HotTableModule,
        NgxDaterangepickerMd.forRoot({
            applyLabel: 'ok',
            separator: ' To '
        })
    ],

    declarations: [
        ProductsComponent,
        AddProductComponent,
        ProductsVariantsComponent,
        ViewProductComponent,
        FilterDialogComponent,
        InventoryModalComponent,
        DefaultProductSearchComponent,
        SupplierDialogComponent,
        ConfirmationDialogComponent,
        ReconsileInventoryComponent,
        FilterReconcileDialogComponent,
        // PrintBarcodeComponent
    ],
    providers: [ProductService],
    entryComponents: [FilterDialogComponent, InventoryModalComponent, DefaultProductSearchComponent, SupplierDialogComponent, ConfirmationDialogComponent,FilterReconcileDialogComponent]
})
export class ProductsModule {
}
