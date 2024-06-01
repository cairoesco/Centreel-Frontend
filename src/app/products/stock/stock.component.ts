import { Component, ViewChild, ElementRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatDialog } from "@angular/material/dialog";
import { Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as _ from 'lodash';

import { AddStockComponent } from './add-stock/add-stock.component'
import { TransferStockComponent } from './transfer-stock/transfer-stock.component'
import { StockService } from './stock.service';
import { ReconcileStockComponent } from './reconcile-stock/reconcile-stock.component';
import { StockHistoryComponent } from './stock-history/stock-history.component';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
// import { AnyMxRecord } from 'dns';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
    ]),
  ]
})
export class StockComponent {
  @ViewChild('expandedElement') expandedElement;
  @ViewChild('myTable')  table: any; 
  public innerHeight: any;
  public inProgress: boolean = true;
  public productId: number = 0
  public columns: any = [];
  public displayedColumns: any = [];
  public dataSource: any[] = [];
  public tablewidth: any;
  public childTableWidth: any;
  public columns_parent: any = [];
  public displayedColumns_parent: any = [];
  public dataSource_parent: any = new MatTableDataSource([]);
  public dataHeader: any;
  public dataHeaderChild: any[];
  public showExpandLoading: boolean = false;
  public filterList: any = [];
  public selectedFilter: any = { chain_id: 0, store_ids: '', product_type_id: '', product_category_id: '' };
  public chain_id: any = 0;
  product_unit: any;
  sortedData: any[];
  public newrows: any[] = [];
  public total_count;
  productobj: any = new Object();
  scrollEnable: boolean = false;
  readonly headerHeight = 50;
  readonly rowHeight = 50;
  isLoading: boolean = true;
  public dynamicHeight = "";
  storeColumnArr: any[] = [];

  public pageSize: any = 20;
  public pageIndex: any = 0;
  changeHeight() {
    this.innerHeight = window.innerHeight - 250;
    this.tablewidth = (window.innerWidth - (window.innerWidth * 0.25)) - 85 + 'px';
    this.childTableWidth = ((window.innerWidth - (window.innerWidth * 0.25)) - 1150) + 'px';
  }

