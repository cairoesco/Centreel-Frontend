import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { UtilsServiceService } from '../../shared/services/utils-service.service';
import * as _ from 'lodash';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-inventory-audit',
  templateUrl: './inventory-audit.component.html',
  styleUrls: ['./inventory-audit.component.scss']
})
export class InventoryAuditComponent implements OnInit {
  inProgress: boolean = false;
  reconcile: UntypedFormGroup;
  type: any = new Object();
  rows = [];
  formobj: any = new Object();
  minDate = moment("2018-01-01");
  maxDate = moment();
  localconfi: any = { applyLabel: 'ok', separator: ' To ', format: 'DD/MM/YYYY', direction: 'ltr', weekLabel: 'W', cancelLabel: 'Cancel', customRangeLabel: 'Custom range', daysOfWeek: moment.weekdaysMin(), monthNames: moment.monthsShort(), firstDay: moment.localeData().firstDayOfWeek() };
  public dynamicHeight = "";
  public product_type = [{product_type_slug:'all', product_name: 'All'},{product_type_slug:'cannabis', product_name: 'Cannabis'},{product_type_slug:'non cannabis', product_name: 'Non-Cannabis'},]
  public export_date: any;
  public date_time: any;

  constructor(
    public reportService: ReportService,
    private formBuilder: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private utils: UtilsServiceService
  ) {
    
   }

  ngOnInit() {
    this.getFilterData();
    this.reconcile = this.formBuilder.group({
      store_id: [''], 
      product_type: ['cannabis'], 
      selected: { start: moment().format('DD/MM/YYYY HH:mm:ss'), end: moment().format('DD/MM/YYYY') }
    });
    this.onChanges();
  }

  /* onchange event */
  public param_dt: any;
  onChanges() {
    this.inProgress = true;
    // var TZ = this.utils.getTimeZone(); //timezone
    this.reconcile.valueChanges.subscribe(val => {

      this.param_dt = '';
      if ( (val.store_id) && (val.store_id) > 0) {
        this.formobj.store_id = JSON.stringify(val.store_id);
      } else {
        delete this.formobj.store_id;
      }

      /* for product type */
      if ((val.product_type)) {
        this.formobj.type = (val.product_type);
        this.param_dt =  '&type=' + this.formobj.type;
      } else {
        delete this.formobj.type;
      }
      let params = 'store_id=' + this.formobj.store_id + this.param_dt; 
      this.date_time = moment(val.selected.start, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
      this.export_date = moment(val.selected.start, 'DD/MM/YYYY HH:mm:ss').format('MMMDDYYYY');
      // this.reportService.getReconcileHistoryReport(this.formobj)
      this.reportService.getInventoryAuditReport(params)
        .subscribe((response: any) => {
          this.inProgress = false;
          this.rows = response.data;
          this.dynamicHeight = this.rows.length < 12 ? ((this.rows.length + 2) * 48 + 10) + "px" : '';
        },
          err => {
            this.inProgress = false;
          }
        );
    });
  }
  /* onchange event */

  /* download pdf */
  getExportPDF() {
    
    this.formobj.ext = 'pdf';
    let params = 'store_id=' + this.formobj.store_id + '&ext=' + this.formobj.ext + '&date_time=' + this.date_time + this.param_dt; 
    
    this.reportService.inventory_audit_exportReport(params).then(
      (res: HttpResponse<any>) => {
        this.reportService.downloadFile(res.body, 'application/pdf', 'Inventory Audit Report '+this.export_date);
      });
  }
  /* download pdf */

  /* download CSV */
  getExportCSV(ext) {
    this.formobj.ext = ext;
    let params = 'store_id=' + this.formobj.store_id + '&ext=' + this.formobj.ext + '&date_time=' + this.date_time + this.param_dt; 
    
    this.reportService.inventory_audit_exportReport(params).then(
    (res: HttpResponse<any>) => {
      if (ext == 'csv') {
        this.reportService.downloadFile(res.body, 'text/csv', 'Inventory Audit Report '+this.export_date);
      } else if (ext == 'xls') {
        this.reportService.downloadFile(res.body, 'application/vnd.ms-excel', 'Inventory Audit Report '+this.export_date);
      }
    });
  }
  /* download CSV */

  reset_form() {
   
    this.reconcile.controls['product_type'].setValue('cannabis');

  }

  /* new code */
  public chains: any = [];
  public stores: any = [];
  public warehouses: any = [];
  public warehouseList: any = [];
  getFilterData(){
    this.reportService.getFilterList()
    .subscribe((response: any) => {
      if (response.status) {
        this.chains = response.data.chains;
        this.stores = response.data.stores;
        this.warehouses = response.data.warehouses;
        if (this.stores.length > 0) {
          this.reconcile.patchValue({ store_id: this.stores[0].store_id });
        }
      }
      else {
        this.utils.showSnackBar(response.message, { panelClass: 'error' });
      }
    });
  }

}
