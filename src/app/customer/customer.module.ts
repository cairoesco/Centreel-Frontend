import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { CustomerFilterDialogComponent } from './customer-filter-dialog/customer-filter-dialog.component';
import { CustomerService} from './customer.service'
import { SharedModule } from '../shared/shared.module';
import { PreferredProductDialogComponent } from './preferred-product-dialog/preferred-product-dialog.component'
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import {AddCustomerComponent} from './add-customer/add-customer.component';

@NgModule({
    declarations: [CustomerComponent, AddCustomerComponent, CustomerFilterDialogComponent, PreferredProductDialogComponent],
    imports: [SharedModule,
        CommonModule,
        CustomerRoutingModule,
        NgxDaterangepickerMd.forRoot({
            applyLabel: 'ok',
            separator: ' To '
        })
    ],
    providers: [CustomerService]
})
export class CustomerModule { }
