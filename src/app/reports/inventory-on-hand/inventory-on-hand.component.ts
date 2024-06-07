import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpResponse } from '@angular/common/http';
import { ReportService } from '../report.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-inventory-on-hand',
  templateUrl: './inventory-on-hand.component.html',
  styleUrls: ['./inventory-on-hand.component.scss']
})
export class InventoryOnHandComponent implements OnInit {
  @ViewChild('myDatatable') table: any;
  public inProgress: boolean = false;
  public sales_template = [];
  public formobj: any = new Object();
  public result_data: any = [];
  public dynamicHeight = "";
  public temp: any = [];
  public storeList: any = [];
  public storeID: any;
  public inventory_report: UntypedFormGroup;
  public timeout: any;
  public export_date = moment().format('MMMDDYYYY');

  constructor(public dialog: MatDialog,
    public reportService: ReportService,
    private formBuilder: UntypedFormBuilder,
  ) { }

  ngOnInit() {
    this.inventory_report = this.formBuilder.group({
      product_type: ['non cannabis'],
      store_id: [''],
      is_club: [1],
      has_stock: [false],
    });
    this.getStores();
  }
  onActivate(event) {
    if (event.type == 'click') {
      this.table.rowDetail.toggleExpandRow(event.row);
    }
  }
  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
    }, 100);
  }
  getHeight(records, row) {
    let inner_height = (records < 5 || records != null) ? ((records + 1) * 48 + 10) + "px" : '';
    return inner_height;
  }
  public resultsData: any = [];
  updatedResponseInventory(response) {
    if (response.length > 0) {
      response.forEach(element => {
        let r_data: any;
        let index: any;
        let object: any = {
          description: element.description,
          name: element.name,
          available_qty: element.available_qty,
          product_category_name: element.product_category_name,
          product_highlights: element.product_highlights,
          product_name: element.product_name,
          product_type_name: element.product_type_name,
          product_type_slug: element.product_type_slug,
          // reorder: element.reorder,
          variant_id: element.variant_id,
          variant_name: element.variant_name,
          variant_sku: element.variant_sku,
          vendor_id: element.vendor_id,
          vendor_name: element.vendor_namel,
          stockwiseData: [
            {
              on_hand_amount: element.on_hand_amount,
              available_qty: element.available_qty,
              batch_no: element.batch_no,
              stock_price: element.stock_price,
              storage_id: element.storage_id,
              storage_name: element.storage_name,
              total_selling_amount: element.total_selling_amount,
              margin: element.margin,
              margin_percentage: element.margin_percentage,
              reorder: element.reorder
            }
          ]
        }
        r_data = this.resultsData.find(x => x.variant_id === element.variant_id);
        if (r_data) {
          index = this.resultsData.indexOf(r_data);
          this.resultsData[index].stockwiseData.push(object.stockwiseData[0])
          this.resultsData[index].available_qty = (+this.resultsData[index].available_qty) + (+object.stockwiseData[0].available_qty)
        }
        else {
          this.resultsData.push(object);
        }
      });
    }
  }
  getFilterdData(val) {
    this.reportService.getInventoryData(val)
      .subscribe((response: any) => {
        this.inProgress = false;
        this.resultsData = [];
        this.result_data = response.data;
        this.dynamicHeight = this.result_data.length < 12 ? ((this.result_data.length + 2) * 55 + 20) + "px" : ''
        this.temp = this.result_data;
        this.updatedResponseInventory(this.temp)
      },
        err => {
          this.inProgress = false;
        }
      );
  }
  //**************** Filter popup start *********************/
  public filter_data: any;
  openFilter(): void {
    let fdata = this.formobj
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '70%',
      maxWidth: "700px",
      data: { fdata }
    });
    //Call after delete confirm model close
    dialogRef.afterClosed().subscribe(val => {
      if (Boolean(val)) {
        this.onChanges(val)
      }
    });
  }
  /* onchange event */
  onChanges(data): void {
    this.formobj = {};
    let val = data;
    this.formobj.type = val.product_type
    this.formobj.store_id = val.store_id
    val.has_stock = val.has_stock ? 0 : 1;
    this.formobj.has_stock = val.has_stock
    this.reportService.getInventoryData(this.formobj)
      .subscribe((response: any) => {
        this.inProgress = false;
        this.resultsData = [];
        if (val.product_type == 'cannabis')
          this.result_data = _.filter(response.data, function (o) { return o.product_type_slug == val.product_type; });
        else if (val.product_type == 'all')
          this.result_data = response.data;
        else
          this.result_data = _.filter(response.data, function (o) { return o.product_type_slug != 'cannabis'; });

        this.dynamicHeight = this.result_data.length < 12 ? ((this.result_data.length + 2) * 55 + 20) + "px" : ''
        this.temp = this.result_data;
        this.updatedResponseInventory(this.temp)
      },
        err => {
          this.inProgress = false;
        }
      );
  }

  getStores() {
    this.reportService.getStores()
      .subscribe((response: any) => {
        this.storeList = response.data.stores;
        if (this.storeList.length > 0) {
          this.inventory_report.patchValue({ store_id: this.storeList[0].store_id });
          this.formobj.type = 'non cannabis';
          this.onChanges(this.inventory_report.value)
        }
      });
  }
  applyFilter(filterValue: string) {
    const val = filterValue.toLowerCase();
    const temp = this.temp.filter(function (d) {
      d.variant_sku = '' + d.variant_sku;
      return d.description.toLowerCase().indexOf(val) !== -1 || d.product_category_name.toLowerCase().indexOf(val) !== -1 || d.variant_sku.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.resultsData = [];
    this.result_data = temp;
    this.updatedResponseInventory(temp);
    this.dynamicHeight = this.result_data.length < 12 ? ((this.result_data.length + 2) * 55 + 20) + "px" : '';
  }


  /* download pdf */
  getExportPDF(ext) {
    this.formobj.is_club = this.inventory_report.controls.is_club.value ? 0 : 1;
    this.formobj.ext = ext
    this.reportService.exportReport("exports/inventory", this.formobj).then(
      (res: HttpResponse<any>) => {
        this.reportService.downloadFile(res.body, 'application/pdf', 'Inventory Report '+this.export_date);
      });
  }

  /* download csv and excel */
  getExportCSV(ext) {
    this.formobj.is_club = this.inventory_report.controls.is_club.value ? 0 : 1;
    this.formobj.ext = ext
    this.reportService.exportReport("exports/inventory", this.formobj).then(
      (res: HttpResponse<any>) => {
        if (ext == 'csv') {
          this.reportService.downloadFile(res.body, 'text/csv', 'Inventory Report '+this.export_date);
        } else if (ext == 'xls') {
          this.reportService.downloadFile(res.body, 'application/vnd.ms-excel', 'Inventory Report '+this.export_date);
        }
      });
  }
}
