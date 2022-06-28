import { Routes } from '@angular/router';
import { SalesComponent } from './sales/sales.component';
import { RvcComponent } from './rvc/rvc.component';
import { TopsellingComponent } from './topselling/topselling.component';
import { WasteComponent } from './waste/waste.component';
import { OrdersComponent } from './orders/orders.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { StocktransferComponent } from './stocktransfer/stocktransfer.component';
import { CustomsalesComponent } from './customsales/customsales.component';
import { TaxReportComponent } from './tax-report/tax-report.component';
import { CogsReportComponent } from "./cogs-report/cogs-report.component";
import { RefundReportComponent } from './refund-report/refund-report.component';
import { CashoutComponent } from './cashout/cashout.component';
import { TimeTrackingComponent } from './time-tracking/time-tracking.component';
import { InventoryOnHandComponent } from './inventory-on-hand/inventory-on-hand.component';
import { ReconcileHistoryComponent } from './reconcile-history/reconcile-history.component';
import { InventoryAuditComponent } from './inventory-audit/inventory-audit.component';
import { PrintableMenuComponent } from './printable-menu/printable-menu.component';
import { BrandSalesComponent } from "./brand-sales/brandsales.component";
import { EmployeeSalesComponent } from "./employee-sales/employee-sales.component";
import { LowSalesComponent  } from "./low-sales/low-sales.component";

export const ReportsRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'sales',
                component: SalesComponent,
                data: { title: 'Sales Report' }
            },
            {
                path: 'closeout',
                component: RvcComponent,
                data: { title: 'Closeout Report' }
            },
            {
               path: "brandsales",
               component: BrandSalesComponent,
               data: { title: "Brand Sales Report" },
            },
            {
                path: "cogsreport",
                component: CogsReportComponent,
                data: { title: "Cogs Report" },
            },
            {
                path: 'inventory',
                component: InventoryOnHandComponent,
                data: { title: 'Inventory Report' }
            },
            {
                path: 'inventory-audit',
                component: InventoryAuditComponent,
                data: { title: 'Inventory Audit Report' }
            },
            {
                path: 'topselling',
                component: TopsellingComponent,
                data: { title: 'Top Selling Report' }
            },
            {
                path: 'waste',
                component: WasteComponent,
                data: { title: 'Waste Report' }
            },
            {
                path: 'stocktransfer',
                component: StocktransferComponent,
                data: { title: 'Stock-transfer Report' }
            },
            {
                path: 'timesheet',
                component: TimesheetComponent,
                data: { title: 'Timesheet Report' }
            },
            {
                path: 'orders',
                component: OrdersComponent,
                data: { title: 'Orders Report' }
            },
            {
                path: 'customsales',
                component: CustomsalesComponent,
                data: { title: 'Custom Sales Report' }
            },
            {
                path: 'tax',
                component: TaxReportComponent,
                data: { title: 'Tax Report' }
            },
            {
                path: 'cashout',
                component: CashoutComponent,
                data: { title: 'Cash Out Report' }
            },
            {
                path: 'timetracking',
                component: TimeTrackingComponent,
                data: { title: 'Time Tracking Report' }
            },
            {
                path: 'reconcilehistory',
                component: ReconcileHistoryComponent,
                data: { title: 'Reconcile History Report' }
            },
            {
                path: 'refund-report',
                component: RefundReportComponent,
                data: { title: 'Refund Report' }
            },
            {
                path: 'printable-menu',
                component: PrintableMenuComponent,
                data: { title: 'Printable Menu Report' }
            },
            {
               path: "employee-sales",
               component: EmployeeSalesComponent,
               data: { title: "Employee Sales Report" },
            },
            {
              path: "low-sales",
              component: LowSalesComponent,
              data: { title: "Low Sales Report" },
            },
        ]
    }
];
