import { NgModule } from '@angular/core';
import { StockComponent } from './stock.component';
import { SharedModule } from '../../shared/shared.module';
import { StockRoutingModule } from './stock.routing';
import { StockService } from './stock.service';
import { userPermission } from '../../shared/userPermission'
import { TransferStockComponent } from './transfer-stock/transfer-stock.component';
import { AddStockComponent } from './add-stock/add-stock.component';
import { DecimalPipe } from '@angular/common';
import { ReconcileStockComponent } from './reconcile-stock/reconcile-stock.component';
import { StockHistoryComponent } from './stock-history/stock-history.component';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';

@NgModule({
    imports: [SharedModule, StockRoutingModule],
    declarations: [StockComponent, TransferStockComponent, AddStockComponent, ReconcileStockComponent, StockHistoryComponent, FilterDialogComponent],
    providers: [StockService, userPermission, DecimalPipe]
})
export class StockModule { }