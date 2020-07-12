import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { StockService } from '../stock.service';
import { UtilsServiceService } from '../../../shared/services/utils-service.service';

@Component({
  selector: 'app-stock-history',
  templateUrl: './stock-history.component.html',
  styleUrls: ['./stock-history.component.scss']
})
export class StockHistoryComponent implements OnInit {
  displayedColumns: string[] = ['id', 'qty', 'source_name','batch_no','stock_price','action', 'created_at', 'user_name','source_page'];
  parentData: any;
  dataSource: any = [];
  selectedStore: any;
  inProgress:boolean = false;
  constructor(
    private utils: UtilsServiceService,
    public dialogRef: MatDialogRef<StockHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public stockService: StockService,
  ) {
    this.parentData = data;
  }

  ngOnInit() {
    if (_.isArray(this.parentData.header) && this.parentData.header.length > 0) {
      this.selectedStore = this.parentData.header[0].storage_id;
      this.getStockHistory(this.parentData.header[0].storage_id)
    }
  }

  getStockHistory(storage_id) {
    let request = {
      pageSize: 500,
      pageIndex: 0,
      variant_id: this.parentData.data.variant_id,
      storage_id: storage_id
    }
    this.inProgress=true;
    this.stockService.getStockHistory(request).subscribe((result: any) => {
      if (result.success) {
        this.dataSource = result.data;
      }
      this.inProgress=false;
    })
  }
}
