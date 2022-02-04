import {NgModule} from '@angular/core'

import {RouterModule, Routes } from '@angular/router';

import { ChainComponent } from './chain.component';
import { CreateComponent } from './create/create.component';


const ChainRoutes: Routes = [
    // path: '',
    // component: ChainComponent,
    // children: [{
    //     path: 'create',
    //     component: CreateComponent
    // }]
    {
        path: '',
        component: ChainComponent,
    },
    {
        path: 'create',
        component: CreateComponent,
    data: { title: 'Add chain',breadcrumb: {name:'Add chains',url:"create"} },

    }
];

@NgModule({
    imports:[RouterModule.forChild(ChainRoutes)],
    exports:[RouterModule]
})

export class ChainRoutingModule{}