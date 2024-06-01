import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './src/app/products/products.routing';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from './src/app/shared/shared.module'
import { ProductsComponent } from './src/app/products/products/products.component';
import { AddProductComponent } from './src/app/products/products/add-product/add-product.component';
import { ProductsVariantsComponent } from './src/app/products/products-variants/products-variants.component';
import { ViewProductComponent } from './src/app/products/products/view-product/view-product.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ProductService } from './src/app/products/product.service';
import { Ng5SliderModule } from 'ng5-slider';
import { FilterDialogComponent } from './src/app/products/filter-dialog/filter-dialog.component';
import { InventoryModalComponent } from './src/app/products/products/inventory-modal/inventory-modal.component';
import { DefaultProductSearchComponent } from './src/app/products/products/default-product-search/default-product-search.component';
import { SupplierDialogComponent } from './src/app/products/products/supplier-dialog/supplier-dialog.component';
import { ConfirmationDialogComponent } from './src/app/products/products/confirmation-dialog/confirmation-dialog.component';
import { ReconsileInventoryComponent } from './src/app/products/reconsile-inventory/reconsile-inventory.component';
import { HotTableModule } from '@handsontable/angular';
import { FilterReconcileDialogComponent } from './src/app/products/reconsile-inventory/filter-dialog/filter-dialog.component';
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
    providers: [ProductService]
})
export class ProductsModule {
}
