import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProductsComponent } from './products/products.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { ProductsVariantsComponent } from './products-variants/products-variants.component';
import { ViewProductComponent } from './products/view-product/view-product.component';
import { ReconsileInventoryComponent } from './reconsile-inventory/reconsile-inventory.component';
import { CanDeactivateGuard } from '../shared/guard/can-deactivate.guard';

const routes: Routes =
    [
        {
            path: 'allproducts',
            component: ProductsComponent,
            data: { title: 'Products', breadcrumb: { name: 'ALL PRODUCTS', url: "allproducts" } },
        },
        {
            path: 'reconcile',
            component: ReconsileInventoryComponent,
            canDeactivate: [CanDeactivateGuard],
            data: { title: 'Reconcile Inventory', breadcrumb: { name: 'Reconcile', url: "reconcile" } },
        },
        {
            path: 'create',
            component: AddProductComponent,
            canDeactivate: [CanDeactivateGuard],
            data: { title: 'Create Product', breadcrumb: { name: 'Create Inventory Product', url: "create" } }
        },
        {
            path: ':id/view',
            component: ViewProductComponent,
            data: { title: 'View Product', breadcrumb: { name: 'View Inventory Product', url: "view" } }
        },
        {
            path: 'stock',
            loadChildren: () => import('./stock/stock.module').then(m => m.StockModule),
            data: { title: 'Stock', breadcrumb: { name: 'Stock', url: "stock" } }
        },
        {
            path: ':product_id/variants/:variant_id/view',
            component: ProductsVariantsComponent,
            data: { title: 'Variants', breadcrumb: { name: 'Variants', url: "variants" } }
        }
    ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductsRoutingModule { }
