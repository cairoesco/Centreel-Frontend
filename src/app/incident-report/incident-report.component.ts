import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../api.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import * as moment from 'moment';
import { UtilsServiceService } from '../shared/services/utils-service.service';

@Component({
  selector: 'app-incident-report',
  templateUrl: './incident-report.component.html',
  styleUrls: ['./incident-report.component.scss']
})
export class IncidentReportComponent implements OnInit {

  inProgress: boolean = false;
  public innerHeight: any;
  incident: any[] = [];
  dataSource: any;
  formobj: any = new Object();
  incidentList: UntypedFormGroup;
  minDate = moment("2018-01-01");
  maxDate = moment();
  localconfi: any = { applyLabel: 'ok', separator: ' To ', format: 'DD/MM/YYYY', direction: 'ltr', weekLabel: 'W', cancelLabel: 'Cancel', customRangeLabel: 'Custom range', daysOfWeek: moment.weekdaysMin(), monthNames: moment.monthsShort(), firstDay: moment.localeData().firstDayOfWeek() };
  rows = [];
  public dynamicHeight = "";
  public temp: any = [];
  storeList: any = [];
  public store_ids: any = [];
  @ViewChild('myDatatable') table: any;


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
    private formBuilder: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private api: ApiService,
    private utils: UtilsServiceService) { }

  ngOnInit() {
    this.incidentList = this.formBuilder.group({
      store_id: [''],
      reason: [''],
      selected: { start: moment().format('DD/MM/YYYY'), end: moment().format('DD/MM/YYYY') }
    });
    this.getStores();
    this.onChanges();
    this.incidentList.updateValueAndValidity({ onlySelf: false, emitEvent: true });
  }
  checkHeight() {
    this.innerHeight = window.innerHeight - 190;
  }
  ngDoCheck() {
    this.checkHeight();
  }

  /* Get Store list */
  getStores() {
    this.api.get('stores')
      .subscribe((response: any) => {
        this.storeList = response.data;
        if (response.data.length > 0) {
          this.storeList = response.data;
          this.store_ids = response.data.map(x => x.store_id)
          this.incidentList.patchValue({ store_id: [this.store_ids[0]] });
        }
      });
  }
  
  /* onchange event */
  onChanges(): void {
    this.inProgress = true;
    this.incidentList.valueChanges.subscribe(val => {
     var sdate = val.selected.start.format('YYYY-MM-DD HH:mm:ss');
      var edate = val.selected.end.format('YYYY-MM-DD HH:mm:ss');
      if (sdate == edate) {
        edate = val.selected.end.add(1, 'day').format('YYYY-MM-DD HH:mm:ss');
      }
      this.formobj.from_date = this.utils.get_utc_from_to_date(sdate);
      this.formobj.to_date = this.utils.get_utc_from_to_date(edate);

      if ((val.store_id.length) > 0) {
        this.formobj.store = JSON.stringify(val.store_id);
      } else {
        delete this.formobj.store;
      }

      if (Boolean(val.reason)) {
        this.formobj.reason = val.reason;
      } else {
        delete this.formobj.reason;
      }

      this.api.get('incidentReport', this.formobj)
        .subscribe((response: any) => {
          this.inProgress = false;
          if (response.data) {
            this.rows = response.data;
            this.dataSource = new MatTableDataSource(this.rows);
            this.dataSource.sort = this.sort;
            this.dynamicHeight = this.rows.length < 12 ? ((this.rows.length + 2) * 55 + 10) + "px" : '';
            this.temp = this.rows;
          }
        },
          err => {
            this.inProgress = false;
          }
        );
    });
  }
  /* onchange event */

  columnsToDisplay = ['date', 'store', 'reason', 'parties', 'action'];
  @ViewChild(MatSort) sort: MatSort;

  applyFilter(filterValue: string) {
    const val = filterValue.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return d.reason.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.dynamicHeight = this.rows.length < 12 ? ((this.rows.length + 2) * 55 + 10) + "px" : '';
  }

  /* export Functionality */

  /* download pdf */
  getExportPDF() {
    this.api.getExportPDF("incidentReportpdf", this.formobj).then(
      (res: HttpResponse<any>) => {
        this.downloadFile(res.body, 'application/pdf');
      });
  }

  /* download csv */
  getExportCSV(ext) {
    this.formobj.ext = ext;
    this.api.getExportPDF("incidentReportcsv", this.formobj).then(
      (res: HttpResponse<any>) => {
        if (ext == 'csv') {
          this.downloadFile(res.body, 'text/csv');
        } else if (ext == 'xls') {
          this.downloadFile(res.body, 'application/vnd.ms-excel');
        }
      });
  }

  downloadFile(data: any, type) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let ext;
    switch (type) {
      case 'text/csv':
        ext = '.csv';
        break;
      case 'application/pdf':
        ext = '.pdf';
        break;
      case 'application/vnd.ms-excel':
        ext = '.xls';
        break;
    }

    var filename = +(new Date()) + ext;

    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, filename);
    } else {
      var a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    window.URL.revokeObjectURL(url);

  }

  /* export Functionality */

  /* For date formate convert */
  zerofill(i) {
    return (i < 10 ? '0' : '') + i;
  }

  get_utc_from_to_date(date) {
    var date1 = this.convert_local_time_to_utc_time(date);
    let dt = new Date(date1);

    dt.setDate(dt.getDate() + 1);
    var curr_date = this.zerofill(dt.getDate());
    var curr_month = this.zerofill(dt.getMonth() + 1); //Months are zero based
    var curr_year = dt.getFullYear();
    var curr_sec = this.zerofill(dt.getSeconds()),
      curr_min = this.zerofill(dt.getMinutes()),
      curr_hr = this.zerofill(dt.getHours());

    var todt = curr_year + "-" + curr_month + "-" + curr_date + " " + curr_hr + ":" + curr_min + ":" + curr_sec;
    return todt;
  }

  convert_local_time_to_utc_time(date) {

    var dt = new Date(date);
    // Get local timezone and convert date into local time zone
    var userzone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    var orgdt1 = dt.toLocaleString('en-US', {
      timeZone: userzone
    });
    let orgdt = new Date(orgdt1);

    // Get utc date after converting date into local time zone
    var curr_date = this.zerofill(orgdt.getUTCDate()),
      curr_month = this.zerofill(orgdt.getUTCMonth() + 1),
      curr_year = orgdt.getUTCFullYear(),
      curr_sec = this.zerofill(orgdt.getUTCSeconds()),
      curr_min = this.zerofill(orgdt.getUTCMinutes()),
      curr_hr = this.zerofill(orgdt.getUTCHours());

    var new_dt = curr_year + "-" + curr_month + "-" + curr_date + " " + curr_hr + ":" + curr_min + ":" + curr_sec;
    return new_dt;
  }
  /* For date formate convert */
}
