import { DiscountComponent } from './discount.component';
import { viewDiscountComponent } from './view-discount/view-discount.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateDiscountComponent } from './create-discount/create-discount.component';
import { CanDeactivateGuard } from '../shared/guard/can-deactivate.guard';

const routes: Routes = [
    { path: '', component: DiscountComponent, },
    {
        path: 'discounts',
        component: DiscountComponent,
        data: { title: 'View Discount Order', breadcrumb: { name: 'view Discount Order', url: "po-list" } }
    },
    {
        path: ':id/view',
        component: viewDiscountComponent,
        canDeactivate: [CanDeactivateGuard],
        data: { title: 'View Discount Order', breadcrumb: { name: 'view Discount Order', url: "po-list/:id/view" } }
    },
    {
        path: 'create',
        component: CreateDiscountComponent,
        canDeactivate: [CanDeactivateGuard],
        data: { title: 'Receive Discount Order', breadcrumb: { name: 'Create Discount Order', url: "po-list/create" } }
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PurchaseOrderRoutingModule { }
