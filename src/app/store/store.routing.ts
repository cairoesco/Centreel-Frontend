import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router';

import { StoreComponent } from './store.component'
import { StoreAddComponent } from './store-add/store-add.component';
import { StoreViewComponent } from './store-view/store-view.component';
import { CanDeactivateGuard } from '../shared/guard/can-deactivate.guard';

const storeRoute: Routes = [
    { path: '', component: StoreComponent, data: { title: 'Stores' } },
    { path: 'create', component: StoreAddComponent, canDeactivate: [CanDeactivateGuard], data: { title: 'Create Store', breadcrumb: { name: 'Create | Store', url: "stores" } } },
    {
        path: ':id/view',
        component: StoreViewComponent,
        data: { title: 'View Store', breadcrumb: { name: 'View Store', url: "view" } }
    }
]

@NgModule({
    imports: [RouterModule.forChild(storeRoute)],
    exports: [RouterModule]
})

export class StoreRoutingModule { }