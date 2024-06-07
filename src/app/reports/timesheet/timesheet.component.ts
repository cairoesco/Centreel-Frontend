import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { UtilsServiceService } from '../../shared/services/utils-service.service';
import { ReportService } from '../report.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent implements OnInit {

  inProgress: boolean = false;
  timesheet: UntypedFormGroup;
  storeList = [];
  dateArray = [];
  type: any = new Object();
  rows: any;
  formobj: any = new Object();
  minDate = moment("2018-01-01");
  maxDate = moment();
  localconfi: any = { applyLabel: 'ok', separator: ' To ', format: 'DD/MM/YYYY', direction: 'ltr', weekLabel: 'W', cancelLabel: 'Cancel', customRangeLabel: 'Custom range', daysOfWeek: moment.weekdaysMin(), monthNames: moment.monthsShort(), firstDay: moment.localeData().firstDayOfWeek() };
  public dynamicHeight = "";
  public export_date = moment().format('MMMDDYYYY');
  public store_id: any = "";

  //datepicker
  selected = {  start: moment().startOf('month'), end: moment() };
  alwaysShowCalendars: boolean;
  //datepicker
  isInvalidDate = (m: moment.Moment) =>  m.isAfter(moment())
  
  constructor(private router: Router,
    public reportService: ReportService,
    private formBuilder: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private utils: UtilsServiceService) {
    this.alwaysShowCalendars = true;
  }

  ngOnInit() {
    this.getStores();
    this.timesheet = this.formBuilder.group({
      store_id: ['', Validators.required],
      selected: { start: moment().format('DD/MM/YYYY'), end: moment().format('DD/MM/YYYY') }
    });
    this.onChanges();
  }

  /* Get Store list */
  getStores() {
    this.reportService.getStores()
      .subscribe((response: any) => {
        this.storeList = response.data.stores;
        if (response.data.stores.length > 0) {
          this.timesheet.patchValue({ store_id: this.storeList[0].store_id });
          this.store_id = this.storeList[0].store_id
        }
      });
  }
  getDateArray(params) {
    let arr: any = [];
    // var dt = new Date(start);
    let start = moment(params.startdate, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
    let end = moment(params.enddate, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
    while (start <= end) {
      arr.push({date:start})
      start = moment(start, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');
    }
    return arr;
  }

  /* onchange event */
  onChanges(): void {
    this.inProgress = true;
    var TZ = this.utils.getTimeZone(); //timezone
    this.timesheet.valueChanges.subscribe(val => {
      this.formobj.store_id = val.store_id || this.store_id;
      this.formobj.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      this.formobj.tz = encodeURIComponent(TZ);
     var sdate = val.selected.start.format('YYYY-MM-DD HH:mm:ss');
      var edate = val.selected.end.format('YYYY-MM-DD HH:mm:ss');
      this.formobj.startdate = sdate;
      this.formobj.enddate = edate;
      if (sdate == edate) {
        edate = val.selected.end.add(1, 'day').format('YYYY-MM-DD HH:mm:ss');
        this.formobj.enddate = sdate;
      }
      this.formobj.from_date = this.utils.get_utc_from_to_date(sdate);
      this.formobj.to_date = this.utils.get_utc_from_to_date(edate);

      this.dateArray = this.getDateArray(this.formobj);
      this.dateArray.push({date:'Total'})

      let params = 'store_id=' + this.formobj.store_id + '&from_date=' + this.formobj.from_date + '&to_date=' + this.formobj.to_date + '&tz=' + encodeURIComponent(TZ) + '&timezone=' + this.formobj.timezone; 
      // this.reportService.getTimesheetReport(this.formobj)
      if(this.formobj.store_id){
      this.reportService.getTimesheetReport(params)
        .subscribe((response: any) => {
          this.inProgress = false;
          this.rows = response.data;
          let appendData = this.rows.total_hour;
          this.rows.timesheet = this.rows.timesheet.concat(appendData)
          this.dynamicHeight = this.rows.length < 12 ? ((this.rows.length + 2) * 48 + 10) + "px" : '';
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
    this.formobj.ext = 'pdf';
    var TZ = this.utils.getTimeZone(); //timezone
    this.formobj.tz = encodeURIComponent(TZ);
    let params = 'store_id=' + this.formobj.store_id + '&from_date=' + this.formobj.from_date + '&to_date=' + this.formobj.to_date + '&tz=' + encodeURIComponent(TZ) + '&timezone=' + this.formobj.timezone + '&ext=' + this.formobj.ext; 
    this.reportService.timesheet_exportReport(params).then(
      (res: HttpResponse<any>) => {
        this.reportService.downloadFile(res.body, 'application/pdf', 'Timesheet Report '+this.export_date);
      });
  }
  /* download pdf */

  /* download CSV and EXCEL */
  getExportCSV(ext) {
    this.formobj.ext = ext;
    var TZ = this.utils.getTimeZone(); //timezone
    this.formobj.tz = encodeURIComponent(TZ);
    let params = 'store_id=' + this.formobj.store_id + '&from_date=' + this.formobj.from_date + '&to_date=' + this.formobj.to_date + '&tz=' + encodeURIComponent(TZ) + '&timezone=' + this.formobj.timezone + '&ext=' + this.formobj.ext; 
    
    this.reportService.timesheet_exportReport(params).then(
    (res: HttpResponse<any>) => {
      if (ext == 'csv') {
        this.reportService.downloadFile(res.body, 'text/csv', 'Timesheet Report '+this.export_date);
      } else if (ext == 'xls') {
        this.reportService.downloadFile(res.body, 'application/vnd.ms-excel', 'Timesheet Report '+this.export_date);
      }
    });
  }
  /* download CSV and EXCEL */

  reset_form() {
    this.timesheet.patchValue({ selected: { start: moment().startOf('month'), end: moment() } });
  }

  getDate(date, index, emp_name) {
    let data: any = '';
    if(this.rows.timesheet && this.rows.timesheet.length>0){
      this.rows.timesheet.forEach(o => {
        if (o.emp_name == emp_name && (o.clock_in == date || date == 'Total')) {
          data = o.diff
          return
        }
      });
    }
    
    return data ? data : '--';
  }
}
