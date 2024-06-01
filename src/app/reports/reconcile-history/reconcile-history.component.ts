import { Component, OnInit  } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { UtilsServiceService } from '../../shared/services/utils-service.service';
import * as _ from 'lodash';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-reconcile-history',
  templateUrl: './reconcile-history.component.html',
  styleUrls: ['./reconcile-history.component.scss']
})
export class ReconcileHistoryComponent implements OnInit {
  inProgress: boolean = false;
  reconcile: UntypedFormGroup;
  type: any = new Object();
  rows = [];
  formobj: any = new Object();
  minDate = moment("2018-01-01");
  maxDate = moment();
  localconfi: any = { applyLabel: 'ok', separator: ' To ', format: 'DD/MM/YYYY', direction: 'ltr', weekLabel: 'W', cancelLabel: 'Cancel', customRangeLabel: 'Custom range', daysOfWeek: moment.weekdaysMin(), monthNames: moment.monthsShort(), firstDay: moment.localeData().firstDayOfWeek() };
  public dynamicHeight = "";
  

  public product_type = [{product_type_slug:'all', product_name: 'All'},{product_type_slug:'cannabis', product_name: 'Flower'},{product_type_slug:'non cannabis', product_name: 'Paraphernalia'},]
  // public reconcile_reason = ["Damaged", "Lost/Theft", "Destroyed"];
  public reconcile_reason;
  public export_date = moment().format('MMMDDYYYY');

  //datepicker range
  selected = {  start: moment().startOf('month'), end: moment() };
  alwaysShowCalendars: boolean;
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
  //datepicker range
  isInvalidDate = (m: moment.Moment) =>  m.isAfter(moment())
  
  constructor(
    public reportService: ReportService,
    private formBuilder: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private utils: UtilsServiceService
  ) { 
    this.alwaysShowCalendars = true;
  }

  ngOnInit() {
    this.getFilterData();
    this.reconcile = this.formBuilder.group({
      store_id: [''], 
      warehouse_id: [''], 
      reason : [''], 
      product_type: [''], 
      selected: { start: moment().format('DD/MM/YYYY'), end: moment().format('DD/MM/YYYY') }
    });
    this.onChanges();
  }

  /* onchange event */
  public param_dt: any;
  public source_dt: any;
  public reason_dt: any;
  public type_dt: any;
  onChanges() {
    var TZ = this.utils.getTimeZone(); //timezone
    this.reconcile.valueChanges.subscribe(val => {
     var sdate = val.selected.start.format('YYYY-MM-DD HH:mm:ss');
      var edate = val.selected.end.format('YYYY-MM-DD HH:mm:ss');
      if (sdate == edate) {
        edate = val.selected.end.add(1, 'day').format('YYYY-MM-DD HH:mm:ss');
      }
      this.formobj.from_date = this.utils.get_utc_from_to_date(sdate);
      this.formobj.to_date = this.utils.get_utc_from_to_date(edate);
      this.formobj.tz = (TZ);

      this.param_dt = '';
      this.source_dt = '';
      this.reason_dt = '';
      this.type_dt = '';
      if ( (val.store_id) && (val.store_id) > 0) {
        this.formobj.store_id = JSON.stringify(val.store_id);
      } else {
        delete this.formobj.store_id;
      }

      /* for warehouse */
      if ( (val.warehouse_id) && (val.warehouse_id) > 0) {
        this.formobj.source_id = (val.warehouse_id);
        this.source_dt =  '&source_id=' + this.formobj.source_id;
      } else {
        delete this.formobj.source_id;
      }

      /* for reason */
      if ( (val.reason)) {
        this.formobj.reason = (val.reason);
        this.reason_dt =  '&reason=' + this.formobj.reason;
      } else {
        delete this.formobj.reason;
      }

      /* for product type */
      if ((val.product_type)) {
        this.formobj.type = (val.product_type);
        this.type_dt =  '&type=' + this.formobj.type;
      } else {
        delete this.formobj.type;
      }
      this.inProgress = true;
      this.param_dt = this.source_dt + this.reason_dt + this.type_dt;
      let params = 'store_id=' + this.formobj.store_id + '&from_date=' + this.formobj.from_date + '&to_date=' + this.formobj.to_date + '&tz=' + encodeURIComponent(TZ) + this.param_dt; 
    
      this.reportService.getReconcileHistoryReport(this.formobj)
      this.reportService.getReconcileHistoryReport(params)
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
    var TZ = this.utils.getTimeZone(); //timezone
    let params = 'store_id=' + this.formobj.store_id + '&from_date=' + this.formobj.from_date + '&to_date=' + this.formobj.to_date + '&tz=' + encodeURIComponent(TZ) + '&ext=' + this.formobj.ext + this.param_dt; 
    
    this.reportService.reconcile_exportReport(params).then(
      (res: HttpResponse<any>) => {
        this.reportService.downloadFile(res.body, 'application/pdf', 'Reconcile History Report '+this.export_date);
      });
  }
  /* download pdf */

  /* download CSV */
  getExportCSV(ext) {
    this.formobj.ext = ext;
    var TZ = this.utils.getTimeZone(); //timezone
    let params = 'store_id=' + this.formobj.store_id + '&from_date=' + this.formobj.from_date + '&to_date=' + this.formobj.to_date + '&tz=' + encodeURIComponent(TZ) + '&ext=' + this.formobj.ext + this.param_dt; 
    
    this.reportService.reconcile_exportReport(params).then(
    (res: HttpResponse<any>) => {
      if (ext == 'csv') {
        this.reportService.downloadFile(res.body, 'text/csv', 'Reconcile History Report '+this.export_date);
      } else if (ext == 'xls') {
        this.reportService.downloadFile(res.body, 'application/vnd.ms-excel', 'Reconcile History Report '+this.export_date);
      }
    });
  }
  /* download CSV */

  reset_form() {
    this.reconcile.controls['selected'].setValue({ start: moment().startOf('month'), end: moment() });
    this.reconcile.controls['warehouse_id'].reset();
    this.reconcile.controls['reason'].reset();
    this.reconcile.controls['product_type'].reset();
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
        this.reconcile_reason = response.data.reconcile_reason;
        if (this.stores.length > 0) {
          this.reconcile.patchValue({ store_id: this.stores[0].store_id });
        }
      }
      else {
        this.utils.showSnackBar(response.message, { panelClass: 'error' });
      }
    });
  }

  findWarehouse(store_id, event) {
    if (event.isUserInput) {
      this.warehouseList = _.filter(this.warehouses, function (o) { return o.store_id == store_id; });
    }
  }

}
