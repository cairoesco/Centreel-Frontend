import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { UtilsServiceService } from '../../shared/services/utils-service.service';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrdersComponent implements OnInit {
  @ViewChild('myDatatable') table: any;

  inProgress: boolean = false;
  orderlist: UntypedFormGroup;
  storeList = [];
  resultdata = [];
  submitted: boolean = false;
  type: any = new Object();
  rows = [];
  formobj: any = new Object();
  grand_total: number = 0;
  minDate = moment("2018-01-01");
  maxDate = moment();
  localconfi: any = { applyLabel: 'ok', separator: ' To ', format: 'DD/MM/YYYY', direction: 'ltr', weekLabel: 'W', cancelLabel: 'Cancel', customRangeLabel: 'Custom range', daysOfWeek: moment.weekdaysMin(), monthNames: moment.monthsShort(), firstDay: moment.localeData().firstDayOfWeek() };
  public timeout: any;
  public dynamicHeight = "";
  public export_date = moment().format('MMMDDYYYY');
  public store_id: any = "";
  //datepicker range
  selected = {  start: moment(), end: moment().subtract(1, 'days') };
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
  
  constructor(private router: Router,
    public reportService: ReportService,
    private formBuilder: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private utils: UtilsServiceService) {
    this.alwaysShowCalendars = true;
  }

  ngOnInit() {
    //this.changeHeight();
    this.getStores();
    this.orderlist = this.formBuilder.group({
      store_id: ['', Validators.required],
      customer_name: [''],
      order_pub_id: [''],
      selected: { start: moment().format('DD/MM/YYYY'), end: moment().format('DD/MM/YYYY') }
    });
    this.onChanges();
  }

  // columnsToDisplay = ['Order ID', 'Employee Name', 'Order Status', 'Order Time', 'Order Type', 'Payment Mode', 'Bill Amount'];
  getStores() {
    this.reportService.getStores()
      .subscribe((response: any) => {
        this.storeList = response.data.stores;
        if (this.storeList.length > 0) {
          this.orderlist.patchValue({ store_id: this.storeList[0].store_id });
          this.store_id = this.storeList[0].store_id
        }
      });
  }

  /* onchange event */
  onChanges(): void {
    this.inProgress = true;
    var TZ = this.utils.getTimeZone(); //timezone
    this.orderlist.valueChanges.subscribe(val => {
  
      this.formobj.store_id = val.store_id || this.store_id;
      this.formobj.tz = encodeURIComponent(TZ);
     var sdate = val.selected.start.format('YYYY-MM-DD HH:mm:ss');
      var edate = val.selected.end.format('YYYY-MM-DD HH:mm:ss');
      if (sdate == edate) {
        edate = val.selected.end.add(1, 'day').format('YYYY-MM-DD HH:mm:ss');
      }
      this.formobj.start_date = this.utils.get_utc_from_to_date(sdate);
      this.formobj.end_date = this.utils.get_utc_from_to_date(edate);

      if (Boolean(val.customer_name)) {
        this.formobj.search = val.customer_name;
      } else {
        delete this.formobj.search;
      }

      if (Boolean(val.order_id)) {
        this.formobj.order_pub_id = val.order_id;
      } else {
        delete this.formobj.order_pub_id;
      }

      if(this.formobj.store_id){
      this.reportService.getOrdersReport(this.formobj)
        .subscribe((response: any) => {
          this.inProgress = false;
          if (response.data.length > 0) {
            this.rows = response.data[0].orders;
            this.dynamicHeight = this.rows.length < 12 ? ((this.rows.length + 2) * 48 + 140) + "px" : '';
          } else {
            this.rows = response.data;
          }
        },
          err => {
            this.inProgress = false;
          }
        );
      }
    });
  }
  /* onchange event */

  /* download pdf */
  getExportPDF() {
    this.reportService.exportReport("orderslistpdf", this.formobj).then(
      (res: HttpResponse<any>) => {
        this.reportService.downloadFile(res.body, 'application/pdf', 'Orders Report '+this.export_date);
      });
  }
  /* download pdf */

  /* download excel and csv */
  getExportCSV(ext) {
    this.formobj.ext = ext;
    this.reportService.exportReport("orderslistcsv", this.formobj).then(
      (res: HttpResponse<any>) => {
        if (ext == 'csv') {
          this.reportService.downloadFile(res.body, 'text/csv', 'Orders Report '+this.export_date);
        } else if (ext == 'xls') {
          this.reportService.downloadFile(res.body, 'application/vnd.ms-excel', 'Orders Report '+this.export_date);
        }
      });
  }
  /* download excel and csv */

  reset_form() {
    this.orderlist.controls['selected'].setValue({start: moment(), end: moment().subtract(1, 'days')  });
    // this.orderlist.controls['customer_name'].reset();
    this.orderlist.controls['order_id'].reset();
    if (this.storeList.length > 0) {
      this.orderlist.patchValue({ store_id: this.storeList[0].store_id });
    }
  }

  /* for expand */
  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
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
  getRowHeight(sub_detail) {
    if(sub_detail){
     return sub_detail.order_detail.variants.length < 10 ? ((sub_detail.order_detail.variants.length + 1) * 48 + 32) : 0;
    }
  }
}
