import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReportsRoutes } from './reports.routing';
import { SharedModule } from '../shared/shared.module'
import { SalesComponent } from './sales/sales.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RvcComponent } from './rvc/rvc.component';
import { TopsellingComponent } from './topselling/topselling.component';
import { WasteComponent } from './waste/waste.component';
import { OrdersComponent } from './orders/orders.component';
import { StocktransferComponent } from './stocktransfer/stocktransfer.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { CustomsalesComponent } from './customsales/customsales.component';
import { SalesFilterDialogComponent } from './customsales/sales-filter-dialog/sales-filter-dialog.component';
import { SaleshareFilterDialogComponent } from './customsales/saleshare-filter-dialog/saleshare-filter-dialog.component';
import { TaxReportComponent } from './tax-report/tax-report.component';
import { CogsReportComponent } from "./cogs-report/cogs-report.component";
import { RefundReportComponent } from './refund-report/refund-report.component';
import { ReportService } from './report.service';
import { CashoutComponent } from './cashout/cashout.component';
import { TimeTrackingComponent } from './time-tracking/time-tracking.component';
import { InventoryOnHandComponent } from './inventory-on-hand/inventory-on-hand.component';
import { FilterDialogComponent } from './inventory-on-hand/filter-dialog/filter-dialog.component';
import { ReconcileHistoryComponent } from './reconcile-history/reconcile-history.component';
import { InventoryAuditComponent } from './inventory-audit/inventory-audit.component';
import { PrintableMenuComponent } from './printable-menu/printable-menu.component';
import { BrandSalesComponent } from "./brand-sales/brandsales.component";
import { EmployeeSalesComponent  } from "./employee-sales/employee-sales.component";
import { LowSalesComponent  } from "./low-sales/low-sales.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ReportsRoutes),
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        NgxDaterangepickerMd.forRoot({
            applyLabel: 'ok',
            separator: ' To '
        })
    ],
    declarations: [
        SalesComponent,
        RvcComponent,
        TopsellingComponent,
        WasteComponent,
        OrdersComponent,
        StocktransferComponent,
        TimesheetComponent,
        CustomsalesComponent,
        SalesFilterDialogComponent,
        SaleshareFilterDialogComponent,
        TaxReportComponent,
        CogsReportComponent,
        RefundReportComponent,
        CashoutComponent,
        TimeTrackingComponent,
        InventoryOnHandComponent,
        FilterDialogComponent,
        ReconcileHistoryComponent,
        InventoryAuditComponent,
        PrintableMenuComponent,
        BrandSalesComponent,
        EmployeeSalesComponent,
        LowSalesComponent
    ],
    providers: [ReportService
    ]
})
export class ReportsModule {
}
