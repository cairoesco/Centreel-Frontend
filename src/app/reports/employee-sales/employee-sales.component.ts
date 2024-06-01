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
  selector: 'app-employee-sales',
  templateUrl: './employee-sales.component.html',
  styleUrls: ['./employee-sales.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EmployeeSalesComponent implements OnInit {
  @ViewChild('myDatatable') table: any;

  inProgress: boolean = false;
  employeeSalesList: UntypedFormGroup;
  storeList = [];
  resultdata = [];
  submitted: boolean = false;
  type: any = new Object();
  rows = [];
  formobj: any = new Object();
  grand_total: number = 0;
  minDate = moment("2018-01-01");
  maxDate = moment();
  store_id: any = "";
  localconfi: any = { applyLabel: 'ok', separator: ' To ', format: 'DD/MM/YYYY', direction: 'ltr', weekLabel: 'W', cancelLabel: 'Cancel', customRangeLabel: 'Custom range', daysOfWeek: moment.weekdaysMin(), monthNames: moment.monthsShort(), firstDay: moment.localeData().firstDayOfWeek() };
  public timeout: any;
  public dynamicHeight = "";
  public export_date = moment().format('MMMDDYYYY');

  //datepicker range
  selected = { start: moment().startOf('month'), end: moment()};
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
    this.employeeSalesList = this.formBuilder.group({
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
          this.employeeSalesList.patchValue({ store_id: this.storeList[0].store_id });
          this.store_id = this.storeList[0].store_id
        }
      });
  }

  /* onchange event */
  onChanges(): void {
    this.inProgress = true;
    var TZ = this.utils.getTimeZone(); //timezone
    this.employeeSalesList.valueChanges.subscribe(val => {
      this.formobj.store_id = val.store_id || this.store_id
      this.formobj.tz = encodeURIComponent(TZ);
      var sdate = val.selected.start.format('YYYY-MM-DD HH:mm:ss');
      var edate = val.selected.end.format('YYYY-MM-DD HH:mm:ss');
      if (sdate == edate) {
        edate = val.selected.end.add(1, 'day').format('YYYY-MM-DD HH:mm:ss');
      }
      this.formobj.start_date = this.utils.get_utc_from_to_date(sdate);
      this.formobj.end_date = this.utils.get_utc_from_to_date(edate);
      const payload = `store_id=${this.formobj.store_id}&from_date=${this.formobj.start_date}&to_date=${this.formobj.end_date}`
      // if (Boolean(val.customer_name)) {
      //   this.formobj.search = val.customer_name;
      // } else {
      //   delete this.formobj.search;
      // }

      // if (Boolean(val.order_pub_id)) {
      //   this.formobj.search = val.order_pub_id;
      // } else {
      //   delete this.formobj.order_pub_id;
      // }
       
      if(this.formobj.store_id){
      this.reportService.getEmployeeSalesReport(payload)
        .subscribe((response: any) => {
          this.inProgress = false;
          if (Object.keys(response.data).length > 0) {
            this.rows = response.data
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
  getExport(ext) {
    const url = `employeeSales/export?store_id=${this.formobj.store_id}&from_date=${this.formobj.start_date}&to_date=${this.formobj.end_date}&ext=${ext}`
    this.reportService.exportEmployeeSalesReport(url).then(
      (res: HttpResponse<any>) => {
        if (ext == 'csv') {
          this.reportService.downloadFile(res.body, 'text/csv', 'Employee sales report Report '+this.export_date);
        } else if (ext == 'xls') {
          this.reportService.downloadFile(res.body, 'application/vnd.ms-excel', 'Employee sales report Report '+this.export_date);
        } else if (ext == 'pdf'){
        this.reportService.downloadFile(res.body, 'application/pdf', 'Employee sales report Report '+this.export_date);
        }
      });
  }

  reset_form() {
    this.employeeSalesList.controls['selected'].setValue({ start: moment().format('DD/MM/YYYY'), end: moment().format('DD/MM/YYYY') });
    this.employeeSalesList.controls['customer_name'].reset();
    this.employeeSalesList.controls['order_id'].reset();
    if (this.storeList.length > 0) {
      this.employeeSalesList.patchValue({ store_id: this.storeList[0].store_id });
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
