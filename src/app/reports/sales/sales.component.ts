import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ReportService } from '../report.service';
import { UtilsServiceService } from '../../shared/services/utils-service.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  inProgress: boolean = false;
  saleType: UntypedFormGroup;
  productTypes = [];
  warehouse = [];
  resultdata = [];
  submitted: boolean = false;
  type: any = new Object();
  rows = [];
  formobj: any = new Object();
  grand_total: number = 0;
  minDate = moment("2018-01-01");
  maxDate = moment();
  localconfi: any = { applyLabel: 'ok', separator: ' To ', format: 'DD/MM/YYYY', direction: 'ltr', weekLabel: 'W', cancelLabel: 'Cancel', customRangeLabel: 'Custom range', daysOfWeek: moment.weekdaysMin(), monthNames: moment.monthsShort(), firstDay: moment.localeData().firstDayOfWeek() };
  public innerHeight: any;
  public dynamicHeight = "";
  public export_date = moment().format('MMMDDYYYY');

  public storage_id: any = "";

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

  constructor(private router: Router,
    public reportService: ReportService,
    private formBuilder: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    public utils: UtilsServiceService) {
    this.alwaysShowCalendars = true;
  }

  ngOnInit() {
    this.getProductTypes();
    this.getWarehouse();
    this.saleType = this.formBuilder.group({
      storage_id: ['', Validators.required],
      selected: { start: moment().format('DD/MM/YYYY'), end: moment().format('DD/MM/YYYY') }
    });
    this.onChanges();
  }
  ngDoCheck() {
    this.innerHeight = window.innerHeight - 190;
  }

  /* onchange event */
  onChanges(): void {
    this.inProgress = true;
    this.saleType.valueChanges.subscribe(val => {
      this.formobj.storage_id = val.storage_id || this.storage_id
     var sdate = val.selected.start.format('YYYY-MM-DD HH:mm:ss');
      var edate = val.selected.end.format('YYYY-MM-DD HH:mm:ss');
      if (sdate == edate) {
        edate = val.selected.end.add(1, 'day').format('YYYY-MM-DD HH:mm:ss');
      }
      this.formobj.from_date = this.utils.get_utc_from_to_date(sdate);
      this.formobj.to_date = this.utils.get_utc_from_to_date(edate);
      
      if(this.formobj.storage_id){
      this.reportService.getSalesReport(this.formobj)
        .subscribe((response: any) => {
          this.inProgress = false;
          this.rows = response.data;
          this.dynamicHeight = this.rows.length < 12 ? ((this.rows.length + 2) * 48 + 10) + "px" : '';
          this.grand_total = 0;
          response.data.forEach(element => {
            this.grand_total += +element.total_qty
          });
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
    this.formobj.report_name = 'sales';
    this.reportService.exportReport("sales/salesperCategorypdf", this.formobj).then(
      (res: HttpResponse<any>) => {
        this.reportService.downloadFile(res.body, 'application/pdf', 'Sales per Category Report '+this.export_date);
      });
  }
  /* download pdf */

  /* download csv and excel */
  getExportCSV(ext) {
    this.formobj.ext = ext;
    this.reportService.exportReport("sales/salesperCategorycsv", this.formobj).then(
      (res: HttpResponse<any>) => {
        if (ext == 'csv') {
          this.reportService.downloadFile(res.body, 'text/csv', 'Sales per Category Report '+this.export_date);
        } else if (ext == 'xls') {
          this.reportService.downloadFile(res.body, 'application/vnd.ms-excel', 'Sales per Category Report '+this.export_date);
        }
      });
  }
  /* download csv and excel */

  getProductTypes() {
    this.reportService.getProductTypes()
      .subscribe((response: any) => {
        this.productTypes = response.data;
      });
  }
  /* warehouse dropdown */
  getWarehouse() {
    this.reportService.getWarehouse()
      .subscribe((response: any) => {
        /* filter only store front data */
        this.warehouse = _.filter(response.data, function (o) { return o.subtype == 'Store Front'; });
        /* filter only store front data */
        if (response.data.length > 0) {
          this.saleType.patchValue({ storage_id: this.warehouse[0].storage_id });
          this.storage_id = this.warehouse[0].storage_id
        }
      });
  }
  /* warehouse dropdown */

  reset_form() {
    this.saleType.controls['selected'].setValue({ start: moment().startOf('month'), end: moment() });
  }
}