  constructor(
    public dialog: MatDialog,
    public stockService: StockService,
    public decimalPipe: DecimalPipe,
    private el: ElementRef,
  ) {

    this.GetFilterData();
  }
  ngDoCheck() {
    this.changeHeight();
  }
  //************************** Get Product wise stock list *******************************/
  stockDataResponse: any = []
  GetProductWiseStockList(pageIndex) {
    this.productobj.pageIndex = pageIndex;
    this.inProgress = true;
    if (this.newrows.length == 0) {
      this.isLoading = true;
    }
    const request: any = { pageSize: this.pageSize, pageIndex: pageIndex, chain_id: this.selectedFilter.chain_id,search:this.productobj.search };
    // if (Boolean(this.selectedFilter.store_id)) request.store_id = this.selectedFilter.store_id;
    // if (Boolean(this.selectedFilter.product_type_id)) request.product_type_id = this.selectedFilter.product_type_id;
    // if (Boolean(this.selectedFilter.product_category_id)) request.product_category_id = this.selectedFilter.product_category_id;
    this.productobj.search ? request.search = this.productobj.search : delete request.search;

    this.selectedFilter.store_ids && this.selectedFilter.store_ids.length > 0 ? request.store_ids = this.selectedFilter.store_ids ? JSON.stringify(this.selectedFilter.store_ids) : '' : delete request.store_ids;
    this.selectedFilter.product_type_id && this.selectedFilter.product_type_id.length > 0 ? request.product_type_id = this.selectedFilter.product_type_id ? JSON.stringify(this.selectedFilter.product_type_id) : '' : delete request.product_type_id;
    this.selectedFilter.product_category_id && this.selectedFilter.product_category_id.length > 0 ? request.product_category_id = this.selectedFilter.product_category_id ? JSON.stringify(this.selectedFilter.product_category_id) : '' : delete request.product_category_id;
    
    this.columns_parent = [];
    this.stockService.getProductStockList(request)
      .subscribe((response: any) => {
        this.total_count = response.total_count;
        this.scrollEnable = false;
        this.inProgress = false;
        this.stockDataResponse = response
        if (response.success) {
          this.isLoading = false;
          this.dataHeader = response.data.header.stores;
          this.dataSource_parent = new MatTableDataSource(response.data.stocks);
          this.sortedData = response.data.stocks;
          if (this.sortedData.length == 0 && this.productobj.pageIndex == 0)
            this.newrows = this.sortedData
          else
            this.newrows.push(...this.sortedData)
          this.newrows = [...this.newrows]

          this.dynamicHeight = this.newrows.length < 12 ? ((this.newrows.length + 2) * 48 + 140) + "px" : '';
          var newrowsArray = this.newrows.map(obj => {
            var addKey = Object.assign({}, obj);
            this.dataHeader.forEach((element, i) => {
              addKey[element.store_name] = obj.store_stock[i];
            });
            return addKey;
          })
          this.newrows = [...newrowsArray];
          this.getObjKeys();

          this.ParentTableDataBind_parent();
        }
      }, error => {
        this.inProgress = false;
      });
  }
  onScroll(offsetY: number) {

    const viewHeight = this.el.nativeElement.getBoundingClientRect().height - this.headerHeight;
    if (offsetY && (offsetY + viewHeight >= ((this.newrows.length * this.rowHeight) * 70 / 100))) {

      if (!this.scrollEnable) {
        this.scrollEnable = true;
        // debugger
        if (!this.productobj.pageIndex)
          this.productobj.pageIndex = 0;

        this.pageIndex = this.productobj.pageIndex + 1;
        if (this.newrows.length < this.stockDataResponse.total_count)
          this.GetProductWiseStockList(this.pageIndex);
      }
    }

  }
  sortData(sort: Sort) {
    const data = this.dataSource_parent.data.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      if (sort.active == 'Product Name') {
        return this.compare(a.product_name, b.product_name, isAsc);
      }
    });

    this.dataSource_parent = new MatTableDataSource(this.sortedData);

  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  //************************************************************* Parent table ********************************* */

  ParentTableDataBind_parent() {
    this.columns_parent.push({
      columnDef: "name", header: "Product Name", pcell: (element: any, i: any) => {
        return element.product_name;
      }
    });

    this.columns_parent.push({
      columnDef: "total", header: "Total", pcell: (element: any, i: any) => {
        return this.formatNumber(element.total_stock, element.product_unit) + ' ' + element.product_unit;
      }
    });

    this.dataHeader.forEach(element => {
      this.columns_parent.push({
        columnDef: element.store_name + element.store_id, header: element.store_name, store_id: element.store_id, pcell: (element: any, i: any) => {
          var pos = i - 2;
          var innerobject = element.store_stock[pos];
          //return innerobject;
          return this.formatNumber(innerobject, element.product_unit) + ' ' + element.product_unit;
        }
      });
    });

    this.displayedColumns_parent = this.columns_parent.map(c => c.columnDef);
  }
  //******************************************************  End Parent table************************************************ */

  //************************** Get Product variants wise stock list *******************************/
  GetProductVariantsStockList(product_id) {
    // if (Boolean(this.expandedElement)) {
    if ((product_id)) {
      this.productId = product_id;
      this.columns = [];
      this.displayedColumns = [];
      this.dataSource = [];
      this.showExpandLoading = true;
      // let request = Boolean(this.selectedFilter.store_id) ? { store_id: this.selectedFilter.store_id, chain_id: this.selectedFilter.chain_id } : { chain_id: this.selectedFilter.chain_id };
      const request: any = { chain_id: this.selectedFilter.chain_id,search:this.productobj.search };

      /* new code */
      this.productobj.search ? request.search = this.productobj.search : delete request.search;

      this.selectedFilter.store_ids && this.selectedFilter.store_ids.length > 0 ? request.store_ids = this.selectedFilter.store_ids ? JSON.stringify(this.selectedFilter.store_ids) : '' : delete request.store_ids;
      this.selectedFilter.product_type_id && this.selectedFilter.product_type_id.length > 0 ? request.product_type_id = this.selectedFilter.product_type_id ? JSON.stringify(this.selectedFilter.product_type_id) : '' : delete request.product_type_id;
      this.selectedFilter.product_category_id && this.selectedFilter.product_category_id > 0 ? request.product_category_id = this.selectedFilter.product_category_id ? JSON.stringify(this.selectedFilter.product_category_id) : '' : delete request.product_category_id;
      /* new code */
      
      this.stockService.getProductVariantsStockList(product_id, request)
        .subscribe((response: any) => {
          if (response.success) {
            this.dataSource = [];
            this.dataHeaderChild = response.data.header.warehouses;
            this.dataSource = response.data.stocks;
            this.ChildTableDataBind();
            this.showExpandLoading = false;
          }
        });
    }
  }
  //************************************************************* Child Table ********************************* */
  ChildTableDataLoad(row) {
    this.columns = [];
    this.displayedColumns = [];
    this.dataSource = [];
    this.dataSource = this.dataHeaderChild;
    this.ChildTableDataBind();
  }

  ChildTableDataBind() {
    this.product_unit = Boolean(this.expandedElement) ? this.expandedElement.product_unit : '';
    this.columns.push({
      columnDef: "name", header: "Variant Name", cell: (element: any, i: any) => {
        return element.variant_name;
      }
    });

    this.columns.push({
      columnDef: "total", header: "Total", cell: (element: any, i: any) => {
        return element.total_stock;
      }
    });

    this.dataHeaderChild.forEach(element => {
      this.columns.push({
        columnDef: element.storage_name + element.storage_id, header: element.storage_name, store_id: element.store_id, location_short: element.location_short, cell: (element: any, i: any) => {
          var pos = i - 2;
          var innerobject = element.storage_stock[pos];
          return innerobject;
        }
      });
    });

    this.displayedColumns = this.columns.map(c => c.columnDef);
  }

  //Format number in decimal format
  formatNumber(n, product_unit) {
    if (product_unit == 'pcs')
      return this.decimalPipe.transform(parseInt(n), '1.0');
    else
      return this.decimalPipe.transform(parseFloat(n), '1.2-2');
  }

  //#region ------------------------- Get stock filter data start ---------------------//

  GetFilterData() {
    this.stockService.getVendorList().subscribe((result: any) => {
      if (result.success) {
        this.filterList = result.data;
        this.selectedFilter.chain_id = this.filterList.chains[0].chain_id;
        this.GetProductWiseStockList(0);
      }
    })
  }

  //#endregion ------------------------- Get stock filter data end ---------------------//

  //*************** Reconcile Stock ************** */
  ReconcileStock(data: any, column, index, row_index) {

    let storage_id = this.dataHeaderChild[index - 2].storage_id;
    // let { product_name, product_type_slug } = this.expandedElement;
    let { product_name, product_type_slug } = this.expandedRow;
    const dialogRef = this.dialog.open(ReconcileStockComponent, {
      data: { data: data, index: index, storage_id: storage_id, product_name: product_name, product_type_slug: product_type_slug, product_unit: this.product_unit, storage_name: column.header, header: this.dataHeaderChild, productId: this.productId }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (_.isArray(result)) {
        //Update parent row total stock
        // this.expandedElement.total_stock = +(this.expandedElement.total_stock) + +(result[0].stock);
        this.expandedRow.total_stock = +(this.expandedRow.total_stock) + +(result[0].stock);

        //Update parent table store column total
        let horizontal_index = _.findIndex(this.dataHeader, function (o: any) { return o.store_id == column.store_id; });
        // this.expandedElement.store_stock[horizontal_index] = +(this.expandedElement.store_stock[horizontal_index]) + +(result[0].stock);
        this.expandedRow.store_stock[horizontal_index] = +(this.expandedRow.store_stock[horizontal_index]) + +(result[0].stock);

        //Update child table row data
        let verIndex = _.findIndex(this.dataSource, function (o) { return o.variant_id == result[0].variant_id; });
        this.dataSource[verIndex].storage_stock[index - 2] = +(this.dataSource[verIndex].storage_stock[index - 2]) + +(result[0].stock);
        this.dataSource[verIndex].total_stock = +(this.dataSource[verIndex].total_stock) + +(result[0].stock);
      }
    });
  }

  //*************** Stock History ************** */
  StockHistory(data, column, index, row_index) {
    const dialogRef = this.dialog.open(StockHistoryComponent, {
      width: '70vw',
      data: { data: data, storage_name: column.header, header: this.dataHeaderChild }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
    });
  }

  //*************** Transfer Stock ************** */
  TransferStock(data, column, index, row_index) {

    // let { product_name } = this.expandedElement;
    let { product_name } = this.expandedRow;
    const dialogRef = this.dialog.open(TransferStockComponent, {
      data: { data: data, index: index, product_unit: this.product_unit, product_name: product_name, storage_name: column.header, header: this.dataHeaderChild, productId: this.productId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (_.isArray(result)) {
        result.forEach(element => {
          let horizontal_index = _.findIndex(this.dataHeaderChild, function (o) { return o.storage_id == element.storage_id; });
          this.dataSource[row_index].storage_stock[horizontal_index] = +(this.dataSource[row_index].storage_stock[horizontal_index]) + +(element.value_added);

          //Minus value from current stock
          this.dataSource[row_index].storage_stock[element.index - 2] = +(this.dataSource[row_index].storage_stock[element.index - 2]) - +(element.value_added);

          //Update parent table store column total
          let current_storage = _.find(this.dataHeaderChild, function (o) { return o.storage_id == element.storage_id; });
          if (current_storage.store_id != column.store_id) {
            // this.expandedElement.store_stock[horizontal_index] = +(this.expandedElement.store_stock[horizontal_index]) + +(element.value_added);
            this.expandedRow.store_stock[horizontal_index] = +(this.expandedRow.store_stock[horizontal_index]) + +(element.value_added);
          }

          //Minus value from parent table current stock
          if (element.store_id != column.store_id) {
            let parent_index = _.findIndex(this.dataHeader, function (o: any) { return o.store_id == column.store_id; });
            // this.expandedElement.store_stock[parent_index] = +(this.expandedElement.store_stock[parent_index]) - +(element.value_added);
            this.expandedRow.store_stock[parent_index] = +(this.expandedRow.store_stock[parent_index]) - +(element.value_added);
          }
        });
      }
    });
  }

  //*************** Add Stock ************** */
  AddStock(data, column, index,rowIndex) {

    let storage_id = this.dataHeaderChild[index - 2].storage_id;
    // let { product_name, product_type_slug } = this.expandedElement;
    let { product_name, product_type_slug } = this.expandedRow;
    const dialogRef = this.dialog.open(AddStockComponent, {
      panelClass: 'add-stock-dialog',
      disableClose: true,
      data: { data: data, index: index, product_name: product_name, product_type_slug: product_type_slug, product_unit: this.expandedRow.product_unit, storage_name: column.header, storage_id: storage_id, productId: this.productId,chain_id: this.selectedFilter.chain_id }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (_.isArray(result)) {
        if (result[0].value_added) {
          //Update parent row total stock
          // this.expandedElement.total_stock = +(this.expandedElement.total_stock) + +(result[0].value_added);
          this.expandedRow.total_stock = +(this.expandedRow.total_stock) + +(result[0].value_added);

          //Update parent table store column total
          let horizontal_index = _.findIndex(this.dataHeader, function (o: any) { return o.store_id == column.store_id; });
          // this.expandedElement.store_stock[horizontal_index] = +(this.expandedElement.store_stock[horizontal_index]) + +(result[0].value_added);
          this.expandedRow.store_stock[horizontal_index] = +(this.expandedRow.store_stock[horizontal_index]) + +(result[0].value_added);

          //Update child table row data
          let verIndex = _.findIndex(this.dataSource, function (o) { return o.variant_id == result[0].variant_id; });
          this.dataSource[verIndex].storage_stock[index - 2] = +(this.dataSource[verIndex].storage_stock[index - 2]) + +(result[0].value_added);
          this.dataSource[verIndex].total_stock = +(this.dataSource[verIndex].total_stock) + +(result[0].value_added);
          this.dataSource[rowIndex].reorder = result[0].reorder
          this.dataSource = [...this.dataSource]
        }
      }
    });
  }

  //************* filter ***********************/
  ApplyFilter(filterValue: string) {
    this.dataSource_parent.filter = filterValue.trim().toLowerCase();
  }

  ChangeChain() {
    this.selectedFilter.store_id = '';
    this.selectedFilter.product_type_id = '';
    this.selectedFilter.product_category_id = '';
    this.newrows = [];
    this.GetProductWiseStockList(0);
  }
  //*********** Apply multipal filter **********/
  ApplyMultipleFilter() {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      panelClass: 'app-filter-dialog',
      disableClose: true,
      data: { filterList: JSON.stringify(this.filterList), selectedFilter: this.selectedFilter }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.inProgress = true;
        this.isLoading = true;
        this.scrollEnable = false
        this.selectedFilter = result;
        this.productobj.pageSize = 20;
        this.productobj.pageIndex = 0;
        this.newrows = [];
        this.GetProductWiseStockList(0);
      }
    })
  }

  getStockFilterData(request) {
    this.stockService.getProductStockList(request)
      .subscribe((response: any) => {
        if (response.success) {
          this.sortedData = response.data.stocks;
          this.newrows = this.sortedData
          this.newrows = [...this.newrows]
          this.inProgress = false;
          this.isLoading = false;
        }
      }, error => {
        this.inProgress = false;
      });
  }

  public search =new UntypedFormControl('');

  onChanges(): void {
    this.search.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(val => {
      this.productobj['search'] = this.search.value;
        this.productobj.pageSize = 20;
        this.productobj.pageIndex = 0;
        this.productobj.search = this.search.value;
        this.newrows = [];
        this.GetProductWiseStockList(0);
    })
    
  }

  ngOnInit() {
    this.onChanges();
  }

  expandedRow: any;
  index: any;
  onActivate(event) {
    if (event.type == 'click') {
      let i = this.sortedData.indexOf(event.row)
      if (i != this.index) {
        this.table.rowDetail.collapseAllRows()
      }
      this.index = i;
      this.GetProductVariantsStockList(event.row.product_id);
      this.table.rowDetail.toggleExpandRow(event.row);
      this.expandedRow = event.row;
    }
  }

  getHeight(records) {
    let inner_height = (records < 5 || records != null) ? ((records + 1) * 64 + 10) + "px" : '';
    return inner_height;
  }

  getRowHeight(sub_detail) {

    if (sub_detail) {
      return sub_detail.length < 5 ? ((sub_detail.length + 1) * 48 + 32) : 0;
    }
  }

  getObjKeys() {
    this.storeColumnArr = [];
    var arr = Object.keys(this.newrows[0]);
    for (var i=0; i < arr.length; i++) {
      if (arr[i] !== 'product_id' && arr[i] !== 'product_type_slug' && arr[i] !== 'store_stock' && arr[i] !== 'product_unit' && arr[i] !== 'product_name' && arr[i] !== 'total_stock') {
        this.storeColumnArr.push(arr[i]);
      }
    }
  }
}
