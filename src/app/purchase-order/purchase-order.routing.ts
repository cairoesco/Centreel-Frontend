import { PurchaseOrderComponent } from './purchase-order.component';
import { viewPoComponent } from './view-po/view-po.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePoComponent } from './create-po/create-po.component';
import { PrintPoComponent } from './print-po/print-po.component'
import { CanDeactivateGuard } from '../shared/guard/can-deactivate.guard';
import { DraftPoComponent } from './draft-po/draft-po.component';
import { ViewDraftPoComponent } from './view-draft-po/view-draft-po.component';

const routes: Routes = [
    { path: '', component: PurchaseOrderComponent, },
    {
        path: 'po-list',
        component: PurchaseOrderComponent,
        data: { title: 'View Purchase Order', breadcrumb: { name: 'view Purchase Order', url: "po-list" } }
    },
    {
        path: 'po-list/:id/view',
        component: viewPoComponent,
        canDeactivate: [CanDeactivateGuard],
        data: { title: 'View Purchase Order', breadcrumb: { name: 'view Purchase Order', url: "po-list/:id/view" } }
    },
    {
        path: 'po-list/create',
        component: CreatePoComponent,
        canDeactivate: [CanDeactivateGuard],
        data: { title: 'Receive Purchase Order', breadcrumb: { name: 'Create Purchase Order', url: "po-list/create" } }
    },
    {
        path: 'po-list/:id/print',
        component: PrintPoComponent,
        data: { title: 'Print Purchase Order', breadcrumb: { name: 'print Purchase Order', url: "po-list/:id/print" } }
    },
    {
        path: 'po-draft',
        component: DraftPoComponent,
        data: { title: 'Print Purchase Order', breadcrumb: { name: 'print Purchase Order', url: "po-draft" } }
    },
    {
        path: 'po-draft/:id/view',
        component: ViewDraftPoComponent,
        canDeactivate: [CanDeactivateGuard],
        data: { title: 'View Purchase Order', breadcrumb: { name: 'view Purchase Order', url: "po-draft/:id/view" } }
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PurchaseOrderRoutingModule { }
